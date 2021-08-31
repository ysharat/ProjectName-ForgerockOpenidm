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
