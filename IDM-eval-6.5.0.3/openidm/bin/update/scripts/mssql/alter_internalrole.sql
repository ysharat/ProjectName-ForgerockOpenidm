GO
USE [openidm]
GO
-- Add new columns to internalrole
ALTER TABLE [openidm].[internalrole]
ADD
  name NVARCHAR(64),
  temporalConstraints NVARCHAR(1024) NULL,
  condition NVARCHAR(1024) NULL,
  privs NTEXT NULL;

GO
USE [master]
GO
