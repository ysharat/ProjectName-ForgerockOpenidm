//written by sharath 172916
define("org/forgerock/openidm/ui/common/delegates/MappingDelegate", [
    "org/forgerock/openidm/ui/common/util/Constants",
    "org/forgerock/commons/ui/common/main/SiteConfigurationDelegate",
    "org/forgerock/commons/ui/common/main/Configuration",
    "org/forgerock/commons/ui/common/main/EventManager"
 ], function(Constants, AbstractDelegate, configuration, eventManager) {

    var obj = new AbstractDelegate(Constants.host + "/" + Constants.context + "/config/mappings");

    obj.getConfiguration = function(successCallback, errorCallback) {
        var headers = {};
        //headers[Constants.HEADER_PARAM_USERNAME] = "anonymous";
        //headers[Constants.HEADER_PARAM_PASSWORD] = "anonymous";
        //headers[Constants.HEADER_PARAM_NO_SESSION] = "true";

        return obj.serviceCall({
            url: "",
            headers: headers
        }).then(function(data) {

            if(successCallback) {
                successCallback(data);
            }
            return data;
        }. errorCallback);
    };

    return obj;
});