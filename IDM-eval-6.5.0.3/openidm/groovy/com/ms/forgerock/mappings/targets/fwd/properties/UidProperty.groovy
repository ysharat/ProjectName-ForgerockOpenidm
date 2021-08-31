package com.ms.forgerock.mappings.targets.fwd.properties

import com.ms.forgerock.mappings.targets.Property

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

class UidProperty implements Property {
final Logger logger = LoggerFactory.getLogger("myGroovyLogger");
console.log("172916-1 start.........................**********");

public UidProperty(){
logger.info("Test info log output message 172916");
}

public String build(){
return "test172916"
 }

}


