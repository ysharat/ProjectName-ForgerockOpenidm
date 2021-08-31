"use strict";

/*
 * Copyright 2015-2017 ForgeRock AS. All Rights Reserved
 *
 * Use of this code requires a commercial software license with ForgeRock AS.
 * or with one of its affiliates. All use shall be exclusively subject
 * to such license between the licensee and ForgeRock AS.
 */

define(["jquery", "underscore", "handlebars", "form2js", "jsonEditor", "org/forgerock/openidm/ui/admin/util/AdminAbstractView", "org/forgerock/commons/ui/common/main/ValidatorsManager", "org/forgerock/openidm/ui/common/delegates/ConfigDelegate", "org/forgerock/openidm/ui/common/delegates/ResourceDelegate", "org/forgerock/openidm/ui/admin/delegates/ConnectorDelegate", "org/forgerock/commons/ui/common/main/EventManager", "org/forgerock/commons/ui/common/util/Constants", "org/forgerock/openidm/ui/admin/util/InlineScriptEditor", "org/forgerock/commons/ui/common/util/UIUtils", "org/forgerock/openidm/ui/admin/util/AdminUtils", "org/forgerock/openidm/ui/common/delegates/ResourceDelegate", "org/forgerock/openidm/ui/common/resource/RelationshipArrayView", "selectize"], function ($, _, handlebars, form2js, JSONEditor, AdminAbstractView, ValidatorsManager, ConfigDelegate, ResourceDelegate, ConnectorDelegate, EventManager, Constants, InlineScriptEditor, UIUtils, AdminUtils, resourceDelegate, RelationshipArrayView) {
    var EditAssignmentView = AdminAbstractView.extend({
        template: "templates/admin/assignment/EditAssignmentViewTemplate.html",
        element: "#assignmentHolder",
        events: {
            "click #saveAssignmentsDetails": "saveAssignmentDetails",
            "click #saveAssignmentScripts": "saveAssignmentScripts",
            "click #saveAssignmentAttributes": "saveAssignmentAttributeEvent",
            "click #deleteAssignment": "deleteAssignment",
            "click #addAttribute": "eventAddAttribute",
            "click .delete-attribute": "deleteAttributeEvent",
            "click .save-operations": "saveOperationsEvent",
            "change .select-attribute": "changeSchema",
            "onValidate": "onValidate"
        },
        partials: ["partials/assignment/_AssignmentAttribute.html", "partials/assignment/_OperationsPopover.html", "partials/assignment/_LDAPGroup.html"],
        data: {
            showLinkQualifier: false,
            displayLinkQualifiers: [],
            assignmentAttributes: []
        },
        model: {},
        render: function render(args, callback) {
            var resourcePromise,
                configPromise = ConfigDelegate.readEntity("sync"),
                systemType;

            this.model.serviceUrl = ResourceDelegate.getServiceUrl(args);
            this.model.args = args;
            this.model.schemaEditors = [];
            this.model.assignmentAttributes = [];

            resourcePromise = ResourceDelegate.readResource(this.model.serviceUrl, args[2]);

            $.when(configPromise, resourcePromise).then(_.bind(function (sync, resource) {
                this.data.resource = resource[0];

                this.data.mapping = _.find(sync.mappings, function (mapping) {
                    return this.data.resource.mapping === mapping.name;
                }, this);

                if (this.data.mapping.linkQualifiers) {
                    this.data.showLinkQualifier = true;
                }

                systemType = this.data.mapping.target.split("/");

                AdminUtils.findPropertiesList(systemType).then(_.bind(function (properties, connector) {
                    this.data.resourceSchema = properties;

                    this.data.resourcePropertiesList = _.chain(properties).keys().sortBy().value();

                    if (connector) {
                        this.model.connector = connector;
                    }

                    this.attributeRender(callback);
                }, this));
            }, this));
        },

        attributeRender: function attributeRender(callback) {
            this.parentRender(_.bind(function () {
                ValidatorsManager.bindValidators(this.$el.find("#assignmentDetailsForm"));
                ValidatorsManager.validateAllFields(this.$el);

                if (this.data.showLinkQualifier) {
                    this.model.linkQualifierSelectize = this.$el.find('#linkQualifiers').selectize({
                        persist: false,
                        create: false,
                        maxItems: null
                    });

                    this.model.linkQualifierSelectize[0].selectize.clear();

                    if (this.data.resource.linkQualifiers) {
                        this.model.linkQualifierSelectize[0].selectize.setValue(this.data.resource.linkQualifiers);
                    }
                }

                this.model.onAssignment = InlineScriptEditor.generateScriptEditor({
                    "element": this.$el.find("#onAssignmentHolder"),
                    "eventName": "onAssignment",
                    "noValidation": true,
                    "scriptData": this.data.resource.onAssignment,
                    "disablePassedVariable": false
                });

                this.model.onUnassignment = InlineScriptEditor.generateScriptEditor({
                    "element": this.$el.find("#onUnassignmentHolder"),
                    "eventName": "onUnassignment",
                    "noValidation": true,
                    "scriptData": this.data.resource.onUnassignment || this.data.resource.unAssignment,
                    "disablePassedVariable": false
                });

                this.$el.find("#assignmentEventsTab").on("shown.bs.tab", _.bind(function () {
                    this.model.onAssignment.refresh();
                    this.model.onUnassignment.refresh();
                }, this));

                _.each(this.data.resource.attributes, _.bind(function (attribute) {
                    this.addAttribute(attribute);
                }, this));

                this.showRolesTab();

                this.$el.find("#assignmentName")[0].focus();

                if (callback) {
                    callback();
                }
            }, this));
        },

        changeSchema: function changeSchema(event) {
            var container = $(event.target).parents(".list-group-item"),
                value = $(event.target).val(),
                ldapGroup = null,
                index = this.$el.find("#assignmentAttributesList .list-group-item").index(container);

            if (value !== "ldapGroups") {
                this.model.schemaEditors[index] = this.createJSONEditor($(event.target));
            } else {
                _.each(this.model.connector.objectTypes, function (objectType, key) {
                    if (objectType.id === "__GROUP__") {
                        ldapGroup = key;
                    }
                });

                if (ldapGroup) {
                    var connectorName = this.model.connector._id.split("/");

                    ConnectorDelegate.queryConnector(connectorName[1] + "/" + ldapGroup).then(_.bind(function (groups) {
                        container.find(".attribute-value").empty();
                        container.find(".attribute-value").append($(handlebars.compile("{{> assignment/_LDAPGroup}}")(groups)));

                        this.model.schemaEditors[index] = container.find(".ldap-group-select").selectize({
                            persist: false,
                            create: false,
                            maxItems: null
                        });

                        container.find(".ldap-group-select")[0].selectize.clear();
                    }, this));
                } else {
                    this.model.schemaEditors[index] = this.createJSONEditor($(event.target));
                }
            }
        },

        eventAddAttribute: function eventAddAttribute(event) {
            event.preventDefault();

            this.addAttribute(null);
        },

        addAttribute: function addAttribute(attribute) {
            var newAttr = $(handlebars.compile("{{> assignment/_AssignmentAttribute}}")(this.data)),
                defaultAttribute = {
                "assignmentOperation": "mergeWithTarget",
                "name": "",
                "unassignmentOperation": "removeFromTarget",
                "value": ""
            },
                currentAttribute,
                ldapGroup,
                tempIndex;

            if (attribute) {
                this.model.assignmentAttributes.push(attribute);
                currentAttribute = attribute.value;
                newAttr.find(".select-attribute").val(attribute.name);
            } else {
                this.model.assignmentAttributes.push(defaultAttribute);
                currentAttribute = defaultAttribute.value;
            }

            this.$el.find("#assignmentAttributesList").append(newAttr);

            if (attribute && attribute.name === "ldapGroups") {
                _.each(this.model.connector.objectTypes, function (objectType, key) {
                    if (objectType.id === "__GROUP__") {
                        ldapGroup = key;
                    }
                });

                if (ldapGroup) {
                    var connectorName = this.model.connector._id.split("/");

                    tempIndex = this.model.schemaEditors.length;

                    this.model.schemaEditors.push({});

                    ConnectorDelegate.queryConnector(connectorName[1] + "/" + ldapGroup).then(_.bind(function (groups) {
                        newAttr.find(".attribute-value").empty();
                        newAttr.find(".attribute-value").append($(handlebars.compile("{{> assignment/_LDAPGroup}}")(groups)));

                        this.model.schemaEditors[tempIndex] = newAttr.find(".ldap-group-select").selectize({
                            persist: false,
                            create: false,
                            maxItems: null
                        });

                        newAttr.find(".ldap-group-select")[0].selectize.clear();
                        newAttr.find(".ldap-group-select")[0].selectize.setValue(currentAttribute);
                    }, this));
                } else {
                    this.model.schemaEditors.push(this.createJSONEditor(newAttr.find(".select-attribute"), currentAttribute));
                }
            } else {
                this.model.schemaEditors.push(this.createJSONEditor(newAttr.find(".select-attribute"), currentAttribute));
            }

            this.setPopover(newAttr.find(".btn-toggle-attribute-operations"));
        },

        createJSONEditor: function createJSONEditor(element, jsonEditorValue) {
            var container = element.parents(".list-group-item"),
                value = element.val(),
                schema = {
                "type": this.data.resourceSchema[value].type
            },
                editor;

            if (schema.type === "relationship") {
                schema.type = "object";

                if (!_.isObject(schema.properties)) {
                    schema.properties = {};
                }

                schema.properties._ref = {
                    "type": "string"
                };
            }

            container.find(".attribute-value").empty();

            editor = new JSONEditor(container.find(".attribute-value")[0], {
                disable_array_reorder: true,
                disable_collapse: true,
                disable_edit_json: true,
                disable_properties: false,
                iconlib: "fontawesome4",
                no_additional_properties: false,
                theme: "bootstrap3",
                schema: schema
            });

            editor.on('change', _.bind(function () {
                this.$el.find(".compactJSON div.form-control>:input").addClass("form-control");
            }, this));

            if (jsonEditorValue) {
                editor.setValue(jsonEditorValue);
            }

            return editor;
        },

        setPopover: function setPopover(button) {
            var container = $(button).parents(".list-group-item"),
                index = this.$el.find("#assignmentAttributesList .list-group-item").index(container),
                attributeDetails = this.model.assignmentAttributes[index];

            $(button).popover({
                trigger: 'click',
                placement: 'bottom',
                html: true,
                content: $(handlebars.compile("{{> assignment/_OperationsPopover}}")(attributeDetails))
            });
        },

        saveOperationsEvent: function saveOperationsEvent(event) {
            event.preventDefault();

            var container = $(event.target).parents(".list-group-item"),
                button = $(container).find(".btn-toggle-attribute-operations"),
                index = this.$el.find("#assignmentAttributesList .list-group-item").index(container),
                attributeDetails = this.model.assignmentAttributes[index];

            this.saveOperations(attributeDetails, container.find(".onAssignment-select"), container.find(".onUnassignment-select"));

            $(button).trigger("click");
        },

        /**
         *
         * @param attributeDetails - Object of the current attribute used for assignment operations
         * @param onAssignmentEle - The assignment select dom element
         * @param unAssignmentEle - the unassignment select dom element
         * @returns {*} Updates the attribute details object with the correct assignment and unassignment operations based on dom selection
         */
        saveOperations: function saveOperations(attributeDetails, onAssignmentEle, unAssignmentEle) {
            attributeDetails.assignmentOperation = onAssignmentEle.val();
            attributeDetails.unassignmentOperation = unAssignmentEle.val();

            return attributeDetails;
        },

        deleteAttributeEvent: function deleteAttributeEvent(event) {
            event.preventDefault();

            var deleteResults = this.deleteAttribute($(event.target).parents(".list-group-item"), this.$el.find("#assignmentAttributesList .list-group-item"), this.model.schemaEditors, this.model.assignmentAttributes);

            this.model.schemaEditors = deleteResults.schemaEditors;
            this.model.assignmentAttributes = deleteResults.assignmentAttributes;
        },

        /**
         *
         * @param removeElement - Current dom attribute that was clicked for deleting
         * @param elementList - Array of dom elements used for displaying attribute
         * @param schemaEditors - Array of json editors used on the the attribute tab
         * @param assignmentAttributes - Array of attribute objects used for saving
         * @returns {{schemaEditors: *, assignmentAttributes: *}} - Returns the updated schemaEditors array and assignmentAttributes array
         */
        deleteAttribute: function deleteAttribute(removeElement, elementList, schemaEditors, assignmentAttributes) {
            var editorIndex = elementList.index(removeElement);

            schemaEditors.splice(editorIndex, 1);
            assignmentAttributes.splice(editorIndex, 1);

            removeElement.remove();

            return {
                schemaEditors: schemaEditors,
                assignmentAttributes: assignmentAttributes
            };
        },

        saveAssignmentDetails: function saveAssignmentDetails(event) {
            event.preventDefault();

            var formVal = _.extend({}, this.data.resource, form2js(this.$el.find('#assignmentDetailsForm')[0], '.', true));

            this.$el.find("#assignmentHeaderName").html(formVal.name);

            ResourceDelegate.patchResourceDifferences(this.model.serviceUrl, { id: this.data.resource._id, rev: this.data.resource._rev }, this.data.resource, formVal, _.bind(function (result) {
                EventManager.sendEvent(Constants.EVENT_DISPLAY_MESSAGE_REQUEST, "assignmentSaveSuccess");

                this.data.resource = result;
            }, this));
        },

        saveAssignmentScripts: function saveAssignmentScripts(event) {
            event.preventDefault();

            var onAssignment = this.model.onAssignment.generateScript(),
                onUnassignment = this.model.onUnassignment.generateScript(),
                resourceObject = _.clone(this.data.resource);

            if (_.isNull(onAssignment)) {
                delete resourceObject.onAssignment;
            } else {
                resourceObject.onAssignment = onAssignment;
            }

            if (_.isNull(onUnassignment)) {
                delete resourceObject.onUnassignment;
            } else {
                resourceObject.onUnassignment = onUnassignment;
            }

            ResourceDelegate.updateResource(this.model.serviceUrl, this.data.resource._id, resourceObject, _.bind(function (result) {
                EventManager.sendEvent(Constants.EVENT_DISPLAY_MESSAGE_REQUEST, "assignmentSaveSuccess");

                this.data.resource = result;
            }, this));
        },

        saveAssignmentAttributeEvent: function saveAssignmentAttributeEvent(event) {
            event.preventDefault();

            var selectAttributes = $(".select-attribute"),
                resourceObject = _.clone(this.data.resource);

            this.model.assigmentAttributes = this.saveAssignmentAttribute(selectAttributes, this.model.assignmentAttributes, this.model.schemaEditors);

            resourceObject.attributes = this.model.assignmentAttributes;

            ResourceDelegate.updateResource(this.model.serviceUrl, this.data.resource._id, resourceObject, _.bind(function (result) {
                EventManager.sendEvent(Constants.EVENT_DISPLAY_MESSAGE_REQUEST, "assignmentSaveSuccess");

                this.data.resource = result;
            }, this));
        },

        /**
         *
         * @param selectAttributes - Array of name html inputs
         * @param assignmentAttributes - Array of assignment attribute objects for saving
         * @param schemaEditors - Array of inputs or jsonEditors used to generate attribute value
         * @returns {*} - Returns the updated assignmentAttributes based on name and value
         */
        saveAssignmentAttribute: function saveAssignmentAttribute(selectAttributes, assignmentAttributes, schemaEditors) {
            _.each(schemaEditors, _.bind(function (editor, index) {
                assignmentAttributes[index].name = $(selectAttributes[index]).val();

                if (editor.schema) {
                    assignmentAttributes[index].value = editor.getValue();
                } else {
                    assignmentAttributes[index].value = editor.val();
                }
            }, this));

            return assignmentAttributes;
        },

        deleteAssignment: function deleteAssignment(event) {
            event.preventDefault();

            UIUtils.confirmDialog($.t("templates.admin.AssignmentTemplate.deleteMessage"), "danger", _.bind(function () {
                ResourceDelegate.deleteResource(this.model.serviceUrl, this.data.resource._id, _.bind(function () {
                    EventManager.sendEvent(Constants.EVENT_DISPLAY_MESSAGE_REQUEST, "deleteAssignmentSuccess");

                    EventManager.sendEvent(Constants.ROUTE_REQUEST, { routeName: "adminListManagedObjectView", args: ["managed", "assignment"] });
                }, this), function () {
                    EventManager.sendEvent(Constants.EVENT_DISPLAY_MESSAGE_REQUEST, "deleteAssignmentFail");
                });
            }, this));
        },

        showRolesTab: function showRolesTab() {
            var tabView = new RelationshipArrayView();

            resourceDelegate.getSchema(this.model.args).then(_.bind(function (schema) {
                var opts = {
                    element: ".assignmentRoles",
                    prop: schema.properties.roles,
                    schema: schema
                };

                opts.prop.propName = "roles";
                opts.prop.selector = "\\.roles";
                opts.prop.relationshipUrl = "managed/assignment/" + this.data.resource._id + "/roles";
                opts.prop.parentDisplayText = this.data.resource.name;

                tabView.render(opts);
            }, this));
        }
    });

    return new EditAssignmentView();
});
