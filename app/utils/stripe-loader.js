module.exports.load = _.once(function() {
  $.getScript('https://js.stripe.com/v2/');
});
