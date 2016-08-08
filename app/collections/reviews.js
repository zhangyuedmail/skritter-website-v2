var SkritterCollection = require('base/skritter-collection');
var Review = require('models/review');

/**
 * @class Reviews
 * @extends {SkritterCollection}
 */
module.exports = SkritterCollection.extend({

  /**
   * @property model
   * @type {Review}
   */
  model: Review,

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
  },

  /**
   * @method comparator
   * @param {Review} review
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
   * @method post
   * @param {Object} [options]
   */
  post: function(options) {
    var self = this;
    options = _.defaults(options || {}, {async: true, skip: 0});
    if (this.state === 'standby') {
      this.state = 'posting';
      this.trigger('state', this.state, this);
      this.trigger('state:' + this.state, this);
      var reviews = this.slice(0, -options.skip || this.length);
      async.eachSeries(
        _.chunk(reviews, 20),
        function(chunk, callback) {
          var data = _
            .chain(chunk)
            .map(function(review) {
              return review.get('data');
            })
            .flatten()
            .value();
          //TODO: figure out why duplicates exist
          data = _.uniqBy(data, function(review) {
            return [
              review.itemId,
              review.currentInterval,
              review.newInterval
            ].join('');
          });
          $.ajax({
            url: app.getApiUrl() + 'reviews',
            async: options.async,
            headers: app.user.session.getHeaders(),
            type: 'POST',
            data: JSON.stringify(data),
            error: function(error) {
              var items = _
                .chain(error.responseJSON.errors)
                .map('Item')
                .without(undefined)
                .value();
              if (items.length) {
                Raygun.send(
                  new Error('Review Error: Items returned with errors'),
                  {
                    data: data,
                    error: error.responseJSON
                  }
                );
                self.reset();
                callback(error);
              } else {
                Raygun.send(
                  new Error('Review Error: Unable to post chunk'),
                  {
                    data: data,
                    error: error.responseJSON
                  }
                );
                self.remove(chunk);
                callback();
              }

            },
            success: function() {
              self.remove(chunk);
              setTimeout(callback, 1000);
            }
          });
        },
        function(error) {
          self.state = 'standby';
          self.trigger('state', self.state, self);
          self.trigger('state:' + self.state, self);
          if (error) {
            console.error('REVIEW ERROR:', error);
          } else {
            console.log('REVIEWS POSTED:', reviews.length);
          }
        }
      );
    }
  },

  /**
   * @method put
   * @param {Object} models
   * @param {Object} [options]
   * @returns {Array}
   */
  put: function(models, options) {
    //var updatedItems = [];
    var updatedReviews = [];
    models = _.isArray(models) ? models : [models];
    options = _.defaults(options || {}, {merge: true});
    for (var a = 0, lengthA = models.length; a < lengthA; a++) {
      var model = models[a];
      model.data = _.uniqBy(model.data, 'itemId');
      for (var b = 0, lengthB = model.data.length; b < lengthB; b++) {
        var modelData = model.data[b];
        var item = modelData.item.clone();
        var submitTimeSeconds = Math.round(modelData.submitTime);
        modelData.actualInterval = item.get('last') ? submitTimeSeconds - item.get('last') : 0;
        modelData.newInterval = app.fn.interval.quantify(item.toJSON(), modelData.score);
        modelData.previousInterval = item.get('previousInterval') || 0;
        modelData.previousSuccess = item.get('previousSuccess') || false;
        if (!_.isInteger(modelData.score)) {
          modelData = 3;
          modelData.newInterval = 86400;
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
        /**
         * used for updating of local items
         if (!this.get(model.group)) {
          item.set({
            changed: submitTimeSeconds,
            last: submitTimeSeconds,
            previousInterval: modelData.currentInterval,
            reviews: item.get('reviews') + 1,
            successes: modelData.score > 1 ? item.get('successes') + 1 : item.get('successes'),
            timeStudied: item.get('timeStudied') + modelData.reviewTime
          });
        }
         item.set({
          interval: modelData.newInterval,
          next: submitTimeSeconds + modelData.newInterval,
          previousSuccess: modelData.score > 1
        });
         updatedItems.push(item);
         **/

      }
      updatedReviews.push(this.add(model, options));
    }
    return updatedReviews;
  }

});
