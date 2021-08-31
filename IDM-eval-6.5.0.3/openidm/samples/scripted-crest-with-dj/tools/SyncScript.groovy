/*
 * Copyright 2014-2018 ForgeRock AS. All Rights Reserved
 *
 * Use of this code requires a commercial software license with ForgeRock AS.
 * or with one of its affiliates. All use shall be exclusively subject
 * to such license between the licensee and ForgeRock AS.
 */

import org.forgerock.json.resource.Connection
import org.forgerock.json.resource.NotFoundException
import org.forgerock.json.resource.QueryRequest
import org.forgerock.json.resource.QueryResourceHandler
import org.forgerock.json.resource.QueryResponse
import org.forgerock.json.resource.ReadRequest
import org.forgerock.json.resource.Requests
import org.forgerock.json.resource.ResourceResponse
import org.forgerock.openicf.connectors.groovy.OperationType
import org.forgerock.openicf.connectors.scriptedcrest.ScriptedCRESTConfiguration
import org.forgerock.services.context.RootContext
import org.forgerock.util.query.QueryFilter
import org.identityconnectors.common.StringUtil
import org.identityconnectors.common.logging.Log
import org.identityconnectors.framework.common.exceptions.ConnectorException
import org.identityconnectors.framework.common.objects.AttributeUtil
import org.identityconnectors.framework.common.objects.Name
import org.identityconnectors.framework.common.objects.ObjectClass
import org.identityconnectors.framework.common.objects.OperationOptions
import org.identityconnectors.framework.common.objects.SyncToken

def operation = operation as OperationType
def configuration = configuration as ScriptedCRESTConfiguration
def connection = connection as Connection
def log = log as Log
def objectClass = objectClass as ObjectClass


switch (operation) {
    case OperationType.SYNC:
        def options = options as OperationOptions
        def token = token as Object

        Map<String, Object> objectClassInfo = configuration.propertyBag[objectClass.objectClassValue];
        if (objectClassInfo != null) {

            QueryRequest request = Requests.newQueryRequest('/api/changelog')

            if (objectClass.equals(ObjectClass.ACCOUNT)) {
                request.queryFilter = QueryFilter.and(QueryFilter.greaterThan('_id', token), QueryFilter.contains('targetDN', 'ou=people,dc=example,dc=com'))
            } else if (objectClass.equals(ObjectClass.GROUP)) {
                request.queryFilter = QueryFilter.and(QueryFilter.greaterThan('_id', token), QueryFilter.contains('targetDN', 'ou=groups,dc=example,dc=com'))
            } else {
                request.queryFilter = QueryFilter.greaterThan('_id', token)
            }

            request.addField('_id', 'changeType', 'targetDN')

            def lastToken = token.toString()
            def exception = null;

            connection.query(new RootContext(), request, [
                    handleError   : { org.forgerock.json.resource.ResourceException error ->
                        log.error(error, error.message)
                        exception = error
                    },
                    handleResource: { ResourceResponse resource ->
                        lastToken = resource.id

                        def content = resource.content.getObject();
                        String resourceId = content.targetDN
                        resourceId = resourceId.substring(resourceId.indexOf('=') + 1, resourceId.indexOf(','))

                        handler({

                            syncToken lastToken
                            if ("add".equals(content.changeType)) {
                                CREATE()
                            } else if ("modify".equals(content.changeType)) {
                                UPDATE()
                            } else if ("delete".equals(content.changeType)) {
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

                            ReadRequest readRequest = Requests.newReadRequest(objectClassInfo.resourceContainer, resourceId)
                            readRequest.setResourcePath("/api/" + readRequest.getResourcePath())
                            try {
                                def changedResource = connection.read(new RootContext(), readRequest)

                                object {
                                    if (StringUtil.isBlank(changedResource.revision)) {
                                        uid changedResource.id
                                    } else {
                                        uid changedResource.id, changedResource.revision
                                    }

                                    setObjectClass objectClass

                                    objectClassInfo.attributes.each { key, value ->
                                        if (AttributeUtil.namesEqual(key, Name.NAME)) {
                                            id changedResource.content.get("_id").required().asString()
                                        } else if (null != changedResource.content.get(value.jsonName)) {
                                            //attribute key, converter(value.attributeInfo, value)

                                            def attributeValue = changedResource.content.get(value.jsonName).getObject();

                                            if (attributeValue instanceof Collection) {
                                                if (((Collection) attributeValue).isEmpty()) {
                                                    attribute key
                                                } else {
                                                    attribute {
                                                        name key
                                                        attributeValue.each {
                                                            delegate.value CRESTHelper.fromJSONToAttribute(value.attributeInfo, it)
                                                        }
                                                    }
                                                }
                                            } else {
                                                attribute key, CRESTHelper.fromJSONToAttribute(value.attributeInfo, attributeValue)
                                            }
                                        }
                                    }
                                }


                            } catch (NotFoundException e) {
                                DELETE()
                                object {
                                    uid resourceId
                                    id resourceId
                                    delegate.objectClass(objectClass)
                                }
                            } catch (Exception e) {
                                throw new ConnectorException(e.message, e)
                            }
                        })
                    },
                    handleResult  : { QueryResponse result -> }
            ] as QueryResourceHandler)

            if (exception != null) {
                throw new ConnectorException(exception.message, exception);
            }
            return new SyncToken(lastToken)

        } else {
            throw new UnsupportedOperationException(operation.name() + " operation of type:" +
                    objectClass.objectClassValue + " is not supported.")
        }

        break;
    case OperationType.GET_LATEST_SYNC_TOKEN:

        QueryRequest request = Requests.newQueryRequest('/api/changelog')
        request.queryFilter = QueryFilter.alwaysTrue()
        request.addField('_id')

        def lastToken = "0"
        def exception = null;

        connection.query(new RootContext(), request, [
                handleError   : { org.forgerock.json.resource.ResourceException error ->
                    log.error(error, error.message)
                    exception = error
                },
                handleResource: { ResourceResponse resource ->
                    lastToken = resource.id
                    return true;
                },
                handleResult  : { QueryResponse result -> }
        ] as QueryResourceHandler)

        if (exception != null) {
            throw new ConnectorException(exception.message, exception);
        }
        return new SyncToken(lastToken)

        break;
    default:
        throw new ConnectorException("SyncScript can not handle operation:" + operation.name())
}
