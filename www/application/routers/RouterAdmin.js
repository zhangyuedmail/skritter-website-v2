/**
 * @module Application
 */
define([
    'framework/BaseRouter',
    'pages/admin/ParamEditor'
], function(BaseRouter, PageAdminParamEditor) {
    /**
     * @class RouterAdmin
     * @extends BaseRouter
     */
    var RouterAdmin = BaseRouter.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {},
        /**
         * @property routes
         * @type Object
         */
        routes: {
            'admin/param-editor': 'showParamEditor',
            'admin/param-editor/:strokeId': 'showParamEditor'
        },
        /**
         * @method showParamEditor
         * @param {String} [strokeId]
         */
        showParamEditor: function(strokeId) {
            this.currentPage = new PageAdminParamEditor();
            this.currentPage.set(strokeId).render();
        }
    });

    return RouterAdmin;
});
