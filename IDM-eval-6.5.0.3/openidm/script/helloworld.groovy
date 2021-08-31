 import org.slf4j.Logger
import org.slf4j.LoggerFactory
//import MyGroovyTest;
 //import com.ms.forgerock.objects.Systemidm


final Logger logger = LoggerFactory.getLogger("myGroovyLogger");
println "hello world"
 logger.info("test")
 def realm ="IS1.morgan"
 if(realm ==~ /^(?i)is1\.morgan$/){
  println "true"
 }
 else {
  println "false"
 }






