define([
    'require.text!template/user-account.html',
    'base/View'
], function(template, BaseView) {
    /**
     * @class UserAccount
     */
    var View = BaseView.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            BaseView.prototype.initialize.call(this);
            this.sub = skritter.user.subscription;
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.setTitle('Account');
            this.$el.html(_.template(template, skritter.strings));
            BaseView.prototype.render.call(this);
            this.elements.userAboutMe.text(skritter.user.settings.get('aboutMe'));
            this.elements.userAvatar.html(skritter.user.getAvatar('img-circle'));
            this.elements.userCreated.text(moment(skritter.user.settings.get('created')*1000).format("MMMM Do, YYYY"));
            //this.elements.userPrivate.text(skritter.user.settings.get('private'));
            //this.elements.userShowHeisig.text(skritter.user.settings.get('showHeisig'));
            //this.elements.userSourceLang.text(skritter.user.settings.get('sourceLang'));
            //this.elements.userStudyAllListWritings.text(skritter.user.settings.get('studyAllListWritings'));
            //this.elements.userStudyRareWritings.text(skritter.user.settings.get('studyRareWritings'));
            this.elements.userUsername.text(skritter.user.settings.get('name'));
            this.elements.userTimezone.text(skritter.user.settings.get('timezone'));
            this.elements.userEmail.text(skritter.user.settings.get('email'));
            //subscription content block
            this.elements.subExpires.text(this.sub.get('expires') ? this.sub.get('expires') : 'Never!');
            if (skritter.fn.hasCordova() && this.sub.canGplay()) {
                this.elements.subPlan.text(this.sub.getGplayPlan());
                if (this.sub.get('expires') === false) {
                    this.elements.subStatus.text('Active').addClass('text-success');
                    this.elements.subOneMonth.hide();
                    this.elements.subOneYear.hide();
                    this.elements.subCancel.hide();
                } else if (this.sub.isActive()) {
                    this.elements.subStatus.text('Active').addClass('text-success');
                    this.elements.subOneMonth.hide();
                    this.elements.subOneYear.hide();
                } else {
                    this.elements.subStatus.text('Inactive').addClass('text-danger');
                    this.elements.subCancel.hide();
                }
            } else {
                this.elements.subOptions.hide();
                this.elements.subPlan.text(this.sub.get('subscribed') ? this.sub.get('subscribed') : 'n/a');
                if (this.sub.isActive()) {
                    this.elements.subStatus.text('Active').addClass('text-success');
                } else {
                    this.elements.subStatus.text('Inactive').addClass('text-danger');
                }
            }
            return this;
        },
        /**
         * @method loadElements
         * @returns {Backbone.View}
         */
        loadElements: function() {
            BaseView.prototype.loadElements.call(this);
            this.elements.userAboutMe = this.$('#user-about-me');
            this.elements.userCreated = this.$('#user-created');
            this.elements.userEmail = this.$('#user-email');
            this.elements.userPrivate = this.$('#user-private');
            this.elements.userShowHeisig = this.$('#user-show-heisig');
            this.elements.userSourceLang = this.$('#user-source-lang');
            this.elements.userStudyAllListWritings = this.$('#user-study-all-list-writings');
            this.elements.userStudyRareWritings = this.$('#user-study-rare-writings');
            this.elements.userTimezone = this.$('#user-timezone');
            this.elements.userUsername = this.$('.user-username');
            this.elements.subCancel = this.$('#button-sub-cancel');
            this.elements.subExpires = this.$('#sub-expires');
            this.elements.subPlan = this.$('#sub-plan');
            this.elements.subOneMonth = this.$('#button-sub-one-month');
            this.elements.subOneYear = this.$('#button-sub-one-year');
            this.elements.subOptions = this.$('#sub-options');
            this.elements.subStatus = this.$('#sub-status');
            return this;
        },
        /**
         * @property {Object} events
         */
        events: function() {
            return _.extend({}, BaseView.prototype.events, {
                'vclick #button-sub-one-month': 'handleButtonSubOneMonthClicked',
                'vclick #button-sub-one-year': 'handleButtonSubOneYearClicked'
            });
        },
        /**
         * @method handleButtonSubOneMonthClicked
         * @param {Function} event
         */
        handleButtonSubOneMonthClicked: function(event) {
            this.sub.subscribeGplay('one.month.sub');
            event.preventDefault();
        },
        /**
         * @method handleButtonSubOneYearClicked
         * @param {Function} event
         */
        handleButtonSubOneYearClicked: function(event) {
            this.sub.subscribeGplay('one.year.sub');
            event.preventDefault();
        }
    });

    return View;
});