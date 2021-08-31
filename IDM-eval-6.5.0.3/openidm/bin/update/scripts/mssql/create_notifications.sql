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
