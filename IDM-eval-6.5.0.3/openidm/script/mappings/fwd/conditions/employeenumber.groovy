import com.ms.forgerock.mappings.targets.fwd.conditions.EmployeeNumberCondition
//import com.ms.forgerock.helpers.JsonHelper
import com.ms.forgerock.objects.Systemid
import org.slf4j.*;
//import org.slf4j.LoggerFactory;

final Logger logger = LoggerFactory.getLogger("myGroovyLogger::");
//logger.debug("Test groovy debug log  output message 172919");


//Systemid s=new Systemid(object)
logger.info("****employeeNumbergroovy1 printing  object::: "+object);
//logger.info("***********************");
//managedConfig = openidm.read("config/managed")
//logger.info("****employeeNumbergroovy1 printing  managedConfig::: "+managedConfig);
//managedConfig = openidm.read("config/mappings")
//logger.info("****employeeNumbergroovy1 printing  mappings::: "+managedConfig);


EmployeeNumberCondition condition = new EmployeeNumberCondition(new Systemid(object))
logger.info("****employeeNumbergroovy2 condition.evaluate() boolean value:: "+condition.evaluate());
Systemid s=new Systemid(object)
logger.info("****employeeNumbergroovy3:systemid to string*** "+s.toString());
return condition.evaluate()
