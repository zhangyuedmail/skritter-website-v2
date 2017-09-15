module.exports = {
  apiDomain: location.hostname.indexOf('.cn') > -1 ? '.cn' : '.com',

  apiRoot: 'https://legacy.skritter',

  /**
   * Root URL of the v2 API
   * @type {String}
   */
  apiRootV2: 'https://api.skritter.com/v2',

  apiVersion: 0,

  /**
   * Auto-advance delay amount in ms
   * @type {Number}
   */
  autoAdvanceDelay: 1000,

  /**
   * Max size in px of the study canvas
   * @type {Number}
   */
  canvasSize: 450,

  /**
   * Path for where to store audio persistently on a mobile device
   * @type {String}
   */
  cordovaAudioUrl: 'cdvfile://localhost/persistent/audios/',

  /**
   * The standard format a date should go in for internal application usage
   * (e.g. adding a date to a variable's value)
   * @type {String}
   */
  dateFormatApp: 'YYYY-MM-DD',

  demoLang: 'zh',

  description: '{!application-description!}',

  /**
   * A standard regexp to use to perform all frontend email validation
   * @type {RegExp}
   */
  emailRegexp: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,

  /**
   * Show all the fancy goal mode related stuff?
   * @type {Boolean}
   */
  goalModeEnabled: false,

  /**
   * How long to wait in ms before advancing to the next prompt after the user
   * clicks a grading button
   * @type {Number}
   */
  gradingBarClickAdvanceDelay: 200,

  /**
   * Target language of the application, either "zh"|"ja"
   * @type {String}
   */
  language: '{!application-language!}',

  /**
   * A number value representing last time items have been changed.
   * @type {Number}
   */
  lastItemChanged: 0,

  /**
   * A string representing last vocablist browse search term.
   * @type {String}
   */
  lastVocablistBrowseSearch: '',

  /**
   * The UI language code
   * @type {String}
   */
  locale: 'en',

  /**
   * Maximum number of items that can be auto-adding per day.
   * Does not limit manual adding.
   */
  maxAutoAddItems: 10,

  /**
   * The max amount of time for the timer to increase by for a certain prompt type.
   * @type {Object<String, Number>}
   */
  maxPromptTimes: {
    rune: 30,
    rdng: 30,
    defn: 30,
    tone: 15
  },

  nodeApiRoot: 'https://api-dot-write-way.appspot.com',

  /**
   * Whether to allow offline mode to function.
   */
  offlineEnabled: false,

  sentryUrl: 'https://4aa61a5ed92f4aaf8a9ae79777b70843@sentry.io/123679',

  /**
   * Whether to show a FPS counter when on the study page
   * @type {Boolean}
   */
  showCanvasFPS: false,

  /**
   * Whether app page load times should be stored to app.loadTimes
   * @type {Boolean}
   */
  recordLoadTimes: true && window.performance,

  /**
   * Whether to use a local backend instead of production
   * @type {Boolean}
   */
  thinkLocally: '{!application-thinkLocally!}',

  timestamp: '{!timestamp!}',

  title: '{!application-title!}',

  /**
   * Whether to use new API v2 GET endpoints
   * @type {Boolean}
   */
  useV2Gets: {
    items: false,
    itemsdue: false,
    progstats: true,
    subscriptions: false,
    users: true,
    vocablists: false,
    vocabs: false
  },

  version: '{!application-version!}',

  writingFillers: [' ', '~', '-', '～', '.', '。', ',', '，', '、', '・', '?', '？']
};
