/*
 * Copyright 2014-2018 ForgeRock AS. All Rights Reserved
 *
 * Use of this code requires a commercial software license with ForgeRock AS.
 * or with one of its affiliates. All use shall be exclusively subject
 * to such license between the licensee and ForgeRock AS.
 */

import static groovyx.net.http.Method.GET

import groovyx.net.http.RESTClient
import org.apache.http.client.HttpClient
import org.forgerock.openicf.connectors.groovy.OperationType
import org.forgerock.openicf.connectors.scriptedrest.ScriptedRESTConfiguration
import org.identityconnectors.common.logging.Log
import org.identityconnectors.framework.common.objects.ObjectClass
import org.identityconnectors.framework.common.objects.SyncToken

def operation = operation as OperationType
def configuration = configuration as ScriptedRESTConfiguration
def httpClient = connection as HttpClient
def connection = customizedConnection as RESTClient
def log = log as Log
def objectClass = objectClass as ObjectClass

log.info("Entering " + operation + " Script");


if (OperationType.GET_LATEST_SYNC_TOKEN.equals(operation)) {

    return connection.request(GET) { req ->
        uri.path = '/api/changelog'
        uri.query = [
                _queryFilter: 'true',
                _fields     : '_id'
        ]

        response.success = { resp, json ->
            def lastToken = "0"
            json.result.each() { it ->
                lastToken = it._id
            }
            return new SyncToken(lastToken)
        }


        response.failure = { resp, json ->
            throw new ConnectException(json.message)
        }
    }

} else if (OperationType.SYNC.equals(operation)) {
    def token = token as Object
    log.info("Entering SYNC");
    switch (objectClass) {
        case ObjectClass.ACCOUNT:
            return connection.request(GET) { req ->
                uri.path = '/api/changelog'
                uri.query = [
                        _queryFilter: "_id gt \"${token}\" and targetDN co \"ou=people,dc=example,dc=com\"",
                        _fields     : '_id,changeType,targetDN'
                ]

                response.success = { resp, json ->
                    def lastToken = token
                    json.result.each() { changeLogEntry ->
                        lastToken = changeLogEntry._id

                        String resourceId = changeLogEntry.targetDN
                        resourceId = resourceId.substring(4, resourceId.indexOf(','))

                        handler({
                            syncToken lastToken
                            if ("add".equals(changeLogEntry.changeType)) {
                                CREATE()
                            } else if ("modify".equals(changeLogEntry.changeType)) {
                                UPDATE()
                            } else if ("delete".equals(changeLogEntry.changeType)) {
                                DELETE()
                                object {
                                    uid resourceId
                                    id resourceId
                                    delegate.objectClass(objectClass)
                                }
                                return
                            } else {
                                CREATE_OR_UPDATE()
                            }

                            connection.request(GET) { getReq ->
                                uri.path = '/api/users/' + resourceId

                                response.success = { getResp, value ->
                                    object {
                                        uid value._id
                                        id value._id
                                        attribute 'telephoneNumber', value?.contactInformation?.telephoneNumber
                                        attribute 'emailAddress', value?.contactInformation?.emailAddress
                                        attribute 'familyName', value?.name?.familyName
                                        attribute 'givenName', value?.name?.givenName
                                        attribute 'displayName', value?.displayName
                                        attribute('groups', *(value?.groups))
                                        attribute 'created', value?._meta?.created
                                        attribute 'lastModified', value?._meta?.lastModified
                                    }

                                }

                                response."404" = { getResp, error ->
                                    DELETE()
                                    object {
                                        uid resourceId
                                        id resourceId
                                        delegate.objectClass(objectClass)
                                    }
                                }

                                response.failure = { getResp, error ->
                                    throw new ConnectException(error.message)
                                }
                            }

                        })
                    }
                    return new SyncToken(lastToken)
                }

                response.failure = { resp, json ->
                    throw new ConnectException(json.message)
                }
            }
            break;

        case ObjectClass.GROUP:
            return connection.request(GET) { req ->
                uri.path = '/api/changelog'
                uri.query = [
                        _queryFilter: "_id gt \"${token}\" and targetDN co \"ou=groups,dc=example,dc=com\"",
                        _fields     : '_id,changeType,targetDN'
                ]

                response.success = { resp, json ->
                    def lastToken = "0"
                    json.result.each() { changeLogEntry ->
                        lastToken = changeLogEntry._id

                        String resourceId = changeLogEntry.targetDN
                        resourceId = resourceId.substring(3, resourceId.indexOf(','))

                        handler({
                            syncToken lastToken
                            if ("add".equals(changeLogEntry.changeType)) {
                                CREATE()
                            } else if ("modify".equals(changeLogEntry.changeType)) {
                                UPDATE()
                            } else if ("delete".equals(changeLogEntry.changeType)) {
                                DELETE()
                                object {
                                    uid resourceId
                                    id resourceId
                                    delegate.objectClass(objectClass)
                                }
                                return
                            } else {
                                CREATE_OR_UPDATE()
                            }

                            connection.request(GET) { getReq ->
                                uri.path = '/api/groups/' + resourceId

                                response.success = { getResp, value ->
                                    object {
                                        uid value._id
                                        id value._id
                                        delegate.objectClass(objectClass)
                                        attribute('members', *(value?.members))
                                        attribute 'displayName', value?.displayName
                                        attribute 'created', value?._meta?.created
                                        attribute 'lastModified', value?._meta?.lastModified
                                    }

                                }

                                response."404" = { getResp, error ->
                                    DELETE()
                                    object {
                                        uid resourceId
                                        id resourceId
                                        delegate.objectClass(objectClass)
                                    }
                                }

                                response.failure = { getResp, error ->
                                    throw new ConnectException(error.message)
                                }
                            }

                        })
                    }
                    return new SyncToken(lastToken)
                }


                response.failure = { resp, json ->
                    throw new ConnectException(json.message)
                }
            }
            break;
    }

} else { // action not implemented
    log.error("Sync script: action '" + operation + "' is not implemented in this script");
}

