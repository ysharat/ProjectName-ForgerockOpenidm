GO
USE [openidm]
GO

-- Alter 'createdate' column in uinotification table
ALTER TABLE [openidm].[uinotification] ALTER COLUMN createdate NVARCHAR(38) NOT NULL;

GO
USE [master]
GO
