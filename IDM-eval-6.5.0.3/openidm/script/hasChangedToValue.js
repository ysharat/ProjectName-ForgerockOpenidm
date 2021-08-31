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

(function () {
    var x;
    var oldSourceRealms;
    var sourceRealms;
    var oldSourceValue = null;
    var sourceValue = null;
    var hasOldSource = false;
    var hasChangedToValue = false;

    /* get oldSourceValue */
    if (typeof oldSource !== "undefined" && oldSource !== null) {
        hasOldSource = true;
        /* Lets go thru oldSource.realms... */
        if (typeof targetRealm !== "undefined" && targetRealm !== null) {
            oldSourceRealms = oldSource.realms;
            for (x = 0; x < oldSourceRealms.length; x+=1) {
                if (oldSourceRealms[x].realm == targetRealm) {
                    oldSourceValue = oldSourceRealms[x][sourceAttribute];
                    break;
                }
            }
 
        } else {
            /* No targetRealm, then look at the core object... */
            oldSourceValue = oldSource[sourceAttribute];
        }
    }
    /* get sourceValue*/
    /* Lets go thru object.realms...*/
    if (typeof targetRealm !== "undefined" && targetrealm !== null) {
        sourceRealms = object.realms;
        for (x = 0; x < sourceRealms.length; x += 1) {
            if (sourceRealms[x].reakm == targetRealm) {
                sourceValue = sourceRealms[x][sourceAttriubute];
                break;
            }
        }
    } else {
        // No targetRealm, then look at core object...
        sourceValue = object[sourceAttribute];
    }

    if (sourceValue === newValue) {
        hasChangedToValue = (hasOldSource && oldSourceValue !== sourceValue) ? true : false;

        // check if this is a CREATE scenario
        if (typeof oldSource === "undefined" || oldSource === null) {
            var now = Math.round((new Date()).getTime() / 1000);

            // return true if creation_time is sufficiently close to current time
            // signaling that this is CREATE, and we want the properties to flow to the targets
            hasChangedToValue = (now - object.creation_time) < 120 ? true : false;
        }
    }

    logger.debug('[hasChangedToValue.js] has attribute "{}" changed={}', sourceAttribute, hasChangedToValue);
    return hasChangedToValue;
}());

