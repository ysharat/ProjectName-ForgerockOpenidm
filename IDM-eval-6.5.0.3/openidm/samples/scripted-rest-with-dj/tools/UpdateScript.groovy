/*
 * Copyright 2014-2018 ForgeRock AS. All Rights Reserved
 *
 * Use of this code requires a commercial software license with ForgeRock AS.
 * or with one of its affiliates. All use shall be exclusively subject
 * to such license between the licensee and ForgeRock AS.
 */


import static groovyx.net.http.ContentType.JSON
import static groovyx.net.http.Method.GET
import static groovyx.net.http.Method.PUT

import groovy.json.JsonBuilder
import groovyx.net.http.RESTClient
import org.apache.http.client.HttpClient
import org.forgerock.openicf.connectors.groovy.OperationType
import org.forgerock.openicf.connectors.scriptedrest.ScriptedRESTConfiguration
import org.identityconnectors.common.logging.Log
import org.identityconnectors.framework.common.exceptions.ConnectorException
import org.identityconnectors.framework.common.objects.Attribute
import org.identityconnectors.framework.common.objects.AttributesAccessor
import org.identityconnectors.framework.common.objects.ObjectClass
import org.identityconnectors.framework.common.objects.OperationOptions
import org.identityconnectors.framework.common.objects.Uid

def operation = operation as OperationType
def updateAttributes = new AttributesAccessor(attributes as Set<Attribute>)
def configuration = configuration as ScriptedRESTConfiguration
def httpClient = connection as HttpClient
def connection = customizedConnection as RESTClient
def name = id as String
def log = log as Log
def objectClass = objectClass as ObjectClass
def options = options as OperationOptions
def uid = uid as Uid

log.info("Entering " + operation + " Script");

switch (operation) {
    case OperationType.UPDATE:
        def builder = new JsonBuilder()
        switch (objectClass) {
            case ObjectClass.ACCOUNT:
                try {
                    def query = ["_queryFilter": "_id eq '" + uid.uidValue + "'"]
                    def searchResult = connection.request(GET) { req ->
                        uri.path = '/api/users'
                        uri.query = query
                    }

                    def response = searchResult.responseData
                    assert response.resultCount == 1

                    def result = response.result.get(0)
                    def resultContactInformation = result.contactInformation
                    def resultDisplayName = result.displayName
                    def resultName = result.name
                    builder {
                        contactInformation {
                            telephoneNumber(updateAttributes.hasAttribute("telephoneNumber")
                                    ? updateAttributes.findString("telephoneNumber")
                                    : resultContactInformation.telephoneNumber)
                            emailAddress(updateAttributes.hasAttribute("emailAddress")
                                    ? updateAttributes.findString("emailAddress")
                                    : resultContactInformation.emailAddress)
                        }
                        displayName(updateAttributes.hasAttribute("displayName")
                                ? updateAttributes.findString("displayName")
                                : resultDisplayName)
                        delegate.name({
                            familyName(updateAttributes.hasAttribute("familyName")
                                    ? updateAttributes.findString("familyName")
                                    : resultName.familyName)
                            givenName(updateAttributes.hasAttribute("givenName")
                                    ? updateAttributes.findString("givenName")
                                    : resultName.givenName)
                        })
                    }
                } catch (AssertionError e) {
                    throw new ConnectException(e.getMessage())
                }

                return connection.request(PUT, JSON) { req ->
                    uri.path = "/api/users/${uid.uidValue}"
                    body = builder.toString()
                    headers.'If-Match' = "*"

                    response.success = { resp, json ->
                        new Uid(json._id, json._rev)
                    }
                }
            case ObjectClass.GROUP:
                if (updateAttributes.hasAttribute("members")) {
                    builder {
                        members(updateAttributes.findList("members"))
                    }
                    return connection.request(PUT, JSON) { req ->
                        uri.path = "/api/groups/${uid.uidValue}"
                        body = builder.toString()
                        headers.'If-Match' = "*"

                        response.success = { resp, json ->
                            new Uid(json._id, json._rev)
                        }
                    }
                }
                break
            default:
                throw new ConnectorException("UpdateScript can not handle object type: " + objectClass.objectClassValue)
        }
        break
    case OperationType.ADD_ATTRIBUTE_VALUES:
        throw new UnsupportedOperationException(operation.name() + " operation of type:" +
                objectClass.objectClassValue + " is not supported.")
    case OperationType.REMOVE_ATTRIBUTE_VALUES:
        throw new UnsupportedOperationException(operation.name() + " operation of type:" +
                objectClass.objectClassValue + " is not supported.")
    default:
        throw new ConnectorException("UpdateScript can not handle operation:" + operation.name())
}
return uid