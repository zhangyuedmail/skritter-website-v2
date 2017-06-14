const GelatoComponent = require('gelato/component');
const VocablistCollection = require('collections/VocablistCollection');

/**
 * Component where the user can select multiple lists.
 * @class ListSelectComponent
 * @extends {GelatoComponent}
 */
const ListSelectComponent = GelatoComponent.extend({

  /**
   * @property events
   * @type {Object}
   */
  events: {
    'click #send-feedback': 'onSendFeedbackClicked'
  },

  /**
   * @property template
   * @type {Function}
   */
  template: require('./ListSelect.jade'),

  /**
   * @method initialize
   * @param {Object} [options]
   */
  initialize: function(options) {
    this.vocablists = new VocablistCollection();

    // hack in a quick comparator for sorting by name
    this.vocablists.comparator = function (list) {
      return list.get('shortName') || list.get('name');
    };

    this.listenTo(this.vocablists, 'sync', this.render);

    this.vocablists.fetch({
      data: {
        limit: 10,
        sort: 'studying',
        lang: app.getLanguage()
      }
    });
  },

  /**
   * @method render
   * @returns {ListSelectComponent}
   */
  render: function() {
    this.renderTemplate();

    this.$('#field-lists').multiselect();

    return this;
  },

  /**
   * @method getSelected
   */
  getSelected: function() {
    return this.$('#field-lists option:selected').map(function() {
      return $(this).val();
    }).get();
  }

});

module.exports = ListSelectComponent;
