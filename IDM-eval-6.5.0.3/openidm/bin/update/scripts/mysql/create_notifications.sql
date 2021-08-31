-- -----------------------------------------------------
-- Table `openidm`.`notificationobjects`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `openidm`.`notificationobjects` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT ,
  `objecttypes_id` BIGINT UNSIGNED NOT NULL ,
  `objectid` VARCHAR(255) NOT NULL ,
  `rev` VARCHAR(38) NOT NULL ,
  `fullobject` MEDIUMTEXT NULL ,
  INDEX `fk_notificationobjects_objecttypes` (`objecttypes_id` ASC) ,
  PRIMARY KEY (`id`) ,
  UNIQUE INDEX `idx_notificationobjects_object` (`objecttypes_id` ASC, `objectid` ASC) ,
  CONSTRAINT `fk_notificationobjects_objecttypes`
    FOREIGN KEY (`objecttypes_id` )
    REFERENCES `openidm`.`objecttypes` (`id` )
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `openidm`.`notificationobjectproperties`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `openidm`.`notificationobjectproperties` (
  `notificationobjects_id` BIGINT UNSIGNED NOT NULL ,
  `propkey` VARCHAR(255) NOT NULL ,
  `proptype` VARCHAR(32) NULL ,
  `propvalue` VARCHAR(2000) NULL ,
  PRIMARY KEY (`notificationobjects_id`, `propkey`),
  INDEX `fk_notificationobjectproperties_notificationobjects` (`notificationobjects_id` ASC) ,
  INDEX `idx_notificationobjectproperties_propkey` (`propkey` ASC) ,
  INDEX `idx_notificationobjectproperties_propvalue` (`propvalue`(255) ASC) ,
  CONSTRAINT `fk_notificationobjectproperties_notificationobjects`
    FOREIGN KEY (`notificationobjects_id` )
    REFERENCES `openidm`.`notificationobjects` (`id` )
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;
