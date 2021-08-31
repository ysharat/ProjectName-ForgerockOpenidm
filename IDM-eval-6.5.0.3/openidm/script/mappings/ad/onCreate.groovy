
import org.slf4j.*;
import java.security.SecureRandom

final Logger logger = LoggerFactory.getLogger("logger");
logger.warn("^^^^^^^inside Oncreate.groovy for AD");

def SecureRandom random = new SecureRandom()
def password =""
String alphabet = "abcdefghijklmnopquerstuvwxyz0123456789"
for(int i = 0; i<32; i++){
    def index = random.nextInt(32)
    password += alphabet.charAt(index)
}
logger.warn("^^^^^^^inside Oncreate.groovy for AD password is "+password);
target.__PASSWORD__ = "Saibaba123"




