"use strict";

/*
 * Copyright 2014-2017 ForgeRock AS. All Rights Reserved
 *
 * Use of this code requires a commercial software license with ForgeRock AS.
 * or with one of its affiliates. All use shall be exclusively subject
 * to such license between the licensee and ForgeRock AS.
 */

// Place third party dependencies in the lib folder
//
// Configure loading modules from the lib directory,
requirejs.config({
   map: {
       "*" : {
                underscore: "lodash",
                ThemeManager:"org/forgerock/openidm/ui/common/util/ThemeManager",
                NavigationFilter:"org/forgerock/commons/ui/common/components/navigation/filters/RoleFilter"
       }
   },
    "paths": {
        "jquery": "libs/jquery-2.2.4-min", 
        "lodash": "libs/lodash-3.10.1-min",
        "i18next": "libs/i18next-1.7.3-min",
        "bootstrap": "libs/bootstrap-3.4.1-custom",
        "backbone": "libs/backbone-1.1.2-min",
        "handlebars": "libs/handlebars-4.5.3",
        "spin": "libs/spin-2.0.1-min",
        "form2js": "libs/form2js-2.0-769718a"
    },
    shim: {
        underscore: {
            exports: "_"
        },
        backbone: {
           deps: ["underscore"],
           exports: "Backbone"
        },
        handlebars: {
            exports: "handlebars"
        },
        bootstrap: {
            deps: ["jquery"]
        },
        spin: {
            exports: "spin"
        },
        i18next: {
            deps: ["jquery","handlebars"],
            exports: "i18next"
        }
    }

});
//  require(['home'],function(Y){
//     console.log("coming here inside main1");
//      Y.doSomething();
//  });


 require(["org/forgerock/commons/ui/common/util/Constants",
  "org/forgerock/commons/ui/common/main/EventManager",
  "org/forgerock/commons/ui/common/main",
  "org/forgerock/openidm/ui/util/delegates/SiteConfigurationDelegate",
  "org/forgerock/openidm/ui/common/delegates/MappingsDelegate",
  "config/main",
  "jquery",
  "underscore",
  "backbone",
  "handlebars",
  "i18next"
],function(Constants,EventManager){
    console.log("coming here inside main1");
     EventManager.sendEvent("EVENT_DEPENDENCIES_LOADED");
 });

