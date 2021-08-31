-- Alter uinotification schema
ALTER TABLE openidm.uinotification
 MODIFY COLUMN `createDate` VARCHAR(38) NOT NULL;
