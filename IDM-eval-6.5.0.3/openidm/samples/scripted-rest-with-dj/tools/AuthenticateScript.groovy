/*
 * Copyright 2014-2018 ForgeRock AS. All Rights Reserved
 *
 * Use of this code requires a commercial software license with ForgeRock AS.
 * or with one of its affiliates. All use shall be exclusively subject
 * to such license between the licensee and ForgeRock AS.
 */

import static groovyx.net.http.Method.GET

import groovyx.net.http.RESTClient
import org.apache.http.auth.AuthScope
import org.apache.http.auth.UsernamePasswordCredentials
import org.apache.http.client.CredentialsProvider
import org.apache.http.client.HttpClient
import org.apache.http.client.protocol.HttpClientContext
import org.apache.http.impl.client.BasicAuthCache
import org.apache.http.impl.client.BasicCredentialsProvider
import org.forgerock.openicf.connectors.groovy.OperationType
import org.forgerock.openicf.connectors.scriptedrest.ScriptedRESTConfiguration
import org.identityconnectors.common.logging.Log
import org.identityconnectors.common.security.GuardedString
import org.identityconnectors.common.security.SecurityUtil
import org.identityconnectors.framework.common.exceptions.ConnectorSecurityException
import org.identityconnectors.framework.common.exceptions.InvalidCredentialException
import org.identityconnectors.framework.common.objects.ObjectClass
import org.identityconnectors.framework.common.objects.OperationOptions
import org.identityconnectors.framework.common.objects.Uid

def operation = operation as OperationType
def configuration = configuration as ScriptedRESTConfiguration
def httpClient = connection as HttpClient
def connection = customizedConnection as RESTClient
def username = username as String
def log = log as Log
def objectClass = objectClass as ObjectClass
def options = options as OperationOptions
def password = password as Object;

log.info("Entering " + operation + " Script");

def authClient = new RESTClient(configuration.serviceAddress, configuration.defaultContentType)
authClient.setClient(httpClient)
authClient.setHeaders(connection.getHeaders())

CredentialsProvider credentialsProvider = new BasicCredentialsProvider();
credentialsProvider.setCredentials(new AuthScope(AuthScope.ANY_HOST, AuthScope.ANY_PORT),
        new UsernamePasswordCredentials(username, SecurityUtil.decrypt(password as GuardedString)));

return authClient.request(GET) { req ->
    uri.path = '/api/users/' + username
    uri.query = [
            _fields: '_id'
    ]
    context.setAttribute(HttpClientContext.AUTH_CACHE, new BasicAuthCache())
    context.setAttribute(HttpClientContext.CREDS_PROVIDER, credentialsProvider)

    response.success = { resp, json ->
        return new Uid(json._id)
    }

    response."401" = { resp, json ->
        throw new InvalidCredentialException();
    }

    response.failure = { resp, json ->
        throw new ConnectorSecurityException()
    }
}
