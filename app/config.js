module.exports = {
  apiDomain: location.hostname.indexOf('.cn') > -1 ? '.cn' : '.com',

  apiRoot: 'https://legacy.skritter',

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

  language: null,

  lastItemChanged: 0,

  locale: 'en',

  nodeApiRoot: 'https://api-dot-write-way.appspot.com',

  timestamp: '{!timestamp!}',

  title: '{!application-title!}',

  version: '{!application-version!}'
};
