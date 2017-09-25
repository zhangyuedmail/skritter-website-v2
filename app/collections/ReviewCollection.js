const BaseSkritterCollection = require('base/BaseSkritterCollection');
const ReviewModel = require('models/ReviewModel');

/**
 * @class ReviewCollection
 * @extends {BaseSkritterCollection}
 */
const ReviewCollection = BaseSkritterCollection.extend({

  /**
   * @property model
   * @type {ReviewModel}
   */
  model: ReviewModel,

  /**
   * @property url
   * @type {String}
   */
  url: 'reviews',

  /**
   * @method initialize
   * @param {Array|Object} [models]
   * @param {Object} [options]
   * @constructor
   */
  initialize: function(models, options) {
    options = options || {};
    this.items = options.items;
    this.addCountOffset = 0;
    this.postCountOffset = 0;
  },

  /**
   * @method comparator
   * @param {ReviewModel} review
   * @return {String}
   */
  comparator: function(review) {
    return review.get('created');
  },

  /**
   * @method fetchReviewErrors
   * @param {Function} [callback]
   */
  fetchReviewErrors: function(callback) {
    $.ajax({
      url: app.getApiUrl() + 'reviews/errors',
      headers: app.user.session.getHeaders(),
      type: 'GET',
      data: {
        limit: 100,
        offset: moment().startOf('year').unix()
      },
      error: function(error) {
        console.error(error);
      },
      success: function(result) {
        console.log(result);
      }
    });
  },

  /**
   * Returns an arrat of data items matching the given itemId.
   * @param {String} itemId
   * @returns {Object[]}
   */
  getByItemId: function(itemId) {
    return _.chain(this.models)
      .map(model => model.get('data'))
      .flatten()
      .filter(model => model.itemId === itemId)
      .sortBy('submitTime')
      .value();
  },

  /**
   * @method getDueCountOffset
   * @returns {Number}
   */
  getDueCountOffset: function() {
    const reviews = _.flatten(this.map('data'));
    let offset = this.postCountOffset - this.addCountOffset;

    _.forEach(reviews, review => {
      if (review.due) offset++;
    });

    return offset;
  },

  /**
   * @method post
   * @param {Object} [options]
   */
  post: function(options) {
    options = _.defaults(options || {}, {async: true, skip: 0});

    if (this.state !== 'standby') {
      return;
    }


    this.state = 'posting';
    this.trigger('state', this.state, this);
    this.trigger('state:' + this.state, this);

    const reviews = this.slice(0, -options.skip || this.length);

    return new Promise(
      (resolve) => {
        async.eachSeries(
          _.chunk(reviews, 20),
          (chunk, callback) => {
            const data = _
              .chain(chunk)
              .map(review => review.get('data'))
              .flatten()
              .uniqBy(review => [review.itemId, review.currentInterval, review.newInterval].join(''))
              .value();

            $.ajax({
              url: app.getApiUrl() + 'reviews?spaceItems=' + app.user.get('spaceItems'),
              async: options.async,
              headers: app.user.session.getHeaders(),
              type: 'POST',
              data: JSON.stringify(data),
              error: (error) => {
                const items = _
                  .chain(error.responseJSON ? error.responseJSON.errors : [])
                  .map('Item')
                  .without(undefined)
                  .value();

                if (items.length) {
                  this.reset();

                  callback(error);
                } else {
                  this.remove(chunk);

                  callback();
                }
              },
              success: () => {
                this.remove(chunk);

                if (app.user.offline.isReady()) {
                  app.user.offline.removeReviews(chunk);
                  app.user.offline.updateItems(chunk);
                }

                _.forEach(data, review => {
                  if (review.due) this.postCountOffset++;
                });

                this.trigger('update:due', true);

                setTimeout(callback, 1000);
              }
            });
          },
          (error) => {
            this.state = 'standby';
            this.trigger('state', self.state, self);
            this.trigger('state:' + self.state, self);

            if (error) {
              console.error('REVIEW ERROR:', error);
            } else {
              console.log('REVIEWS POSTED:', reviews.length);
            }

            resolve();
          }
        );
      }
    );
  },

  /**
   * @method put
   * @param {Object} models
   * @param {Object} [options]
   * @returns {Array}
   */
  put: function(models, options) {
    const updatedReviews = [];

    models = _.isArray(models) ? models : [models];
    options = _.defaults(options || {}, {merge: true});

    for (let a = 0, lengthA = models.length; a < lengthA; a++) {
      const model = models[a];

      model.data = _.uniqBy(model.data, 'itemId');

      for (let b = 0, lengthB = model.data.length; b < lengthB; b++) {
        const modelData = model.data[b];
        const item = modelData.item.clone();
        const submitTimeSeconds = Math.round(modelData.submitTime);

        if (!_.isInteger(modelData.score)) {
          console.error('REVIEW ERROR:', 'score must be an integer value');
        }

        modelData.actualInterval = item.get('last') ? submitTimeSeconds - item.get('last') : 0;
        modelData.newInterval = app.fn.interval.quantify(item.toJSON(), modelData.score);
        modelData.previousInterval = item.get('previousInterval') || 0;
        modelData.previousSuccess = item.get('previousSuccess') || false;

        if (!_.isInteger(modelData.newInterval)) {
          console.error('REVIEW ERROR:', 'missing new interval integer value');
        }

        if (app.isDevelopment()) {
          console.log(
            item.id,
            'graded',
            modelData.score,
            'scheduled for',
            moment.duration(modelData.newInterval, 'seconds').as('days'),
            'days'
          );
        }
      }

      updatedReviews.push(this.add(model, options));
    }

    if (app.user.offline.isReady()) {
      app.user.offline.putReviews(updatedReviews);
    }

    this.trigger('update:due', true);

    return updatedReviews;
  }

});

module.exports = ReviewCollection;
