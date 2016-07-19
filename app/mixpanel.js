function init(token) {
  if (window.mixpanel === undefined) {
    window.mixpanel = {track: function() {}};
    console.warn('Unable to init mixpanel');
  } else {
    window.mixpanel.init(token);
  }
}

function track(eventName, properties) {
  window.mixpanel.track(eventName, properties);
}

module.exports = {
  init: init,
  track: track
};
