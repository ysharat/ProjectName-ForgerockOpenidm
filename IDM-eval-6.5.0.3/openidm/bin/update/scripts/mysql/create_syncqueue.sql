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
