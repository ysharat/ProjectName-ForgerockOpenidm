/*
 * Copyright 2016-2018 ForgeRock AS. All Rights Reserved
 *
 * Use of this code requires a commercial software license with ForgeRock AS.
 * or with one of its affiliates. All use shall be exclusively subject
 * to such license between the licensee and ForgeRock AS.
 */

/*global require, openidm, exports */

(function () {
    exports.setDefaultFields = function (object) {

        if (!object.accountStatus) {
            object.accountStatus = 'active';
        }

        if (!object.authzRoles) {
            object.authzRoles = [
                {
                    "_ref": "internal/role/openidm-authorized"
                }
            ];
        }

        /* uncomment to randomly generate passwords for new users
         if (!object.password) {

         // generate random password that aligns with policy requirements
         object.password = require("crypto").generateRandomString([
         { "rule": "UPPERCASE", "minimum": 1 },
         { "rule": "LOWERCASE", "minimum": 1 },
         { "rule": "INTEGERS", "minimum": 1 },
         { "rule": "SPECIAL", "minimum": 1 }
         ], 16);

         }
         */
    };

    /**
     * Sends an email to the passed object's provided `mail` address via idm system email (if configured).
     *
     * @param object -- managed user
     */
    exports.emailUser = function (object) {
        // if there is a configuration found, assume that it has been properly configured
        var emailConfig = openidm.read("config/external.email"), Handlebars = require('lib/handlebars'),
            emailTemplate = openidm.read("config/emailTemplate/welcome");

        if (emailConfig && emailConfig.host && emailTemplate && emailTemplate.enabled) {
            // Since email service is configured, check that 'mail' property is present on object before attempting send
            if (object.mail) {
                var email,
                    template,
                    locale = emailTemplate.defaultLocale;

                email =  {
                    "from": emailTemplate.from || emailConfig.from,
                    "to": object.mail,
                    "subject": emailTemplate.subject[locale],
                    "type": "text/html"
                };

                template = Handlebars.compile(emailTemplate.message[locale]);

                email.body = template({
                    "object": object
                 });

                // do NOT wait for completion, so that this call will succeed even if email fails to send
                return openidm.action("external/email", "send", email, { waitForCompletion: false });
            } else {
                logger.info("Mail property not set for the user object; "
                    + "the user was created but was not notified. Username: {}", object.userName);
            }
        }
    };
}());
