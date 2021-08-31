-- WARNING: This is a permanent operation and the associated data will be permanently deleted!
-- Drop 'roles' column from internaluser
ALTER TABLE SOPENIDM.INTERNALUSER DROP COLUMN roles;

-- DB2 Tables can end up in a reorg pending state after ALTER commands.
-- This will reorganize the table and clear pending state
REORG table SOPENIDM.INTERNALUSER;
