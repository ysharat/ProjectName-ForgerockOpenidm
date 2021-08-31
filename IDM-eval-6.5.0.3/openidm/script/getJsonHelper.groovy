import org.slf4j.*;


    //def logger = LoggerFactory.getLogger('logger');
    logger = LoggerFactory.getLogger("logger");
    logger.info("info--getJsonHelper.groovy--172786-820");
    logger.debug("debug--getJsonHelper.groovy--172786-001");
    logger.info("****getJsonHelper printing  source::: "+source);
    logger.info("****getJsonHelper printing  source::: ");
    def ret=source.accountStatus?.toLowerCase()
    logger.info("****getJsonHelper printing  ret::: "+ret);
        toStringOrNull(defaultType)
    String toStringOrNull(String value) {
        logger.info("172786-1 "+defaultType);
        //return source
        return value
    }
    String toStringOrNull(JsonValue value) {
        logger.info("172786-2");
        return "2323322"
    }
  
 
  
     
     
   
    
    
 
