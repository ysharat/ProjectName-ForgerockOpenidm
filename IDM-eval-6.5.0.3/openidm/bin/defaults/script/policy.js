/*
 * Copyright 2012-2018 ForgeRock AS. All Rights Reserved
 *
 * Use of this code requires a commercial software license with ForgeRock AS.
 * or with one of its affiliates. All use shall be exclusively subject
 * to such license between the licensee and ForgeRock AS.
 */

/*global additionalPolicies,resources, require */
var _ = require('lib/lodash'),
    policyConfig = {
    "policies" : [
        {   "policyId" : "required",
            "policyExec" : "required",
            "clientValidation": true,
            "policyRequirements" : ["REQUIRED"]
        },
        {   "policyId" : "not-empty",
            "policyExec" : "notEmpty",
            "clientValidation": true,
            "validateOnlyIfPresent": true,
            "policyRequirements" : ["REQUIRED"]
        },
        {
            "policyId" : "max-attempts-triggers-lock-cooldown",
            "policyExec" : "maxAttemptsTriggersLockCooldown",
            "policyRequirements" : ["NO_MORE_THAN_X_ATTEMPTS_WITHIN_Y_MINUTES"]
        },
        {   "policyId" : "unique",
            "policyExec" : "unique",
            "policyRequirements" : ["UNIQUE"]
        },
        {   "policyId" : "valid-username",
            "policyExec" : "validUsername",
            "policyRequirements" : ["VALID_USERNAME"]
        },
        {   "policyId" : "no-internal-user-conflict",
            "policyExec" : "noInternalUserConflict",
            "policyRequirements" : ["UNIQUE"]
        },
        {
            "policyId" : "regexpMatches",
            "policyExec" : "regexpMatches",
            "clientValidation": true,
            "policyRequirements" : ["MATCH_REGEXP"]
        },
        {
            "policyId" : "valid-type",
            "policyExec" : "validType",
            "policyRequirements": ["VALID_TYPE"]
        },
        {
            "policyId" : "valid-array-items",
            "policyExec" : "validArrayItems",
            "clientValidation": true,
            "policyRequirements" : ["VALID_ARRAY_ITEMS"]
        },
        {
            "policyId" : "valid-date",
            "policyExec" : "validDate",
            "clientValidation": true,
            "validateOnlyIfPresent": true,
            "policyRequirements": ["VALID_DATE"]
        },
        {
            "policyId" : "valid-email-address-format",
            "policyExec" : "validEmailAddressFormat",
            "clientValidation": true,
            "validateOnlyIfPresent": true,
            "policyRequirements": ["VALID_EMAIL_ADDRESS_FORMAT"]
        },
        {
            "policyId" : "valid-name-format",
            "policyExec" : "validNameFormat",
            "clientValidation": true,
            "validateOnlyIfPresent": true,
            "policyRequirements": ["VALID_NAME_FORMAT"]
        },
        {
            "policyId" : "valid-phone-format",
            "policyExec" : "validPhoneFormat",
            "clientValidation": true,
            "validateOnlyIfPresent": true,
            "policyRequirements": ["VALID_PHONE_FORMAT"]
        },
        {   "policyId" : "at-least-X-capitals",
            "policyExec" : "atLeastXCapitalLetters",
            "clientValidation": true,
            "validateOnlyIfPresent": true,
            "policyRequirements" : ["AT_LEAST_X_CAPITAL_LETTERS"]
        },
        {   "policyId" : "at-least-X-numbers",
            "policyExec" : "atLeastXNumbers",
            "clientValidation": true,
            "validateOnlyIfPresent": true,
            "policyRequirements" : ["AT_LEAST_X_NUMBERS"]
        },
        {   "policyId" : "minimum-length",
            "policyExec" : "minLength",
            "clientValidation": true,
            "validateOnlyIfPresent": true,
            "policyRequirements" : ["MIN_LENGTH"]
        },
        {   "policyId" : "cannot-contain-others",
            "policyExec" : "cannotContainOthers",
            "clientValidation": true,
            "validateOnlyIfPresent": true,
            "policyRequirements" : ["CANNOT_CONTAIN_OTHERS"]
        },
        {   "policyId" : "cannot-contain-characters",
            "policyExec" : "cannotContainCharacters",
            "clientValidation": true,
            "validateOnlyIfPresent": true,
            "policyRequirements" : ["CANNOT_CONTAIN_CHARACTERS"]
        },
        {   "policyId" : "cannot-contain-duplicates",
            "policyExec" : "cannotContainDuplicates",
            "clientValidation": true,
            "validateOnlyIfPresent": true,
            "policyRequirements" : ["CANNOT_CONTAIN_DUPLICATES"]
        },
        {
            "policyId" : "mapping-exists",
            "policyExec" : "mappingExists",
            "policyRequirements" : ["MAPPING_EXISTS"]
        },
        {
            "policyId" : "valid-permissions",
            "policyExec" : "validPermissions",
            "clientValidation": true,
            "policyRequirements": [
                "PRIVILEGE_MISSING_REQUIRED_CREATE_ATTRIBUTES",
                "PRIVILEGE_AT_LEAST_ONE_ATTRIBUTE_READONLY_FALSE",
                "EXPECTED_PERMISSIONS_VERBS",
                "UNIQUE_PERMISSIONS_VERBS",
                "PRIVILEGE_MUST_CONTAIN_ACTIONS_ARRAY",
                "PRIVILEGE_MUST_CONTAIN_CREATE_OR_UPDATE_PERMISSION",
                "PRIVILEGE_MUST_CONTAIN_VIEW_PERMISSION"
            ]
        },
        {
            "policyId" : "valid-accessFlags-object",
            "policyExec" : "validAccessFlagsObject",
            "policyRequirements": [
                "ATTRIBUTE_MUST_BE_A_STRING",
                "READONLY_MUST_BE_A_BOOLEAN",
                "INVALID_ACCESS_FLAG_PROPERTY",
                "INVALID_ACCESS_FLAG_ATTRIBUTE"
            ]
        },
        {
            "policyId" : "valid-privilege-path",
            "policyExec" : "validPrivilegePath",
            "policyRequirements": [
                "PATH_MUST_BE_A_VALID_OBJECT"
            ]
        },
        {
            "policyId" : "valid-temporal-constraints",
            "policyExec" : "validTemporalConstraints",
            "policyRequirements": [
                "TEMPORAL_CONSTRAINT_FORMAT"
            ]
        }
    ]
},
policyImpl = (function (){

    var policyFunctions = {};


    policyFunctions.mappingExists = function(fullObject, value, params, property) {
        var syncConfig = openidm.read('config/sync');

        if (syncConfig && syncConfig.mappings.length) {
            for (var i = 0; i < syncConfig.mappings.length; i++) {
                if (syncConfig.mappings[i].name === value) {
                    return [];
                }
            }
        }
        return [ {"policyRequirement": "MAPPING_EXISTS"}];
    };

    policyFunctions.regexpMatches = function(fullObject, value, params, property) {
        if (typeof(value) === "number") {
            value = value + ""; // cast to string;
        }

        var pattern = new RegExp(params.regexp, (params.flags || "")),
            isRequired = _.find(this.failedPolicyRequirements, function (fpr) {
                return fpr.policyRequirement === "REQUIRED";
            }),
            isNonEmptyString = (typeof(value) === "string" && value.length),
            valuePassesRegexp = (function (v) {
                var testResult = isNonEmptyString ? pattern.test(v) : false;
                return testResult;
            }(value));

        if ((isRequired || isNonEmptyString) && !valuePassesRegexp) {
            return [ {"policyRequirement": "MATCH_REGEXP", "regexp": params.regexp, params: params, "flags": params.flags}];
        }

        return [];
    };

    policyFunctions.validType = function(fullObject, value, params, property) {
        var type = _.isNull(value)
                ? "null"
                : (Array.isArray(value) || Object.prototype.toString.call(value) === "[object ScriptableList]")
                        ? "array"
                        : typeof(value);
        if (value !== undefined && !_.contains(params.types, type)) {
            return [
                {
                    "policyRequirement" : "VALID_TYPE",
                    "params" : {
                        "invalidType" : type,
                        "validTypes" : params.types
                    }
                }
            ];
        }
        return [];
    };

    policyFunctions.validArrayItems = function(fullObject, value, params, property) {
        var arrayItems = (typeof value === "object") ? _.toArray(value) : [],
            propertyPolicies = (typeof params === "object" && typeof params.properties === "object") ? _.toArray(params.properties) : [],
            invalidArrayItems = [];
        // loop over each arrayItem and validate it using the propertyPolicies passed into params
        _.each(arrayItems, function (item, arrayIndex) {
            var itemType = typeof item,
                failedPolicyRequirements = [];

            _.each(propertyPolicies, function (propPolicy) {
                var propName = propPolicy.name,
                    policies = propPolicy.policies,
                    policyRequirements = policyProcessor.validate(policies, [], [], item, propName, policyProcessor.getPropertyValue(item, propName), failedPolicyRequirements);
            });

            if (failedPolicyRequirements.length) {
                invalidArrayItems.push({
                    arrayIndex : arrayIndex,
                    failedPolicyRequirements : failedPolicyRequirements
                });
            }
        });

        if (invalidArrayItems.length) {
            return [
                {
                    "policyRequirement" : "VALID_ARRAY_ITEMS",
                    "params" : {
                        "invalidArrayItems" : invalidArrayItems
                    }
                }
            ];
        }

        return [];
    };

    policyFunctions.required = function(fullObject, value, params, propName) {
        if (value === undefined) {
            return [ { "policyRequirement" : "REQUIRED" } ];
        }
        return [];
    };

    policyFunctions.notEmpty = function(fullObject, value, params, property) {
        if (value === undefined) {
            return [];
        }
        if (value === null || (value.hasOwnProperty('length') && !value.length)) {
            return [{"policyRequirement": "REQUIRED"}];
        }
        return [];
    };

    policyFunctions.maxAttemptsTriggersLockCooldown = function(fullObject, value, params, property) {
        var failures = [],
            lastFailedDate = new Date(fullObject[params.dateTimeField]);

        if (value > params.max &&
            (lastFailedDate.getTime() + (1000*60*params.numMinutes)) > (new Date()).getTime()) {
             failures = [{"policyRequirement": "NO_MORE_THAN_X_ATTEMPTS_WITHIN_Y_MINUTES", params: {"max":params.max,"numMinutes":params.numMinutes}}];
        }
        return failures;
    };

    policyFunctions.noInternalUserConflict = function(fullObject, value, params, property) {
        return !checkInternalUserExists(value)
            ? []
            : [{"policyRequirement": "UNIQUE"}];
    }

    function checkUniqueness(fullObject, value, params, property) {
        var queryParams,existing,requestId,requestBaseArray,resourcePath;
        params = params || {};
        if (value && value.length) {
            if (params && params.query) {
                queryParams = params.query;
                queryParams[params.query.valueField] = value;
            } else {
                /*
                    If the request is from selfservice the property is prefixed with the object (i.e. user/userName).
                    In this case we need to remove "user/". property.split("/").pop() will do the trick.
                */
                queryParams = {
                    "_queryFilter": property.split("/").pop() + ' eq "' + value.replace(/"/g, '\\"') + '"'
                };
            }
            resourcePath = params.resourcePath || resourceName.parent().toString();

            requestId = resourceName.leaf();
            existing = openidm.query(resourcePath, queryParams);

            if (existing.result.length !== 0 && (!requestId || (existing.result[0]._id != requestId))) {
                return false;
            }
        }
        return true;
    }

    function checkInternalUserExists(value) {
        var queryParams,existing,requestId;
        if (value && value.length) {
            queryParams = {
                "_queryId": "credential-internaluser-query",
                "username": value
            };

            requestId = resourceName.leaf();
            existing = openidm.query("internal/user",  queryParams);

            if (existing.result.length !== 0 && (!requestId || (existing.result[0]._id != requestId))) {
                return true;
            }
        }
        return false;
    }

    policyFunctions.unique = function(fullObject, value, params, property) {
        return checkUniqueness(fullObject, value, params, property)
                ? []
                : [{"policyRequirement": "UNIQUE"}];
    }

    /* validUsername tests for uniqueness as well as internal user conflicts. A single policy with a generic
       VALID_USERNAME requirement is used to prevent either requirement from revealing to an end-user that a
       username is not unique -- account enumeration. */
    policyFunctions.validUsername = function(fullObject, value, params, property) {
        return checkUniqueness(fullObject, value, params, property) && !checkInternalUserExists(value)
                ? []
                : [{"policyRequirement": "VALID_USERNAME"}];
    }

    policyFunctions.validDate = function(fullObject, value, params, property) {
        var isRequired = _.find(this.failedPolicyRequirements, function (fpr) {
                return fpr.policyRequirement === "REQUIRED";
            }),
            isNonEmptyString = (typeof(value) === "string" && value.length),
            isValidDate = isNonEmptyString ? !isNaN(new Date(value).getTime()) : false;

        if ((isRequired || isNonEmptyString) && !isValidDate) {
            return [ {"policyRequirement": "VALID_DATE"}];
        }

        return [];
    };

    policyFunctions.cannotContainCharacters = function(fullObject, value, params, property) {
        var i,
            join = function (arr, d) { // my own join needed since it appears params.forbiddenChars is not a proper JS array with the normal join method available
                var j,list = "";
                for (j in arr) {
                    list += arr[j] + d;
                }
                return list.replace(new RegExp(d + "$"), '');
            };

        if (typeof(value) === "string" && value.length) {
            for (i in params.forbiddenChars) {
                if (value.indexOf(params.forbiddenChars[i]) !== -1) {
                    return [ { "policyRequirement" : "CANNOT_CONTAIN_CHARACTERS", "params" : {"forbiddenChars" : join(params.forbiddenChars, ", ")} } ];
                }
            }
        }
        return [];
    };

    policyFunctions.validPhoneFormat = function(fullObject, value, params, property) {
        var pattern = /^\+?([0-9\- \(\)])*$/,
            isRequired = _.find(this.failedPolicyRequirements, function (fpr) {
                return fpr.policyRequirement === "REQUIRED";
            }),
            isNonEmptyString = (typeof(value) === "string" && value.length),
            valuePassesRegexp = (function (v) {
                var testResult = isNonEmptyString ? pattern.test(v) : false;
                return testResult;
            }(value));

        if ((isRequired || isNonEmptyString) && !valuePassesRegexp) {
            return [ {"policyRequirement": "VALID_PHONE_FORMAT"}];
        }

        return [];
    };

    policyFunctions.validNameFormat = function(fullObject, value, params, property) {
        var pattern = /^([A-Za'-\u0105\u0107\u0119\u0142\u00F3\u015B\u017C\u017A\u0104\u0106\u0118\u0141\u00D3\u015A\u017B\u0179\u00C0\u00C8\u00CC\u00D2\u00D9\u00E0\u00E8\u00EC\u00F2\u00F9\u00C1\u00C9\u00CD\u00D3\u00DA\u00DD\u00E1\u00E9\u00ED\u00F3\u00FA\u00FD\u00C2\u00CA\u00CE\u00D4\u00DB\u00E2\u00EA\u00EE\u00F4\u00FB\u00C3\u00D1\u00D5\u00E3\u00F1\u00F5\u00C4\u00CB\u00CF\u00D6\u00DC\u0178\u00E4\u00EB\u00EF\u00F6\u00FC\u0178\u00A1\u00BF\u00E7\u00C7\u0152\u0153\u00DF\u00D8\u00F8\u00C5\u00E5\u00C6\u00E6\u00DE\u00FE\u00D0\u00F0\-\s])+$/,
            isRequired = _.find(this.failedPolicyRequirements, function (fpr) {
                return fpr.policyRequirement === "REQUIRED";
            }),
            isNonEmptyString = (typeof(value) === "string" && value.length),
            valuePassesRegexp = (function (v) {
                var testResult = isNonEmptyString ? pattern.test(v) : false;
                return testResult;
            }(value));

        if ((isRequired || isNonEmptyString) && !valuePassesRegexp) {
            return [ {"policyRequirement": "VALID_NAME_FORMAT"}];
        }

        return [];
    };

    policyFunctions.minLength = function(fullObject, value, params, property) {
        var isRequired = _.find(this.failedPolicyRequirements, function (fpr) {
                return fpr.policyRequirement === "REQUIRED";
            }),
            isNonEmptyString = (typeof(value) === "string" && value.length),
            hasMinLength = isNonEmptyString ? (value.length >= params.minLength) : false;

        if ((isRequired || isNonEmptyString) && !hasMinLength) {
            return [ { "policyRequirement" : "MIN_LENGTH", "params" : {"minLength":params.minLength} } ];
        }

        return [];
    };

    policyFunctions.atLeastXCapitalLetters = function(fullObject, value, params, property) {
        var isRequired = _.find(this.failedPolicyRequirements, function (fpr) {
                return fpr.policyRequirement === "REQUIRED";
            }),
            isNonEmptyString = (typeof(value) === "string" && value.length),
            valuePassesRegexp = (function (v) {
                var test = isNonEmptyString ? v.match(/[(A-Z)]/g) : null;
                return test !== null && test.length >= params.numCaps;
            }(value));

        if ((isRequired || isNonEmptyString) && !valuePassesRegexp) {
            return [ { "policyRequirement" : "AT_LEAST_X_CAPITAL_LETTERS", "params" : {"numCaps": params.numCaps} } ];
        }

        return [];
    };

    policyFunctions.atLeastXNumbers = function(fullObject, value, params, property) {
        var isRequired = _.find(this.failedPolicyRequirements, function (fpr) {
                return fpr.policyRequirement === "REQUIRED";
            }),
            isNonEmptyString = (typeof(value) === "string" && value.length),
            valuePassesRegexp = (function (v) {
                var test = isNonEmptyString ? v.match(/\d/g) : null;
                return test !== null && test.length >= params.numNums;
            }(value));

        if ((isRequired || isNonEmptyString) && !valuePassesRegexp) {
            return [ { "policyRequirement" : "AT_LEAST_X_NUMBERS", "params" : {"numNums": params.numNums}  } ];
        }

        return [];
    };

    policyFunctions.validEmailAddressFormat = function(fullObject, value, params, property) {
        var pattern = /.+@.+\..+/i,
            isRequired = _.find(this.failedPolicyRequirements, function (fpr) {
                return fpr.policyRequirement === "REQUIRED";
            }),
            isNonEmptyString = (typeof(value) === "string" && value.length),
            valuePassesRegexp = (function (v) {
                var testResult = isNonEmptyString ? pattern.test(v) : false;
                return testResult;
            }(value));

        if ((isRequired || isNonEmptyString) && !valuePassesRegexp) {
            return [ {"policyRequirement": "VALID_EMAIL_ADDRESS_FORMAT"}];
        }

        return [];
    };

    policyFunctions.cannotContainOthers = function(fullObject, value, params, property) {
        var fieldArray,
            fullObject_server = {},
            getValueFromPointer = function (object, pointer) {
                var pathParts = pointer.split('/');
                if (pathParts[0] === "") {
                    pathParts.shift(1);
                }
                if (pointer === "/") {
                    return object;
                }
                return pathParts.reduce(function (result, path) {
                    if (typeof result === "object" && result !== null) {
                        return result[path];
                    } else {
                        return result;
                    }
                }, object);
            },
            disallowedFieldValue,
            result = [ ];

        // legacy csv support
        if (typeof params.disallowedFields === "string") {
            fieldArray = params.disallowedFields.split(',');
        } else {
            fieldArray = params.disallowedFields;
        }

        // since this function runs on both the client and the server, we need to
        // check for the presence of our server-side functions before using them.
        try {
            if (typeof(openidm) !== "undefined" && typeof(request) !== "undefined"  && request.resourcePath && !request.resourcePath.match(/\/\*$/)) {
                fullObject_server = openidm.read(request.resourcePath);
                if (fullObject_server === null) {
                    fullObject_server = {};
                }
            }
        } catch(e) {
            fullObject_server = {};
        }

        if (value && typeof(value) === "string" && value.length) {
            fieldArray.forEach(function (disallowedFieldName) {
                disallowedFieldValue = getValueFromPointer(fullObject, disallowedFieldName);

                if (typeof(disallowedFieldValue) === "undefined") {
                    disallowedFieldValue = getValueFromPointer(fullObject_server, disallowedFieldName);
                }

                if (typeof(disallowedFieldValue) === "string" && value.match(disallowedFieldValue)) {
                    result.push(disallowedFieldName);
                }
            });
        }
        if (result.length) {
            return [{"policyRequirement": "CANNOT_CONTAIN_OTHERS", params: {"disallowedFields": result}}];
        } else {
            return [];
        }
    };

    policyFunctions.cannotContainDuplicates = function(fullObject, value, params, property) {
        var checkedValues = {};
        if (value && value.length) {
            for (i = 0; i < value.length; i++) {
                if (Object.prototype.hasOwnProperty.call(checkedValues, value[i])) {
                    return [{"policyRequirement": "CANNOT_CONTAIN_DUPLICATES", params: {"duplicateValue": value[i]}}];
                }
                checkedValues[value[i]] = true;
            }
        }
        return [];
    };

    policyFunctions.validPermissions = function(fullObject, value, params, property) {
        var returnValue = [],
            schema,
            requiredNames = [],
            requiredTitles = [],
            readWriteAccessFlagsAttributeNames,
            missingRequiredAttributes = false;

        if (fullObject.permissions && fullObject.permissions.length > 0) {
            /*
                If internal/privilege has CREATE permission it must have accessFlags
                for each required attribute set to readOnly=false
            */
            if (
                fullObject.permissions.indexOf("CREATE") > -1 &&
                fullObject.accessFlags &&
                fullObject.accessFlags !== undefined &&
                fullObject.accessFlags.length > 0
            ) {
                schema = openidm.read('schema/' + fullObject.path);
                readWriteAccessFlagsAttributeNames = _.pluck(_.filter(fullObject.accessFlags, function (accessFlag) { return !accessFlag.readOnly; }),'attribute');
                // there must be a schema available to make decisions about required attributes
                if (schema && schema.required) {
                    _.each(schema.required, function(propName) {
                        if (readWriteAccessFlagsAttributeNames.indexOf(propName) === -1) {
                            missingRequiredAttributes = true;
                            requiredNames.push(propName);
                            requiredTitles.push(schema.properties[propName].title || propName);
                        }
                    });

                    if (missingRequiredAttributes) {
                        return [{
                            "policyRequirement": "PRIVILEGE_MISSING_REQUIRED_CREATE_ATTRIBUTES",
                            "params": {
                                "missingRequiredAttributes" : requiredNames.join(", "),
                                "missingRequiredAttributeLabels" : requiredTitles.join(", ")
                            }
                        }];
                    }
                }
            }
            /*
                If internal/privilege has UPDATE permission and it has accessFlags
                but none are set to readOnly=false then the privilege is invalid.
            */
            if (
                fullObject.permissions.indexOf("UPDATE") > -1 &&
                fullObject.accessFlags &&
                fullObject.accessFlags !== undefined &&
                fullObject.accessFlags.length > 0 &&
                _.filter(fullObject.accessFlags, function (accessFlag) { return !accessFlag.readOnly; }).length === 0
            ) {
                return [{"policyRequirement": "PRIVILEGE_AT_LEAST_ONE_ATTRIBUTE_READONLY_FALSE"}];
            }
            /*
                If internal/privilege has accessFlags with least one set to readOnly=false then the privilege
                must have either CREATE OR UPDATE permissions else it is invalid.
            */
            if (
                fullObject.accessFlags &&
                fullObject.accessFlags !== undefined &&
                fullObject.accessFlags.length > 0 &&
                _.filter(fullObject.accessFlags, function (accessFlag) { return !accessFlag.readOnly; }).length > 0 &&
                fullObject.permissions.indexOf("CREATE") === -1 &&
                fullObject.permissions.indexOf("UPDATE") === -1
            ) {
                return [{"policyRequirement": "PRIVILEGE_MUST_CONTAIN_CREATE_OR_UPDATE_PERMISSION"}];
            }
            /*
                If internal/privilege has no accessFlags the privilege
                must have at least VIEW permission else it is invalid.
            */
            if (
                (fullObject.accessFlags === undefined || fullObject.accessFlags.length === 0)
                && fullObject.permissions.indexOf("VIEW") === -1
            ) {
                return [{"policyRequirement": "PRIVILEGE_MUST_CONTAIN_VIEW_PERMISSION"}];
            }
            /*
                Loop over the internal/privilege permissions array and check that each permission is a valid verb.
            */
            var foundVerbs = [];
            var validVerbs = ["VIEW","CREATE","UPDATE","DELETE","ACTION"];
            _.each(fullObject.permissions, function (permission) {
                if (validVerbs.indexOf(permission) === -1) {
                    returnValue = [{"policyRequirement": "EXPECTED_PERMISSIONS_VERBS", params: { "validVerbs" : validVerbs }}];
                }
                // make sure none of the verbs are repeated
                if (foundVerbs.indexOf(permission) !== -1) {
                    returnValue = [{"policyRequirement": "UNIQUE_PERMISSIONS_VERBS", params: { "nonUnique" : permission }}];
                } else {
                    foundVerbs.push(permission);
                }
                /*
                    Make sure if "ACTION" is one of the permissions then the privilege has a valid
                    "actions" array with at least one value.
                */
                if (
                    permission === "ACTION" &&
                    (!fullObject.actions || typeof(fullObject.actions) !== "object" || fullObject.actions.length === 0)
                ) {
                    returnValue = [{"policyRequirement": "PRIVILEGE_MUST_CONTAIN_ACTIONS_ARRAY"} ];
                }
            });
        }

        return returnValue;
    };

    policyFunctions.validAccessFlagsObject = function(fullObject, value, params, property) {
        var returnValue = [],
            schema;
        /*
            Loop over the internal/privilege accessFlags array and check the validity of each object
        */
        if (fullObject.accessFlags && fullObject.accessFlags.length > 0) {
            _.each(fullObject.accessFlags, function (accessFlag) {
                var invalidProperties = [],
                    invalidAttributes = [],
                    schemaProp,
                    isRelationship = function (property) {
                        return _.has(property, "type") && property.type === "relationship";
                    },
                    isArrayOfRelationships = function (property) {
                        return _.has(property, "type") && property.type === "array" && property.items.type === "relationship";
                    };

                // attribute property must be a string
                if (typeof(accessFlag.attribute) !== "string") {
                    returnValue = [{
                        "policyRequirement": "ATTRIBUTE_MUST_BE_A_STRING",
                        "params": { "objectInErrorState" : accessFlag }
                    }];
                }
                // readOnly property must be a boolean
                if (typeof(accessFlag.readOnly) !== "boolean") {
                    returnValue = [{
                        "policyRequirement": "READONLY_MUST_BE_A_BOOLEAN",
                        "params": { "objectInErrorState" : accessFlag }
                    }];
                }
                // accessFlag is invalid if it contains any properties other than "readOnly" or "attribute"
                _.each(_.keys(accessFlag), function (key) {
                    if (["readOnly", "attribute"].indexOf(key) === -1) {
                        invalidProperties.push(key);
                    }
                });

                if (invalidProperties.length > 0) {
                    returnValue = [{
                        "policyRequirement": "INVALID_ACCESS_FLAG_PROPERTY",
                        "params": {
                            "objectInErrorState" : accessFlag,
                            "invalidProperties" : invalidProperties
                        }
                    }];
                }

                // attribute is invalid if it's property has no schema definition or it's type is a relationship
                if (returnValue.length === 0 && typeof fullObject.path !== "undefined") {
                    schema = openidm.read('schema/' + fullObject.path),
                    schemaProp = (schema) ? schema.properties[accessFlag.attribute] : {};

                    if (
                        typeof schemaProp !== "object" ||
                        isRelationship(schemaProp) ||
                        isArrayOfRelationships(schemaProp)
                    ) {
                        invalidAttributes.push(accessFlag.attribute);
                    }
                }

                if (invalidAttributes.length > 0) {
                    returnValue = [{
                        "policyRequirement": "INVALID_ACCESS_FLAG_ATTRIBUTE",
                        "params": {
                            "objectInErrorState" : accessFlag,
                            "invalidAttributes" : invalidAttributes
                        }
                    }];
                }
            });
        }

        return returnValue;
    };

    policyFunctions.validPrivilegePath = function(fullObject, value, params, property) {
        if (typeof fullObject.path === "string") {
            var schema = openidm.read('schema/' + fullObject.path), resourceType = fullObject.path.split("/")[0];
            // if there is no schema we know this is not a valid internal or managed object
            if (!schema) {
                return [{"policyRequirement": "PATH_MUST_BE_A_VALID_OBJECT"}];
            }
        }

        return [];
    };

    policyFunctions.validTemporalConstraints = function(fullObject, value, params, property) {
        if (value !== undefined && value !== null) {
            if (Array.isArray(value) || Object.prototype.toString.call(value) === "[object ScriptableList]") {
                if (!org.forgerock.openidm.relationship.RelationshipValidator.isValidFormat(value)) {
                    return [{"policyRequirement": "TEMPORAL_CONSTRAINT_FORMAT"}];
                }
            } else {
                return [{"policyRequirement": "TEMPORAL_CONSTRAINT_FORMAT"}];
            }
        }
        return [];
    };

    return policyFunctions;

}()),

policyProcessor = (function (policyConfig,policyImpl){
    //Internal policy code below - do not modify this module

    var getPolicy = function(policyId) {
        var i;
        for (i = 0; i < policyConfig.policies.length; i++) {
            if (policyConfig.policies[i].policyId === policyId) {
                return policyConfig.policies[i];
            }
        }
        throw "Unknown policy " + policyId;
    },

    getPropertyValue = function(object, pointer) {
        var pathParts = pointer.split('/');
        if (pathParts[0] === "") {
            pathParts.shift(1);
        }
        if (pointer === "/") {
            return object;
        }
        return pathParts.reduce(function (result, path) {
            if (typeof result === "object" && result !== null) {
                return result[path];
            } else {
                return result;
            }
        }, object);
    },

    getPropertyConfig = function(resource, propName) {
        var props = resource.properties,prop,i;
        for (i = 0; i < props.length; i++) {
            prop = props[i];
            if (prop.name === propName) {
                return prop;
            }
        }
        return null;
    },

    resourceMatches = function(resource1, resource2) {
        var rsrc1 = resource1.split("/"),
            rsrc2 = resource2.split("/"),
            i;

        if (rsrc1.length === rsrc2.length) {
            for (i = 0; i < rsrc1.length; i++) {
                if (rsrc1[i] !== rsrc2[i] &&
                    rsrc1[i] !== "*" &&
                    rsrc2[i] !== "*") {
                    return false;
                }
            }
            return true;
        }
        return false;
    },

    getResource = function(resources, resourceName) {
        var i,resource;
        if (resources !== null) {
            for (i = 0; i < resources.length; i++) {
                resource = resources[i];
                if (resourceMatches(resource.resource, resourceName)) {
                    return resource;
                }
            }
        }
        return null;
    },

    getResourceWithPolicyRequirements = function(resource) {
        var compProps = resource.properties || [],
            i,j,x,reqs,
            propPolicyReqs,
            prop,policy;

        // Loop through the properties for this resource
        for (i = 0; i < compProps.length; i++) {
            propPolicyReqs = [];
            prop = compProps[i];
            // loop through the policies of each property
            for (j = 0; j < prop.policies.length; j++) {
                policy = getPolicy(prop.policies[j].policyId);
                // Check if client validation is enabled, if so add source
                if ((policy.clientValidation !== undefined) && policy.clientValidation) {
                    prop.policies[j].policyFunction = policyImpl[policy.policyExec].toString();
                }
                prop.policies[j].policyRequirements = policy.policyRequirements;
                reqs = policy.policyRequirements;
                // loop through the requirements for each policy
                for (x = 0; x < reqs.length; x++) {
                    // Add the requirement if it hasen't been added yet
                    if (propPolicyReqs.indexOf(reqs[x]) === -1) {
                        propPolicyReqs.push(reqs[x]);
                    }
                }
            }
            // Add the requirements array to the property object
            prop.policyRequirements = propPolicyReqs;
        }
        // Return all property configs for this resource
        return resource;
    },

    getAllPolicyRequirements = function (policies) {
        var reqs = [],i;
        for (i in policies) {
            reqs = reqs.concat(getPolicy(policies[i].policyId).policyRequirements);
        }
        return reqs;
    },

    getAppliedConditionalPolicies = function (conditionalPolicies, fallbackPolicies, fullObject) {
        var policies = [],
            i, j, condition, dependencies, failedCondition, passes;
        if (conditionalPolicies !== undefined && conditionalPolicies !== null) {
            // Check if any conditional policies apply
            for (i = 0; i < conditionalPolicies.length; i++) {
                failedCondition = false;
                condition = conditionalPolicies[i].condition;
                dependencies = conditionalPolicies[i].dependencies;
                // Check dependencies
                if (dependencies !== undefined && dependencies !== null) {
                    for (j = 0; j < dependencies.length; j++) {
                        if (!fullObject.hasOwnProperty(dependencies[j])) {
                            // Failed dependency, so mark condition as failed.
                            failedCondition = true;
                            break;
                        }
                    }
                    if (failedCondition) {
                        // Continue to next condition
                        continue;
                    }
                }
                // Evaluate the condition
                condition.fullObject = fullObject;
                if (openidm.action("script", "eval", condition, {})) {
                    // Condition passed, so add the conditional policies
                    for (var p in conditionalPolicies[i].policies) {
                       policies.push(conditionalPolicies[i].policies[p]);
                    }
                }
            }
        }
        if (fallbackPolicies !== undefined && fallbackPolicies !== null && policies.length == 0) {
            for (var p in fallbackPolicies) {
               policies.push(fallbackPolicies[p]);
            }
        }
        return policies
    }

    validate = function(policies, conditionalPolicies, fallbackPolicies, fullObject, propName, propValue, retArray) {
        var retObj = {},
            allPolicies = policies.slice(),
            policyRequirements = [],
            propValueContainer = [],
            allPolicyRequirements,i,j,params,policy,validationFunc,failed,y,appliedConditionalPolicies;

        appliedConditionalPolicies = getAppliedConditionalPolicies(conditionalPolicies, fallbackPolicies, fullObject);
        for (i = 0; i < appliedConditionalPolicies.length; i++) {
            allPolicies.push(appliedConditionalPolicies[i]);
        }

        allPolicyRequirements = getAllPolicyRequirements(allPolicies);

        for (i = 0; i < allPolicies.length; i++) {
            params = allPolicies[i].params;
            policy = getPolicy(allPolicies[i].policyId);
            // validate this property every time unless the property has been marked as "validateOnlyIfPresent" and it isn't present
            if (!(typeof(policy.validateOnlyIfPresent) !== 'undefined' && policy.validateOnlyIfPresent && typeof(propValue) === 'undefined')) {
                validationFunc = policyImpl[policy.policyExec];

                if (propName.match(/\[\*\]$/)) { // if we are dealing with a property that is an array element
                    propValueContainer = propValue; // then use the propValue provided for the array
                } else { // if we are dealing with a regular property
                    propValueContainer = [propValue]; // then it's a single value array
                }

                if (propValueContainer !== undefined && propValueContainer !== null) {
                    for (j=0;j<propValueContainer.length;j++) {

                        retObj = {};
                        retObj.policyRequirements = [];

                        if (openidm.isEncrypted(propValueContainer[j])) {
                            propValueContainer[j] = openidm.decrypt(propValueContainer[j]);
                        }
                        failed = validationFunc.call({ "failedPolicyRequirements": policyRequirements, "allPolicyRequirements": allPolicyRequirements }, fullObject, propValueContainer[j], params, propName);
                        if (failed.length > 0) {
                            retObj.property = propName.replace(/\[\*\]$/, "["+j+"]");
                            for ( y = 0; y < failed.length; y++) {
                                policyRequirements.push(failed[y]);
                                retObj.policyRequirements.push(failed[y]);
                            }
                            retArray.push(retObj);
                        }
                    }
                }
            }

        }
    },

    mergePolicies = function(oldPolicies, newPolicies) {
        var returnPolicies = [],
            i,j,p,key,
            found,
            newPolicy,
            policy;

        for (i = 0; i < oldPolicies.length; i++) {
            returnPolicies.push(oldPolicies[i]);
        }
        found = false;
        for (i = 0; i < newPolicies.length; i++) {
            newPolicy = newPolicies[i];
            for (j = 0; j < returnPolicies.length; j++) {
                policy = returnPolicies[j];
                if (newPolicy.policyId === policy.policyId) {
                    // update old policy with new config
                    returnPolicies[j] = newPolicy;
                    found = true;
                }
            }
            if (!found) {
                p = {};
                p.policyId = newPolicy.policyId;
                p.params = {};
                for (key in newPolicy.params) {
                    p.params[key] = newPolicy.params[key];
                }
                // add new policy
                returnPolicies.push(p);
            }
            found = false;
        }
        return returnPolicies;
    },

    getAdditionalPolicies = function(id) {
        var parts = id.split("/"),
            resource = parts[0],
            objectName = parts[1],
            obj,
            resourceConfig;

        // only managed objects support additional policies
        if (resource !== "managed" || parts.length > 3) {
            return [];
        } else {
            resourceConfig = openidm.read("config/managed");
        }

        obj = _.find(resourceConfig.objects, function (obj) {
            return obj.name === objectName;
        });
        if (_.isObject(obj) && _.isObject(obj.schema) && _.isObject(obj.schema.properties)) {
            return _.chain(obj.schema.properties)
                    .pairs()
                    .map(function (pair) {
                        var customPolicies = _.map(pair[1].policies), // will always result in a standard array
                            conditionalPoliciesx = pair[1].conditionalPolicies,
                            fallbackPoliciesx = pair[1].fallbackPolicies,
                            standardPolicies = [],
                            types = [];

                        if (_.contains(obj.schema.required, pair[0])) {
                            standardPolicies.push({
                                "policyId" : "required"
                            });
                        }

                        if (((pair[1].type.constructor.name === "Array") && !_.contains(pair[1].type, "null")) ||
                            (_.isNumber(pair[1].minLength) && pair[1].minLength > 0)) {
                            standardPolicies.push({
                                "policyId" : "not-empty"
                            });
                        }

                        if (((pair[1].type.constructor.name === "Array") && _.contains(pair[1].type, "string")) ||
                            (pair[1].type === "string")) {

                            if (!isNaN(parseInt(pair[1].minLength))) {
                                standardPolicies.push({
                                    "policyId" : "minimum-length",
                                    "params" : {
                                        "minLength" : parseInt(pair[1].minLength)
                                    }
                                });
                            }
                            if (_.isString(pair[1].pattern)) {
                                standardPolicies.push({
                                    "policyId" : "regexpMatches",
                                    "params" : {
                                        "regexp" : pair[1].pattern
                                    }
                                });
                            }

                        }

                        if (_.isString(pair[1].type)) {
                            types.push(pair[1].type);
                        } else {
                            for (var index in pair[1].type) {
                                types.push(pair[1].type[index]);
                            }
                        }
                        // treat a relationship type as an object
                        types = _.map(types, function (type) {
                            if (type === "relationship") {
                                return "object";
                            }
                            return type;
                        });
                        standardPolicies.push({
                            "policyId" : "valid-type",
                            "params" : {
                                "types" : types
                            }
                        })

                        return {
                            name: pair[0],
                            policies: standardPolicies.concat(customPolicies),
                            conditionalPolicies: conditionalPoliciesx,
                            fallbackPolicies: fallbackPoliciesx
                        };
                    })
                    .filter(function (property) {
                        return property.policies.length > 0;
                    })
                    .value();
        }

        return [];
    },

    updateResourceConfig = function(resource, id) {
        var newProps = getAdditionalPolicies(id),
            props = resource.properties,
            i,j,
            found,
            newProp,
            prop;
        for (i = 0; i < newProps.length; i++) {
            found = false;
            newProp = newProps[i];
            for (j = 0; j < props.length; j++) {
                prop = props[j];
                if (newProp.name === prop.name) {
                    found = true;
                    if (prop.policies !== undefined && prop.policies.length > 0) {
                        prop.policies = mergePolicies(prop.policies, newProp.policies);
                    } else {
                        prop.policies = newProp.policies;
                    }
                    // Check if there are conditional policies in the existing resource config
                    if ((prop.conditionalPolicies !== null) && (prop.conditionalPolicies !== undefined)
                            && (prop.conditionalPolicies.length > 0)) {
                        // check if there are additional conditional policies
                        if ((newProp.conditionalPolicies !== null) && (newProp.conditionalPolicies !== undefined)
                                && (newProp.conditionalPolicies.length > 0)) {
                            // Merge the the conditional policies
                            prop.conditionalPolicies = prop.conditionalPolicies.concat(newProp.conditionalPolicies);
                        }
                    } else {
                        // No existing conditional policies, overwrite with new ones (if any)
                        prop.conditionalPolicies = newProp.conditionalPolicies;
                    }
                }
            }
            if (!found) {
                props.push(newProp);
            }
            found = false;
        }
        resource.properties = props;
    },

    processRequest =  function() {
        var returnObject = {},
            resource,
            method = request.method,
            compArray,
            rsrc,
            i,
            action,
            failedPolicyRequirements,
            fullObject,
            propName,
            policies,
            policyRequirements,
            props,
            prop,
            conditionalPolicies,
            fallbackPolicies;

        if (request.resourcePath !== null && request.resourcePath !== undefined) {
            // Get the policy configuration for the specified resource
            resource = getResource(resources, request.resourcePath);
            if (resource === null ) {
                resource = {};
                resource.resource = request.resourcePath;
                resource.properties = [];
            } else if (resource.calculatedProperties) {
                resource.properties = openidm.action("script", "eval", resource.calculatedProperties, {});
            }
            // Update the policy configuration with any resource specific
            updateResourceConfig(resource, request.resourcePath);
        }
        if (method === "read") {
            if (request.resourcePath === null || request.resourcePath === "") {
                compArray = [];
                for (i = 0; i < resources.length; i++) {
                    rsrc = resources[i];
                    if (rsrc.calculatedProperties) {
                        rsrc.properties = openidm.action("script", "eval", rsrc.calculatedProperties, {});
                    }
                    compArray.push(getResourceWithPolicyRequirements(rsrc));
                }
                returnObject = {};
                returnObject.resources = compArray;
            } else {
                returnObject = getResourceWithPolicyRequirements(resource);
            }
        } else if (method === "action") {
            action = request.action;
            failedPolicyRequirements = [];
            returnObject = {};
            if (request.resourcePath === null) {
                throw "No resource specified";
            }
            if (resource === null) {
                // There are no configured policies for this resource (nothing to verify)
                returnObject.result = true;
                returnObject.failedPolicyRequirements = failedPolicyRequirements;
            } else {
                // Perform the validation
                if (action === "validateObject") {
                    fullObject = request.content;
                    for (i = 0; i < resource.properties.length; i++) {
                        propName = resource.properties[i].name;
                        policies = resource.properties[i].policies;
                        conditionalPolicies = resource.properties[i].conditionalPolicies;
                        fallbackPolicies = resource.properties[i].fallbackPolicies;
                        // Validate
                        policyRequirements = validate(policies, conditionalPolicies, fallbackPolicies, fullObject,
                                propName, getPropertyValue(fullObject, propName), failedPolicyRequirements);
                    }
                } else if (action === "validateProperty") {
                    fullObject = openidm.read(request.resourcePath);
                    props = request.content;
                    for (propName in props) {
                        prop = getPropertyConfig(resource, propName);
                        if (prop !== null) {
                            policies = prop.policies;
                            conditionalPolicies = prop.conditionalPolicies;
                            fallbackPolicies = prop.fallbackPolicies;
                            // Validate
                            policyRequirements = validate(policies, conditionalPolicies, fallbackPolicies, fullObject,
                                    propName, getPropertyValue(props, propName), failedPolicyRequirements);
                        }
                    }
                } else {
                    throw "Unsupported action: " + action;
                }
                // Set the result to true if no failedPolicyRequirements (failures), false otherwise
                returnObject.result = (failedPolicyRequirements.length === 0);
                // Set the return failedPolicyRequirements
                returnObject.failedPolicyRequirements = failedPolicyRequirements;
            }
        } else {
            throw "Unsupported method: " + method;
        }
        return returnObject;
    };

    return {
        processRequest:processRequest,
        validate: validate,
        getPropertyValue: getPropertyValue
    };

}(policyConfig,policyImpl)),
additionalPolicyLoader = (function (config,impl) {

    var obj = {},
    addPolicy = function(policy) {
        config.policies.push(policy);
    };

    obj.load = function (additionalPolicies) {
        var i,j;
        //Load additional policy scripts if configured
        for (i = 0; i < additionalPolicies.length; i++) {
            eval(additionalPolicies[i]);

            for (j=0;j<config.policies.length;j++) {
                if (!policyImpl.hasOwnProperty(config.policies[j].policyExec) &&
                    typeof(eval(config.policies[j].policyExec)) === "function") {
                    impl[config.policies[j].policyExec] = eval(config.policies[j].policyExec);
                }
            }
        }
    };
    return obj;

}(policyConfig,policyImpl));

if (typeof additionalPolicies !== 'undefined') {
    additionalPolicyLoader.load(additionalPolicies);
}
// if request is not available this file has been loaded by require('policy') from a test script
if (typeof(request) !== 'undefined') {
    policyProcessor.processRequest();
} else {
    (function () {
        // provide a mock openidm object for testing
        exports.mockRouter = function (router) {
            openidm = router;
        };
        exports.policyImpl = policyImpl;
    }());
}
