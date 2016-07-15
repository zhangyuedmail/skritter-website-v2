function isLoaded() {
  return window.mixpanel !== undefined;
}

function init(token) {
  if (isLoaded()) {
    window.mixpanel.init(token);
  } else {
    console.warn('Unable to init mixpanel');
  }
}

function track(eventName, properties) {
  if (isLoaded()) {
    window.mixpanel.track(eventName, properties);
  } else {
    console.warn('Unable to track event', eventName);
  }
}

module.exports = {
  isLoaded: isLoaded,
  init: init,
  track: track
};
