-- Add new columns to internalrole
ALTER TABLE internalrole
ADD
(
  name VARCHAR2(64 CHAR),
  temporalConstraints VARCHAR2(1024 CHAR),
  condition VARCHAR2(1024 CHAR),
  privs CLOB
);

PROMPT Creating Primary Key Constraint PRIMARY_8 on table internalrole ...
ALTER TABLE internalrole
ADD CONSTRAINT PRIMARY_8 PRIMARY KEY
(
  objectid
)
ENABLE
;

