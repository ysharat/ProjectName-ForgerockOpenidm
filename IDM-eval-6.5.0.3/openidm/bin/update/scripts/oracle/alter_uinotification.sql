-- Alter uinotification schema
ALTER TABLE uinotification
 MODIFY COLUMN createDate VARCHAR2(38 CHAR) NOT NULL;