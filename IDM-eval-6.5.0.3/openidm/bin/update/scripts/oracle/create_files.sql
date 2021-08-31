-- DROP TABLE files CASCADE CONSTRAINTS;


PROMPT Creating Table files ...
CREATE TABLE files (
  objectid VARCHAR2(38 CHAR) NOT NULL,
  rev VARCHAR2(38 CHAR) NOT NULL,
  content CLOB NULL
);
PROMPT Creating Primary Key Constraint PRIMARY_27 on table files ...
ALTER TABLE files
ADD CONSTRAINT PRIMARY_27 PRIMARY KEY
(
  objectid
)
ENABLE
;
