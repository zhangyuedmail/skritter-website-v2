var GelatoPage = require('gelato/page');
var DefaultNavbar = require('navbars/default/view');
var VocablistSidebar = require('components/vocablist-sidebar/view');
var ChinesePodSession = require('models/chinesepod-session');
var ChinesePodLabels = require('collections/chinesepod-labels');
var ChinesePodLessons = require('collections/chinesepod-lessons');

/**
 * @class ChinesePodPage
 * @extends {GelatoPage}
 */
module.exports = GelatoPage.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this.navbar = new DefaultNavbar();
        this.sidebar = new VocablistSidebar();
        this.chinesepodSession = new ChinesePodSession();
        this.chinesepodSession.fetch();
        this.listenToOnce(this.chinesepodSession, 'state', this.handleChinesepodSessionLoaded);
        this.chinesepodLabels = new ChinesePodLabels();
        this.chinesepodLessons = new ChinesePodLessons();
        this.listenTo(this.chinesepodLabels, 'state', this.render);
        this.listenTo(this.chinesepodLessons, 'state', this.render);
        this.viewOption = 'lessons';
        this.email = '';
        this.password = '';
        this.errorMessage = '';
        this.searchString = '';
    },
    /**
     * @property bodyClass
     * @type {String}
     */
    bodyClass: 'background1',
    /**
     * @property events
     * @type {Object}
     */
    events: {
        'submit #login-form': 'handleSubmitLoginForm',
        'vclick #logout-chinesepod-link': 'handleClickLogoutChineseLink',
        'keyup #search-input': 'handleChangeSearchInput',
        'change input[name="view-option"]': 'handleChangeViewOption',
        'click .lookup-link': 'handleClickLookupLink'
    },
    /**
     * @property title
     * @type {String}
     */
    title: 'ChinesePod Lists - Skritter',
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @method render
     * @returns {ChinesePodPage}
     */
    render: function() {
        this.renderTemplate();
        this.navbar.render();
        this.sidebar.setElement('#vocablist-sidebar-container').render();
        return this;
    },
    /**
     * @method remove
     * @returns {VocablistBrowse}
     */
    remove: function() {
        this.navbar.remove();
        this.sidebar.remove();
        return GelatoPage.prototype.remove.call(this);
    },
    /**
     * @method handleChinesepodSessionLoaded
     */
    handleChinesepodSessionLoaded: function() {
        this.render();
        if (!this.chinesepodSession.isNew()) {
            this.chinesepodLabels.fetch();
            this.chinesepodLessons.fetch();
        }
    },
    /**
     * @method handleSubmitLoginForm
     * @param {Event} e
     */
    handleSubmitLoginForm: function(e) {
        e.preventDefault();
        this.email = this.$('#email').val();
        this.password = this.$('#password').val();
        this.errorMessage = '';
        this.chinesepodSession.set({
            email: this.email,
            password: this.password
        });
        this.chinesepodSession.save();
        this.listenToOnce(this.chinesepodSession, 'sync', function() {
            document.location.reload();
        });
        this.listenToOnce(this.chinesepodSession, 'error', function(model, jqxhr) {
            this.errorMessage = jqxhr.responseJSON.message;
            this.render();
        });
        this.render();
    },
    /**
     * @method handleClickLogoutChineseLink
     */
    handleClickLogoutChineseLink: function() {
        this.chinesepodSession.destroy();
        this.listenToOnce(this.chinesepodSession, 'sync', function() {
            document.location.reload();
        })
    },
    /**
     * @method handleChangeSearchInput
     * @param {Event} e
     */
    handleChangeSearchInput: _.throttle(function(e) {
        this.searchString = $(e.target).val().toLowerCase();
        this.renderTable();
    }, 500),
    /**
     * @method renderTable
     */
    renderTable: function() {
        var context = require('globals');
        context.view = this;
        var rendering = $(this.template(context));
        this.$('table').replaceWith(rendering.find('table'));
    },
    /**
     * @method handleChangeViewOption
     */
    handleChangeViewOption: function() {
        this.viewOption = $('input[name="view-option"]:checked').val();
        this.renderTable();
    },
    /**
     * @method handleClickLookupLink
     */
    handleClickLookupLink: function(e) {
        var lookupToken = $(e.target).data('lookup-token');
        var url = app.getApiUrl() + 'cpod/list/' + lookupToken;
        var headers = app.user.session.getHeaders();
        $(e.target).append($(" <i class='fa fa-1x fa-spinner fa-pulse' />"));
        $.ajax({
            url: url,
            headers: headers,
            success: function (response) {
                document.location.href = '/vocablist/view/' + response.vocabListID;
            }
        });
    }
});
