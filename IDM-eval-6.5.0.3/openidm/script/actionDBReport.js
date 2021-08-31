(function () {
    
    logger.warn("\n\n ^^^^^^^start inside actionDB.groovy"); 
    //logger.warn("^^^^^^^^target:"+target)
    //String resource="system/${target}/account"
    
    /*
    var samaccountname = source.msid
    var resource="system/openICFMSAD/account"
    var filter={"_queryFilter": "sAMAccountName eq \"" +samaccountname+"\""};
    logger.warn("^^^^^^^inside actionDB--filter for corelation"+JSON.stringify(filter));
    logger.warn("inside actionDB--corelation result->openidm.query result for "+"samaccountname ="+samaccountname +" result is::"+openidm.query(resource,filter));
    */

    var x, situation, reconId, target_resource, auditObject, retrun_value;
    var isSourceRealmDisabled = true, isTargetRealmDisabled = true, reporting_status = '', systemId = '',
        sourceRealmIndex = -1, patch = [];
    situation = recon.actionParam.situation;
    reconId = recon.actionParam.reconId;
    logger.warn("^^^situation: " + situation);
    //logger.warn("^^^^^^^^^^^^actionDBReport->reconId: "+reconId);
    target_resource = recon.actionParam.mapping.split("_")[1];
    //logger.warn("^^^actionDBReport->sitution is : " + situation + "\n *,source =" + source + " *,reconId= " + reconId + ", recon.actionParam.mapping: " + recon.actionParam.mapping + "*, target_resource: " + target_resource);
    //logger.warn("^^^actionDBReport->target: " + target);
    var targetRealm = "MSAD.MS.COM";

    /* ===================================== */
    /* Determine if the source realm is disabled */
    if (typeof source !== "undefined" && source !== null) {
        if (targetRealm === "ALL") {
            //The ALL targetrealm is really for FWD which affects all realms
            isSourceRealmDisabled = (source.accountStatus === 'inactive') ? true : false;
        }
        else {
            for (x = 0; x < source.realms.length; x += 1) {
                if (source.realms[x].realm === targetRealm) {
                    logger.warn("^^^^^^^^^^^^actionDBReport->line no 26 Inside if...");
                    sourceRealmIndex = x;
                    isSourceRealmDisabled = (source.realms[x].disabled === "1") ? true : false;
                    logger.warn("^^^^^^^^^^^^actionDBReport->isSourceRealmDisabled..." + isSourceRealmDisabled);
                    break;
                }
            }
        }
    }
    // Determine if the target realm is disabled    
    if (typeof target !== "undefined" && target !== null && typeof disabledTargetField !== "undefined") {
        logger.warn("^^^^^^^^^^^^actionDBReport->target..." + target);
        if (typeof target[disabledTargetField] !== "undefined" && typeof disabledTargetValue !== "undefined") {
            if (disabledTargetMode === "regexp") {
                logger.warn("^^^^^^^^^^^^actionDBReport->regexp...");
                isTargetRealmDisabled = new RegExp(disabledTargetValue).test(target[disabledTargetField]);
            }
            else if (disabledTargetMode === "standard") {
                logger.warn("^^^^^^^^^^^^actionDBReport->standard..."+" ,disabledTargetField="+disabledTargetField+" ,Target[disabledTargetField]="+target[disabledTargetField] +" ,disabledTargetValue=" +disabledTargetValue);
                isTargetRealmDisabled = (target[disabledTargetField] === disabledTargetValue)
                logger.warn("^^^^^^^^^^^^actionDBReport->isTargetRealmDisabled..." + isTargetRealmDisabled);
            }
        }
    }
    //
    if ((situation === "ABSENT" || situation === "MISSING") && source !== null) {
        systemId = (typeof source.name === "undefined" || source.name === null) ? '_id=' + source._id : source.name;
        logger.warn("^^^actionDBReport->systemId absent or missing: " + systemId);
        if (isSourceRealmDisabled) {
            reporting_status = 'disabled_missing';
        }
        else {
            reporting_status = 'active_missing';
        }
    }
    else if ((situation === "FOUND" || situation === "CONFIRMED") && source !== null && target !== null) {
        systemId = (typeof source.name === "undefined" || source.name === null) ? '_id=' + source._id : source.name;
        logger.warn("^^^actionDBReport->systemId found or Confirmed: " + systemId);
        if (!isSourceRealmDisabled && isTargetRealmDisabled) {
            reporting_status = 'active_disabled';
            logger.warn("^^^actionDBReport->systemId FOUND or CONFIRMED: " + systemId + "::" + reporting_status);
        }
        else if (isSourceRealmDisabled && !isTargetRealmDisabled) {
            reporting_status = 'disabled_active';
            logger.warn("^^^actionDBReport->systemId FOUND or CONFIRMED: " + systemId + "::" + reporting_status);
        }
        else if (isSourceRealmDisabled && isTargetRealmDisabled) {
            reporting_status = 'disabled_disabled';
            logger.warn("^^^actionDBReport->systemId FOUND or CONFIRMED: " + systemId + "::" + reporting_status);
            logger.warn("^^^^^^^^^^^^actionDBReport isSourceRealmDisabled ="+isSourceRealmDisabled +", isTargetRealmDisabled="+isTargetRealmDisabled);
        }
        else if (!isSourceRealmDisabled && !isTargetRealmDisabled) {
            reporting_status = 'active_active';
            logger.warn("^^^actionDBReport->systemId FOUND or CONFIRMED: " + systemId + "::" + reporting_status);
            
        }


    }
    else if ((situation === "SOURCE_MISSING" || situation === "UNASSIGNED") && target !== null) {

        logger.warn("\n\n\^^^target value in case of source missing is "+ target);

        if (typeof displayTargetField === "undefined") {
            systemId = '_id=' + target._id;
            logger.warn("^^^actionDBReport->systemId SOURCE_MISSING or UNASSIGNED:1 " + systemId + "::" + reporting_status);
        }
        else if (typeof target[displayTargetField] === "undefined" || target[displayTargetField] === null) {
            systemId = '_id=' + target._id;
            logger.warn("^^^actionDBReport->systemId SOURCE_MISSING or UNASSIGNED:2 " + systemId + "::" + reporting_status);
        }
        else {
            systemId = target[displayTargetField];
            logger.warn("^^^actionDBReport->systemId SOURCE_MISSING or UNASSIGNED:3 " + systemId + "::" + reporting_status);
        }
        if (isTargetRealmDisabled) {
            reporting_status = 'missing_disabled';
            logger.warn("^^^actionDBReport->systemId SOURCE_MISSING or UNASSIGNED:4 " + systemId + "::" + reporting_status);
        } else {
            reporting_status = 'missing_active';
            logger.warn("^^^actionDBReport->systemId SOURCE_MISSING or UNASSIGNED:5 " + systemId + "::" + reporting_status);
        }

    }
    else if (situation === "SOURCE_IGNORED" || situation === "UNQUALIFIED") {
        systemId = (typeof source.name === "undefined" || source.name === null) ? '_id=' + source._id : source.name;
        logger.warn("^^^actionDBReport->systemId SOURCE_IGNORED or UNQUALIFIED: " + systemId + "::" + reporting_status);
        
    }


    //Add msRep to recon table for processing in the postRecon process
    if (reporting_status !== '' && systemId !== '') {
        auditObject = {
            "transactionId": reconId,
            "timestamp": (new Date()).toISOString(),
            "userId": systemId,
            "status": reporting_status,
            "entryType": "msRep"
        }

        logger.warn("^^^^^^^actionDBReport->entering to create audit record in DB auditObject is= " + JSON.stringify(auditObject));
        openidm.create('audit/recon', null, auditObject);
        //logger.warn("auditresp= "+auditresp);
    }


    // return action for reconsstatsonly mappings
    if (situation === "FOUND") {
        retrun_value = 'LINK';
    }
    else {
        retrun_value = 'REPORT';
    }

    if (situation === "MISSING") {
        logger.warn('ActionDb Report, Pls investiage if systemid also needs to be removed from local repo='+ situation +"::"+ source.name);
        logger.warn('[actionDBReport.js] Situation {} discovered for systemID {}, Pls investiage if systemid also needs to be removed from local repo', situation, source.name);
    }

    logger.debug('[actionDBReport.js] Returning ACTION ={}', retrun_value);
    logger.info("DBActionReport.js _____-------------------------******************************&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& systemId="+systemId +"\n\n");
    return retrun_value;
}())