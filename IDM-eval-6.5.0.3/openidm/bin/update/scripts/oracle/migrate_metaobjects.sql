-- DROP SEQUENCE metaobjects_id_SEQ;


PROMPT Creating Sequence metaobjects_id_SEQ ...
CREATE SEQUENCE  metaobjects_id_SEQ
  MINVALUE 1 MAXVALUE 999999999999999999999999 INCREMENT BY 1  NOCYCLE ;

-- DROP TABLE metaobjectproperties CASCADE CONSTRAINTS;


PROMPT Creating Table metaobjectproperties ...
CREATE TABLE metaobjectproperties (
  metaobjects_id NUMBER(24,0) NOT NULL,
  propkey VARCHAR2(255 CHAR) NOT NULL,
  proptype VARCHAR2(32 CHAR),
  propvalue VARCHAR2(2000 CHAR)
);


PROMPT Creating Index fk_metaobjectproperties_gen on metaobjectproperties ...
CREATE INDEX fk_metaobjectproperties_gen ON metaobjectproperties
(
  metaobjects_id
)
;
PROMPT Creating Index idx_metaobjectproper_1 on metaobjectproperties ...
CREATE INDEX idx_metaobjectproper_1 ON metaobjectproperties
(
  propkey
)
;
PROMPT Creating Index idx_metaobjectproper_2 on metaobjectproperties ...
CREATE INDEX idx_metaobjectproper_2 ON metaobjectproperties
(
  propvalue
)
;

PROMPT Creating Primary Key Constraint PRIMARY_28 on table metaobjectproperties ...
ALTER TABLE metaobjectproperties
ADD CONSTRAINT PRIMARY_28 PRIMARY KEY
(
  metaobjects_id,
  propkey
)
;


-- DROP TABLE metaobjects CASCADE CONSTRAINTS;


PROMPT Creating Table metaobjects ...
CREATE TABLE metaobjects (
  id NUMBER(24,0) NOT NULL,
  objecttypes_id NUMBER(24,0) NOT NULL,
  objectid VARCHAR2(255 CHAR) NOT NULL,
  rev VARCHAR2(38 CHAR) NOT NULL,
  fullobject CLOB
);


PROMPT Creating Primary Key Constraint PRIMARY_29 on table metaobjects ...
ALTER TABLE metaobjects
ADD CONSTRAINT PRIMARY_29 PRIMARY KEY
(
  id
)
ENABLE
;
PROMPT Creating Unique Index idx_metaobjects_object on metaobjects...
CREATE UNIQUE INDEX idx_metaobjects_object ON metaobjects
(
  objecttypes_id,
  objectid
)
;
PROMPT Creating Index fk_metaobjects_objecttypes on metaobjects ...
CREATE INDEX fk_metaobjects_objecttypes ON metaobjects
(
  objecttypes_id
)
;


PROMPT Creating Foreign Key Constraint fk_metaproperties_conf on table metaobjects...
ALTER TABLE metaobjectproperties
ADD CONSTRAINT fk_metaproperties_conf FOREIGN KEY
(
  metaobjects_id
)
REFERENCES metaobjects
(
  id
)
ON DELETE CASCADE
ENABLE
;

PROMPT Creating Foreign Key Constraint fk_meta_objecttypes on table objecttypes...
ALTER TABLE metaobjects
ADD CONSTRAINT fk_meta_objecttypes FOREIGN KEY
(
  objecttypes_id
)
REFERENCES objecttypes
(
  id
)
ON DELETE CASCADE
ENABLE
;

-- -----------------------------------------------------
-- Migrate user meta data
-- -----------------------------------------------------
INSERT INTO metaobjects (id, objecttypes_id, objectid, rev, fullobject)
  SELECT metaobjects_id_SEQ.NEXTVAL, objecttypes_id, objectid, rev, fullobject
  FROM genericobjects
    WHERE objecttypes_id = (SELECT id FROM objecttypes WHERE objecttype = 'internal/usermeta');

INSERT INTO metaobjectproperties (metaobjects_id, propkey, proptype, propvalue)
  SELECT metaobjects.id, genericobjectproperties.propkey, genericobjectproperties.proptype, genericobjectproperties.propvalue
  FROM metaobjects
  JOIN genericobjects ON metaobjects.objectid = genericobjects.objectid
    AND metaobjects.objecttypes_id = genericobjects.objecttypes_id
  JOIN genericobjectproperties ON genericobjects.id = genericobjectproperties.genericobjects_id;


-- -----------------------------------------------------
-- Remove old user meta data
-- WARNING: This is a permanent operation and the associated data will be permanently deleted!
-- -----------------------------------------------------
DELETE FROM genericobjects
  WHERE objectid IN (SELECT objectid FROM metaobjects)
  AND objecttypes_id = (SELECT id FROM objecttypes WHERE objecttype = 'internal/usermeta');
COMMIT;


CREATE OR REPLACE TRIGGER metaobjects_id_TRG BEFORE INSERT ON metaobjects
FOR EACH ROW
DECLARE
v_newVal NUMBER(12) := 0;
v_incval NUMBER(12) := 0;
BEGIN
  IF INSERTING AND :new.id IS NULL THEN
    SELECT  metaobjects_id_SEQ.NEXTVAL INTO v_newVal FROM DUAL;
    -- If this is the first time this table have been inserted into (sequence == 1)
    IF v_newVal = 1 THEN
      --get the max indentity value from the table
      SELECT NVL(max(id),0) INTO v_newVal FROM metaobjects;
      v_newVal := v_newVal + 1;
      --set the sequence to that value
      LOOP
           EXIT WHEN v_incval>=v_newVal;
           SELECT metaobjects_id_SEQ.nextval INTO v_incval FROM dual;
      END LOOP;
    END IF;
    --used to emulate LAST_INSERT_ID()
    --mysql_utilities.identity := v_newVal;
   -- assign the value from the sequence to emulate the identity column
   :new.id := v_newVal;
  END IF;
END;

/

