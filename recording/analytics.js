// analytics.js

const events = [];
const startTime = performance.now();

export function logEvent(type, data = {}) {
  events.push({
    t: Math.round(performance.now() - startTime),
    type,
    ...data,
  });
}

export function getEventLog() {
  return events;
}
