-- -----------------------------------------------------
-- Table `openidm`.`metaobjects`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `openidm`.`metaobjects` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT ,
  `objecttypes_id` BIGINT UNSIGNED NOT NULL ,
  `objectid` VARCHAR(255) NOT NULL ,
  `rev` VARCHAR(38) NOT NULL ,
  `fullobject` MEDIUMTEXT NULL ,
  INDEX `fk_metaobjects_objecttypes` (`objecttypes_id` ASC) ,
  PRIMARY KEY (`id`) ,
  UNIQUE INDEX `idx_metaobjects_object` (`objecttypes_id` ASC, `objectid` ASC) ,
  CONSTRAINT `fk_metaobjects_objecttypes`
    FOREIGN KEY (`objecttypes_id` )
    REFERENCES `openidm`.`objecttypes` (`id` )
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `openidm`.`metaobjectproperties`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `openidm`.`metaobjectproperties` (
  `metaobjects_id` BIGINT UNSIGNED NOT NULL ,
  `propkey` VARCHAR(255) NOT NULL ,
  `proptype` VARCHAR(32) NULL ,
  `propvalue` VARCHAR(2000) NULL ,
  PRIMARY KEY (`metaobjects_id`, `propkey`),
  INDEX `fk_metaobjectproperties_metaobjects` (`metaobjects_id` ASC) ,
  INDEX `idx_metaobjectproperties_propkey` (`propkey` ASC) ,
  INDEX `idx_metaobjectproperties_propvalue` (`propvalue`(255) ASC) ,
  CONSTRAINT `fk_metaobjectproperties_metaobjects`
    FOREIGN KEY (`metaobjects_id` )
    REFERENCES `openidm`.`metaobjects` (`id` )
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


START TRANSACTION;
-- -----------------------------------------------------
-- Migrate user meta data
-- -----------------------------------------------------
INSERT INTO `openidm`.`metaobjects` (`objecttypes_id`, `objectid`, `rev`, `fullobject`)
  SELECT `objecttypes_id`, `objectid`, `rev`, `fullobject`
  FROM `openidm`.`genericobjects`
    WHERE `objecttypes_id` = (SELECT `id` FROM `openidm`.`objecttypes` WHERE `objecttype` = 'internal/usermeta');

INSERT INTO `openidm`.`metaobjectproperties` (`metaobjects_id`, `propkey`, `proptype`, `propvalue`)
  SELECT `metaobjects`.`id`, `genericobjectproperties`.`propkey`, `genericobjectproperties`.`proptype`, `genericobjectproperties`.`propvalue`
  FROM `openidm`.`metaobjects`
  JOIN `openidm`.`genericobjects` ON `metaobjects`.`objectid` = `genericobjects`.`objectid`
    AND `metaobjects`.`objecttypes_id` = `genericobjects`.`objecttypes_id`
  JOIN `openidm`.`genericobjectproperties` ON `genericobjects`.`id` = `genericobjectproperties`.`genericobjects_id`;


-- -----------------------------------------------------
-- Remove old user meta data
-- WARNING: This is a permanent operation and the associated data will be permanently deleted!
-- -----------------------------------------------------
DELETE FROM `openidm`.`genericobjects`
  WHERE `objectid` IN (SELECT `objectid` FROM `openidm`.`metaobjects`)
  AND `objecttypes_id` = (SELECT `id` FROM `openidm`.`objecttypes` WHERE `objecttype` = 'internal/usermeta');
COMMIT;
