/*
This script is basically a copy of the getRealmAttribute.js script. The 
purpose is to compare a realm attribute value in the "source" to the 
"oldSource" to determine changes, if any. Script returns "true" if there 
is a change or "false" if no changes...

In the event there is no "oldSource" then this event is NOT an implicit sync,
therefore we do not have a basis to determine if any difference detected wsa,
if fact, changed by us. We will simply return FALSE and not allow a change.

Variables:  
     sourceAttribute - Attribute to check (required)
     targetRealm - Realm to search for attribute (not defined searches base object)

*/
logger.warn("^^^^^^^Start inside hasAttributeChanged.js--1");
/*
(function () {
    logger.warn("^^^^^^^Start inside hasAttributeChanged.js--1");
    var x, oldSourceRealms, sourceRealms, oldSourceValue = null, sourceValue = null, hasAttributeChanged = false, hasOldSource = false;
    if (typeof oldSource !== "undefined" && oldSource !== null) {
        logger.warn("^^^^^^^Start inside hasAttributeChanged.js --2");
        hasOldSource = true;
        //lets go thru oldsource.realms
        if (typeof targetRealm !== "undefined" && targetRealm !== null) {
            oldSourceRealms = oldSource.realms;
            for (x = 0; x < oldSourceRealms.length; x+=1) {
                if (oldSourceRealms[x].realm == targetRealm) {
                    oldSourceValue = oldSourceRealms[x][sourceAttribute];
                    break;
                }
            }
        } else {
            //no targetRealm, then look at core object
            logger.warn("^^^^^^^Start inside hasAttributeChanged.js --3");
            oldSourceValue = oldSOurce[sourceAttribute];
        }
    }
        //lets go thru object.realms
    if (typeof targetRealm !== "undefined" && targetRealm !== null) {
        logger.warn("^^^^^^^Start inside hasAttributeChanged.js --4");
        sourceRealms = object.realms;
        for (x = 0; x < sourceRealms.length; x+=1) {
            if (sourceRealms[x].realm == targetRealm) {
                sourceValue = sourceRealms[x][sourceAttribute];
                logger.warn("^^^^^^^Start inside hasAttributeChanged.js --4-sourceValue="+sourceValue);
                break;
            }
        }
    } else {
        //no targetRealm, then look at core object
        logger.warn("^^^^^^^Start inside hasAttributeChanged.js --5");
        sourceValue = object[sourceAttribute];
    }
        //has the value changed?
    hasAttributeChanged = (hasOldSource && oldSourceValye !== sourceValue) ? true : false;
    // check if this a create secnario
    if (typeof oldSource === "undefined" || oldSource === null) {
        logger.warn("^^^^^^^Start inside hasAttributeChanged.js --6");
        var now = Math.round((new Date()).getTime() / 1000);

        // return true if creation_time is suficiently close to current time
        // signaling that this a create and we wnat the properties to flow to the targets
        logger.warn("^^^^^^^Start inside hasAttributeChanged.js --6.1="+(now - object.creation_time) < 120 ? true : false);
        hasAttributeChanged = (now - object.creation_time) < 120 ? true : false;
    }

    logger.debug('[hasAttributeChanged.js] has attribute "{}" changed={}', sourceAttribute, hasAttributeChanged);
    return hasAttributeChanged
}());

*/