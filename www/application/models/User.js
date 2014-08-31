/**
 * @module Application
 */
define([
    'framework/BaseModel',
    'models/user/UserData',
    'models/user/UserSettings',
    'models/user/UserSubscription'
], function(BaseModel, UserData, UserSettings, UserSubscription) {
    /**
     * @class User
     * @extends BaseModel
     */
    var User = BaseModel.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {
            this.data = new UserData();
            this.settings = new UserSettings();
            this.subscription = new UserSubscription();
            if (localStorage.getItem('_active')) {
                this.set('id', localStorage.getItem('_active'));
                if (localStorage.getItem(this.id + '-data')) {
                    this.data.set(JSON.parse(localStorage.getItem(this.id + '-data')), {silent: true});
                }
                if (localStorage.getItem(this.id + '-settings')) {
                    this.settings.set(JSON.parse(localStorage.getItem(this.id + '-settings')), {silent: true});
                }
                if (localStorage.getItem(this.id + '-subscription')) {
                    this.subscription.set(JSON.parse(localStorage.getItem(this.id + '-subscription')), {silent: true});
                }
            }
        },
        /**
         * @property defaults
         * @type Object
         */
        defaults: {
            id: 'guest',
            lang: '@@language'
        }
    });

    return User;
});