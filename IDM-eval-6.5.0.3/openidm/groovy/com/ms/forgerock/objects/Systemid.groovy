package com.ms.forgerock.objects
import org.slf4j.*

class Systemid {
    private Object systemid

final Logger logger = LoggerFactory.getLogger("myGroovyLogger")

//logger.info("Test groovy debug log  output message 172919");

//console.log("Test console groovy info log  output message 172919-29");


    public Systemid(Object systemid) {
    //logger.info("****Test groovy info inside Systemidgroovy1");
        if(systemid == null) {
            throw new Exception("172816--systemid excpeiton mssing argument")
        }
        this.systemid = systemid;
    }
    public String getName() {
        return this.systemid.name
    }
    public Object getRealm(String realmName) {
        def realms =this.systemid.realms
        logger.info("****Test groovy info inside Systemidgroovy2::"+realms)
        logger.info("****realmName::"+realmName)
        def realm = null
        logger.info("****systemidgroovy--1");
        if(realms instanceof org.forgerock.json.JsonValue) {
            realms= this.systemid.realms.asList()
        }
        logger.info("****systemidgroovy--2 next getting to loop--");
        realms.each { 
            if (it.realm == realmName) {
                logger.info("****systemidgroovy closure--22");
                realm = it
            }
        }
        // for(it in realms){
        //     logger.info("****systemidgroovy--looping 1"+it);
        //     if (it == realmName){
        //         logger.info("****systemidgroovy--looping 2"+it);
        //         realm=it
        //     }
        // }
        logger.info("****systemidgroovy--3")
        return realm
        
    }
    public List getRealms(){
        return this.systemid.realms
    }


    
}
