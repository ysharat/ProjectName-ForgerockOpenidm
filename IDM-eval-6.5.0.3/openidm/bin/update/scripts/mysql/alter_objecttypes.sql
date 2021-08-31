-- Alter objecttypes schema
ALTER TABLE openidm.objecttypes
 MODIFY COLUMN `objecttype` VARCHAR(255) NOT NULL;
