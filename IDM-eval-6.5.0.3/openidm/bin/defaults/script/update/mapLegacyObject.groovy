/*
 * Copyright 2018 ForgeRock AS. All Rights Reserved
 *
 * Use of this code requires a commercial software license with ForgeRock AS.
 * or with one of its affiliates. All use shall be exclusively subject
 * to such license between the licensee and ForgeRock AS.
 */
package bin.defaults.script.update

import static org.forgerock.json.JsonValue.object
import static org.forgerock.json.resource.ResourcePath.valueOf

import org.forgerock.openidm.util.Version
import org.forgerock.json.JsonValue

def sourceObject = source as JsonValue;
def targetObject = target as JsonValue;
def mappingTarget = mappingConfig.target.getObject() as String
def remoteVersion = remoteVersion as Version

/*
 * Compute the new target object by mapping all sourceObject properties to the targetObject,
 * __preserving values already present in the targetObject__ which may have been mapped
 * via property mappings.
 *
 * Retaining properties already present in the targetObject preserves the ability to
 * perform additional data transformations via the existing propery mapping functionality
 * prior to performing internal OpenIDM data transformations for upgrade purposes.
 */
targetObject.getObject().putAll(sourceObject.getObject() + targetObject.getObject());

// Remove the _rev from the calculated target object
targetObject.remove("_rev");

/*
 * Data Transformations for all OOTB OpenIDM object types.
 */

/*
 * Relationship objects.
 */
if (mappingTarget.startsWith("repo/relationships")) {
    /*
     * Transform legacy relationship objects to 6.x format.
     * Versions: 4.0.x, 5.0.x and 5.5.x
     * Issue: OPENIDM-10066
     */
    if (targetObject.isDefined("firstId")) {
        targetObject.put("firstResourceId", valueOf(targetObject.get("firstId").asString()).leaf());
        targetObject.put("firstResourceCollection", valueOf(targetObject.get("firstId").asString()).parent().toString());
        targetObject.remove("firstId");
    }
    if (targetObject.isDefined("secondId")) {
        targetObject.put("secondResourceId", valueOf(targetObject.get("secondId").asString()).leaf());
        targetObject.put("secondResourceCollection", valueOf(targetObject.get("secondId").asString()).parent().toString());
        targetObject.remove("secondId");
    }

    /*
     * Remove 'repo/' prefix from resource collections on relationships to internal roles.
     * Versions: 4.0.x, 5.0.x, 5.5.x and 6.0.x
     * Issue: OPENIDM-10886
     */
    if (targetObject.get("firstResourceCollection").asString()?.startsWith('repo/internal')) {
        targetObject.put("firstResourceCollection", targetObject.get("firstResourceCollection").asString() - 'repo/');
    }
    if (targetObject.get("secondResourceCollection").asString()?.startsWith('repo/internal')) {
        targetObject.put("secondResourceCollection", targetObject.get("secondResourceCollection").asString() - 'repo/');
    }
}

/*
 * Internal user objects.
 */
if (mappingTarget.startsWith("internal/user") || mappingTarget.startsWith("repo/internal/user")) {
    /*
     * Remove obsolete userName, roles and needsResetPassword attributes if they exist.
     */
    if (targetObject.isDefined("userName")) {
        targetObject.remove("userName");
    }
    if (targetObject.isDefined("roles")) {
        targetObject.remove("roles");
    }
    if (targetObject.isDefined("needsResetPassword")) {
        targetObject.remove("needsResetPassword");
    }
}