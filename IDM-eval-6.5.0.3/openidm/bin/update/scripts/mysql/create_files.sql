-- -----------------------------------------------------
-- Table `openidm`.`files`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `openidm`.`files` (
  `objectid` VARCHAR(38) NOT NULL ,
  `rev` VARCHAR(38) NOT NULL ,
  `content` LONGTEXT ,
  PRIMARY KEY (`objectid`) )
ENGINE = InnoDB;
