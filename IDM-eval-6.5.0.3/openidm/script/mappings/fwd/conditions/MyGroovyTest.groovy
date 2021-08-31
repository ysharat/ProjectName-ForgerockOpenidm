//package com.ms.forgerock.mappings.targets.fwd.conditions
import org.slf4j.*;

class MyGroovyTest { 
def logger = LoggerFactory.getLogger('logger');

    void printTest(String msg) { 
        logger.info(msg +"included11");
    }
}