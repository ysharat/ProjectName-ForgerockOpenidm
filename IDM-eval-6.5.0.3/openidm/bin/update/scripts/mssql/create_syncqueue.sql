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
