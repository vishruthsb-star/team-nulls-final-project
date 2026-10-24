import '@fontsource-variable/manrope';
import './styles/main.css';
import * as d3 from 'd3';
import { loadData, loadMapData, loadRespondents } from './data.js';
import { requireElement } from './dom.js';
import { getState, setHoveredCountry, setSelectedCountry, setSelectedMetric, subscribe } from './state.js';
import { renderCountryDrilldown } from './charts/countryDrilldown.js';
import { renderCommercialGap } from './charts/commercialGap.js';
import { getStoryboardStats, renderCountryMeasureDots, renderTrustSafetyScatter, renderTrustUseScatter, renderWillingnessDistribution } from './charts/storyboardCharts.js';
import { mountDotMap } from './hero/dotMap.js';

const app = requireElement('#app');
const section = (id, eyebrow, title, copy) => `<section class="story-section" id="${id}" aria-labelledby="${id}-title"><header class="section-copy"><p class="kicker">${eyebrow}</p><h2 id="${id}-title">${title}</h2><p>${copy}</p></header><div class="chart-shell"><div class="card-header"><span class="card-label">${eyebrow}</span><span class="card-title">${title}</span></div><div class="chart-meta"></div><div class="chart" id="${id}-chart"></div></div></section>`;

function buildPage(stats) {
  const pct = (value) => `${value.toFixed(1)}%`;
  app.innerHTML = `<header class="hero"><div class="hero-content"><p class="eyebrow">CS 6730 Data Visualization | Team Nulls</p><p class="team-line">Medha Koppam, Akhila Gadamsetty, Vishruth Shoba Balaji, Kruthi Shetty, Dipthi Dinesh</p><h1>Would you get in?</h1><p class="lede">How trust and safety shape acceptance of autonomous vehicles across 17 countries.</p><p class="hero-intro">Designing a self-driving car means designing for how people feel about it: whether they trust it, whether they feel safe in it, and whether those feelings hold from one market to the next. We looked at 18,631 survey responses from 17 countries to see where they line up and where they don't.</p><a class="scroll-link" href="#country-trust">Explore the evidence</a></div></header>${section('country-trust', '01 · Global pattern', 'Compare country profiles', 'Choose a measure to compare the 17 surveyed countries. Select a country to see its age, behavior, and readiness profile in this same frame.')}${section('commercial-gap', '02 · Market adoption', 'People may use it before they buy it', 'Use and purchase are not the same decision. Filter by age and income to see how the gap changes across countries.')}${section('would-get-in', '03 · Willingness', 'Would you get in?', `Of ${stats.n.toLocaleString()} valid responses, ${pct(stats.agree)} agree, ${pct(stats.neutral)} are neutral, and ${pct(stats.disagree)} disagree. The neutral group may still be open to change.`)}${section('trust-use', '04 · Country relationship', 'Several factors shape willingness', `Country trust and willingness to use move together closely (r = ${stats.correlation.toFixed(3)}). The line shows a pattern, not cause and effect.`)}${section('trust-safety', '05 · Tension', 'Trust and safety are different', `${stats.highestUse.name} has the highest mean willingness to use (${stats.highestUse.use.toFixed(2)} / 5). It is highlighted. Safety concern uses the reverse of the map safety-confidence measure.`)}${section('country-measures', '06 · Comparison', 'Willingness has several parts', 'Compare intended use, trust, and safety concern on the same five-point scale. The source does not name motorway, urban, or traffic-jam conditions, so this chart does not show them.') }<section class="takeaways"><p class="kicker">Takeaways</p><h2>So here's what UX teams at AV companies should remember</h2><ol><li>Start with trust. It is the factor most closely tied to willingness, and low trust is the biggest barrier we found.</li><li>Treat safety as its own workstream. It is closely related to willingness, but not as closely as trust is.</li><li>Look across markets before you look across roads. Country differences in trust dwarf differences between driving contexts.</li><li>Don't read willingness to use as intent to buy. The gap shows up in every country, and its size varies a lot.</li><li>Acceptance depends on context and has several dimensions, so a one-size-fits-all rollout is unlikely to fit.</li></ol></section><section class="methods"><p class="kicker">Data and methods</p><h2>Data and methods</h2><p>Data: L3Pilot First Phase survey, a Volkswagen-led European research project on automated driving. We used Phase 1 only: 18,631 responses from 17 countries, both developed and emerging economies. Attitude questions use a 5-point agreement scale, and "prefer not to respond" is recorded separately.</p><p><a href="/data/l3pilot_clean.json">Download the cleaned data</a>. Blank values and the non-scale response code 6 are treated as missing for agreement averages. Rows are kept in the extract, and each chart states its valid sample through its marks or tooltip.</p></section><section class="conclusion"><p class="kicker">Conclusion</p><h2>Trust, readiness, and ownership are related. They are not interchangeable.</h2><p>The map, country profile, and market view keep these questions separate while showing how they connect.</p></section><footer><strong>Team Nulls</strong><span>CS 6730 Data Visualization · L3Pilot Global User Acceptance Survey</span></footer>`;
}

function renderMapSummary(container, mapData, state) {
  const metric = mapData.metrics.metrics.find((item) => item.key === state.selectedMetric) ?? mapData.metrics.metrics[0];
  const countries = Object.values(mapData.metrics.countries).filter((country) => Number.isFinite(country.metrics[metric.key]));
  const highest = d3.greatest(countries, (country) => country.metrics[metric.key]);
  const lowest = d3.least(countries, (country) => country.metrics[metric.key]);
  const world = container.querySelector('.world-view');
  let summary = world.querySelector('.global-summary');
  if (!summary) { summary = document.createElement('section'); summary.className = 'global-summary'; summary.setAttribute('aria-label', 'Selected metric summary'); world.insertBefore(summary, world.querySelector('.drilldown-stage')); }
  summary.innerHTML = `<div><span class="micro-label">Global average</span><strong>${mapData.metrics.global[metric.key].toFixed(1)}</strong><span>${metric.label}</span></div><div><span class="micro-label">Highest</span><strong>${highest.name}</strong><span>${highest.metrics[metric.key].toFixed(1)} / 100</span></div><div><span class="micro-label">Lowest</span><strong>${lowest.name}</strong><span>${lowest.metrics[metric.key].toFixed(1)} / 100</span></div>`;
}

function renderCharts(data, mapData, respondents, state) {
  const map = requireElement('#country-trust-chart');
  renderCountryDrilldown(map, mapData, state, { setMetric: setSelectedMetric, setCountry: setSelectedCountry, setHover: setHoveredCountry });
  renderMapSummary(map, mapData, state);
  renderCommercialGap(requireElement('#commercial-gap-chart'), respondents);
  renderWillingnessDistribution(requireElement('#would-get-in-chart'), data);
  renderTrustUseScatter(requireElement('#trust-use-chart'), data, mapData.metrics);
  renderTrustSafetyScatter(requireElement('#trust-safety-chart'), data, mapData.metrics);
  renderCountryMeasureDots(requireElement('#country-measures-chart'), data, mapData.metrics);
}

function renderDomError(error) { app.innerHTML = `<p class="error">Unable to render visualization: ${error.message}</p>`; }

async function initialize() {
  let data, mapData, respondents;
  try { [data, mapData, respondents] = await Promise.all([loadData(), loadMapData(), loadRespondents()]); }
  catch (error) { renderDomError(error); return; }
  buildPage(getStoryboardStats(data, mapData.metrics));
  mountDotMap(requireElement('.hero'));
  const render = (state) => { try { renderCharts(data, mapData, respondents, state); } catch (error) { renderDomError(error); } };
  subscribe(render);
  render(getState());
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), { threshold: .12 });
  app.querySelectorAll('.story-section, .intro, .conclusion, footer').forEach((element) => observer.observe(element));
}

initialize().catch(renderDomError);
