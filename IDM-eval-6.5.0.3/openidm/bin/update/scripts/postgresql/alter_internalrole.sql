-- Add new columns to internalrole
ALTER TABLE openidm.internalrole ADD COLUMN name VARCHAR(64) DEFAULT NULL;
ALTER TABLE openidm.internalrole ADD COLUMN temporalConstraints VARCHAR(1024) DEFAULT NULL;
ALTER TABLE openidm.internalrole ADD COLUMN condition VARCHAR(1024) DEFAULT NULL;
ALTER TABLE openidm.internalrole ADD COLUMN privs TEXT DEFAULT NULL;