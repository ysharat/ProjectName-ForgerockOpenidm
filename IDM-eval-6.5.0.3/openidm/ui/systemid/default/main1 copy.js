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
   
    "paths": {
        "jquery": "libs/jquery-2.2.4-min", 
        "lodash": "libs/lodash-3.10.1-min",
        "bootstrap": "libs/bootstrap-3.4.1-custom",
        "backbone": "libs/backbone-1.1.2-min",
        "form2js": "libs/form2js-2.0-769718a",
        "i18next": "libs/i18next-1.7.3-min",
        "handlebars": "libs/handlebars-4.5.3.js",
        "underscore": "libs/underscore-min"
    }

});
 require(['home'],function(Y){
    console.log("coming here inside main1");
     Y.doSomething();
 });

