define("org/forgerock/openidm/ui/custom/HelloWorldView", [
    "org/forgerock/commons/ui/common/main/AbstractView",
    "org/forgerock/commons/ui/common/main/Configuration",
    "org/forgerock/commons/ui/common/util/UIUtils"

 ], function(AbstractView) {
    console.log("inside my helloworldviewJS")
    var HelloWorldView = AbstractView.extend({
        template: "templates/custom/HelloWorld.html",
        baseTemplate: "templates/common/MediumBaseTemplate.html",
        events: {

        }

    });
    return new HelloWorldView();
});