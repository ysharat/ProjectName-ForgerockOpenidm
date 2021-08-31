//write by sharath 172916
define("org/forgerock/openidm/ui/util/delegates/SiteConfigurationDelegate", [
    "jquery",
    "underscore",
    "org/forgerock/commons/ui/common/main/Configuration",
    "org/forgerock/openidm/ui/common/delegates/SiteConfigurationDelegate",
    "org/forgerock/commons/ui/common/components/Navigation"

 ], function($, _, conf, commonSiteConfigurationDelegate, nav) {

    var obj = commonSiteConfigurationDelegate;

    obj.admincheck = false;

    obj.checkForDifferences = function(){
        if(conf.loggedUser && _.contains(conf.loggedUser.uiroles,"ui-admin") && !obj.admincheck){
            nav.configuration.userBar.unshift({
                "id": "admin_link",
                "href": "/admin",
                "118nKey": "openidm.admin.label"
            });

            obj.admincheck = true;
        }

        nav.reload();
        return $.Deferred().resolve();
    };

    return obj;
});