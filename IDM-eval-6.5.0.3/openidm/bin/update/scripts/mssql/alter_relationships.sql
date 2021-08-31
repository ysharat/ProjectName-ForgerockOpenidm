-- WARNING: This is a permanent operation and the associated data will be permanently deleted!
GO
USE [openidm]
GO

-- Drop 'properties' column from relationships
ALTER TABLE [openidm].[relationships] DROP COLUMN properties;

GO
USE [master]
GO