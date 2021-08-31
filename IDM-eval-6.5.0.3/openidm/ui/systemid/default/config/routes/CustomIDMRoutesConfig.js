define("config/routes/CustomIDMRoutesConfig", [
], function() {
console.log("inside systemidFolders CustomIDMRoutesConfig ");
    var obj = {
        "helloWorldView" : {
            view: "org/forgerock/openidm/ui/custom/CreateSystemID",
            role: "ui-user",
            url: "CreateSystemID/"
        }
    };

    return obj;
});