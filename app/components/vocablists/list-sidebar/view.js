var GelatoComponent = require('gelato/component');

var ConfirmDialog = require('dialogs/confirm/view');
var VocablistSettingsDialog = require('dialogs/vocablist-settings/view');
var VocablistSectionsEditDialog = require('dialogs/vocablist-sections-edit/view');

/**
 * @class VocablistsListSidebar
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
    /**
     * @method initialize
     * @param {Object} options
     * @constructor
     */
    initialize: function(options) {
        this.vocablist = options.vocablist;
    },
    /**
     * @property events
     * @type {Object}
     */
    events: {
        'change #image-upload-input': 'handleChangeImageUploadInput',
        'click #add-to-queue': 'handleClickAddToQueue',
        'click #copy-link': 'handleClickCopyLink',
        'click #delete-link': 'handleClickDeleteLink',
        'click #publish-link': 'handleClickPublishLink',
        'click #study-settings-link': 'handleClickStudySettingsLink',
        'click #image-upload-link': 'handleClickImageUploadLink'
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @method render
     * @returns {VocablistsListSidebar}
     */
    render: function() {
        this.renderTemplate();
    },
    /**
     * @method handleChangeImageUploadInput
     * @param {Event} event
     */
    handleChangeImageUploadInput: function(event) {
        var file = event.target.files[0];
        var data = new FormData().append('image', file);
        this.$('#list-img-wrapper .fa-spinner').removeClass('hide');
        this.$('#list-img').remove();
        this.$('#missing-image-stub').removeClass('hide');
        var imageUrl = app.getApiUrl() + _.result(this.vocablist, 'url') + '/image';
        $.ajax({
            url: imageUrl,
            method: 'POST',
            headers: app.user.headers(),
            data: data,
            processData: false,
            contentType: false,
            success: function() {
                document.location.reload();
            }
        });
    },
    /**
     * @method handleClickAddToQueue
     * @param {Event} event
     */
    handleClickAddToQueue: function(event) {
        event.preventDefault();
        if (this.vocablist.get('studyingMode') === 'not studying') {
            this.vocablist.save({'studyingMode': 'adding'}, {patch: true});
            this.render();
        }
    },
    /**
     * @method handleClickCopyLink
     * @param {Event} event
     */
    handleClickCopyLink: function(event) {
        event.preventDefault();
        var confirmDialog = new ConfirmDialog({
            title: 'Confirm Copy',
            body: 'Are you sure you want to make a copy of this list?',
            okText: 'Yes - Copy!',
            onConfirm: 'show-spinner'
        });
        this.listenTo(confirmDialog, 'confirm', function() {
            var copyUrl = app.getApiUrl() + _.result(this.vocablist, 'url') + '/copy';
            $.ajax({
                url: copyUrl,
                method: 'POST',
                headers: app.user.headers(),
                success: function(response) {
                    app.router.navigate('/vocablist/view/' + response.VocabList.id, {trigger: true});
                }
            });
        });
        confirmDialog.render().open();
    },
    /**
     * @method handleClickDeleteLink
     * @param {Event} event
     */
    handleClickDeleteLink: function(event) {
        event.preventDefault();
        var confirmDialog = new ConfirmDialog({
            title: 'Confirm Delete',
            body: 'Are you sure you want to delete this list?',
            okText: 'Yes - Delete!',
            onConfirm: 'show-spinner'
        });
        this.listenTo(confirmDialog, 'confirm', function() {
            this.vocablist.save({disabled: true, studyingMode: 'not studying'}, {patch: true});
            this.listenToOnce(this.vocablist, 'state', function() {
                app.router.navigate('/vocablists/my-lists', {trigger: true});
            });
        });
        confirmDialog.render().open();
    },
    /**
     * @method handleClickImageUploadLink
     * @param {Event} event
     */
    handleClickImageUploadLink: function(event) {
        event.preventDefault();
        this.$('#image-upload-input').trigger('click');
    },
    /**
     * @method handleClickPublishLink
     * @param {Event} event
     */
    handleClickPublishLink: function(event) {
        var confirmDialog = new ConfirmDialog({
            title: 'Confirm Publish',
            body: 'Are you sure you want to publish this list? You cannot undo this.',
            okText: 'Yes - Publish!',
            onConfirm: 'show-spinner'
        });
        this.listenTo(confirmDialog, 'confirm', function() {
            var publishUrl = app.getApiUrl() + _.result(this.vocablist, 'url') + '/publish';
            $.ajax({
                url: publishUrl,
                method: 'POST',
                headers: app.user.headers(),
                success: function() {
                    document.location.reload()
                }
            });
        });
        confirmDialog.render().open();
    },
    /**
     * @method handleClickStudySettingsLink
     * @param {Event} event
     */
    handleClickStudySettingsLink: function(event) {
        event.preventDefault();
        this.dialog = new VocablistSettingsDialog({vocablist: this.vocablist});
        this.dialog.render().open();
    }
});
