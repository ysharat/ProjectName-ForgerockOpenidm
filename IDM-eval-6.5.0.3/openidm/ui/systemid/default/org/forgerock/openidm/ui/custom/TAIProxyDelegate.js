define("org/forgerock/openidm/ui/custom/TAIProxyDelegate", [
    "jquery",
    "underscore",
    "org/forgerock/commons/ui/common/main/AbstractConfigurationAware",
    "org/forgerock/commons/ui/common/main/ValidatorsManager",
    "org/forgerock/commons/ui/common/main/Configuration",
    "org/forgerock/commons/ui/common/util/UIUtils"

], function ($, _, AbstractConfigurationAware, validators) {
    console.log("inside TAIProxyDelegate.js ")
    var obj = function TAIProxyDelegate(){

    };
    obj.prototype.serviceCall = function(callParams){

        return obj.prototype.restCall(callParams);
    };
    obj.prototype.restCall =function(options){
        console.log("Inside rest call.....");
        return $.ajax(options);

    };
    
    obj.taiQuery = function(name,realm,suppressEvents,successCallback, errorCallback){
        console.log("inside TAIProxyDelegate.js taiquery method");
        return obj.prototype.serviceCall({
            url: "https://jsonplaceholder.typicode.com/users1",
            type: "GET",
            error: errorCallback,
            suppressEvents: suppressEvents
        });
        //return "test";
    }
    console.log("coming to call end return obj...")
    return obj;
});