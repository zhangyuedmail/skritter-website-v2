/**
 * @module Application
 */
define(['framework/BaseModel'], function(BaseModel) {
    /**
     * @class Analytics
     * @extends {BaseModel}
     */
    var Analytics = BaseModel.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function(attributes, options) {
            options = options ? options : {};
            this.enabled = false;
            this.user = options.user;
            if (app.isNative() && plugins.analytics) {
                if (app.get('languageCode') === 'ja') {
                    plugins.analytics.startTrackerWithId('UA-52116701-2');
                    this.enabled = true;
                } else if (app.get('languageCode') === 'zh') {
                    plugins.analytics.startTrackerWithId('UA-52116701-1');
                    this.enabled = true;
                }
            } else {
                //TODO: add tracking for html5 website version
            }
        },
        /**
         * @method setUserId
         * @param {String} userId
         */
        setUserId: function(userId) {
            if (!this.enabled) {
                return;
            }
            plugins.analytics.setUserId(userId);
        },
        /**
         * @method trackView
         * @param {String} title
         */
        trackView: function(title) {
            if (!this.enabled) {
                return;
            }
            plugins.analytics.trackView(title);
        }
    });

    return Analytics;
});
