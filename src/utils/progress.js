function key(user) {
  return `progress_${user?.email || "guest"}`;
}

export function loadStats(user) {
  try { return JSON.parse(localStorage.getItem(key(user))) || {}; }
  catch { return {}; }
}

export function saveStats(user, statsObj) {
  localStorage.setItem(key(user), JSON.stringify(statsObj));
}