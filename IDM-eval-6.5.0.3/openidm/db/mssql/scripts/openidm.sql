SET NUMERIC_ROUNDABORT OFF
GO
SET ANSI_PADDING,ANSI_WARNINGS,CONCAT_NULL_YIELDS_NULL,ARITHABORT,QUOTED_IDENTIFIER,ANSI_NULLS ON
GO

IF (NOT EXISTS (SELECT name FROM master.dbo.sysdatabases WHERE (name = N'openidm')))
-- -----------------------------------------------------
-- Database OpenIDM - case-sensitive and accent-sensitive
-- -----------------------------------------------------
CREATE DATABASE [openidm] COLLATE Latin1_General_100_CS_AS
GO
ALTER DATABASE [openidm] SET READ_COMMITTED_SNAPSHOT ON
GO
USE [openidm]
GO

-- -----------------------------------------------------
-- Login openidm
-- -----------------------------------------------------
IF (NOT EXISTS (select loginname from master.dbo.syslogins where name = N'openidm' and dbname = N'openidm'))
CREATE LOGIN [openidm] WITH PASSWORD=N'openidm', DEFAULT_DATABASE=[openidm], CHECK_EXPIRATION=OFF, CHECK_POLICY=OFF
GO

-- -----------------------------------------------------
-- User openidm - Database owner user
-- -----------------------------------------------------
IF (NOT EXISTS (select name from dbo.sysusers where name = N'openidm'))
CREATE USER [openidm]		  FOR LOGIN [openidm] WITH DEFAULT_SCHEMA = [openidm]
GO

-- -----------------------------------------------------
-- Schema openidm
-- -----------------------------------------------------
IF (NOT EXISTS (SELECT name FROM sys.schemas WHERE name = N'openidm'))
EXECUTE sp_executesql N'CREATE SCHEMA [openidm] AUTHORIZATION [openidm]'

EXEC sp_addrolemember N'db_owner', N'openidm'
GO

BEGIN TRANSACTION

-- -----------------------------------------------------
-- Table `openidm`.`objecttypes`
-- -----------------------------------------------------
IF NOT EXISTS (SELECT name FROM sysobjects where name='objecttypes' AND xtype='U')
BEGIN
CREATE  TABLE [openidm].[objecttypes]
(
  id NUMERIC(19,0) NOT NULL IDENTITY ,
  objecttype NVARCHAR(255) NOT NULL ,
  PRIMARY KEY CLUSTERED (id) ,
);
CREATE UNIQUE INDEX idx_objecttypes_objecttype ON [openidm].[objecttypes] (objecttype ASC);
END

-- -----------------------------------------------------
-- Table `openidm`.`genericobjects`
-- -----------------------------------------------------
IF NOT EXISTS (SELECT name FROM sysobjects where name='genericobjects' AND xtype='U')
BEGIN
CREATE  TABLE [openidm].[genericobjects]
(
  id NUMERIC(19,0) NOT NULL IDENTITY ,
  objecttypes_id NUMERIC(19,0) NOT NULL ,
  objectid NVARCHAR(255) NOT NULL ,
  rev NVARCHAR(38) NOT NULL ,
  fullobject NTEXT NULL ,

  CONSTRAINT fk_genericobjects_objecttypes
  	FOREIGN KEY (objecttypes_id)
  	REFERENCES [openidm].[objecttypes] (id)
  	ON DELETE CASCADE
  	ON UPDATE NO ACTION,
  PRIMARY KEY CLUSTERED (id),
);
CREATE UNIQUE INDEX idx_genericobjects_object ON [openidm].[genericobjects] (objecttypes_id ASC, objectid ASC);
CREATE INDEX fk_genericobjects_objecttypes ON [openidm].[genericobjects] (objecttypes_id ASC);
END

-- -----------------------------------------------------
-- Table `openidm`.`genericobjectproperties`
-- -----------------------------------------------------
IF NOT EXISTS (SELECT name FROM sysobjects where name='genericobjectproperties' AND xtype='U')
BEGIN
CREATE  TABLE [openidm].[genericobjectproperties]
(
  genericobjects_id NUMERIC(19,0) NOT NULL ,
  propkey NVARCHAR(255) NOT NULL ,
  proptype NVARCHAR(32) NULL ,
  propvalue NVARCHAR(195) NULL ,
  PRIMARY KEY CLUSTERED (genericobjects_id, propkey),
  CONSTRAINT fk_genericobjectproperties_genericobjects
    FOREIGN KEY (genericobjects_id)
    REFERENCES [openidm].[genericobjects] (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
);
CREATE INDEX fk_genericobjectproperties_genericobjects ON [openidm].[genericobjectproperties] (genericobjects_id ASC);
CREATE INDEX idx_genericobjectproperties_propkey ON [openidm].[genericobjectproperties] (propkey ASC);
CREATE INDEX idx_genericobjectproperties_propvalue ON [openidm].[genericobjectproperties] (propvalue ASC);
END


-- -----------------------------------------------------
-- Table `openidm`.`managedobjects`
-- -----------------------------------------------------
IF NOT EXISTS (SELECT name FROM sysobjects where name='managedobjects' AND xtype='U')
BEGIN
CREATE  TABLE [openidm].[managedobjects]
(
  id NUMERIC(19,0) NOT NULL IDENTITY ,
  objecttypes_id NUMERIC(19,0) NOT NULL ,
  objectid NVARCHAR(255) NOT NULL ,
  rev NVARCHAR(38) NOT NULL ,
  fullobject NTEXT NULL ,
  CONSTRAINT fk_managedobjects_objectypes
    FOREIGN KEY (objecttypes_id)
    REFERENCES [openidm].[objecttypes] (id )
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  PRIMARY KEY CLUSTERED (id),
);
CREATE UNIQUE INDEX idx_managedobjects_object ON [openidm].[managedobjects] (objecttypes_id ASC, objectid ASC);
CREATE INDEX fk_managedobjects_objectypes ON [openidm].[managedobjects] (objecttypes_id ASC);
END


-- -----------------------------------------------------
-- Table `openidm`.`managedobjectproperties`
-- -----------------------------------------------------
IF NOT EXISTS (SELECT name FROM sysobjects where name='managedobjectproperties' AND xtype='U')
BEGIN
CREATE  TABLE [openidm].[managedobjectproperties]
(
  managedobjects_id NUMERIC(19,0) NOT NULL ,
  propkey NVARCHAR(255) NOT NULL ,
  proptype NVARCHAR(32) NULL ,
  propvalue NVARCHAR(195) NULL ,
  PRIMARY KEY CLUSTERED (managedobjects_id, propkey),
  CONSTRAINT fk_managedobjectproperties_managedobjects
    FOREIGN KEY (managedobjects_id)
    REFERENCES [openidm].[managedobjects] (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
);
CREATE INDEX fk_managedobjectproperties_managedobjects ON [openidm].[managedobjectproperties] (managedobjects_id ASC);
CREATE INDEX idx_managedobjectproperties_propkey ON [openidm].[managedobjectproperties] (propkey ASC);
CREATE INDEX idx_managedobjectproperties_propvalue ON [openidm].[managedobjectproperties] (propvalue ASC);
END


-- -----------------------------------------------------
-- Table `openidm`.`configobjects`
-- -----------------------------------------------------
IF NOT EXISTS (SELECT name FROM sysobjects where name='configobjects' AND xtype='U')
BEGIN
CREATE  TABLE [openidm].[configobjects]
(
  id NUMERIC(19,0) NOT NULL IDENTITY ,
  objecttypes_id NUMERIC(19,0) NOT NULL ,
  objectid NVARCHAR(255) NOT NULL ,
  rev NVARCHAR(38) NOT NULL ,
  fullobject NTEXT NULL ,
  CONSTRAINT fk_configobjects_objecttypes
    FOREIGN KEY (objecttypes_id)
    REFERENCES [openidm].[objecttypes] (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  PRIMARY KEY CLUSTERED (id),
);
CREATE INDEX fk_configobjects_objecttypes ON [openidm].[configobjects] (objecttypes_id ASC);
CREATE UNIQUE INDEX idx_configobjects_object ON [openidm].[configobjects] (objecttypes_id ASC, objectid ASC);
END


-- -----------------------------------------------------
-- Table `openidm`.`configobjectproperties`
-- -----------------------------------------------------
IF NOT EXISTS (SELECT name FROM sysobjects where name='configobjectproperties' AND xtype='U')
BEGIN
CREATE  TABLE [openidm].[configobjectproperties] (
  configobjects_id NUMERIC(19,0) NOT NULL ,
  propkey NVARCHAR(255) NOT NULL ,
  proptype NVARCHAR(255) NULL ,
  propvalue NVARCHAR(195) NULL ,
  PRIMARY KEY CLUSTERED (configobjects_id, propkey),
  CONSTRAINT fk_configobjectproperties_configobjects
    FOREIGN KEY (configobjects_id)
    REFERENCES [openidm].[configobjects] (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
);
CREATE INDEX fk_configobjectproperties_configobjects ON [openidm].[configobjectproperties] (configobjects_id ASC);
CREATE INDEX idx_configobjectproperties_propkey ON [openidm].[configobjectproperties] (propkey ASC);
CREATE INDEX idx_configobjectproperties_propvalue ON [openidm].[configobjectproperties] (propvalue ASC);
END


-- -----------------------------------------------------
-- Table `openidm`.`notificationobjects`
-- -----------------------------------------------------
IF NOT EXISTS (SELECT name FROM sysobjects where name='notificationobjects' AND xtype='U')
BEGIN
CREATE  TABLE [openidm].[notificationobjects]
(
  id NUMERIC(19,0) NOT NULL IDENTITY ,
  objecttypes_id NUMERIC(19,0) NOT NULL ,
  objectid NVARCHAR(255) NOT NULL ,
  rev NVARCHAR(38) NOT NULL ,
  fullobject NTEXT NULL ,
  CONSTRAINT fk_notificationobjects_objecttypes
    FOREIGN KEY (objecttypes_id)
    REFERENCES [openidm].[objecttypes] (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  PRIMARY KEY CLUSTERED (id),
);
CREATE INDEX fk_notificationobjects_objecttypes ON [openidm].[notificationobjects] (objecttypes_id ASC);
CREATE UNIQUE INDEX idx_notificationobjects_object ON [openidm].[notificationobjects] (objecttypes_id ASC, objectid ASC);
END


-- -----------------------------------------------------
-- Table `openidm`.`notificationobjectproperties`
-- -----------------------------------------------------
IF NOT EXISTS (SELECT name FROM sysobjects where name='notificationobjectproperties' AND xtype='U')
BEGIN
CREATE  TABLE [openidm].[notificationobjectproperties] (
  notificationobjects_id NUMERIC(19,0) NOT NULL ,
  propkey NVARCHAR(255) NOT NULL ,
  proptype NVARCHAR(255) NULL ,
  propvalue NVARCHAR(195) NULL ,
  PRIMARY KEY CLUSTERED (notificationobjects_id, propkey),
  CONSTRAINT fk_notificationobjectproperties_notificationobjects
    FOREIGN KEY (notificationobjects_id)
    REFERENCES [openidm].[notificationobjects] (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
);
CREATE INDEX fk_notificationobjectproperties_notificationobjects ON [openidm].[notificationobjectproperties] (notificationobjects_id ASC);
CREATE INDEX idx_notificationobjectproperties_propkey ON [openidm].[notificationobjectproperties] (propkey ASC);
CREATE INDEX idx_notificationobjectproperties_propvalue ON [openidm].[notificationobjectproperties] (propvalue ASC);
END


-- -----------------------------------------------------
-- Table `openidm`.`relationships`
-- -----------------------------------------------------
IF NOT EXISTS (SELECT name FROM sysobjects where name='relationships' AND xtype='U')
BEGIN
CREATE  TABLE [openidm].[relationships]
(
  id NUMERIC(19,0) NOT NULL IDENTITY ,
  objecttypes_id NUMERIC(19,0) NOT NULL ,
  objectid NVARCHAR(255) NOT NULL ,
  rev NVARCHAR(38) NOT NULL ,
  fullobject NTEXT NULL ,
  firstresourcecollection NVARCHAR(255) ,
  firstresourceid NVARCHAR(56) ,
  firstpropertyname NVARCHAR(100) ,
  secondresourcecollection NVARCHAR(255) ,
  secondresourceid NVARCHAR(56) ,
  secondpropertyname NVARCHAR(100) ,
  CONSTRAINT fk_relationships_objecttypes
    FOREIGN KEY (objecttypes_id)
    REFERENCES [openidm].[objecttypes] (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  PRIMARY KEY CLUSTERED (id),
);
CREATE INDEX fk_relationships_objecttypes ON [openidm].[relationships] (objecttypes_id ASC);
CREATE INDEX idx_relationships_first_object ON [openidm].[relationships] (firstresourcecollection ASC, firstresourceid ASC, firstpropertyname ASC);
CREATE INDEX idx_relationships_second_object ON [openidm].[relationships] (secondresourcecollection ASC, secondresourceid ASC, secondpropertyname ASC);
CREATE UNIQUE INDEX idx_relationships_object ON [openidm].[relationships] (objecttypes_id ASC, objectid ASC);
END


-- -----------------------------------------------------
-- Table `openidm`.`relationshipproperties`
-- -----------------------------------------------------
IF NOT EXISTS (SELECT name FROM sysobjects where name='relationshipproperties' AND xtype='U')
BEGIN
CREATE  TABLE [openidm].[relationshipproperties] (
  relationships_id NUMERIC(19,0) NOT NULL ,
  propkey NVARCHAR(255) NOT NULL ,
  proptype NVARCHAR(255) NULL ,
  propvalue NVARCHAR(195) NULL ,
  PRIMARY KEY CLUSTERED (relationships_id, propkey),
  CONSTRAINT fk_relationshipproperties_relationships
    FOREIGN KEY (relationships_id)
    REFERENCES [openidm].[relationships] (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
);
CREATE INDEX fk_relationshipproperties_relationships ON [openidm].[relationshipproperties] (relationships_id ASC);
CREATE INDEX idx_relationshipproperties_propkey ON [openidm].[relationshipproperties] (propkey ASC);
CREATE INDEX idx_relationshipproperties_propvalue ON [openidm].[relationshipproperties] (propvalue ASC);
END

-- -----------------------------------------------------
-- Table `openidm`.`links`
-- -----------------------------------------------------
IF NOT EXISTS (SELECT name FROM sysobjects where name='links' AND xtype='U')
BEGIN
CREATE  TABLE  [openidm].[links]
(
  objectid NVARCHAR(38) NOT NULL ,
  rev NVARCHAR(38) NOT NULL ,
  linktype NVARCHAR(50) NOT NULL ,
  linkqualifier NVARCHAR(50) NOT NULL ,
  firstid NVARCHAR(255) NOT NULL ,
  secondid NVARCHAR(255) NOT NULL ,
  PRIMARY KEY CLUSTERED (objectid)
);
CREATE UNIQUE INDEX idx_links_first ON [openidm].[links] (linktype ASC, linkqualifier ASC, firstid ASC);
CREATE UNIQUE INDEX idx_links_second ON [openidm].[links] (linktype ASC, linkqualifier ASC, secondid ASC);
END


-- -----------------------------------------------------
-- Table `openidm`.`internaluser`
-- -----------------------------------------------------
IF NOT EXISTS (SELECT name FROM sysobjects where name='internaluser' and xtype='U')
BEGIN
CREATE  TABLE [openidm].[internaluser]
(
  objectid NVARCHAR(255) NOT NULL ,
  rev NVARCHAR(38) NOT NULL ,
  pwd NVARCHAR(510) NULL ,
  PRIMARY KEY CLUSTERED (objectid)
);
END


-- -----------------------------------------------------
-- Table `openidm`.`internalrole`
-- -----------------------------------------------------
IF NOT EXISTS (SELECT name FROM sysobjects where name='internalrole' and xtype='U')
BEGIN
CREATE  TABLE [openidm].[internalrole]
(
  objectid NVARCHAR(255) NOT NULL ,
  rev NVARCHAR(38) NOT NULL ,
  name NVARCHAR(64) ,
  description NVARCHAR(510) NULL ,
  temporalConstraints NVARCHAR(1024) NULL ,
  condition NVARCHAR(1024) NULL ,
  privs NTEXT NULL ,
  PRIMARY KEY CLUSTERED (objectid)
);
END

-- -----------------------------------------------------
-- Table `openidm`.`schedulerobjects`
-- -----------------------------------------------------
IF NOT EXISTS (SELECT name FROM sysobjects where name='schedulerobjects' AND xtype='U')
BEGIN
CREATE  TABLE [openidm].[schedulerobjects]
(
  id NUMERIC(19,0) NOT NULL IDENTITY ,
  objecttypes_id NUMERIC(19,0) NOT NULL ,
  objectid NVARCHAR(255) NOT NULL ,
  rev NVARCHAR(38) NOT NULL ,
  fullobject NTEXT NULL ,
  CONSTRAINT fk_schedulerobjects_objecttypes
    FOREIGN KEY (objecttypes_id)
    REFERENCES [openidm].[objecttypes] (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  PRIMARY KEY CLUSTERED (id),
);
CREATE INDEX fk_schedulerobjects_objecttypes ON [openidm].[schedulerobjects] (objecttypes_id ASC);
CREATE UNIQUE INDEX idx_schedulerobjects_object ON [openidm].[schedulerobjects] (objecttypes_id ASC, objectid ASC);
END


-- -----------------------------------------------------
-- Table `openidm`.`schedulerobjectproperties`
-- -----------------------------------------------------
IF NOT EXISTS (SELECT name FROM sysobjects where name='schedulerobjectproperties' AND xtype='U')
BEGIN
CREATE  TABLE [openidm].[schedulerobjectproperties] (
  schedulerobjects_id NUMERIC(19,0) NOT NULL ,
  propkey NVARCHAR(255) NOT NULL ,
  proptype NVARCHAR(32) NULL ,
  propvalue NVARCHAR(195) NULL ,
  PRIMARY KEY CLUSTERED (schedulerobjects_id, propkey),
  CONSTRAINT fk_schedulerobjectproperties_schedulerobjects
    FOREIGN KEY (schedulerobjects_id)
    REFERENCES [openidm].[schedulerobjects] (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
);
CREATE INDEX fk_schedulerobjectproperties_schedulerobjects ON [openidm].[schedulerobjectproperties] (schedulerobjects_id ASC);
CREATE INDEX idx_schedulerobjectproperties_propkey ON [openidm].[schedulerobjectproperties] (propkey ASC);
CREATE INDEX idx_schedulerobjectproperties_propvalue ON [openidm].[schedulerobjectproperties] (propvalue ASC);
END


-- -----------------------------------------------------
-- Table `openidm`.`clusterobjects`
-- -----------------------------------------------------
IF NOT EXISTS (SELECT name FROM sysobjects where name='clusterobjects' AND xtype='U')
BEGIN
CREATE  TABLE [openidm].[clusterobjects]
(
  id NUMERIC(19,0) NOT NULL IDENTITY ,
  objecttypes_id NUMERIC(19,0) NOT NULL ,
  objectid NVARCHAR(255) NOT NULL ,
  rev NVARCHAR(38) NOT NULL ,
  fullobject NTEXT NULL ,
  CONSTRAINT fk_clusterobjects_objecttypes
    FOREIGN KEY (objecttypes_id)
    REFERENCES [openidm].[objecttypes] (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  PRIMARY KEY CLUSTERED (id),
);
CREATE INDEX fk_clusterobjects_objecttypes ON [openidm].[clusterobjects] (objecttypes_id ASC);
CREATE UNIQUE INDEX idx_clusterobjects_object ON [openidm].[clusterobjects] (objecttypes_id ASC, objectid ASC);
END


-- -----------------------------------------------------
-- Table `openidm`.`clusterobjectproperties`
-- -----------------------------------------------------
IF NOT EXISTS (SELECT name FROM sysobjects where name='clusterobjectproperties' AND xtype='U')
BEGIN
CREATE  TABLE [openidm].[clusterobjectproperties] (
  clusterobjects_id NUMERIC(19,0) NOT NULL ,
  propkey NVARCHAR(255) NOT NULL ,
  proptype NVARCHAR(32) NULL ,
  propvalue NVARCHAR(195) NULL ,
  PRIMARY KEY CLUSTERED (clusterobjects_id, propkey),
  CONSTRAINT fk_clusterobjectproperties_clusterobjects
    FOREIGN KEY (clusterobjects_id)
    REFERENCES [openidm].[clusterobjects] (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
);
CREATE INDEX fk_clusterobjectproperties_clusterobjects ON [openidm].[clusterobjectproperties] (clusterobjects_id ASC);
CREATE INDEX idx_clusterobjectproperties_propkey ON [openidm].[clusterobjectproperties] (propkey ASC);
CREATE INDEX idx_clusterobjectproperties_propvalue ON [openidm].[clusterobjectproperties] (propvalue ASC);
END

-- -----------------------------------------------------
-- Table `openidm`.`clusteredrecontargetids`
-- -----------------------------------------------------
IF NOT EXISTS (SELECT name FROM sysobjects where name='clusteredrecontargetids' AND xtype='U')
BEGIN
CREATE  TABLE  [openidm].[clusteredrecontargetids]
(
  objectid NVARCHAR(38) NOT NULL ,
  rev NVARCHAR(38) NOT NULL ,
  reconid NVARCHAR(255) NOT NULL ,
  targetids NTEXT NOT NULL ,
  PRIMARY KEY CLUSTERED (objectid)
);
CREATE INDEX idx_clusteredrecontargetids_reconid ON [openidm].[clusteredrecontargetids] (reconid ASC);
END


-- -----------------------------------------------------
-- Table `openidm`.`uinotification`
-- -----------------------------------------------------
IF NOT EXISTS (SELECT name FROM sysobjects where name='uinotification' and xtype='U')
BEGIN
CREATE  TABLE [openidm].[uinotification] (
  objectid NVARCHAR(38) NOT NULL ,
  rev NVARCHAR(38) NOT NULL ,
  notificationtype NVARCHAR(255) NOT NULL ,
  createdate NVARCHAR(38) NOT NULL ,
  message NTEXT NOT NULL ,
  requester NVARCHAR(255) NULL ,
  receiverid NVARCHAR(255) NOT NULL ,
  requesterid NVARCHAR(255) NULL ,
  notificationsubtype NVARCHAR(255) NULL ,
  PRIMARY KEY CLUSTERED (objectid)
);
CREATE INDEX idx_uinotification_receiverid ON [openidm].[uinotification] (receiverid ASC);
END


-- -----------------------------------------------------
-- Table `openidm`.`updateobjects`
-- -----------------------------------------------------
IF NOT EXISTS (SELECT name FROM sysobjects where name='updateobjects' AND xtype='U')
BEGIN
CREATE  TABLE [openidm].[updateobjects]
(
  id NUMERIC(19,0) NOT NULL IDENTITY ,
  objecttypes_id NUMERIC(19,0) NOT NULL ,
  objectid NVARCHAR(255) NOT NULL ,
  rev NVARCHAR(38) NOT NULL ,
  fullobject NTEXT NULL ,

  CONSTRAINT fk_updateobjects_objecttypes
  	FOREIGN KEY (objecttypes_id)
  	REFERENCES [openidm].[objecttypes] (id)
  	ON DELETE CASCADE
  	ON UPDATE NO ACTION,
  PRIMARY KEY CLUSTERED (id),
);
CREATE UNIQUE INDEX idx_updateobjects_object ON [openidm].[updateobjects] (objecttypes_id ASC, objectid ASC);
CREATE INDEX fk_updateobjects_objecttypes ON [openidm].[updateobjects] (objecttypes_id ASC);
END

-- -----------------------------------------------------
-- Table `openidm`.`updateobjectproperties`
-- -----------------------------------------------------
IF NOT EXISTS (SELECT name FROM sysobjects where name='updateobjectproperties' AND xtype='U')
BEGIN
CREATE  TABLE [openidm].[updateobjectproperties]
(
  updateobjects_id NUMERIC(19,0) NOT NULL ,
  propkey NVARCHAR(255) NOT NULL ,
  proptype NVARCHAR(32) NULL ,
  propvalue NVARCHAR(195) NULL ,
  PRIMARY KEY CLUSTERED (updateobjects_id, propkey),
  CONSTRAINT fk_updateobjectproperties_updateobjects
    FOREIGN KEY (updateobjects_id)
    REFERENCES [openidm].[updateobjects] (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
);
CREATE INDEX fk_updateobjectproperties_updateobjects ON [openidm].[updateobjectproperties] (updateobjects_id ASC);
CREATE INDEX idx_updateobjectproperties_propkey ON [openidm].[updateobjectproperties] (propkey ASC);
CREATE INDEX idx_updateobjectproperties_propvalue ON [openidm].[updateobjectproperties] (propvalue ASC);
END


-- -----------------------------------------------------
-- Table `openidm`.`syncqueue`
-- -----------------------------------------------------
IF NOT EXISTS (SELECT name FROM sysobjects where name='syncqueue' AND xtype='U')
BEGIN
CREATE  TABLE [openidm].[syncqueue]
(
  objectid NVARCHAR(38) NOT NULL ,
  rev NVARCHAR(38) NOT NULL ,
  syncAction NVARCHAR(38) NOT NULL ,
  resourceCollection NVARCHAR(38) NOT NULL ,
  resourceId NVARCHAR(255) NOT NULL ,
  mapping NVARCHAR(255) NOT NULL ,
  objectRev NVARCHAR(38) NULL ,
  oldObject NTEXT NULL ,
  newObject NTEXT NULL ,
  context NTEXT NOT NULL ,
  state NVARCHAR(38) NOT NULL ,
  nodeId NVARCHAR(255) NULL,
  remainingRetries NVARCHAR(38) NOT NULL ,
  createDate NVARCHAR(38) NOT NULL ,
  PRIMARY KEY CLUSTERED (objectid) ,
);
CREATE INDEX idx_syncqueue_mapping_state_createdate ON [openidm].[syncqueue] (mapping ASC, state ASC, createDate ASC);
CREATE INDEX idx_syncqueue_mapping_retries ON [openidm].[syncqueue] (mapping ASC, remainingRetries ASC);
END

-- -----------------------------------------------------
-- Table `openidm`.`locks`
-- -----------------------------------------------------
IF NOT EXISTS (SELECT name FROM sysobjects where name='locks' AND xtype='U')
BEGIN
CREATE  TABLE  [openidm].[locks]
(
  objectid NVARCHAR(38) NOT NULL ,
  rev NVARCHAR(38) NOT NULL ,
  nodeid NVARCHAR(255),
  PRIMARY KEY CLUSTERED (objectid)
);
CREATE INDEX idx_locks_nodeid ON [openidm].[locks] (nodeid ASC);
END

-- -----------------------------------------------------
-- Table `openidm`.`files`
-- -----------------------------------------------------
IF NOT EXISTS (SELECT name FROM sysobjects where name='files' AND xtype='U')
BEGIN
CREATE  TABLE  [openidm].[files]
(
  objectid NVARCHAR(38) NOT NULL ,
  rev NVARCHAR(38) NOT NULL ,
  content NTEXT NULL,
  PRIMARY KEY CLUSTERED (objectid)
);
END


-- -----------------------------------------------------
-- Table `openidm`.`metaobjects`
-- -----------------------------------------------------
IF NOT EXISTS (SELECT name FROM sysobjects where name='metaobjects' AND xtype='U')
BEGIN
CREATE  TABLE [openidm].[metaobjects]
(
  id NUMERIC(19,0) NOT NULL IDENTITY ,
  objecttypes_id NUMERIC(19,0) NOT NULL ,
  objectid NVARCHAR(255) NOT NULL ,
  rev NVARCHAR(38) NOT NULL ,
  fullobject NTEXT NULL ,

  CONSTRAINT fk_metaobjects_objecttypes
  	FOREIGN KEY (objecttypes_id)
  	REFERENCES [openidm].[objecttypes] (id)
  	ON DELETE CASCADE
  	ON UPDATE NO ACTION,
  PRIMARY KEY CLUSTERED (id),
);
CREATE UNIQUE INDEX idx_metaobjects_object ON [openidm].[metaobjects] (objecttypes_id ASC, objectid ASC);
CREATE INDEX fk_metaobjects_objecttypes ON [openidm].[metaobjects] (objecttypes_id ASC);
END

-- -----------------------------------------------------
-- Table `openidm`.`metaobjectproperties`
-- -----------------------------------------------------
IF NOT EXISTS (SELECT name FROM sysobjects where name='metaobjectproperties' AND xtype='U')
BEGIN
CREATE  TABLE [openidm].[metaobjectproperties]
(
  metaobjects_id NUMERIC(19,0) NOT NULL ,
  propkey NVARCHAR(255) NOT NULL ,
  proptype NVARCHAR(32) NULL ,
  propvalue NVARCHAR(195) NULL ,
  PRIMARY KEY CLUSTERED (metaobjects_id, propkey),
  CONSTRAINT fk_metaobjectproperties_metaobjects
    FOREIGN KEY (metaobjects_id)
    REFERENCES [openidm].[metaobjects] (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
);
CREATE INDEX fk_metaobjectproperties_metaobjects ON [openidm].[metaobjectproperties] (metaobjects_id ASC);
CREATE INDEX idx_metaobjectproperties_propkey ON [openidm].[metaobjectproperties] (propkey ASC);
CREATE INDEX idx_metaobjectproperties_propvalue ON [openidm].[metaobjectproperties] (propvalue ASC);
END

USE [master]
GO
COMMIT;
