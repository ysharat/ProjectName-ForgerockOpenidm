-- Add new columns to internalrole
ALTER TABLE SOPENIDM.INTERNALROLE
 ADD name                   VARCHAR(64)
 ADD temporalConstraints    VARCHAR(1024)
 ADD conditional            VARCHAR(1024)
 ADD privs                  CLOB(2M);

-- DB2 Tables can end up in a reorg pending state after ALTER commands.
-- This will reorganize the table and clear pending state
REORG table SOPENIDM.INTERNALROLE;
