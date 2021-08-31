import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
//import MyGroovyTest;
//import com.ms.forgerock.objects.Systemid


final Logger logger = LoggerFactory.getLogger("myGroovyLogger");

logger.info("******1 Test groovy info log  output message 172919-25 *****"+source.employeeNumber);

if(source.sn == null){
logger.info("******3 Test groovy info log  output message 172919-26 ::"+source.sn);
//throw new Exception("&&&&&&&&&--Exception");
}
return source.sn


