/*
 * Copyright 2014-2017 ForgeRock AS. All Rights Reserved
 *
 * Use of this code requires a commercial software license with ForgeRock AS.
 * or with one of its affiliates. All use shall be exclusively subject
 * to such license between the licensee and ForgeRock AS.
 */
(function (mapping) {

    var _ = require('lib/lodash'),
        syncConfig = openidm.read("config/sync"),
        recon,
        mappingRecon;

    if (!syncConfig) {
        syncConfig = { "mappings" : [] };
        openidm.create("config","sync",syncConfig);
    }

    if (syncConfig.mappings) {
        recon = openidm.read("recon");

        _.each(syncConfig.mappings, function(m){
            if(!mapping || mapping === m.name){
                //this takes advantage of the fact that the reconciliations map is in reverse chronilogical order
                //we just need to grab the first recon matching our mapping
                _.forEachRight(recon.reconciliations, function (r) {
                    if (r.mapping === m.name && !m.recon) {
                        m.recon = r;
                    }
                });
            }
        });
    }

    return syncConfig;
}(
    request.additionalParameters.mapping
));
