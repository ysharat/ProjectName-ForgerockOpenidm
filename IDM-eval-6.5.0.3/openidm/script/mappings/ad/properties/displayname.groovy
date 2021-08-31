
import org.slf4j.*
import com.ms.forgerock.objects.Systemid

final Logger logger = LoggerFactory.getLogger("logger")
logger.warn("^^^^^^^inside displayname.groovy source is1 ="+source)
logger.warn("^^^^^^^inside displayname.groovy realm is ="+realm)
Systemid s= new Systemid(source)

String displayname = s.getRealm(realm).description
logger.warn("^^^^^^displayname2="+displayname)
logger.warn("^^^^^^displayname.discription2="+s.getRealm(realm).description)

return displayname



