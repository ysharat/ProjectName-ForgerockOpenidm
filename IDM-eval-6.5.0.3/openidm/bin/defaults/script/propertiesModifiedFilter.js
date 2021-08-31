/*
 * Copyright 2018 ForgeRock AS. All Rights Reserved
 *
 * Use of this code requires a commercial software license with ForgeRock AS.
 * or with one of its affiliates. All use shall be exclusively subject
 * to such license between the licensee and ForgeRock AS.
 */

/**
 * Returns true if the incoming request is an update that does not modify password or a patch request that modifies
 * any of the given propertiesToCheck fields.
 */
(method === 'update' && content.password === undefined)
    || (method === 'patch'
        && patchOperations.reduce(
            function (exists, op) {
                return exists || propertiesToCheck.indexOf(op.field.replace(/^\/|\/-$/g, "")) > -1;
            },
            false))