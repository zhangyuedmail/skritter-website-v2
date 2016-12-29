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
   * The standard format a date should go in for internal application usage
   * (e.g. adding a date to a variable's value)
   * @type {String}
   */
  dateFormatApp: 'YYYY-MM-DD',

  demoLang: 'zh',

  description: '{!application-description!}',

  canvasSize: 450,

  language: '{!application-language!}',

  lastItemChanged: 0,

  locale: 'en',

  nodeApiRoot: 'https://api-dot-write-way.appspot.com',

  sentryUrl: 'https://4aa61a5ed92f4aaf8a9ae79777b70843@sentry.io/123679',

  timestamp: '{!timestamp!}',

  title: '{!application-title!}',

  version: '{!application-version!}'
};
