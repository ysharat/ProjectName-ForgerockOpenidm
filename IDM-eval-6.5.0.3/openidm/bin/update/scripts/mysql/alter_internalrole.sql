-- Add new columns to internalrole
ALTER TABLE openidm.internalrole
 ADD COLUMN `name` VARCHAR(64) NULL,
 ADD COLUMN `temporalConstraints` VARCHAR(1024) NULL,
 ADD COLUMN `conditional` VARCHAR(1024) NULL,
 ADD COLUMN `privs` MEDIUMTEXT NULL;
