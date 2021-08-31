define("config/routes/CustomIDMRoutesConfig", [
], function() {
    console.log("inside my customdimroutesconfigJS")
    var obj = {       
        "helloWorldView" : {
            view: "org/forgerock/openidm/ui/custom/HelloWorldView",
            role: "ui-user",
            url: "helloWorld/"
        }
    };

    return obj;
});