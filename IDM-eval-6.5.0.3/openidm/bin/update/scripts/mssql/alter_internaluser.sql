-- WARNING: This is a permanent operation and the associated data will be permanently deleted!
GO
USE [openidm]
GO

-- Drop 'roles' column from internaluser
ALTER TABLE [openidm].[internaluser] DROP COLUMN roles;

GO
USE [master]
GO
