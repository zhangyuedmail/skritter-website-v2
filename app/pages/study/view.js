var GelatoPage = require('gelato/page');

var Prompt = require('components/study/prompt/view');
var Toolbar = require('components/study/toolbar/view');
var Items = require('collections/items');
var Navbar = require('navbars/default/view');

/**
 * @class Study
 * @extends {GelatoPage}
 */
module.exports = GelatoPage.extend({
  /**
   * @method initialize
   * @constructor
   */
  initialize: function() {
    ScreenLoader.show();
    this.item = null;
    this.navbar = new Navbar();
    this.prompt = new Prompt();
    this.queue = [];
    this.schedule = new Items();
    this.scheduleState = 'standby';
    this.toolbar = new Toolbar({page: this});
    this.listenTo(this.schedule, 'populate', this.handleSchedulePopulate);
    this.listenTo(this.schedule, 'load', this.handleScheduledLoad);
    this.listenTo(this.prompt, 'next', this.handlePromptNext);
    this.listenTo(this.prompt, 'previous', this.handlePromptPrevious);
    window.onbeforeunload = this.handleWindowOnBeforeUnload.bind(this);
    this.loadSchedule();
  },
  /**
   * @property events
   * @type Object
   */
  events: {},
  /**
   * @property template
   * @type {Function}
   */
  template: require('./template'),
  /**
   * @property title
   * @type {String}
   */
  title: 'Study - Skritter',
  /**
   * @method render
   * @returns {Study}
   */
  render: function() {
    this.renderTemplate();
    this.navbar.setElement('#navbar-container').render();
    this.prompt.setElement('#study-prompt-container').render();
    this.toolbar.setElement('#study-toolbar-container').render();
    return this;
  },
  /**
   * @method handleWindowOnBeforeUnload
   */
  handleWindowOnBeforeUnload: function() {
    if (!this.schedule.reviews.length) {
      return;
    }
    return 'You have ' + this.schedule.reviews.length + ' unsaved reviews!';
  },
  /**
   * @method handlePromptNext
   * @param {PromptItems} promptItems
   */
  handlePromptNext: function(promptItems) {
    var self = this;
    if (this.item && promptItems) {
      var review = promptItems.getReview();
      if (!this.schedule.reviews.get(review)) {
        this.toolbar.timer.addLocalOffset(promptItems.getBaseReviewingTime());
      }
      this.schedule.reviews.put(review, null, function() {
        if (self.schedule.reviews.length > 4) {
          self.schedule.reviews.post({skip: 1});
        }
        self.item = null;
        self.next();
      });
    } else {
      this.next();
    }
  },
  /**
   * @method handlePromptPrevious
   * @param {PromptItems} promptItems
   */
  handlePromptPrevious: function(promptItems) {
    if (!this.queue[0].group) {
      this.queue.unshift(promptItems);
      this.previous();
    }
  },
  /**
   * @method handleScheduledLoad
   */
  handleScheduledLoad: function() {
    var self = this;
    ScreenLoader.post('Preparing for study');
    app.user.db.reviews
      .toArray()
      .then(function(reviews) {
        self.schedule.reviews.add(reviews);
        self.prompt.setSchedule(self.schedule);
        self.populateQueue();
      })
      .catch(function(error) {
        console.error('SCHEDULE LOAD ERROR:', error);
        self.populateQueue();
      });
  },
  /**
   * @method handleSchedulePopulate
   */
  handleSchedulePopulate: function() {
    if (this.prompt.isLoaded()) {
      console.info('QUEUE:', 'Added more items to queue.');
    } else {
      ScreenLoader.hide();
      this.next();
    }
  },
  /**
   * @method loadSchedule
   */
  loadSchedule: function() {
    var self = this;
    var lang = app.getLanguage();
    var parts = app.user.getFilteredParts();
    var studyKana = app.user.get('studyKana');
    var styles = app.user.getFilteredStyles();
    app.user.db.items
      .toArray()
      .then(function(items) {
        items = items.filter(function(item) {
          if (!item.vocabIds.length) {
            return false;
          } else if (item.lang !== lang) {
            return false
          } else if (parts.indexOf(item.part) === -1) {
            return false;
          } else if (styles.indexOf(item.style) === -1) {
            return false;
          }
          if (item.lang === 'ja') {
            var writing = item.id.split('-')[2];
            // Skip all kana items when no kanji exists
            if (!studyKana && app.fn.isKana(writing)) {
              return false;
            }
          }
          return true;
        });
        self.queue = [];
        self.schedule.set(items.splice(0, 2000));
        self.schedule.trigger('load', self.schedule);
      })
      .catch(function(error) {
        self.schedule.trigger('error', error);
      });
  },
  /**
   * @method next
   */
  next: function() {
    var item = this.queue.shift();
    if (item) {
      this.toolbar.render();
      this.prompt.set(item.group ? item : item.getPromptItems());
      if (this.scheduleState === 'standby' && this.queue.length < 5) {
        this.scheduleState = 'populating';
        this.populateQueue();
      }
      this.item = item;
    }
  },
  /**
   * @method populateQueue
   */
  populateQueue: function() {
    var self = this;
    var items = [];
    this.$('#loading-indicator').removeClass('hidden');
    //store base histories for better spacing
    var localHistory = [];
    var queueHistory = this.queue.map(function(item) {
      return item.getBase();
    });
    //creates an array items to queue
    for (var i = 0, length = this.schedule.sort().length; i < length; i++) {
      var item = this.schedule.at(i);
      var itemBase = item.getBase();
      if (items.length < 10 && item.get('vocabIds').length) {
        if (localHistory.indexOf(itemBase) === -1 &&
          queueHistory.indexOf(itemBase) === -1) {
          localHistory.push(itemBase);
          items.push(item);
        }
      } else {
        break;
      }
    }
    //fetch resource data for queue items
    this.schedule.fetch({
      data: {
        ids: _.map(items, 'id').join('|'),
        include_contained: true,
        include_decomps: true,
        include_heisigs: true,
        include_sentences: true,
        include_strokes: true,
        include_vocabs: true
      },
      merge: false,
      remove: false,
      error: function(error) {
        self.schedule.trigger('error', error);
        self.scheduleState = 'standby';
      },
      success: function(items, result) {
        var now = moment().unix();
        var sortedItems = _.sortBy(result.Items, function(item) {
          var readiness = 0;
          if (!item.last) {
            readiness = 9999;
          } else {
            readiness = (now - item.last) / (item.next - item.last);
          }
          return -readiness;
        });
        for (var i = 0, length = sortedItems.length; i < length; i++) {
          self.queue.push(self.schedule.get(sortedItems[i].id));
        }
        self.schedule.trigger('populate', self.queue);
        self.scheduleState = 'standby';
      }
    });
  },
  /**
   * @method previous
   */
  previous: function() {
    if (this.schedule.reviews.length) {
      var review = this.schedule.reviews.last();
      if (review.has('promptItems')) {
        this.toolbar.render();
        this.prompt.set(review.get('promptItems'));
      }
    }
  },
  /**
   * @method remove
   * @returns {Study}
   */
  remove: function() {
    this.navbar.remove();
    this.prompt.remove();
    this.toolbar.remove();
    this.schedule.reviews.post();
    window.onbeforeunload = null;
    return GelatoPage.prototype.remove.call(this);
  }
});
