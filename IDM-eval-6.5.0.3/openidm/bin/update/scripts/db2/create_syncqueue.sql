-- -----------------------------------------------------
-- Table `openidm`.`syncqueue`
-- -----------------------------------------------------
CREATE TABLESPACE SOIDM31 MANAGED BY AUTOMATIC STORAGE;
CREATE TABLE SOPENIDM.SYNCQUEUE (
    objectid                   VARCHAR(38)    NOT NULL,
    rev                        VARCHAR(38)    NOT NULL,
    syncAction                 VARCHAR(38)    NOT NULL,
    resourceCollection         VARCHAR(38)    NOT NULL,
    resourceId                 VARCHAR(255)   NOT NULL,
    mapping                    VARCHAR(255)   NOT NULL,
    objectRev                  VARCHAR(38)    NULL,
    oldObject                  CLOB(2M)       NULL,
    newObject                  CLOB(2M)       NULL,
    context                    CLOB(2M)       NOT NULL,
    state                      VARCHAR(38)    NOT NULL,
    nodeId                     VARCHAR(255)   NULL,
    remainingRetries           VARCHAR(38)    NOT NULL,
    createDate                 VARCHAR(38)   NOT NULL,
    PRIMARY KEY (objectid)
) IN DOPENIDM.SOIDM31;
COMMENT ON TABLE SOPENIDM.SYNCQUEUE IS 'OPENIDM - Explicit Table For Queued Synchronization Events';
CREATE INDEX SOPENIDM.IDX_SYNCQUEUE_MAPPING_STATE_CREATEDATE ON SOPENIDM.SYNCQUEUE (mapping ASC, state ASC, createDate ASC);
CREATE INDEX SOPENIDM.IDX_SYNCQUEUE_MAPPING_RETRIES ON SOPENIDM.SYNCQUEUE (mapping ASC, remainingRetries ASC);

-- -----------------------------------------------------
-- Table openidm.locks
-- -----------------------------------------------------

CREATE TABLESPACE SOIDM32 MANAGED BY AUTOMATIC STORAGE;
CREATE TABLE SOPENIDM.LOCKS (
    objectid                   VARCHAR(38)    NOT NULL,
    rev                        VARCHAR(38)    NOT NULL,
    nodeid                    VARCHAR(255),
    PRIMARY KEY (OBJECTID)
) IN DOPENIDM.SOIDM32;
COMMENT ON TABLE SOPENIDM.LOCKS IS 'OPENIDM - locks';

CREATE INDEX SOPENIDM.IDX_LOCKS_NODEID ON SOPENIDM.LOCKS (NODEID ASC);
