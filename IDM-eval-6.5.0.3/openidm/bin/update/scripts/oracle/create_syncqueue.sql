-- DROP TABLE syncqueue CASCADE CONSTRAINTS;

PROMPT Creating Table syncqueue ...
CREATE TABLE syncqueue (
  objectid           VARCHAR2(38 CHAR)  NOT NULL,
  rev                VARCHAR2(38 CHAR)  NOT NULL,
  syncAction         VARCHAR2(38 CHAR)  NOT NULL,
  resourceCollection VARCHAR2(38 CHAR)  NOT NULL,
  resourceId         VARCHAR2(255 CHAR) NOT NULL,
  mapping            VARCHAR2(255 CHAR) NOT NULL,
  objectRev          VARCHAR2(38 CHAR)  NULL,
  oldObject          CLOB          NULL,
  newObject          CLOB          NULL,
  context            CLOB          NOT NULL,
  state              VARCHAR2(38 CHAR)  NOT NULL,
  nodeId             VARCHAR2(255 CHAR) NULL,
  remainingRetries   VARCHAR2(38 CHAR)  NOT NULL,
  createDate         VARCHAR2(38 CHAR) NOT NULL
);
PROMPT Creating Primary Key Constraint PRIMARY_22 on table syncqueue ..
ALTER TABLE syncqueue
  ADD CONSTRAINT PRIMARY_22 PRIMARY KEY
  (
    objectid
  )
ENABLE
;
PROMPT Creating Index idx_syncqueue_map_state_crdt on syncqueue...
CREATE INDEX idx_syncqueue_map_state_crdt ON syncqueue
(
  mapping,
  state,
  createDate
)
;
PROMPT Creating Index idx_syncqueue_mapping_retries on syncqueue...
CREATE INDEX idx_syncqueue_mapping_retries ON syncqueue
(
  mapping,
  remainingRetries
)
;

-- DROP TABLE locks CASCADE CONSTRAINTS;


PROMPT Creating Table locks ...
CREATE TABLE locks (
  objectid VARCHAR2(38 CHAR) NOT NULL,
  rev VARCHAR2(38 CHAR) NOT NULL,
  nodeid VARCHAR2(255 CHAR)
);
PROMPT Creating Primary Key Constraint PRIMARY_26 on table locks ...
ALTER TABLE locks
ADD CONSTRAINT PRIMARY_26 PRIMARY KEY
(
  objectid
)
ENABLE
;

PROMPT Creating Index idx_locks_nid on locks...
CREATE INDEX idx_locks_nid ON locks
(
  nodeid
)
;
