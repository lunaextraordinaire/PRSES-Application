sap.ui.jsview("view.changePassword", {

    getControllerName: function() {
        return null;
    },

    /**
     * 
     * @param oController may be null
     * @returns {sap.ui.cre.Control}
     */
    createContent: function(oController) {
            if (!window.idIterator) {
                window.idIterator = 1;
            }
            var jsView = this;
            var passwordValid = false;
            var valueStateErrorControl = null;

            // create JSON model instance
            var oModel = new sap.ui.model.json.JSONModel();
            // set the data for the model
            var data = {};
            oModel.setData(data);
            // set the model to the core
            sap.ui.getCore().setModel(oModel);

            // This function calculates how wide the vbox containing all the controls should be.
            var calculateDisplayWidth = function(totalWidth) {
                var displayWidth = 0;
                if (totalWidth <= 360) {
                    displayWidth = totalWidth*0.9;
                } else {
                    // On a wide screen, use a little more space
                    displayWidth = 324 + ((totalWidth - 360)*0.1);
                }
                return Math.round(displayWidth);
            }

            var vbox = new sap.m.VBox('changePasswordScreen');

            var toolbarLabel = new sap.m.Label( 'change_password_toolbar_label', {
                text: getLocalizedString("SCR_CHANGE_PASSWORD_SHORT_SCREEN_TITLE")
            });
            toolbarLabel.onAfterRendering = function() {
                titleDomRef = toolbarLabel.getDomRef();
                titleDomRef.style.fontSize="18px";//cutomized, as per standard size was 24px
                titleDomRef.style.color="black";
            }

            //var explainText = getLocalizedString("SCR_CHANGE_PASSWORD_EXPLAIN");

            var explainText = getLocalizedString("If you have changed your domain password, please set the same password for CIT App as well");

            var appName = window.iab.context.appName;
            if (!appName){
                appName = window.iab.context._defaultAppName;
            }
            explainText = formatString(explainText, appName);
            var explainTextControl = new sap.m.Text( 'change_password_explain_text', {
                text:explainText
            });
            var panelVBox = new sap.m.VBox('panel_vbox', {
                items: [toolbarLabel, explainTextControl]
            });
            var panel = new sap.m.Panel( 'demo_mode_description_panel', {
                content: [panelVBox],
                backgroundDesign: sap.m.BackgroundDesign.Solid
            });

            var passcodePolicy = window.iab.context.policyContext;

            var inputPassword = new sap.m.Input( 'Password_item', {
                type:sap.m.InputType.Password,
                value:"{/password}",
                placeholder:getLocalizedString("SCR_CHANGE_PASSWORD_PLACEHOLDER_PASSWORD"),
                liveChange:function(){
                    inputPassword.setValueState(sap.ui.core.ValueState.None);
                    confirmPassword.setValueState(sap.ui.core.ValueState.None);
                }
            });

            var confirmPassword = new sap.m.Input( 'ConfirmPassword_item', {
                type:sap.m.InputType.Password,
                placeholder:getLocalizedString("SCR_CHANGE_PASSWORD_PLACEHOLDER_CONFIRM_PASSWORD"),
                liveChange:function(){
                    confirmPassword.setValueState(sap.ui.core.ValueState.None);
                }
            });

            var buttonOK = new sap.m.Button( 'button_ok', {
                type:sap.m.ButtonType.Emphasized,
                //text:getLocalizedString("BUTTON_OK"),
                icon:'sap-icon://sys-enter',
                width:"100%",
                press : function(){
                    window.iab.busy.open();
                    var newPassword = inputPassword.getValue();
                    var confirmPasswordValue = confirmPassword.getValue();
                    if (newPassword !== confirmPasswordValue) {
                        // passcodes do not match
                        // Do the work in a setTimeout because otherwise the button steals the
                        // focus back (and if the focus is not on the input control then the
                        // value state text is not visible).
                        setTimeout(function() {
                            confirmPassword.focus();
                            confirmPassword.setValueStateText(getLocalizedString("SCR_CHANGE_PASSWORD_MUST_MATCH"));
                            confirmPassword.setValueState(sap.ui.core.ValueState.Error);
                            window.iab.busy.close();
                        },500);
                    } else {
                        data.newPassword = newPassword;
                        window.iab.triggerEventForJsView("SUBMIT", data);
                    }
                }
            }).addStyleClass("ok_button");
            var buttonCancel = new sap.m.Button( 'cancel_password_change', {
                type:sap.m.ButtonType.Default,
                //text:getLocalizedString("BUTTON_CANCEL"),
                icon:'sap-icon://inspect-down',
                width:"100%",
                press : function(){
                    window.iab.busy.open();
                    window.iab.triggerEventForJsView("CANCEL", data);
                }
            }).addStyleClass("cancel_button");

            var vboxPlaceholder1 = new sap.m.HBox( 'vbox_placeholder1', {
                height:"40px"
            });

            var vboxPlaceholder2 = new sap.m.HBox( 'vbox_placeholder2', {
                height:"25px"
            });

            var vboxPlaceholder3 = new sap.m.HBox( 'vbox_placeholder3', {
                height:"25px"
            });

            vbox.addItem(vboxPlaceholder1);
            vbox.addItem(panel);
            vbox.addItem(vboxPlaceholder2);
            vbox.addItem(inputPassword);
            vbox.addItem(confirmPassword);
            vbox.addItem(vboxPlaceholder3)
            vbox.addItem(buttonOK);
            vbox.addItem(buttonCancel);

            vboxPageContent = new sap.m.VBox('vbox_content', {
                alignItems:sap.m.FlexAlignItems.Center,
                justifyContent:sap.m.FlexJustifyContent.Start,
                items:[vbox]
            });

            var logoPath;
            if (data.custom && data.custom.copyrightLogo) {
                logoPath = data.custom.copyrightLogo;
            } else {
                logoPath = "img/lntlogo.png";
            }
            var logo = new sap.m.Image( 'logo', {
                src: logoPath,
                height:"70px"//standard was 40
            });

            var cprMsg1, cprMsg2;
            if (data.custom && data.custom.copyrightMsg) {
                cprMsg1 = data.custom.copyrightMsg[0];
                cprMsg2 = data.custom.copyrightMsg[1];
            } else {
                cprMsg1 = getLocalizedString("COPYRIGHT_1");
                cprMsg2 = getLocalizedString("COPYRIGHT_2");
            }

            var copyright1 = new sap.m.Text( 'copyright1', {
                text: "© 2017 LARSEN & TOUBRO LIMITED."
            });

            var copyright2 = new sap.m.Text( 'copyright2', {
                text: "All rights reserved."
            });

            var copyright = new sap.m.VBox('copyright', {
                items: [copyright1, copyright2]
            });

            var footerHBox = new sap.m.HBox('panel_footer_hbox', {
                justifyContent:sap.m.FlexJustifyContent.SpaceBetween,
                width: "90%",
                items: [logo, copyright],
                visible: !(data && data.custom && data.custom.hideLogoCopyright && data.custom.hideLogoCopyright.toString() == "true")
            });

            vboxOuter = new sap.m.FlexBox('vbox_outer', {
                direction:sap.m.FlexDirection.Column,
                justifyContent:sap.m.FlexJustifyContent.SpaceBetween,
                alignItems:sap.m.FlexAlignItems.Center,
                items:[vboxPageContent, footerHBox],
                fitContainer: true
            });

            // If the screen width is available, pre-calculate how wide the vbox should be
            // so that the user can't see it draw as the wrong size then quickly redraw as
            // the correct size.
            if ($(window).width()) {
                vbox.setWidth(calculateDisplayWidth($(window).width()) + "px");
            }

            sap.ui.core.ResizeHandler.register(vboxOuter, function(e){
                vbox.setWidth(calculateDisplayWidth(e.size.width) + "px");
                jsView.setHeight(null);
                var domRef = jsView.getDomRef();
                if( $(window).height() && $(window).height() > domRef.offsetHeight) {
                    // The view is not taking up the whole screen height, force it.
                    jsView.setHeight($(window).height() + "px");
                }
            });

            vboxOuter.onAfterRendering = function() {
                var inputs = this.$().find(':input');
                inputs.attr('autocapitalize', 'off');
                inputs.attr('autocorrect', 'off');
                inputs.attr('autocomplete', 'off');
                if (valueStateErrorControl != null) {
                    valueStateErrorControl.focus();
                } else {
                    inputPassword.focus();
                }
            }
            window.iab.page.setShowHeader(false);
            this.onAfterRendering = function() {
                var domRef = this.getDomRef();
                var newHeight = $(window).height();
                if (!(jQuery.device.is.ipad || jQuery.device.is.iphone)){
                    if (window.iab.heightWithoutKeyboard != null) {
                        // If we know the height of the screen without the keyboard, use that
                        // (since the keyboard will affect $(window).height()).
                        newHeight = window.iab.heightWithoutKeyboard;
                    }
                }
                if( newHeight && newHeight > domRef.offsetHeight) {
                    // The view is not taking up the whole screen height, force it.
                    this.setHeight(newHeight + "px");
                }
            }
            return vboxOuter;

    }
});
