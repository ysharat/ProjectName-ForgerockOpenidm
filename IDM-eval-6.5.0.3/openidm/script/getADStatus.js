var sourceValue = ''
var targetValue = ''

if(source.realms){
    var userRealm = source.realms;
    for( var i=0;i<userRealm.length; i++){
        if (userRealm[i].realm == targetRealm){
            var sourceRealm =JSON.parse(userRealm[i]);
            sourceValueStr ="sourceRealm.disabled";
            sourceValue = eval(sourceValueStr);
            if(sourceValue == 0){
                targetValue = true;
            }
            else {
                targetValue = false;
            }
        }
    }
}
if(!source.realms){
    targetValue =false;
}
logger.warn("^^^^^^^targetValue "+targetValue);
targetValue;

