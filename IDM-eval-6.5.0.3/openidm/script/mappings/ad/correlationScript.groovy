
import org.slf4j.*;

final Logger logger = LoggerFactory.getLogger("logger");
logger.warn("^^^^^^^inside correlationscript.groovy");
String samaccountname = source.msid
logger.warn("^^^^^^^^correlationscript.groovy->source is="+ source +" ,,samaccountname="+samaccountname)
//logger.warn("^^^^^^^^target:"+target)
//String resource="system/${target}/account"
String resource="system/openICFMSAD/account"
String filter="sAMAccountName eq '${samaccountname}'"
logger.warn("correlationscript.groovy->openidm.query result for "+"samaccountname ="+samaccountname +" is::"+openidm.query(resource,["_queryFilter":filter]).result)
return openidm.query(resource,["_queryFilter":filter]).result

