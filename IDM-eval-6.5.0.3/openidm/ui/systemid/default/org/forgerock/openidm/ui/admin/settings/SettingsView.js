"use strict";

/*
 * Copyright 2016-2017 ForgeRock AS. All Rights Reserved
 *
 * Use of this code requires a commercial software license with ForgeRock AS.
 * or with one of its affiliates. All use shall be exclusively subject
 * to such license between the licensee and ForgeRock AS.
 */

define(["lodash", "jquery", "handlebars", "org/forgerock/openidm/ui/admin/util/AdminAbstractView", "org/forgerock/openidm/ui/admin/settings/audit/AuditView", "org/forgerock/openidm/ui/admin/settings/SelfServiceView", "org/forgerock/openidm/ui/admin/settings/ConsentView", "org/forgerock/openidm/ui/admin/settings/WorkflowView", "org/forgerock/commons/ui/common/main/Router", "org/forgerock/commons/ui/common/util/Constants", "org/forgerock/commons/ui/common/main/EventManager", "bootstrap-tabdrop"], function (_, $, Handlebars, AdminAbstractView, AuditView, SelfServiceView, ConsentView, WorkflowView, Router, Constants, EventManager) {

    var SettingsView = AdminAbstractView.extend({
        template: "templates/admin/settings/SettingsTemplate.html",
        events: {
            "click a[data-toggle=tab]": "updateRoute"
        },

        render: function render(args, callback) {
            var _this = this;

            this.data.tabName = args[0] || "audit";

            this.parentRender(function () {
                _this.$el.find(".nav-tabs").tabdrop();

                switch (_this.$el.find("#settings > .active").attr("data-settings")) {
                    case "audit":
                        AuditView.render();
                        break;
                    case "selfService":
                        SelfServiceView.render();
                        break;
                    case "consent":
                        ConsentView.render();
                        break;
                    case "workflow":
                        WorkflowView.render();
                        break;
                }

                if (callback) {
                    callback();
                }
            });
        },

        updateRoute: function updateRoute(e) {
            if (e) {
                e.preventDefault();
            }

            if ($(e.currentTarget).parent().hasClass("disabled")) {
                return false;
            } else {
                var route = $(e.currentTarget).attr("data-route");
                EventManager.sendEvent(Constants.ROUTE_REQUEST, {
                    routeName: "settingsView",
                    args: [route],
                    trigger: true
                });
            }
        }
    });

    Handlebars.registerHelper('sw', function (val, val2, options) {
        if (val.indexOf(val2) === 0) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    });

    return new SettingsView();
});
