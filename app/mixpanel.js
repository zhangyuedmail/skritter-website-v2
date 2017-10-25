function init (token) {
  if (window.mixpanel === undefined) {
    window.mixpanel = {
      alias: function () {},
      identify: function () {},
      init: function () {},
      register: function () {},
      track: function () {},
    };
    console.warn('Unable to init mixpanel');
  } else {
    window.mixpanel.init(token);
  }
}

function track (eventName, properties) {
  window.mixpanel.track(eventName, properties);
}

module.exports = {
  init: init,
  track: track,
};
