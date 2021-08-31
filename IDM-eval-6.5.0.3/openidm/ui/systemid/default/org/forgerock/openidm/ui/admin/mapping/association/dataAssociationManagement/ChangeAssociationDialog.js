"use strict";

/*
 * Copyright 2015-2017 ForgeRock AS. All Rights Reserved
 *
 * Use of this code requires a commercial software license with ForgeRock AS.
 * or with one of its affiliates. All use shall be exclusively subject
 * to such license between the licensee and ForgeRock AS.
 */

define(["jquery", "underscore", "org/forgerock/openidm/ui/admin/mapping/util/MappingAdminAbstractView", "org/forgerock/commons/ui/common/main/Configuration", "org/forgerock/commons/ui/common/util/UIUtils", "org/forgerock/openidm/ui/common/delegates/SearchDelegate", "org/forgerock/openidm/ui/admin/mapping/util/MappingUtils", "org/forgerock/openidm/ui/admin/delegates/SyncDelegate", "org/forgerock/openidm/ui/common/util/BootstrapDialogUtils", "org/forgerock/openidm/ui/admin/util/LinkQualifierUtils"], function ($, _, MappingAdminAbstractView, conf, uiUtils, searchDelegate, mappingUtils, syncDelegate, BootstrapDialogUtils, LinkQualifierUtil) {

    var ChangeAssociationDialog = MappingAdminAbstractView.extend({
        template: "templates/admin/mapping/association/dataAssociationManagement/ChangeAssociationDialogTemplate.html",
        el: "#dialogs",
        events: {
            "click #targetSearchBtn": "searchTarget",
            "click #search_results li": "selectSearchResult",
            "click #linkObjectBtn": "linkObject"
        },

        selectSearchResult: function selectSearchResult(e) {
            e.preventDefault();
            this.$el.find(".readyToLink").removeClass("readyToLink");
            $(e.target).closest("li").addClass("readyToLink").find(":radio").prop("checked", true);
            this.$el.find("#linkObjectBtn").show().prependTo($(e.target).closest("li"));
        },

        searchTarget: function searchTarget(e) {
            e.preventDefault();
            var searchCriteria = this.$el.find("#targetSearchInput").val(),
                dialogData = this.data;

            dialogData.searching = true;
            dialogData.searchCriteria = searchCriteria;

            searchDelegate.searchResults(this.getCurrentMapping().target, this.data.targetProps, searchCriteria).then(_.bind(function (results) {
                dialogData.results = _.chain(results).map(_.bind(function (result) {
                    return this.formatResult(result, this.data.targetProps);
                }, this)).value();
                this.reloadData(dialogData);
            }, this), _.bind(function () {
                dialogData.results = [];
                this.reloadData(dialogData);
            }, this));
        },

        linkObject: function linkObject(e) {
            var sourceId = this.$el.find("[name=sourceId]").val(),
                linkId = this.$el.find("[name=found]:checked").val(),
                mapping = this.getMappingName(),
                linkType = this.$el.find("#linkTypeSelect").val();

            e.preventDefault();

            syncDelegate.deleteLinks(mapping, sourceId, "firstId").then(_.bind(function () {
                syncDelegate.performAction(this.data.recon._id, mapping, "LINK", sourceId, linkId, linkType).then(_.bind(function () {
                    this.data.reloadAnalysisGrid();
                    this.currentDialog.close();
                }, this));
            }, this));
        },

        getAmbiguousMatches: function getAmbiguousMatches() {
            var ids = this.data.ambiguousTargetObjectIds.split(", "),
                prom = $.Deferred();

            _.each(ids, _.bind(function (id, i) {
                searchDelegate.searchResults(this.getCurrentMapping().target, ["_id"], id, "eq").then(_.bind(function (result) {
                    this.data.results.push(this.formatResult(result[0], this.data.targetProps));
                    if (i === ids.length - 1) {
                        prom.resolve();
                    }
                }, this));
            }, this));

            return prom;
        },

        reloadData: function reloadData(data) {
            uiUtils.renderTemplate("templates/admin/mapping/association/dataAssociationManagement/ChangeAssociationDialogTemplate.html", $("#changeAssociationDialog"), data);
            if (data.searchCriteria) {
                this.$el.find("#targetSearchInput").focus().val(data.searchCriteria);
                this.$el.find("#linkTypeSelect").val(this.data.selectedLinkQualifier);
            }
        },

        /**
            @param {object} form - container of input fields
            @param {object} values - simple map of id:values
             form object is modified to set the values provided,
            using keys from the values map to find elements with
            matching ids.
        */
        setFormValuesUsingIds: function setFormValuesUsingIds(form, values) {
            _.keys(values, function (id) {
                form.find("#" + id).val(values[id]);
            });
        },

        /**
            @param {object} targetObject - original object from target system
            @param {array} targetProperties - list of specific properties used to represent object
        */
        formatResult: function formatResult(targetObject, targetProperties) {
            if (targetObject && targetObject._id !== undefined) {
                return {
                    _id: targetObject._id,
                    objRep: mappingUtils.buildObjectRepresentation(targetObject, targetProperties)
                };
            } else {
                return undefined;
            }
        },

        render: function render(args, callback) {
            this.dialogContent = $('<div id="changeAssociationDialog"></div>');
            this.setElement(this.dialogContent);
            $('#dialogs').append(this.dialogContent);

            this.currentDialog = BootstrapDialogUtils.createModal({
                title: $.t("templates.mapping.analysis.changeAssociation"),
                message: this.dialogContent,
                onshown: _.bind(function () {
                    uiUtils.renderTemplate(this.template, this.$el, _.extend({}, conf.globalData, this.data), _.bind(function () {
                        this.setFormValuesUsingIds(this.$el, {
                            "linkTypeSelect": args.selectedLinkQualifier
                        });

                        if (callback) {
                            callback();
                        }
                    }, this), "replace");
                }, this)
            });

            _.extend(this.data, args);

            this.data.results = _.filter([this.formatResult(args.targetObj, args.targetObjRep)]);

            if (this.data.ambiguousTargetObjectIds.length) {
                this.getAmbiguousMatches();
            }

            this.data.linkQualifiers = LinkQualifierUtil.getLinkQualifier(this.getMappingName());

            this.currentDialog.realize();
            this.currentDialog.open();
        }
    });

    return new ChangeAssociationDialog();
});
