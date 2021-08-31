"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*
 * Copyright 2014-2017 ForgeRock AS. All Rights Reserved
 *
 * Use of this code requires a commercial software license with ForgeRock AS.
 * or with one of its affiliates. All use shall be exclusively subject
 * to such license between the licensee and ForgeRock AS.
 */

/* eslint no-eval: 0 */

define(["jquery", "underscore", "org/forgerock/commons/ui/common/util/Constants", "org/forgerock/commons/ui/common/main/AbstractDelegate", "org/forgerock/commons/ui/common/main/Configuration", "org/forgerock/commons/ui/common/main/EventManager", "org/forgerock/openidm/ui/common/delegates/ConfigDelegate"], function ($, _, Constants, AbstractDelegate, configuration, eventManager, configDelegate) {

    var obj = new AbstractDelegate(Constants.host + Constants.context + "/sync");

    obj.performAction = function (reconId, mapping, action, sourceId, targetId, linkType) {
        var params = {
            _action: "performAction",
            reconId: reconId,
            mapping: mapping,
            action: action
        };

        if (sourceId) {
            params.sourceId = sourceId;
        } else {
            params.target = true;
        }

        if (linkType) {
            params.linkType = linkType;
        }

        if (targetId) {
            params.targetId = targetId;
        }

        if (!sourceId && !targetId) {
            return $.Deferred().resolve();
        }

        return obj.serviceCall({
            url: "?" + $.param(params),
            type: "POST"
        });
    };

    obj.deleteLinks = function (linkType, id, ordinal) {
        // ordinal is either firstId or secondId
        if (!_.contains(["firstId", "secondId"], ordinal)) {
            throw "Unexpected value passed to deleteLinks: " + ordinal;
        }
        if (!id) {
            return $.Deferred().resolve();
        } else {

            return obj.serviceCall({
                "serviceUrl": Constants.host + Constants.context + "/repo/link",
                "url": "?_queryId=links-for-" + ordinal + "&linkType=" + linkType + "&" + ordinal + "=" + encodeURIComponent(id)
            }).then(function (qry) {
                var i,
                    deletePromises = [];
                for (i = 0; i < qry.result.length; i++) {
                    deletePromises.push(obj.serviceCall({
                        "serviceUrl": Constants.host + Constants.context + "/repo/link/",
                        "url": qry.result[i]._id,
                        "type": "DELETE",
                        "headers": {
                            "If-Match": qry.result[i]._rev
                        }
                    }));
                }

                return $.when.apply($, deletePromises);
            });
        }
    };

    obj.conditionAction = function (sourceObject, p) {
        var result = "";

        if (_typeof(p.condition) === "object" && p.condition.type === "text/javascript" && typeof p.condition.source === "string") {

            try {
                result = eval(p.condition.source) || p.condition.source.length === 0 ? "UPDATE" : "DO NOT UPDATE"; // references to "object" variable expected within this string
            } catch (e) {
                result = "ERROR WITH SCRIPT";
            }
        }

        return result;
    };

    obj.translatePropertyToTarget = function (sourceObject, p) {
        var sampleData = null;

        if (_typeof(p.transform) === "object" && p.transform.type === "text/javascript" && typeof p.transform.source === "string") {
            try {
                sampleData = eval(p.transform.source); // references to "source" variable expected within this string
            } catch (e) {
                sampleData = "ERROR WITH SCRIPT";
            }
        } else if (typeof p.source !== "undefined" && p.source.length) {
            sampleData = sourceObject[p.source];
        }

        if (typeof p["default"] !== "undefined" && p["default"].length) {

            if (sampleData === null || sampleData === undefined) {
                sampleData = p["default"];
            }
        }

        return [p.target, sampleData];
    };

    obj.translateToTarget = function (sourceObject, syncMappingConfig) {

        return _.chain(syncMappingConfig.properties).map(function (p) {
            return obj.translatePropertyToTarget(sourceObject, p);
        }).object().value();
    };

    obj.mappingDetails = function (mapping) {
        var promise = $.Deferred(),
            url = "",
            serviceUrl = Constants.context + "/endpoint/mappingDetails",
            doServiceCall = function doServiceCall() {
            return obj.serviceCall({
                "type": "GET",
                "serviceUrl": serviceUrl,
                "url": url,
                "errorsHandlers": {
                    "missing": {
                        status: 404
                    }
                }
            }).done(function (mappingDetails) {
                promise.resolve(mappingDetails);
            });
        };

        if (mapping) {
            url = "?mapping=" + mapping;
        }

        doServiceCall().fail(function (xhr) {
            if (xhr.status === 404) {
                configDelegate.createEntity("endpoint/mappingDetails", {
                    "context": "endpoint/mappingDetails",
                    "type": "text/javascript",
                    "file": "mappingDetails.js"
                }).then(function () {
                    _.delay(doServiceCall, 2000);
                });
            }
        });

        return promise;
    };

    return obj;
});
