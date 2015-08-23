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
        'vclick #delete-link': 'handleClickDeleteLink',
        'vclick #copy-link': 'handleClickCopyLink',
        'vclick #edit-link': 'handleClickEditLink',
        'vclick #cancel-edits-link': 'handleClickCancelEditsLink',
        'vclick #save-edits-btn': 'handleClickSaveEditsButton',
        'vclick #image-upload-link': 'handleClickImageUploadLink',
        'change #image-upload-input': 'handleChangeImageUploadInput'
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
        this.$('#list-img').error(_.bind(this.handleLoadImageError, this));
        return this;
    },
    /**
     * @method handleLoadImageError
     * @param {Event} event
     */
    handleLoadImageError: function(event) {
        $(event.target).remove();
        this.$('#missing-image-stub').removeClass('hide');
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
            });
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
            });
        });
    },
    /**
     * @method handleClickCopyLink
     */
    handleClickCopyLink: function() {
        var confirmDialog = new ConfirmDialog({
            title: 'Confirm Copy',
            body: 'Are you sure you want to make a copy of this list?',
            okText: 'Yes - Copy!',
            onConfirm: 'show-spinner'
        });
        confirmDialog.render().open();
        this.listenTo(confirmDialog, 'confirm', function() {
            var copyUrl = app.api.getUrl() + _.result(this.vocablist, 'url') + '/copy';
            $.ajax({
                url: copyUrl,
                method: 'POST',
                headers: app.api.getUserHeaders(),
                success: function(response) {
                    confirmDialog.close();
                    var newListId = response.VocabList.id;
                    app.router.navigate('/vocablist/view/'+newListId, {trigger: true});
                }
            });
        });
    },
    /**
     * @method handleClickEditLink
     */
    handleClickEditLink: function() {
        this.$('#editing-version').removeClass('hide');
        this.$('#static-version').addClass('hide');
    },
    /**
     * @method handleClickCancelEditsLink
     */
    handleClickCancelEditsLink: function() {
        this.$('#editing-version').addClass('hide');
        this.$('#static-version').removeClass('hide');
    },
    /**
     * @method handleClickSaveEditsButton
     */
    handleClickSaveEditsButton: function() {
        var tags = this.$('#tags-input').val().split(',');
        tags = _.map(tags, _.trim);
        tags = _.filter(tags);

        var attrs = {
            name: this.$('#name-input').val(),
            description: this.$('#description-textarea').val(),
            tags: tags
        };

        this.vocablist.set(attrs);
        this.vocablist.save(attrs, {patch: true, method: 'PUT'});
    },
    /**
     * @method handleClickImageUploadLink
     */
    handleClickImageUploadLink: function() {
        $('#image-upload-input').trigger('click');
    },
    /**
     * @method handleChangeImageUploadInput
     * @param {Event} e
     */
    handleChangeImageUploadInput: function(e) {
        var file = e.target.files[0];
        var data = new FormData();
        data.append('image', file);
        this.$('#list-img-wrapper .fa-spinner').removeClass('hide');
        this.$('#list-img').remove();
        this.$('#missing-image-stub').removeClass('hide');

        var imageUrl = app.api.getUrl() + _.result(this.vocablist, 'url') + '/image';
        $.ajax({
            url: imageUrl,
            method: 'POST',
            headers: app.api.getUserHeaders(),
            data: data,
            processData: false,
            contentType: false,
            success: function() {
                document.location.reload();
            }
        });
    }
});
