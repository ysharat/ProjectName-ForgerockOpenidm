/*
 * Copyright 2016-2018 ForgeRock AS. All Rights Reserved
 *
 * Use of this code requires a commercial software license with ForgeRock AS.
 * or with one of its affiliates. All use shall be exclusively subject
 * to such license between the licensee and ForgeRock AS.
 */
var base64 = Packages.org.forgerock.util.encode.Base64url,
    dataStoreToken = (httpRequest.getHeaders().getFirst('X-OpenIDM-DataStoreToken').toString()+""),
    id_token = openidm.action("identityProviders", "getDataStoreContent", {token: dataStoreToken}).id_token,
    parts = id_token.split('.'),
    claimsContent = parts[1],
    claims = JSON.parse(new java.lang.String(base64.decode(claimsContent))),
    session_token = claims.sessionTokenId || id_token,
    modifiedMap = {},
    _ = require('lib/lodash');

//console.log(JSON.stringify(claims, null, 4))
try {
    var response = openidm.action("external/rest", "call", {
        "url": sessionValidationBaseEndpoint + "?_action=validate",
        "headers" : {
            "Accept-API-Version" : "protocol=1.0,resource=1.0",
            "iPlanetDirectoryPro" : session_token
        },
        "method": "POST"
    });

    if (!response.valid) {
        throw {
            "code": 401,
            "message": "OpenAM session invalid"
        };
    }
} catch (e) {
    throw {
        "code": 401,
        "message": "OpenAM session invalid"
    };
}


if (security.authenticationId.toLowerCase() === "amadmin") {
    security.authorization = {
        "id" : "openidm-admin",
        "component" : "internal/user",
        "roles" : ["internal/role/openidm-admin", "internal/role/openidm-authorized"],
        "moduleId" : security.authorization.moduleId
    };
} else if (security.authorization.component !== "managed/user") {
    var securityContextClone = {},
        managedUser = openidm.query("managed/user", { '_queryFilter' : '/userName eq "' + security.authenticationId  + '"' }, ["*","authzRoles/*"]);
    Object.keys(security.authorization).forEach(function (k) {
        securityContextClone[k] = security.authorization[k];
    });

    if (managedUser.result.length === 0) {
        throw {
            "code" : 401,
            "message" : "Access denied, managed/user entry is not found"
        };
    }

    if (managedUser.result[0].accountStatus !== "active") {
        throw {
            "code" : 401,
            "message" : "Access denied, user inactive"
        };
    }

    // copy and update necessary fields within security authorization map
    securityContextClone.id = managedUser.result[0]._id;
    securityContextClone.component = "managed/user";
    securityContextClone.queryId = "credential-query";
    securityContextClone.authenticationIdProperty = "username";
    securityContextClone.roles = managedUser.result[0].authzRoles
            ? _.uniq(
                security.authorization.roles.concat(
                    _.map(managedUser.result[0].authzRoles, function (role) {
                        // appending empty string gets the value from java into a format more familiar to JS
                        return org.forgerock.json.resource.ResourcePath.valueOf(role._ref) + "";
                    })
                )
            )
            : security.authorization.roles;
    securityContextClone.userRoles = managedUser.result[0].authzRoles;
    securityContextClone.authenticationId = managedUser.result[0].userName;

    security.authorization = securityContextClone;
    security.authorization = require('auth/customAuthz').setProtectedAttributes(security).authorization;
}

security;
