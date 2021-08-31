/*
 * Copyright 2014-2017 ForgeRock AS. All Rights Reserved
 *
 * Use of this code requires a commercial software license with ForgeRock AS.
 * or with one of its affiliates. All use shall be exclusively subject
 * to such license between the licensee and ForgeRock AS.
 */
//package com.ms.forgerock.mappings.targets.fwd.conditions.MyGroovyTest

import org.forgerock.json.resource.ActionRequest
import org.forgerock.json.resource.CreateRequest
import org.forgerock.json.resource.DeleteRequest
import org.forgerock.json.resource.NotSupportedException
import org.forgerock.json.resource.PatchRequest
import org.forgerock.json.resource.QueryRequest
import org.forgerock.json.resource.ReadRequest
import org.forgerock.json.resource.UpdateRequest
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import mappings.fwd.conditions.MyGroovyTest;

MyGroovyTest t=new MyGroovyTest();
t.printTest("****test11227 *******")


final Logger logger = LoggerFactory.getLogger("myGroovyLogger");
logger.info("Test1 groovy info log  output message 172919-7871");
skipEntitlment = skip_entitlements.asBoolean()

/* the below is working one
managedConfig =openidm.read("config/managed")
logger.info("Test2 groovy info log  output message 172919-789::"+managedConfig);
*/
config=openidm.read("config/provisioner.openicf_hrdb")
logger.info("Test2 groovy info log  output message 172919-789::"+config);

/* this is not working
def operation = operation as OperationType
logger.info("Test2 groovy info log  output message 172919-789::"+operation);  
*/

if (request instanceof CreateRequest) {
    return [
            method: "create",
            resourceName: request.resourcePath,
            newResourceId: request.newResourceId,
            parameters: request.additionalParameters,
            content: request.content.getObject(),
            context: context.toJsonValue().getObject()
    ]
} else if (request instanceof ReadRequest) {
    return [
            method: "read",
            resourceName: request.resourcePath,
            parameters: request.additionalParameters,
            context: context.toJsonValue().getObject()
    ]
} else if (request instanceof UpdateRequest) {
    return [
            method: "update",
            resourceName: request.resourcePath,
            revision: request.revision,
            parameters: request.additionalParameters,
            content: request.content.getObject(),
            context: context.toJsonValue().getObject()
    ]
} else if (request instanceof PatchRequest) {
    return [
            method: "patch",
            resourceName: request.resourcePath,
            revision: request.revision,
            patch: request.patchOperations,
            parameters: request.additionalParameters,
            context: context.toJsonValue().getObject()
    ]
} else if (request instanceof QueryRequest) {
    // query results must be returned as a list of maps
    return [
            [
                    method: "query",
                    resourceName: request.resourcePath,
                    pagedResultsCookie: request.pagedResultsCookie,
                    pagedResultsOffset: request.pagedResultsOffset,
                    pageSize: request.pageSize,
                    queryExpression: request.queryExpression,
                    queryId: request.queryId,
                    queryFilter: request.queryFilter.toString(),
                    parameters: request.additionalParameters,
                    context: context.toJsonValue().getObject()
            ]
    ]
} else if (request instanceof DeleteRequest) {
    return [
            method: "delete",
            resourceName: request.resourcePath,
            revision: request.revision,
            parameters: request.additionalParameters,
            context: context.toJsonValue().getObject()
    ]
} else if (request instanceof ActionRequest) {
    return [
            method: "action",
            action: request.action,
            content: request.content.getObject(),
            parameters: request.additionalParameters,
            context: context.toJsonValue().getObject()
    ]
} else {
    throw new NotSupportedException(request.getClass().getName());
}
