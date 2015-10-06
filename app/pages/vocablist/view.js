var GelatoPage = require('gelato/page');
var VocablistSettings = require('dialogs/vocablist-settings/view');
var ConfirmDialog = require('dialogs/confirm/view');
var VocablistSectionsEditDialog = require('dialogs/vocablist-sections-edit/view');
var DefaultNavbar = require('navbars/default/view');
var User = require('models/user');
var Vocablist = require('models/vocablist');

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
        this.navbar = new DefaultNavbar();
        this.vocablist = new Vocablist({id: options.vocablistId});
        this.vocablist.fetch({data: {includeSectionCompletion: true}});
        this.listenTo(this.vocablist, 'sync', function() {
            this.loadCreatorNameIfNeeded();
            this.render();
        });
        this.updating = false;
    },
    /**
     * @method loadCreatorNameIfNeeded
     */
    loadCreatorNameIfNeeded: function() {
        // Only need to find the real name of the creator if this is a
        // custom list made by someone other than the logged in user.
        var isCustom = this.vocablist.get('sort') === 'custom';
        var isOwned = this.vocablist.get('creator') === app.user.id;
        if (!isCustom || isOwned) {
            return;
        }
        this.creator = new User({id: this.vocablist.get('creator')});
        this.creator.fetch({
            data: { fields: 'name' }
        });
        this.listenTo(this.creator, 'sync', function() {
            var selector = '[data-user-id="'+this.creator.id+'"]';
            var text = this.creator.get('name') || this.creator.id;
            this.$(selector).text(text);
        });
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
        'change #image-upload-input': 'handleChangeImageUploadInput',
        'vclick #add-section-link': 'handleClickAddSectionLink',
        'vclick #cancel-add-section-btn': 'handleClickCancelAddSectionButton',
        'vclick #confirm-add-section-btn': 'handleClickConfirmAddSectionButton',
        'vclick #edit-sections-link': 'handleClickEditSectionsLink',
        'vclick #update-link': 'handleClickUpdateLink'
    },
    /**
     * @property title
     * @type {String}
     */
    title: 'Vocab List - Skritter',
    /**
     * @property bodyClass
     * @type {String}
     */
    bodyClass: 'background1',
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
        this.$('[data-toggle="tooltip"]').tooltip();
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
            var attrs = {'studyingMode': 'adding'};
            var options = {patch: true, method: 'PUT'};
            this.vocablist.save(attrs, options);
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
            this.vocablist.save({disabled: true, studyingMode: 'not studying'}, {patch: true});
            this.listenToOnce(this.vocablist, 'state', function() {
                confirmDialog.close();
                app.router.navigate('/vocablists/my-lists', {trigger: true});
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
            var copyUrl = app.getApiUrl() + _.result(this.vocablist, 'url') + '/copy';
            $.ajax({
                url: copyUrl,
                method: 'POST',
                headers: app.user.headers(),
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
        this.$('#list-editing-version').removeClass('hide');
        this.$('#list-static-version').addClass('hide');
    },
    /**
     * @method handleClickCancelEditsLink
     */
    handleClickCancelEditsLink: function() {
        this.$('#list-editing-version').addClass('hide');
        this.$('#list-static-version').removeClass('hide');
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
     * @method handleClickAddSectionLink
     */
    handleClickAddSectionLink: function() {
        this.$('#add-section-static-version').addClass('hide');
        this.$('#add-section-editing-version').removeClass('hide');
    },
    /**
     * @method handleClickCancelAddSectionButton
     */
    handleClickCancelAddSectionButton: function() {
        this.$('#add-section-static-version').removeClass('hide');
        this.$('#add-section-editing-version').addClass('hide');
    },
    /**
     * @method handleClickConfirmAddSectionButton
     */
    handleClickConfirmAddSectionButton: function() {
        var sectionName = this.$('#add-section-editing-version input').val();

        if (!sectionName) {
            return;
        }

        var sections = _.clone(this.vocablist.get('sections') || []);
        sections.push({
            'name': sectionName,
            'rows': []
        });
        this.vocablist.save({'sections': sections}, {patch: true});
        this.render();
    },
    /**
     * @method handleClickEditSectionsLink
     */
    handleClickEditSectionsLink: function() {
        var dialog = new VocablistSectionsEditDialog({
            vocablist: this.vocablist
        });
        dialog.render().open();
    },
    /**
     * @method handleClickUpdateLink
     */
    handleClickUpdateLink: function() {
        if (this.updating) {
            return;
        }
        var updateUrl = app.getApiUrl() + _.result(this.vocablist, 'url') + '/update';
        this.updating = true;
        $.ajax({
            url: updateUrl,
            method: 'POST',
            headers: app.user.headers(),
            success: function() {
                document.location.reload();
            }
        });
        this.$('#update-link .fa-spinner').removeClass('hide');
        this.$('#update-link .glyphicon').addClass('hide');
    }
});
