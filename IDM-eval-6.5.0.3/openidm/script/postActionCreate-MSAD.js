
//gloabl source,openidm,logger
//var mapping =global.mappingName.split("_");
logger.warn("^^^^^^^inside postActionCreate-MSAD.js, source is ="+source);
//logger.warn("inside postActionCreate-MSAD-warn"+global.mappingName);

var groups, x, MSADType, nkwpGo, accountName, patch, results;
//groups = ["CN-PSO-MSADQA-NKWP-ENROLL,OU=Temp,OU-AD,OU-Workspaces,OU-Service Management,DC-msadqa,DC=msrootqa,DC=ms,DC=com","CN-PSO-MSADQA-NKWP-PwdPolicy,OU=Temp,OU-AD,OU-Workspaces,OU-Service Management,DC-msadqa,DC=msrootqa,DC=ms,DC=com"]
groups = ["CN=Group_DBA,OU=GroupsYSB,DC=mydmn,DC=com"]

nkwpGo = true

for (x = 0; x < source.realms.length; x += 1) {
    if (source.realms[x].realm === "MSAD.MS.COM") {
        MSADType = source.realms[x].type;
        break;
    }
}
if (MSADType === 'Group_DBA' && nkwpGo) {
    accountName = source.name;
    patch = [{
        "operator" : "add",
        "field" : "/idapGroups/-",
        "value" : groups
    }];

    results = openidm.query("system/openICFMSAD/account", {
        '_queryFilter' : 'sAMAccountName eq "' + accountName + '"'
    }).result;

    if (results.length) {
        openidm.patch("system/openICFMSAD/account/" + results[0]._id, null, patch);
    } 
}



