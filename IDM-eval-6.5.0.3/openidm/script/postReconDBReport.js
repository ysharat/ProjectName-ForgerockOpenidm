 logger.warn("\n\n^^^^^^^Start inside postReconDBReport.js");
 logger.warn("^^^^^^^postReconDBReport->target: "+target);
// gloabl gloabl, identityserver, loger, openidm, source ,target, displayTargetName
var x, y, ms = {}, template, Handlebars, reconReport, reconReports, targertObject, email, disabledCount =0,
activeCount = 0;

/*  Any mention of active vs disabled ... Active means NOT DISABLED*/
var active_disabled =[],active_missing = [], disabled_active = [], missing_active = [], disabled_missing=[], missing_disabled=[], disabled_disabled=[];
var displaySourceName;
var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
displaySourceName = "OpenIDM";

//logger.warn("^^^^^^^postReconDBReport : " +" ,,reconId="+reconId);
logger.warn("^^^^^^^postReconDBReport : " +"global.reconId= "+ global.reconId);

reconReports = openidm.query('audit/recon', {
    '_queryFilter': '/transactionId eq "' + global.reconId + '" and entryType eq "msRep"',
    '_fields': 'userId,status'
}).result;

logger.info("^^^^^^^^^^^^reconReports object array is  ="+reconReports);
logger.info((new Date()).toISOString +' [postReconnDBReport] found {} recon entries to review',reconReports.length);

for(x =0; x< reconReports.length; x+=1){
    reconReport =reconReports[x];
    if (reconReport.status === 'disabled_missing'){
        disabled_missing.push(reconReport.userId);
    } else if (reconReport.status === 'active_missing'){
        active_missing.push(reconReport.userId);
    }else if (reconReport.status === 'active_disabled'){
        active_disabled.push(reconReport.userId);
    }else if (reconReport.status === 'disabled_active'){
        disabled_active.push(reconReport.userId);
    }else if (reconReport.status === 'missing_disabled'){
        missing_disabled.push(reconReport.userId);
    }else if (reconReport.status === 'missing_active'){
        missing_active.push(reconReport.userId);
    }else if (reconReport.status === 'disabled_disabled'){
        disabled_disabled.push(reconReport.userId);
    }else if (reconReport.status === 'disabled_disabled'){
        disabledCount +=1
    }else if (reconReport.status === 'active_active'){
        activeCount +=1
    }
}
logger.warn("\n\n");
//logger.info((new Date()).toISOString +' [postReconnDBReport] {} disabled_missing found',disabled_missing.length);
logger.info((new Date()).toISOString +' [postReconnDBReport] {} disabled_missing found',disabled_missing.length);
logger.info((new Date()).toISOString +' [postReconnDBReport] {} active_missing found',active_missing.length);
logger.info((new Date()).toISOString +' [postReconnDBReport] {} active_disabled found',active_disabled.length);
logger.info((new Date()).toISOString +' [postReconnDBReport] {} disabled_active found',disabled_active.length);
logger.info((new Date()).toISOString +' [postReconnDBReport] {} missing_disabled found',missing_disabled.length);
logger.info((new Date()).toISOString +' [postReconnDBReport] {} missing_active found',missing_active.length);
logger.info((new Date()).toISOString +' [postReconnDBReport] {} disabled_disabled found',disabledCount);
logger.info((new Date()).toISOString +' [postReconnDBReport] {} active_active found',activeCount);
logger.warn("\n\n");


////////////
/* Assing variables to the global object*/
ms.runDate = (new Date(global.startTime)).getDate() + ' ' + monthNames[(new Date(global.startTime)).getMonth()] + ' ' + (new Date(global.startTime)).getFullYear();
ms.displaySourceName = displaySourceName;
ms.displayTargetName = displayTargetName;
ms.disabled_missing = disabled_missing;
ms.active_missing = active_missing;
ms.active_disabled = active_disabled;
ms.disabled_active = disabled_active;
ms.missing_disabled = missing_disabled;
ms.missing_active = missing_active;
ms.disabledCount = disabledCount;
ms.activeCount = activeCount;
ms.reconReport = reconReport;

/* if there is a configurration found assume that it has  been properly configured */
if (openidm.read("config/external.email")) {
    email = {
        from: '"Reconciliation Statistics Report" <noreply@ms.com>',
        to: 'ysharat@gmail.com',
        subject: '[dev] Reconciliation Statistics Report for ' + displaySourceName + ' to ' + displayTargetName,
        type: 'text/html'
    };
    global.elaspedTimeMinutes = Math.floor((Date.parse(global.endTime) - Date.parse(global.startTime)) / 60.0) / 1000;
    source.durationMinutes = Math.floor(source.duration / 60.0) / 1000;
    source.entryListDurationSeconds = Math.floor(source.entryListDuration * 1000.0 / 1000) / 1000;
    target.durationMinutes = Math.floor(target.duration / 60.0) / 1000;
    target.entryListDurationSeconds = Math.floor(target.entryListDuration * 1000.0 / 1000) / 1000.0;

    load(identityServer.getInstallLocation() + '/bin/defaults/script/lib/handlebars.js');
    Handlebars.registerHelper('each_upto', function (ary, max, options) {
        var result = [], i;
        if (!ary || ary.length === 0) {
            return options.inverse(this);
        }
        for (i = 0; i < max&& i < ary.length; i += 1) {
            result.push(options.info(ary[i]));
        }
        return result.join('');
    });
    Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
        switch (operator) {
            case '===':
                return (v1 === v2) ? options.info(this) : options.inverse(this);
             case '<':
                return (v1 < v2) ? options.info(this) : options.inverse(this);
            case '<=':
                return (v1 <= v2) ? options.info(this) : options.inverse(this);
            case '>':
                return (v1 > v2) ? options.info(this) : options.inverse(this);
            case '>=':
                return (v1 >= v2) ? options.info(this) : options.inverse(this);
            case '&&':
                return (v1 && v2) ? options.info(this) : options.inverse(this);
            case '||':
                return (v1 || v2) ? options.info(this) : options.inverse(this);
                default:
                    return options.inverse(this);
        }
    });
    template = Handlebars.compile(readFile(identityServer.getProjectLocation() + '/script/templates/postRecondReport.mustache'));

    email._body = template({
        "global": global,
        "source": source,
        "target": target,
        "ms" : ms 
    });

    logger.info((new Date()).toISOString() + ' [postReconDBReport] Recon report for ' + global.mappingName + ' sent to {}', email.to);
    
    
    logger.warn("\n\n");
    logger.info("-------------------------*********1");
    logger.info(active_disabled.length+" Active in "+displaySourceName +", Disabled in "+displayTargetName);
    logger.info(active_missing.length+" Active in "+displaySourceName +", Not in "+displayTargetName);
    logger.info(disabled_active.length+" Disabled in "+displaySourceName +", Active in "+displayTargetName);
    logger.info(missing_active.length+" Not in "+displaySourceName +", Active in "+displayTargetName);
    logger.info("Accounts Match "+activeCount +" Active, "+disabledCount +" disabledcount");

    
    logger.info("\n start.....active_disabled, Active in "+displaySourceName +", Disabled in "+displayTargetName);
    for(var i=0;i<active_disabled.length;i++){
        logger.warn(active_disabled[i]);   
        }

    logger.info("\n--start********* active_missing, Active in "+displaySourceName +", Not in "+displayTargetName);
    for(var i=0;i<active_missing.length;i++){
        logger.warn(active_missing[i]);   
         }
         
    logger.info("\n---start*** disabled_active, Disapled in "+displaySourceName +", Active in "+displayTargetName);
    for(var i=0;i<disabled_active.length;i++){
        logger.warn(disabled_active[i]);   
         }

    logger.info("\n--start** missing_active, Not in "+displaySourceName +", Active in "+displayTargetName);
    for(var i=0;i<missing_active.length;i++){
        logger.warn(missing_active[i]);   
        }
    
    logger.info("\n--start** disabled_missing, Disabled in "+displaySourceName +", Not in "+displayTargetName);
    for(var i=0;i<disabled_missing.length;i++){
        logger.warn(disabled_missing[i]);   
        }

    logger.info("\n--start** missing_disabled, Not in "+displaySourceName +", Disabled in "+displayTargetName);
    for(var i=0;i<missing_disabled.length;i++){
        logger.warn(missing_disabled[i]);   
        }

        logger.info("\n--start** disabled_disabled");
        for(var i=0;i<disabled_disabled.length;i++){
            logger.warn(disabled_disabled[i]);   
            }
    
    
    
    

    // logger.info(active_disabled.length+" Active in "+displaySourceName +", Disabled in "+displayTargetName);
    // logger.info(active_disabled.length+" Active in "+displaySourceName +", Disabled in "+displayTargetName);
    // logger.info(active_disabled.length+" Active in "+displaySourceName +", Disabled in "+displayTargetName);
    logger.warn("\n\n");

    //openidm.action("external/email", "send", email);
    //logger.warn("sent email function already called .....");

} else {
    logger.info((new Date()).toISOString() + ' [postReconDBReport] Email Service not configured; Recon report not generated.');
}

////////////////////