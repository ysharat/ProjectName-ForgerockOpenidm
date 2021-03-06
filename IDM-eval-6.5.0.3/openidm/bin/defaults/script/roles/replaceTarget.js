/*
 * Copyright 2014-2017 ForgeRock AS. All Rights Reserved
 *
 * Use of this code requires a commercial software license with ForgeRock AS.
 * or with one of its affiliates. All use shall be exclusively subject
 * to such license between the licensee and ForgeRock AS.
 */

/*
 * This script replaces an attribute value on the target. This operation makes use of the
 * attributesInfo object by keeping track of target attributes that have already been replaced.
 * This way multiple replaceTarget operations on the same attribute will be merged. Returns an
 * object containing the new value for the attribute and an updated attributesInfo object.
 *
 * The following variables are supplied:
 *   targetObject, sourceObject, existingTargetObject, attributeName, attributeValue, attributesInfo
 */

// Merges values in the case that the target has already been replaced
function mergeValues(target, name, value) {
    if (target[name] != null && target[name] instanceof Array) {
        var targetValue = target[name];
        for (var x = 0; x < value.length; x++) {
            var index = require("roles/util").genericIndexOf(targetValue, value[x]);

            if (index === -1) {
                target[name].push(value[x]);
            }
        }
    } else if (target[name] != null && target[name] instanceof Object) {
        var obj = target[name];
        for (var key in value) {
            obj[key] = value[key];
        }
    } else {
        target[name] = value;
    }
}


// Determine if the target has already been replaced by looking at the attributesInfo.replaced.
// The value of attributesInfo.replaced is an object that will contain a true/false value for every
// attributeName that has already been replaced in the target object.
var replaced = {};
if (attributesInfo.hasOwnProperty("replaced")) {
    // There have been previous replaceTarget operations, check if any have replaced this attribute
    replaced = attributesInfo.replaced;
    if (replaced.hasOwnProperty(attributeName) && replaced[attributeName] == true) {
        // This attribute has been previously replace, so merge values
        mergeValues(targetObject, attributeName, attributeValue);
    } else {
        // Mark the current attribute as replaced
        replaced[attributeName] = true;
        // Do the replace on the target
        targetObject[attributeName] = attributeValue;
    }

} else {
    // No replaceTarget operations have been performed, initialize attributeInfo.replaced
    replaced[attributeName] = true;
    // Do the replace on the target
    targetObject[attributeName] = attributeValue;
}

// Update attributesInfo
attributesInfo["replaced"] = replaced;

// Return the result object with the updated attributesInfo
var result = {
    "value" : targetObject[attributeName],
    "attributesInfo" : attributesInfo
};

result;
