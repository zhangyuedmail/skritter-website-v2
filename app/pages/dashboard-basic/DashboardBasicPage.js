const GelatoPage = require('gelato/page');
const VocablistCollection = require('collections/VocablistCollection');
const VocablistModel = require('models/VocablistModel');

/**
 * A page offering a new path for users to study.
 * @class DashboardBasic
 * @extends {DashboardBasicPage}
 */
const DashboardBasicPage = GelatoPage.extend({

  /**
   * @type {Object}
   */
  events: {
    'click .section-block': 'handleSectionBlockClicked',
  },

  /**
   * @type {Function}
   */
  template: require('./DashboardBasic'),

  /**
   * @type {String}
   */
  title: app.locale('pages.dashboard.title'),

  /**
   * @type {Object}
   */
  vocablistIds: {
    ja: ['6020832698564608', '5644672049348608'],
    zh: ['47872248', '47828570'],
  },

  /**
   * @type {VocablistCollection}
   */
  vocablists: new VocablistCollection(),

  /**
   * @constructor
   */
  initialize () {
    this.vocablists.setSort('name');
    this.fetchVocablists();
  },

  /**
   * @returns {DashboardBasic}
   */
  render () {
    this.renderTemplate();

    return this;
  },

  /**
   *
   */
  fetchVocablists () {
    async.eachSeries(this.getVocablistIds(), (listId, callback) => {
      new VocablistModel({id: listId}).fetch({
        error: () => {
          console.log('Unable to download vocablist:', listId);
        },
        success: (model) => {
          this.vocablists.add(model);
          callback();
        },
      });
    }, () => {
      this.render();
    });
  },

  /**
   * @returns {Array}
   */
  getVocablistIds () {
    return this.vocablistIds[app.getLanguage()].slice(0, 1);
  },

  handleSectionBlockClicked (event) {
    const $sectionBlock = $(event.currentTarget);
    const $vocablistBlock = $(event.currentTarget).closest('.vocablist-block');
    const sectionId = $sectionBlock.data('id');
    const vocablistId = $vocablistBlock.data('id');
    const vocablist = this.vocablists.get(vocablistId);

    if (vocablist.isActive()) {
      app.router.navigate(['study', vocablistId, sectionId].join('/'), {trigger: true});
    } else {
      vocablist.save({'studyingMode': 'reviewing'}, {patch: true});
    }
  },

});

module.exports = DashboardBasicPage;
