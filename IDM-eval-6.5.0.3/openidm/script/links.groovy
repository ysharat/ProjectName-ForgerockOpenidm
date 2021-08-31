

import org.forgerock.json.resource.ActionRequest
import org.forgerock.json.resource.CreateRequest
import org.forgerock.json.resource.DeleteRequest
import org.forgerock.json.resource.ForbiddenException
import org.forgerock.json.resource.NotSupportedException
import org.forgerock.json.resource.NotFoundException
import org.forgerock.json.resource.PatchRequest
import org.forgerock.json.resource.QueryRequest
import org.forgerock.json.resource.ReadRequest
import org.forgerock.json.resource.UpdateRequest
import org.slf4j.*;

    logger = LoggerFactory.getLogger('logger')
    logger.warn("\n^^^^^^start links.groovy...... isAdmin()="+isAdmin())

//Get Messages
messages = openidm.read("config/messages/endpoint")

//must be an admin to use this endpoint
// if (!isAdmin()) {
//     throw new ForbiddenException()
// }

if (request instanceof CreateRequest) {
    def link = request.content.getObject()
    firstid = link?.firstId ?: throwError(400, messages.data["4008"], [:])
    secondId = link?.secondId ?: throwError(400, messages.data["4009"], [:])
    linkType = link?.linkType ?: throwError(400, messages.data["4010"], [:])

    def response

    validateLinkType(linkType)

    validateId(firstId)
    validateId(secondId)

    object = [
        firstId: firstId,
        secondId: secondId,
        linkType: linkType,
        linkQualifier: 'default'
    ]

    response = openidm.create("repo/link", null, object)

    return response
} 
else if (request instanceof ReadRequest) {
    request.resourcePath ==~ /([a-zA-z0-9]){8}-(([a-zA-Z0-9]{4}-){3})([a-zA-Z0-9]){12}/ || throwError(400, messages.input["3009"], [:])

    response = openidm.read("repo/link/" + request.resourcePath)

    if (!response) {
        throw new NotFoundException()
    }

    return response

}
 else if (request instanceof PatchRequest) {
    def content = request.patchOperations
    def objectId = request.resourcePath
    def currentObj = openidm.read("repo/link/" + objectId) 

    content.each{ it ->
    field = it.field.toString() - /\//

    if (field != 'firstId' || field != 'secondId' || field != 'linkType') {
        throwError(400, messages.input["3010"], [:])
    }

    if (it.field =='linkType') {
        validateLinkType(it.value)
    } else if (it.field == 'firstId' || it.field == 'secondId') {
        validateId(it.value)
    }

    if (it.operation == 'replace') {
        currentObj[field] = it.value
    }
    else if (it.operation == 'remove') {
        currentObj[field] = ""
    }
    else {
        throw new NotSupportedException()
    }
}
  return openidm.update("repo/link/" + objectId, null, currentObj)

} else if (request instanceof QueryRequest) {
    return openidm.query("repo/link/", [_queryFIlter: request.queryFilter.toString()])
} else if (request instanceof DeleteRequest) {
    def linkId
    def response

    if (request.resourcePath) {
        linkId = request.resourcePath 
    } else {
        throw new NotFoundException()
    } 

    link = openidm.read("repo/link/" + linkId, null, ["_rev"])

    if (link._rev) {
        response = openidm.delete("repo/link/" + linkId, link._rev)
    } else {
        throw new NotFoundException()
    }

    return response
} else {
    throw new NotSupportedException(request.getClass().getName());
} 

/***
Helper Functions
***/

boolean validateId(String idVal) {
    if(idVal ==~ /[a-zA-Z0-9\<\>\=\-\,\.]/) {
        return true
    } else {
        throwError(400, messages.data["4011"], [:])
    }
}

boolean validateLinkType(String linkType) {
    configMappings = openidm.read("config/sync").mappings 

    targetArray = configMappings.inject([]) { accum, mappings ->
    accum << mappings.name
    }.unique() 

    // linkType is in valid targetArray or throw error due to invalid type
    targetArray.contains(linkType) || throwError(400, messages.data["4012"], [:])
}

boolean isAdmin() {
    context.getContext("security").authorization.roles.contains("openidm-admin")
}

// return error to client
Map throwError(code, String messave, Map datails) {
    throw new ResourceException(code, message).setDetail(new JsonValue(details))
}