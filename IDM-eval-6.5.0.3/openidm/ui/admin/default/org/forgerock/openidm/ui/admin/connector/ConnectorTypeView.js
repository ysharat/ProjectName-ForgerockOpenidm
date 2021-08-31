"use strict";

/*
 * Copyright 2014-2017 ForgeRock AS. All Rights Reserved
 *
 * Use of this code requires a commercial software license with ForgeRock AS.
 * or with one of its affiliates. All use shall be exclusively subject
 * to such license between the licensee and ForgeRock AS.
 */

define(["org/forgerock/openidm/ui/admin/connector/ConnectorTypeAbstractView"], function (ConnectorTypeAbstractView) {
    var ConnectorTypeView = ConnectorTypeAbstractView.extend({
        events: {
            "click .add-btn": "addField",
            "click .remove-btn": "removeField"
        }
    });

    return new ConnectorTypeView();
});
