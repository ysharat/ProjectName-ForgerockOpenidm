/*
 * Copyright 2014-2017 ForgeRock AS. All Rights Reserved
 *
 * Use of this code requires a commercial software license with ForgeRock AS.
 * or with one of its affiliates. All use shall be exclusively subject
 * to such license between the licensee and ForgeRock AS.
 */

//package com.ms.forgerock.mappings.targets.fwd.conditions.MyGroovyTest
import groovy.transform.Field
import mappings.fwd.conditions.MyGroovyTest
import org.forgerock.json.resource.*
import org.slf4j.LoggerFactory
import groovy.json.JsonSlurper

MyGroovyTest t = new MyGroovyTest()
t.printTest('Calling MyGroovyTests method that is printTest11')

//final Logger logger = LoggerFactory.getLogger("logger");
//also can write like below ms
logger = LoggerFactory.getLogger('logger')
logger.info('**Start Inside systemid.groovy....')
//you cant print source here logger.info("printing source:: "+source);
skipEntitlment = skip_entitlements.asBoolean()
syncDebug = request?.additionalParameters.syncDebug ?: false
logger.info('**Start Inside echo.groovy syncDebug:: ' + syncDebug)
logger.info('**Start Inside echo.groovy request.additionalParameters.syncDebug:: ' + request.additionalParameters.syncDebug)
logger.info('**Start Inside echo.groovy,printing request :: ' + request)
def req=request



logger.info('**Start Inside echo.groovy,printing context :: ' + context.parent.parent.parent.parent.parent.parent.parent.parent.parent.originalUri)

//{ "method": "create", "resourcePath": "", "newResourceId": null, "fields": [  ],
//"content": { "name": "name4", "eonid": "eonid1", "environment": "dev", "fwldapid": "1729169", "source": "source1", "msid": "1729169", "accountStatus": "", "realms": [ "RACF", "is1.mrogan" ] } }

logger.info('***********....')
//logger.info("**Start Inside echo.groovy context:: "+context);

user = getUser(context)
logger.info('**Start Inside echo.groovy user:: ' + user);
if (user == null) {
	logger.warn('user is not authenticated : request: ' + request)
	throw new ResourceException(400, 'shrath runtime msg').setDetail(new JsonValue([:]))
}
mappings = openidm.read('config/mappings')
// logger.info("****echo groovy1 printing  mappings::: "+mappings);

//Get Schema
managedConfig = openidm.read('config/managed')
schema = managedConfig.objects.find { it.name == 'systemid' }
//logger.info("***schema::"+new JsonValue(schema));
//logger.info("***schema::"+new JsonValue(schema).name);
//throw new ResourceException(400, "shrath runtime msg").setDetail(new JsonValue([:]))
// //logger.info("****echog roovy printing  managedConfig::: "+managedConfig);
// logger.info("***********************");

//Get Messages
messages = openidm.read('config/messages/endpoint')
logger.info('*****config/messages/endpoint******************' + messages)

//is user admin
//admin_role = getRoles(context.toJsonValue().getObject()).contains(endpoint_config["openidm_admin_role"])
//logger.info("*****admin_role******************" + admin_role)
//config=openidm.read("config/provisioner.openicf_hrdb")
//logger.info("Test2 groovy info log  output message 172919-789::"+config);

// logger.info("***********************");

/* this is not working
 def operation = operation as OperationType
 logger.info("Test2 groovy info log  output message 172919-789::"+operation);
 */
@Field long globalTime

if (request instanceof ActionRequest) {

	globalTime = new Date().getTime()
	logger.warn('****inside ActionRequest, the globalTime is :' + globalTime)
	if (request.action == 'patch') { 
		logger.warn("****inside ActionRequest, of the patch")
		def context = context.toJsonValue().getObject()
		//Get request  content
		def content =  request.content.getObject()
		logger.warn('systemid.groovy: content = {}', content)
		def result= queryForObject(context.remainingUri,['*'])
		logger.warn('systemid.groovy: result = {}', result)
		def name=result.name
		//check for realm and throw error if 'falsey'

	   
	   return [
		   'result' : 'successYSB'
	   ]


	} else {
		logger.warn("****Attempted action '{}' is unsupported by endpoint.", request.action)
	throw new NotSupportedException(request.action)
	}
	

	// // logger.info('**inside ActionRequest ,printing request.action :: ' + request.action)
	// return [
	// 	method    : 'action',
	// 	action    : request.action,
	// 	content   : request.content.getObject(),
	// 	parameters: request.additionalParameters,
	// 	context   : context.toJsonValue().getObject()
	// ]
 }
else if (request instanceof CreateRequest) {
	logger.info('***inside createRequest/post')
	//set systemID from request
	def systemID = request.content.getObject()
	logger.warn('systemid.groovy: systemID object = {}', new JsonValue(systemID))

	if (systemID.name == null) {
		systemID.name = request?.newResourceId ?: request.resourcePath
		logger.info('****echo content inside 2nd if  ::: ' + systemID.name)
	}

	def name = systemID.name

	// logger.info("****echo1 request.content.getObject()  ::: "+request.content.getObject());
	logger.info('****echo content request.resourcePath  ::: ' + request.resourcePath)
	//the below one is also working
	// logger.info("****echo prit openidm  ::: "+openidm);
	logger.info('****echo content request.newResourceId  ::: ' + request.newResourceId)
	//the below one is working
	//logger.info("****echo content context.toJsonValue().getObject()  ::: "+context.toJsonValue().getObject());
	if (true) {
		logger.info('**inside systemid.groovy,Calling openidmCreate  ------:')
		response = openidm.create('managed/systemid', null, systemID)
		logger.info('response ------:' + response)
	} else {
		logger.info('Comming in here1.....')
	}
	logger.info('Comming in here2.....')
	// user =null;
	// the below works
	//  if(user ==null){
	//      throw new ResourceException(400, "shrath runtime msg").setDetail(new JsonValue(['realm':user]))
	//  }

	return [
		method       : 'create',
		resourceName : request.resourcePath,
		newResourceId: request.newResourceId,
		parameters   : request.additionalParameters,
		content      : request.content.getObject(),
		context      : context.toJsonValue().getObject()
	]
}
else if (request instanceof ReadRequest) {
	logger.info('***inside ReadRequest printing request ::'+request)
	logger.info('***inside ReadRequest printing request.resourcePath ::'+request.resourcePath)
	def jsonSlurper = new JsonSlurper()
	def user="sharath"
	//def details = ['test1','test2']
	//details =['test1': 'test1','test2': 'test2']
	//dependency = new JsonValue([details])
	def response = [
		"C:/ysb171ForgeRockShare/curl-7.75.0_2-win64-mingw/curl-7.75.0-win64-mingw/bin/curl",
		"-k",
		"-X",
		"GET",
		"-H",
		"Content-Type: application/json",
		"-H",
		"X-OpenIDM-Username: openidm-admin",
		"-H",
		"X-OpenIDM-Password: openidm-admin",
		"http://esfmylabfridm1.mydmn.com:8080/openidm/managed/systemid/1e5460ee-0f69-4e54-85d9-3b27bbeaa35e"
	].execute().text
	//def output="";
    def output=new JsonValue([:])
	if(response !=null && !response.isEmpty()) {
		logger.info('**1 response from curl systemid.groovy....'+response)
		def resobje= jsonSlurper.parseText(response)
		logger.info('**2 response from curl systemid.groovy....'+resobje.eonid)
		if(resobje.eonid){
			output=resobje.eonid
			logger.info('**3 response from curl systemid.groovy using jsonsllurperParsetext....'+resobje)
            logger.info("output is ::"+output)
		}
		else{
			logger.info('**4 response from curl systemid.groovy using jsonsllurperParsetext....'+resobje)
			throw new ResourceException(resobje.code, "tai server issue").setDetail(new JsonValue(['errorname':resobje.message]));
		}

	}
	else if (response.length()==0 || response.isEmpty()) {
		logger.info('**9 response from curl systemid.groovy....')
		def a_mess = ["question", 42, 'answer']
		logger.info('**9 response from curl systemid.groovy.a_mess...'+a_mess[0])
		//return { "JSONobjectID" : "test" }
		// return [test3]
		return [
			eon_id : output

		]
		// throw new ResourceException(503, "no tai server available").setDetail(new JsonValue(['errorname':'errorvalue']));
	}
	else {

		throw new ResourceException(501, "internal server").setDetail(new JsonValue(['errorname':'undefined']));
	}




	return [
		eon_id : output,
		systemGRN: 'grn'
	]
}
else if (request instanceof UpdateRequest) {
	logger.info('***inside UpdateRequest')
	return [
		method      : 'update',
		resourceName: request.resourcePath,
		revision    : request.revision,
		parameters  : request.additionalParameters,
		content     : request.content.getObject(),
		context     : context.toJsonValue().getObject()
	]
}
else if (request instanceof PatchRequest) {
	logger.info('***inside PatchRequest')
	return [
		method      : 'patch',
		resourceName: request.resourcePath,
		revision    : request.revision,
		patch       : request.patchOperations,
		parameters  : request.additionalParameters,
		context     : context.toJsonValue().getObject()
	]
}
else if (request instanceof QueryRequest) {
	// query results must be returned as a list of maps
	logger.info('***inside QueryRequest ' + request.queryId)

	try {
		//the below is working,which use the above variable
		//        def base36MSID = "default172916";
		//       param = [_queryFilter: 'employeeNumber eq \"' +base36MSID +'\"']
		//      results = openidm.query('system/ldap/account', param)

		//the below is working
		//        def base36MSID = "172916";
		//       param = [_queryFilter: 'msid eq \"' +base36MSID +'\"']
		//      results = openidm.query('managed/systemid', param)

		//the below is not working

		param = ['_queryId': 'for-userName', 'uid': '172916']

		logger.info('***Before Query')
		results = openidm.query('managed/systemid', param)
		logger.info('***After Query')

		//   the below is working
		//param = ["_queryId": "query-all-ids"]

		logger.info('***inside QueryRequest results ' + results)
	}
	catch (e) {
		logger.info('***inside QueryRequest exception ' + e)
		throw new ResourceException(400, 'shrath runtime msg').setDetail(new JsonValue(['error': results]))
	}

	return [
		[
			method            : 'query',
			resultsysb        : results,
			resourceName      : request.resourcePath,
			pagedResultsCookie: request.pagedResultsCookie,
			pagedResultsOffset: request.pagedResultsOffset,
			pageSize          : request.pageSize,
			queryExpression   : request.queryExpression,
			queryId           : request.queryId,
			queryFilter       : request.queryFilter.toString(),
			parameters        : request.additionalParameters,
			context           : context.toJsonValue().getObject()

		]
	]
}
// else if (request instanceof DeleteRequest) {
//     return [
//             method: "delete",
//             resourceName: request.resourcePath,
//             revision: request.revision,
//             parameters: request.additionalParameters,
//             context: context.toJsonValue().getObject()
//     ]
// }
else {
	logger.warn("****Attempted request type '{}' is unsupported.", request.getClass().getName())
	throw new NotSupportedException(request.getClass().getName())
}

String getUser(context) {
	context.parent.parent.parent.authorization.roles
}

ArrayList getRoles(context) {
	context.parent.parent.parent.authorization.roles
}
Map queryForObject(String name, List fields){
	logger.warn("****inside queryForObject-1")
   if(fields[0] == '*'){
	   logger.warn("****inside queryForObject -2")
	   if(schema){
		   logger.warn("****inside queryForObject-3")
		   commonAttrs = schema.schema['order']
		   realmAttrs = schema.schema.properties['realms'].items['order']
	   }
	   fields = commonAttrs + realmAttrs
	   fields << '_id' << '_rev'
   }
   if (name ==~ /([a-zA-Z0-9]){8}-(([a-zA-Z0-9]{4}-){3})([a-zA-Z0-9]){12}/){
	   //return systemID by _id
	    logger.warn("****inside queryForObject -4")
	   query = openidm.read("managed/systemid/"+request.resourcePath)
   } else if(name ==~/([a-zA-Z0-9-_.$]*)/){
	    logger.warn("****inside queryForObject -5")
	   params = [
		   _queryId:"find-by-name",
		   name:name
	   ]
	   //return first systemid in result
	    logger.warn("****inside queryForObject -6")
	   query = openidm.query("managed/systemid/",params,fields)
	    logger.warn("****inside queryForObject -7")
	   if (query.result.size <2){
		    logger.warn("****inside queryForObject -8 query.results are :"+query.result)
		   query = query.result[0]
		    
	   } else{
		    logger.warn("****inside queryForObject -9")
		   //otherwise check for exact case match
	   		for (r in query.result){
				   if (name == r.name){
					   query = r
				   }
			   }
	   }
   }

 if(query == null){
	 logger.warn("No SystemID found with the name '{}'",name)
	throw new ResourceException(400, 'No SystemID found with the name').setDetail(new JsonValue(['error': 'results']))
 }
 logger.warn("****inside queryForObject -10")
 query
}
