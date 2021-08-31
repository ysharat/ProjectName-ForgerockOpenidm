import org.slf4j.*;
//testdd

    //def logger = LoggerFactory.getLogger('logger');
    logger = LoggerFactory.getLogger("logger");
    logger.info("getMsdsSupportEncryptionTypes.groovy--172786-001");
    
        toStringOrNull(defaultType)
    String toStringOrNull(String value) {
        logger.info("172786-1 "+defaultType);
        return value
    }
    String toStringOrNull(JsonValue value) {
        logger.info("172786-2");
        return "2323322"
    }