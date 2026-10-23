const listeners = new Set();
let state = { filters: { country: null, ageGroup: null, trustLevel: null } };
export const getState = () => state;
export function setFilter(name, value) { state = { ...state, filters: { ...state.filters, [name]: value } }; listeners.forEach((listener) => listener(state)); }
export function resetFilters() { state = { ...state, filters: { country: null, ageGroup: null, trustLevel: null } }; listeners.forEach((listener) => listener(state)); }
export function subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); }
