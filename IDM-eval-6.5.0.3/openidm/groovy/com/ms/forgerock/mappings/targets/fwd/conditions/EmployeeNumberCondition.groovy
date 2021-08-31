package com.ms.forgerock.mappings.targets.fwd.conditions

import com.ms.forgerock.mappings.targets.Conditions
import com.ms.forgerock.objects.Systemid
import org.slf4j.*

public class EmployeeNumberCondition implements Conditions {
    private Logger logger
    private Systemid systemid
    static final String ANy = "*"


    public EmployeeNumberCondition(Systemid systemid) {
        if(systemid == null) {
            throw new Exception("EmployeeNumberCondition:172816--systemid excpeiton mssing argument")
        }
        this.systemid = systemid;
        this.logger = LoggerFactory.getLogger(EmployeeNumberCondition.class)
        
        this.logger.info("EmployeeNumberCondition constructore:")
    }

    
    public boolean evaluate() {
        this.logger.info("EmployeeNumberCondition evalulate 1 getting realm::"+this.systemid.getRealm("RACF"));
        logger.info("****EmployeeNumberCondition evalulate-2*****");
        if (this.systemid.getRealm("RACF") != null) {
            this.logger.info("EmployeeNumberCondition evalulate 2:employee number generation called2*****")
            return true;
        }
        this.logger.info("EmployeeNumberCondition:employee number generation called 3******")
        //return false;
        return true;

    }

    
}
