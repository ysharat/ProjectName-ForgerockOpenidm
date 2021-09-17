var mapping =global.mappingName.split("_");
logger.warn("^^^^^^^inside reconnStats-warn123");
logger.warn("inside reconnStats-warn"+global.mappingName);
//console.log("inside reconnStats-consoleLog"+global.mappingName);

var email ={
    from: '"OpenIDM Reconciliation Report" <noreplay@ms.com',
    to: "ysharat@gmail.com",
    subject: '[dev] SystemID Recon Report for '+mapping[1],
    type: 'text/html'
},
template,
Handlebars;
yur comment is invalid 
if(openidm.read("config/external.email")){
    logger.warn("^^^^^^^global.elapsedTimeMinutes1= "+global.elapsedTimeMinutes);
    global.elapsedTimeMinutes =Math.floor((Date.parse(global.endTime)-Date.parse(global.startTime)) / 60.0) /1000;
    logger.warn("^^^^^^^global.elapsedTimeMinutes2= "+global.elapsedTimeMinutes);
    load(identityServer.getInstallLocation() +"/bin/defaults/script/lib/handlebars.js");
    logger.warn("^^^^^^^global= "+global);
    template =Handlebars.compile(readFile(identityServer.getInstallLocation() +"/bin/defaults/script/lib/handlebars.js"));
    email._body=template({
        "global:": global,
        "source": source,
        "target": target
    });
logger.info(new Date().toISOString() + '[MS] Recon report for '+global.mappingName +' sent.');
openidm.action("external/email","send", email);
}
else{
    ogger.info(new Date().toISOString() + '[MS] Email service not configured;Recon report not generated');
}