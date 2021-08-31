/*
 * Copyright 2015-2018 ForgeRock AS. All Rights Reserved
 *
 * Use of this code requires a commercial software license with ForgeRock AS.
 * or with one of its affiliates. All use shall be exclusively subject
 * to such license between the licensee and ForgeRock AS.
 */

import org.forgerock.openidm.context.OriginResourceContext;

/**
 * Stores fields of the managed object in the ManagedObjectContext's fields map.
 */

if (context.containsContext(OriginResourceContext.class)) {
    def mosc = context.asContext(OriginResourceContext.class)
    for (String field : storedFields) {
        def fieldValue = value.get(field);
        // Only store the field if it is a String, meaning is is not already hashed.
        if (fieldValue.class == String) {
            mosc.setField(field, value.get(field))
        }
    }
}
