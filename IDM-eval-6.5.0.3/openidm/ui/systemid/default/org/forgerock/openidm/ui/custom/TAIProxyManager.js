define("org/forgerock/openidm/ui/custom/TAIProxyManager", [
    "jquery",
    "underscore",
    "org/forgerock/commons/ui/common/main/AbstractConfigurationAware",
    "org/forgerock/commons/ui/common/main/ValidatorsManager",
    "org/forgerock/openidm/ui/custom/TAIProxyDelegate",
    "org/forgerock/commons/ui/common/main/Configuration",
    "org/forgerock/commons/ui/common/util/UIUtils"

], function ($, _, AbstractConfigurationAware, validators,TAIProxyDelegate) {
    console.log("inside systemidFolders TaiProxyManager1 ")
    var obj = new AbstractConfigurationAware();
    obj.initialized =false;
    obj.endpointDelegate = {};
    obj.taiQuery = function(name,realm,suppressEvents,successCallback, errorCallback){
        var queryPromise;
        console.log("inside Taiproxymanager.js taiquery method calling promise start");
        queryPromise = TAIProxyDelegate.taiQuery("eon_id",suppressEvents,successCallback, errorCallback);
        // .then(queryPromise).then(function(data){
        //     console.log("$$$$$$$$$ data2==="+JSON.stringify(data));
        // },function(jqXhr){
        //     console.log("$$$$$$$$$ jqXhr2==="+JSON.stringify(jqXhr));
        // });

        console.log("inside Taiproxymanager.js taiquery method promise end");
        return queryPromise;
    }
    console.log("coming to call end return obj...")
    return obj;
});