"use strict";

/*
 * Copyright 2015-2017 ForgeRock AS. All Rights Reserved
 *
 * Use of this code requires a commercial software license with ForgeRock AS.
 * or with one of its affiliates. All use shall be exclusively subject
 * to such license between the licensee and ForgeRock AS.
 */

define(["jquery", "underscore", "org/forgerock/openidm/ui/admin/mapping/util/MappingAdminAbstractView", "org/forgerock/commons/ui/common/main/Configuration", "org/forgerock/openidm/ui/admin/delegates/ReconDelegate", "org/forgerock/commons/ui/common/util/DateUtil", "org/forgerock/openidm/ui/admin/delegates/SyncDelegate", "org/forgerock/openidm/ui/common/delegates/ConfigDelegate", "org/forgerock/openidm/ui/admin/mapping/util/MappingUtils", "org/forgerock/openidm/ui/admin/mapping/association/dataAssociationManagement/ChangeAssociationDialog", "org/forgerock/openidm/ui/admin/mapping/association/dataAssociationManagement/TestSyncDialog", "backgrid", "org/forgerock/openidm/ui/common/util/BackgridUtils", "org/forgerock/commons/ui/common/main/AbstractCollection", "org/forgerock/commons/ui/common/main/ServiceInvoker", "org/forgerock/commons/ui/common/components/Messages", "org/forgerock/commons/ui/common/util/Constants", "backgrid-paginator", "backgrid-selectall"], function ($, _, MappingAdminAbstractView, conf, reconDelegate, dateUtil, syncDelegate, configDelegate, mappingUtils, changeAssociationDialog, TestSyncDialog, Backgrid, BackgridUtils, AbstractCollection, ServiceInvoker, Messages, Constants) {

    var DataAssociationManagementView = MappingAdminAbstractView.extend({
        template: "templates/admin/mapping/association/DataAssociationManagementTemplate.html",
        element: "#analysisView",
        noBaseTemplate: true,
        events: {
            "change #situationSelection": "changeSituationView",
            "click #doSyncButton": "syncNow",
            "click #changeAssociation": "changeAssociation",
            "click #singleRecordSync": "singleRecordSync"
        },
        data: {},
        model: {},

        render: function render(args, callback) {
            this.data.recon = this.getRecon();
            this.mapping = this.getCurrentMapping();
            this.mappingSync = this.getSyncNow();
            this.data.numRepresentativeProps = this.getNumRepresentativeProps();
            this.data.sourceProps = _.pluck(this.mapping.properties, "source").slice(0, this.data.numRepresentativeProps);
            this.data.targetProps = _.pluck(this.mapping.properties, "target").slice(0, this.data.numRepresentativeProps);
            this.data.hideSingleRecordReconButton = mappingUtils.readOnlySituationalPolicy(this.mapping.policies);

            this.data.reconAvailable = false;
            this.parentRender(_.bind(function () {
                if (this.data.recon && !this.getSyncCanceled()) {
                    this.renderReconResults(null, callback);
                } else if (callback) {
                    callback();
                }
            }, this));
        },

        syncNow: function syncNow(e) {
            e.preventDefault();
            $(e.target).closest("button").prop('disabled', true);
            this.mappingSync(e);
        },

        singleRecordSync: function singleRecordSync(e) {
            conf.globalData.testSyncSource = this.getSelectedRow().get("sourceObject");

            e.preventDefault();

            TestSyncDialog.render({
                recon: this.getRecon()
            });
        },

        changeAssociation: function changeAssociation(e) {
            var args,
                selectedRow = this.getSelectedRow(),
                sourceObj = selectedRow.get("sourceObject"),
                targetObj = selectedRow.get("targetObject"),
                translateObj = _.bind(function (obj, isSource) {
                if (isSource) {
                    obj = syncDelegate.translateToTarget(obj, this.mapping);
                }
                return mappingUtils.buildObjectRepresentation(obj, this.data.targetProps);
            }, this);

            e.preventDefault();

            args = {
                selectedLinkQualifier: selectedRow.get("linkQualifier"),
                sourceObj: sourceObj,
                sourceObjRep: translateObj(_.pick(sourceObj, this.data.sourceProps), true),
                targetObj: targetObj,
                targetObjRep: translateObj(_.pick(targetObj, this.data.targetProps)),
                targetProps: $.extend({}, this.data.targetProps),
                ambiguousTargetObjectIds: selectedRow.get("ambiguousTargetObjectIds"),
                recon: $.extend({}, this.data.recon),
                linkQualifiers: this.mapping.linkQualifiers,
                reloadAnalysisGrid: _.bind(function () {
                    this.renderReconResults(this.$el.find("#situationSelection").val().split(","), null);
                }, this)
            };

            changeAssociationDialog.render(args);
        },

        getSelectedRow: function getSelectedRow() {
            return this.data.selectedRow;
        },

        checkNewLinks: function checkNewLinks(rows) {
            var count = this.data.newLinkIds.length,
                warningText;

            _.chain(rows).map(_.bind(function (row) {
                if (row.sourceObject) {
                    row._id = row.sourceObject._id;
                } else {
                    row._id = "";
                }
            }, this));

            if (count) {
                if (count === 1) {
                    warningText = $.t("templates.mapping.analysis.oneNewLinkWarning");
                } else {
                    warningText = $.t("templates.mapping.analysis.newLinksWarning", { "count": count });
                }
                $('#newLinksWarning').show().find("span#newLinksWarningText").html(warningText);
            } else {
                $('#newLinksWarning').hide();
            }

            return rows;
        },

        renderReconResults: function renderReconResults(selectedSituation, callback) {
            var recon = this.data.recon,
                totalRecords = recon.statusSummary.FAILURE + recon.statusSummary.SUCCESS,
                renderGrid = _.bind(function () {
                var situations = selectedSituation || $("#situationSelection", this.$el).val().split(",");

                this.buildAnalysisGrid(situations, totalRecords);
            }, this);

            if (selectedSituation) {
                totalRecords = recon.situationSummary[selectedSituation];
            }

            this.data.reconAvailable = true;
            this.data.allSituations = _.keys(this.data.recon.situationSummary).join(",");
            this.data.situationList = _.map(_.pairs(this.data.recon.situationSummary), function (item) {
                return { key: item[0], value: item[1] };
            });

            if (recon.started) {
                this.data.last_started = dateUtil.formatDate(recon.started, "MMMM dd, yyyy HH:mm");
            }

            reconDelegate.getNewLinksFromRecon(this.data.recon._id, this.data.recon.ended).then(_.bind(function (newLinks) {
                this.data.newLinks = newLinks;
                this.data.newLinkIds = _.chain(newLinks).pluck("sourceObjectId").map(_.bind(function (sObjId) {
                    return sObjId.replace(this.mapping.source + "/", "");
                }, this)).value();
                this.parentRender(_.bind(function () {
                    if (selectedSituation) {
                        $("#situationSelection", this.$el).val(selectedSituation.join(","));
                    }
                    renderGrid($("#analysisGridContainer"), callback);
                }, this));
            }, this));
        },

        changeSituationView: function changeSituationView(e) {
            e.preventDefault();
            this.renderReconResults($(e.target).val().split(","));
        },
        getCols: function getCols() {
            var _this = this;

            return [{
                "name": "sourceObjectDisplay",
                "label": $.t("templates.mapping.source"),
                "sortable": false,
                "editable": false,
                "headerCell": BackgridUtils.FilterHeaderCell,
                "cell": Backgrid.Cell.extend({
                    render: function render() {
                        var sourceObject = this.model.get("sourceObject"),
                            translatedObject,
                            txt;

                        if (sourceObject) {
                            translatedObject = syncDelegate.translateToTarget(sourceObject, _this.mapping);
                            txt = mappingUtils.buildObjectRepresentation(translatedObject, _this.data.targetProps);

                            if (_.contains(_this.data.newLinkIds, sourceObject._id)) {
                                txt = "<span class='newLinkWarning errorMessage fa fa-exclamation-triangle' title='" + $.t("templates.mapping.analysis.newLinkCreated") + "'></span> " + txt;
                            }
                        } else {
                            txt = "Not Found";
                        }

                        this.$el.html(txt);

                        this.delegateEvents();

                        return this;
                    }
                })
            }, {
                "name": "linkQualifier",
                "label": $.t("templates.mapping.linkQualifier"),
                "sortable": false,
                "editable": false,
                "cell": "string"
            }, {
                "name": "targetObjectDisplay",
                "label": $.t("templates.mapping.target"),
                "sortable": false,
                "editable": false,
                "headerCell": BackgridUtils.FilterHeaderCell,
                "cell": Backgrid.Cell.extend({
                    render: function render() {
                        var sourceObject = this.model.get("sourceObject"),
                            targetObject = this.model.get("targetObject"),
                            ambiguousTargetObjectIds = this.model.get("ambiguousTargetObjectIds"),
                            txt;

                        if (sourceObject && _.contains(_this.data.newLinkIds, sourceObject._id)) {
                            txt = mappingUtils.buildObjectRepresentation(_.filter(_this.data.newLinks, function (link) {
                                return link.sourceObjectId.replace(_this.mapping.source + "/", "") === sourceObject._id;
                            })[0].targetObject, _this.data.targetProps);
                        } else if (targetObject) {
                            txt = mappingUtils.buildObjectRepresentation(targetObject, _this.data.targetProps);
                        } else if (ambiguousTargetObjectIds && ambiguousTargetObjectIds.length) {
                            txt = $.t("templates.correlation.multipleMatchesFound");
                        } else {
                            txt = $.t("templates.correlation.notFound");
                        }

                        this.$el.html(txt);

                        this.delegateEvents();

                        return this;
                    }
                })
            }];
        },
        buildAnalysisGrid: function buildAnalysisGrid(situations, totalRecords) {
            var _this = this,
                cols = this.getCols(),
                grid_id = "#analysisGrid",
                pager_id = grid_id + '-paginator',
                ReconCollection = AbstractCollection.extend({
                url: Constants.context + "/endpoint/reconResults",
                queryParams: {
                    _queryId: "reconResults",
                    source: this.mapping.source,
                    target: this.mapping.target,
                    sourceProps: this.data.sourceProps.join(","),
                    targetProps: this.data.targetProps.join(","),
                    reconId: this.data.recon._id,
                    situations: situations.join(","),
                    mapping: this.mapping.name
                },
                sync: function sync(method, collection, options) {
                    var params = [];

                    _.forIn(options.data, function (val, key) {
                        switch (key) {
                            case "per_page":
                                key = "rows";
                                break;
                            case "page":
                                val += 1;
                                break;
                            case "sourceObjectDisplay":
                            case "targetObjectDisplay":
                                if (params.indexOf("search=true") === -1) {
                                    params.push("search=true");
                                }
                                break;
                        }
                        params.push(key + "=" + val);
                    });

                    options.data = params.join("&");
                    options.processData = false;

                    options.error = function (response) {
                        Messages.addMessage({
                            type: Messages.TYPE_DANGER,
                            response: response
                        });
                    };

                    return ServiceInvoker.restCall(options).then(function () {
                        $(grid_id).find(".newLinkWarning").popover({
                            content: function content() {
                                return $(this).attr("data-original-title");
                            },
                            placement: 'top',
                            container: 'body',
                            html: 'true',
                            title: ''
                        });

                        _this.$el.find(".actionButton").prop('disabled', true);
                    });
                },
                parseRecords: function parseRecords(resp) {
                    return _this.checkNewLinks(resp.result[0].rows);
                },
                parseState: function parseState() {
                    return { totalRecords: totalRecords };
                }
            }),
                reconGrid,
                paginator;

            this.model.recons = new ReconCollection();

            reconGrid = new Backgrid.Grid({
                className: "backgrid table table-hover",
                emptyText: $.t("templates.admin.ResourceList.noData"),
                columns: BackgridUtils.addSmallScreenCell(cols),
                collection: _this.model.recons,
                row: BackgridUtils.ClickableRow.extend({
                    callback: function callback() {
                        var disableButton = !this.model.get("sourceObject") || _.contains(_this.data.newLinkIds, this.model.get("_id"));

                        _this.$el.find(".actionButton").prop('disabled', disableButton);
                        _this.$el.find(".selected").removeClass("selected");
                        this.$el.addClass("selected");
                        _this.data.selectedRow = this.model;
                    }
                })
            });

            paginator = new Backgrid.Extension.Paginator({
                collection: this.model.recons,
                windowSize: 0,
                controls: {
                    rewind: {
                        label: " ",
                        title: $.t("templates.backgrid.first")
                    },
                    back: {
                        label: " ",
                        title: $.t("templates.backgrid.previous")
                    },
                    forward: {
                        label: " ",
                        title: $.t("templates.backgrid.next")
                    },
                    fastForward: {
                        label: " ",
                        title: $.t("templates.backgrid.last")
                    }
                }
            });

            this.$el.find(grid_id).append(reconGrid.render().el);
            this.$el.find(pager_id).append(paginator.render().el);

            this.bindDefaultHandlers();

            this.model.recons.getFirstPage();
        },

        onRowSelect: function onRowSelect(model, selected) {
            if (selected) {
                if (!_.contains(this.data.selectedItems, model.id)) {
                    this.data.selectedItems.push(model.id);
                }
            } else {
                this.data.selectedItems = _.without(this.data.selectedItems, model.id);
            }
            this.toggleActions();
        },

        bindDefaultHandlers: function bindDefaultHandlers() {
            this.model.recons.on("backgrid:selected", _.bind(function (model, selected) {
                this.onRowSelect(model, selected);
            }, this));
        }
    });

    return new DataAssociationManagementView();
});
