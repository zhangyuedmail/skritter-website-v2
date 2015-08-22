var GelatoPage = require('gelato/page');
var DefaultNavbar = require('navbars/default/view');
var Vocablist = require('models/vocablist');
var VocablistSettings = require('dialogs/vocablist-settings/view');
var ConfirmDialog = require('dialogs/confirm/view');

/**
 * @class VocablistView
 * @extends {GelatoPage}
 */
module.exports = GelatoPage.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function(options) {
        this.vocablist = new Vocablist({id: options.vocablistId});
        this.vocablist.fetch();

        this.listenTo(this.vocablist, 'state', this.render);

        // Hack until state event and property works.
        this.listenTo(this.vocablist, 'sync', function() {
            this.vocablist.state = 'standby';
            this.render();
        });

        this.navbar = new DefaultNavbar();
    },
    /**
     * @property events
     * @type {Object}
     */
    events: {
        'vclick #add-to-queue-btn': 'handleClickAddToQueueButton',
        'vclick #study-settings-link': 'handleClickStudySettingsLink',
        'vclick #publish-link': 'handleClickPublishLink',
        'vclick #delete-link': 'handleClickDeleteLink'
    },
    /**
     * @property title
     * @type {String}
     */
    title: 'Vocab List - Skritter',
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @method render
     * @returns {VocablistView}
     */
    render: function() {
        this.renderTemplate();
        this.navbar.setElement('#navbar-container').render();
        return this;
    },
    /**
     * @method remove
     * @returns {VocablistView}
     */
    remove: function() {
        this.navbar.remove();
        return GelatoPage.prototype.remove.call(this);
    },
    /**
     * @method handleClickAddToQueueButton
     */
    handleClickAddToQueueButton: function() {
        if (this.vocablist.get('studyingMode') === 'not studying') {
            this.vocablist.set('studyingMode', 'adding');
            this.vocablist.save();
            this.render();
        }
    },
    /**
     * @method handleClickStudySettingsLink
     */
    handleClickStudySettingsLink: function() {
        this.dialog = new VocablistSettings({vocablist: this.vocablist});
        this.dialog.render().open();
    },
    /**
     * @method handleClickPublishLink
     */
    handleClickPublishLink: function() {
        var confirmDialog = new ConfirmDialog({
            title: 'Confirm Publish',
            body: 'Are you sure you want to publish this list? You cannot undo this.',
            okText: 'Yes - Publish!',
            onConfirm: 'show-spinner'
        });
        confirmDialog.render().open();
        this.listenTo(confirmDialog, 'confirm', function() {
            var publishUrl = app.api.getUrl() + _.result(this.vocablist, 'url') + '/publish';
            $.ajax({
                url: publishUrl,
                method: 'POST',
                headers: app.api.getUserHeaders(),
                success: function() {
                    document.location.reload()
                }
            })
        });
    },
    /**
     * @method handleClickDeleteLink
     */
    handleClickDeleteLink: function() {
        var confirmDialog = new ConfirmDialog({
            title: 'Confirm Delete',
            body: 'Are you sure you want to delete this list?',
            okText: 'Yes - Delete!',
            onConfirm: 'show-spinner'
        });
        confirmDialog.render().open();
        this.listenTo(confirmDialog, 'confirm', function() {
            var attrs = {
                disabled: true,
                studyingMode: 'not studying'
            };
            var options = {
                patch: true,
                method: 'PUT'
            };
            this.vocablist.save(attrs, options);
            this.listenToOnce(this.vocablist, 'state', function() {
                confirmDialog.close();
                app.router.navigate('/vocablist/my-lists', {trigger: true});
            })
        });
    }
});
