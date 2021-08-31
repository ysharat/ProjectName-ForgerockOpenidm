GO
USE [openidm]
GO

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


BEGIN TRANSACTION
-- -----------------------------------------------------
-- Migrate user meta data
-- -----------------------------------------------------
INSERT INTO [openidm].[metaobjects] (objecttypes_id, objectid, rev, fullobject)
  SELECT objecttypes_id, objectid, rev, fullobject
  FROM [openidm].[genericobjects]
    WHERE objecttypes_id = (SELECT id FROM [openidm].[objecttypes] WHERE objecttype = 'internal/usermeta');

INSERT INTO [openidm].[metaobjectproperties] (metaobjects_id, propkey, proptype, propvalue)
  SELECT metaobjects.id, genericobjectproperties.propkey, genericobjectproperties.proptype, genericobjectproperties.propvalue
  FROM [openidm].[metaobjects]
  JOIN [openidm].[genericobjects] ON metaobjects.objectid = genericobjects.objectid
    AND metaobjects.objecttypes_id = genericobjects.objecttypes_id
  JOIN [openidm].[genericobjectproperties] ON genericobjects.id = genericobjectproperties.genericobjects_id;


-- -----------------------------------------------------
-- Remove old user meta data
-- WARNING: This is a permanent operation and the associated data will be permanently deleted!
-- -----------------------------------------------------
DELETE FROM [openidm].[genericobjects]
  WHERE objectid IN (SELECT objectid FROM [openidm].[metaobjects])
  AND objecttypes_id = (SELECT id FROM [openidm].[objecttypes] WHERE objecttype = 'internal/usermeta');

COMMIT

GO
USE [master]
GO