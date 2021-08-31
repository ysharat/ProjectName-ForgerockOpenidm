SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL';

CREATE SCHEMA IF NOT EXISTS `openidm` DEFAULT CHARACTER SET utf8 COLLATE utf8_bin ;
USE `openidm` ;

-- -----------------------------------------------------
-- Table `openidm`.`objecttypes`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `openidm`.`objecttypes` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT ,
  `objecttype` VARCHAR(255) NOT NULL ,
  PRIMARY KEY (`id`) ,
  UNIQUE INDEX `idx_objecttypes_objecttype` (`objecttype` ASC) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `openidm`.`genericobjects`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `openidm`.`genericobjects` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT ,
  `objecttypes_id` BIGINT UNSIGNED NOT NULL ,
  `objectid` VARCHAR(255) NOT NULL ,
  `rev` VARCHAR(38) NOT NULL ,
  `fullobject` MEDIUMTEXT NULL ,
  INDEX `fk_genericobjects_objecttypes` (`objecttypes_id` ASC) ,
  PRIMARY KEY (`id`) ,
  UNIQUE INDEX `idx_genericobjects_object` (`objecttypes_id` ASC, `objectid` ASC) ,
  CONSTRAINT `fk_genericobjects_objecttypes`
    FOREIGN KEY (`objecttypes_id` )
    REFERENCES `openidm`.`objecttypes` (`id` )
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `openidm`.`genericobjectproperties`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `openidm`.`genericobjectproperties` (
  `genericobjects_id` BIGINT UNSIGNED NOT NULL ,
  `propkey` VARCHAR(255) NOT NULL ,
  `proptype` VARCHAR(32) NULL ,
  `propvalue` VARCHAR(2000) NULL ,
  PRIMARY KEY (`genericobjects_id`, `propkey`),
  INDEX `fk_genericobjectproperties_genericobjects` (`genericobjects_id` ASC) ,
  INDEX `idx_genericobjectproperties_propkey` (`propkey` ASC) ,
  INDEX `idx_genericobjectproperties_propvalue` (`propvalue`(255) ASC) ,
  CONSTRAINT `fk_genericobjectproperties_genericobjects`
    FOREIGN KEY (`genericobjects_id` )
    REFERENCES `openidm`.`genericobjects` (`id` )
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `openidm`.`managedobjects`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `openidm`.`managedobjects` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT ,
  `objecttypes_id` BIGINT UNSIGNED NOT NULL ,
  `objectid` VARCHAR(255) NOT NULL ,
  `rev` VARCHAR(38) NOT NULL ,
  `fullobject` MEDIUMTEXT NULL ,
  PRIMARY KEY (`id`) ,
  UNIQUE INDEX `idx-managedobjects_object` (`objecttypes_id` ASC, `objectid` ASC) ,
  INDEX `fk_managedobjects_objectypes` (`objecttypes_id` ASC) ,
  CONSTRAINT `fk_managedobjects_objectypes`
    FOREIGN KEY (`objecttypes_id` )
    REFERENCES `openidm`.`objecttypes` (`id` )
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `openidm`.`managedobjectproperties`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `openidm`.`managedobjectproperties` (
  `managedobjects_id` BIGINT UNSIGNED NOT NULL ,
  `propkey` VARCHAR(255) NOT NULL ,
  `proptype` VARCHAR(32) NULL ,
  `propvalue` VARCHAR(2000) NULL ,
  PRIMARY KEY (`managedobjects_id`, `propkey`),
  INDEX `fk_managedobjectproperties_managedobjects` (`managedobjects_id` ASC) ,
  INDEX `idx_managedobjectproperties_propkey` (`propkey` ASC) ,
  INDEX `idx_managedobjectproperties_propvalue` (`propvalue`(255) ASC) ,
  CONSTRAINT `fk_managedobjectproperties_managedobjects`
    FOREIGN KEY (`managedobjects_id` )
    REFERENCES `openidm`.`managedobjects` (`id` )
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `openidm`.`configobjects`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `openidm`.`configobjects` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT ,
  `objecttypes_id` BIGINT UNSIGNED NOT NULL ,
  `objectid` VARCHAR(255) NOT NULL ,
  `rev` VARCHAR(38) NOT NULL ,
  `fullobject` MEDIUMTEXT NULL ,
  PRIMARY KEY (`id`) ,
  INDEX `fk_configobjects_objecttypes` (`objecttypes_id` ASC) ,
  UNIQUE INDEX `idx_configobjects_object` (`objecttypes_id` ASC, `objectid` ASC) ,
  CONSTRAINT `fk_configobjects_objecttypes`
    FOREIGN KEY (`objecttypes_id` )
    REFERENCES `openidm`.`objecttypes` (`id` )
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `openidm`.`configobjectproperties`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `openidm`.`configobjectproperties` (
  `configobjects_id` BIGINT UNSIGNED NOT NULL ,
  `propkey` VARCHAR(255) NOT NULL ,
  `proptype` VARCHAR(255) NULL ,
  `propvalue` VARCHAR(2000) NULL ,
  PRIMARY KEY (`configobjects_id`, `propkey`),
  INDEX `fk_configobjectproperties_configobjects` (`configobjects_id` ASC) ,
  INDEX `idx_configobjectproperties_propkey` (`propkey` ASC) ,
  INDEX `idx_configobjectproperties_propvalue` (`propvalue`(255) ASC) ,
  CONSTRAINT `fk_configobjectproperties_configobjects`
    FOREIGN KEY (`configobjects_id` )
    REFERENCES `openidm`.`configobjects` (`id` )
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


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


-- -----------------------------------------------------
-- Table `openidm`.`relationships`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `openidm`.`relationships` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT ,
  `objecttypes_id` BIGINT UNSIGNED NOT NULL ,
  `objectid` VARCHAR(255) NOT NULL ,
  `rev` VARCHAR(38) NOT NULL ,
  `fullobject` MEDIUMTEXT NULL ,
  `firstresourcecollection` VARCHAR(255) ,
  `firstresourceid` VARCHAR(56) ,
  `firstpropertyname` VARCHAR(100) ,
  `secondresourcecollection` VARCHAR(255) ,
  `secondresourceid` VARCHAR(56) ,
  `secondpropertyname` VARCHAR(100) ,
  PRIMARY KEY (`id`) ,
  INDEX `fk_relationships_objecttypes` (`objecttypes_id` ASC) ,
  INDEX `idx_relationships_first_object` (`firstresourcecollection` ASC, `firstresourceid` ASC, `firstpropertyname` ASC) ,
  INDEX `idx_relationships_second_object` (`secondresourcecollection` ASC, `secondresourceid` ASC, `secondpropertyname` ASC) ,
  UNIQUE INDEX `idx_relationships_object` (`objecttypes_id` ASC, `objectid` ASC) ,
  CONSTRAINT `fk_relationships_objecttypes`
  FOREIGN KEY (`objecttypes_id` )
  REFERENCES `openidm`.`objecttypes` (`id` )
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
  ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `openidm`.`relationshipproperties`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `openidm`.`relationshipproperties` (
  `relationships_id` BIGINT UNSIGNED NOT NULL ,
  `propkey` VARCHAR(255) NOT NULL ,
  `proptype` VARCHAR(255) NULL ,
  `propvalue` VARCHAR(2000) NULL ,
  PRIMARY KEY (`relationships_id`, `propkey`),
  INDEX `fk_relationshipproperties_relationships` (`relationships_id` ASC) ,
  INDEX `idx_relationshipproperties_propkey` (`propkey` ASC) ,
  INDEX `idx_relationshipproperties_propvalue` (`propvalue`(255) ASC) ,
  CONSTRAINT `fk_relationshipproperties_relationships`
  FOREIGN KEY (`relationships_id` )
  REFERENCES `openidm`.`relationships` (`id` )
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
  ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `openidm`.`links`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `openidm`.`links` (
  `objectid` VARCHAR(38) NOT NULL ,
  `rev` VARCHAR(38) NOT NULL ,
  `linktype` VARCHAR(50) NOT NULL ,
  `linkqualifier` VARCHAR(50) NOT NULL ,
  `firstid` VARCHAR(255) NOT NULL ,
  `secondid` VARCHAR(255) NOT NULL ,
  UNIQUE INDEX `idx_links_first` (`linktype` ASC, `linkqualifier` ASC, `firstid` ASC) ,
  UNIQUE INDEX `idx_links_second` (`linktype` ASC, `linkqualifier` ASC, `secondid` ASC) ,
  PRIMARY KEY (`objectid`) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `openidm`.`internaluser`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `openidm`.`internaluser` (
  `objectid` VARCHAR(255) NOT NULL ,
  `rev` VARCHAR(38) NOT NULL ,
  `pwd` VARCHAR(510) NULL ,
  PRIMARY KEY (`objectid`) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `openidm`.`internalrole`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `openidm`.`internalrole` (
  `objectid` VARCHAR(255) NOT NULL ,
  `rev` VARCHAR(38) NOT NULL ,
  `name` VARCHAR(64) NULL ,
  `description` VARCHAR(510) NULL ,
  `temporalConstraints` VARCHAR(1024) NULL,
  `conditional` VARCHAR(1024) NULL,
  `privs` MEDIUMTEXT NULL,
  PRIMARY KEY (`objectid`) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `openidm`.`schedulerobjects`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `openidm`.`schedulerobjects` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT ,
  `objecttypes_id` BIGINT UNSIGNED NOT NULL ,
  `objectid` VARCHAR(255) NOT NULL ,
  `rev` VARCHAR(38) NOT NULL ,
  `fullobject` MEDIUMTEXT NULL ,
  PRIMARY KEY (`id`) ,
  UNIQUE INDEX `idx-schedulerobjects_object` (`objecttypes_id` ASC, `objectid` ASC) ,
  INDEX `fk_schedulerobjects_objectypes` (`objecttypes_id` ASC) ,
  CONSTRAINT `fk_schedulerobjects_objectypes`
    FOREIGN KEY (`objecttypes_id` )
    REFERENCES `openidm`.`objecttypes` (`id` )
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `openidm`.`schedulerobjectproperties`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `openidm`.`schedulerobjectproperties` (
  `schedulerobjects_id` BIGINT UNSIGNED NOT NULL ,
  `propkey` VARCHAR(255) NOT NULL ,
  `proptype` VARCHAR(32) NULL ,
  `propvalue` VARCHAR(2000) NULL ,
  PRIMARY KEY (`schedulerobjects_id`, `propkey`),
  INDEX `fk_schedulerobjectproperties_schedulerobjects` (`schedulerobjects_id` ASC) ,
  INDEX `idx_schedulerobjectproperties_propkey` (`propkey` ASC) ,
  INDEX `idx_schedulerobjectproperties_propvalue` (`propvalue`(255) ASC) ,
  CONSTRAINT `fk_schedulerobjectproperties_schedulerobjects`
    FOREIGN KEY (`schedulerobjects_id` )
    REFERENCES `openidm`.`schedulerobjects` (`id` )
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `openidm`.`uinotification`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `openidm`.`uinotification` (
  `objectid` VARCHAR(38) NOT NULL ,
  `rev` VARCHAR(38) NOT NULL ,
  `notificationType` VARCHAR(255) NOT NULL ,
  `createDate` VARCHAR(38) NOT NULL ,
  `message` TEXT NOT NULL ,
  `requester` VARCHAR(255) NULL ,
  `receiverId` VARCHAR(255) NOT NULL ,
  `requesterId` VARCHAR(255) NULL ,
  `notificationSubtype` VARCHAR(255) NULL ,
  INDEX `idx-uinotification-receiverId` (`receiverId` ASC) ,
  PRIMARY KEY (`objectid`) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `openidm`.`clusterobjects`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `openidm`.`clusterobjects` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT ,
  `objecttypes_id` BIGINT UNSIGNED NOT NULL ,
  `objectid` VARCHAR(255) NOT NULL ,
  `rev` VARCHAR(38) NOT NULL ,
  `fullobject` MEDIUMTEXT NULL ,
  PRIMARY KEY (`id`) ,
  UNIQUE INDEX `idx-clusterobjects_object` (`objecttypes_id` ASC, `objectid` ASC) ,
  INDEX `fk_clusterobjects_objectypes` (`objecttypes_id` ASC) ,
  CONSTRAINT `fk_clusterobjects_objectypes`
    FOREIGN KEY (`objecttypes_id` )
    REFERENCES `openidm`.`objecttypes` (`id` )
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `openidm`.`clusterobjectproperties`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `openidm`.`clusterobjectproperties` (
  `clusterobjects_id` BIGINT UNSIGNED NOT NULL ,
  `propkey` VARCHAR(255) NOT NULL ,
  `proptype` VARCHAR(32) NULL ,
  `propvalue` VARCHAR(2000) NULL ,
  PRIMARY KEY (`clusterobjects_id`, `propkey`),
  INDEX `idx_clusterobjectproperties_propkey` (`propkey` ASC) ,
  INDEX `idx_clusterobjectproperties_propvalue` (`propvalue`(255) ASC) ,
  INDEX `fk_clusterobjectproperties_clusterobjects` (`clusterobjects_id` ASC) ,
  CONSTRAINT `fk_clusterobjectproperties_clusterobjects`
    FOREIGN KEY (`clusterobjects_id` )
    REFERENCES `openidm`.`clusterobjects` (`id` )
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `openidm`.`clusteredrecontargetids`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `openidm`.`clusteredrecontargetids` (
  `objectid` VARCHAR(38) NOT NULL ,
  `rev` VARCHAR(38) NOT NULL ,
  `reconid` VARCHAR(255) NOT NULL ,
  `targetids` LONGTEXT NOT NULL ,
  INDEX `idx_clusteredrecontargetids_reconid` (`reconid` ASC) ,
  PRIMARY KEY (`objectid`) )
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `openidm`.`updateobjects`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `openidm`.`updateobjects` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT ,
  `objecttypes_id` BIGINT UNSIGNED NOT NULL ,
  `objectid` VARCHAR(255) NOT NULL ,
  `rev` VARCHAR(38) NOT NULL ,
  `fullobject` MEDIUMTEXT NULL ,
  PRIMARY KEY (`id`) ,
  INDEX `fk_updateobjects_objecttypes` (`objecttypes_id` ASC) ,
  UNIQUE INDEX `idx_updateobjects_object` (`objecttypes_id` ASC, `objectid` ASC) ,
  CONSTRAINT `fk_updateobjects_objecttypes`
    FOREIGN KEY (`objecttypes_id` )
    REFERENCES `openidm`.`objecttypes` (`id` )
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
  ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `openidm`.`updateobjectproperties`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `openidm`.`updateobjectproperties` (
  `updateobjects_id` BIGINT UNSIGNED NOT NULL ,
  `propkey` VARCHAR(255) NOT NULL ,
  `proptype` VARCHAR(255) NULL ,
  `propvalue` VARCHAR(2000) NULL ,
  PRIMARY KEY (`updateobjects_id`, `propkey`),
  INDEX `fk_updateobjectproperties_updateobjects` (`updateobjects_id` ASC) ,
  INDEX `idx_updateobjectproperties_propkey` (`propkey` ASC) ,
  INDEX `idx_updateobjectproperties_propvalue` (`propvalue`(255) ASC) ,
  CONSTRAINT `fk_updateobjectproperties_updateobjects`
    FOREIGN KEY (`updateobjects_id` )
    REFERENCES `openidm`.`updateobjects` (`id` )
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
  ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `openidm`.`syncqueue`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `openidm`.`syncqueue` (
  `objectid` VARCHAR(38) NOT NULL ,
  `rev` VARCHAR(38) NOT NULL ,
  `syncAction` VARCHAR(38) NOT NULL ,
  `resourceCollection` VARCHAR(38) NOT NULL ,
  `resourceId` VARCHAR(255) NOT NULL ,
  `mapping` VARCHAR(255) NOT NULL ,
  `objectRev` VARCHAR(38) NULL ,
  `oldObject` MEDIUMTEXT NULL ,
  `newObject` MEDIUMTEXT NULL ,
  `context` MEDIUMTEXT NOT NULL ,
  `state` VARCHAR(38) NOT NULL ,
  `nodeId` VARCHAR(255) NULL ,
  `remainingRetries` VARCHAR(38) NOT NULL ,
  `createDate` VARCHAR(38) NOT NULL ,
  PRIMARY KEY (`objectid`) ,
  INDEX `indx_syncqueue_mapping_state_createdate` (`mapping` ASC, `state` ASC, `createDate` ASC) ,
  INDEX `indx_syncqueue_mapping_retries` (`mapping` ASC, `remainingRetries` ASC))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `openidm`.`locks`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `openidm`.`locks` (
  `objectid` VARCHAR(38) NOT NULL ,
  `rev` VARCHAR(38) NOT NULL ,
  `nodeid` VARCHAR(255) ,
  INDEX `idx_locks_nodeid` (`nodeid` ASC) ,
  PRIMARY KEY (`objectid`) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `openidm`.`files`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `openidm`.`files` (
  `objectid` VARCHAR(38) NOT NULL ,
  `rev` VARCHAR(38) NOT NULL ,
  `content` LONGTEXT ,
  PRIMARY KEY (`objectid`) )
ENGINE = InnoDB;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

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
