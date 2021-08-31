-- Alter 'createdate' column in uinotification table
ALTER TABLE SOPENIDM.UINOTIFICATION ALTER COLUMN CREATEDATE SET DATA TYPE VARCHAR(38);

-- DB2 Tables can end up in a reorg pending state after ALTER commands.
-- This will reorganize the table and clear pending state
REORG table SOPENIDM.UINOTIFICATION;