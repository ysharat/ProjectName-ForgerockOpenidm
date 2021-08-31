-- -----------------------------------------------------
-- Table openidm.syncqueue
-- -----------------------------------------------------
CREATE TABLE openidm.syncqueue (
  objectid VARCHAR(38) NOT NULL,
  rev VARCHAR(38) NOT NULL,
  syncAction VARCHAR(38) NOT NULL,
  resourceCollection VARCHAR(38) NOT NULL,
  resourceId VARCHAR(255) NOT NULL,
  mapping VARCHAR(255) NOT NULL,
  objectRev VARCHAR(38) DEFAULT NULL,
  oldObject JSON,
  newObject JSON,
  context JSON,
  state VARCHAR(38) NOT NULL,
  nodeId VARCHAR(255) DEFAULT NULL,
  remainingRetries VARCHAR(38) NOT NULL,
  createDate VARCHAR(38) NOT NULL,
  PRIMARY KEY (objectid)
);
CREATE INDEX indx_syncqueue_mapping_state_createdate ON openidm.syncqueue (mapping, state, createDate);
CREATE INDEX indx_syncqueue_mapping_retries ON openidm.syncqueue (mapping, remainingRetries);

-- -----------------------------------------------------
-- Table openidm.locks
-- -----------------------------------------------------

CREATE TABLE openidm.locks (
  objectid VARCHAR(38) NOT NULL,
  rev VARCHAR(38) NOT NULL,
  nodeid VARCHAR(255),
  PRIMARY KEY (objectid)
);

CREATE INDEX idx_locks_nodeid ON openidm.locks (nodeid);
