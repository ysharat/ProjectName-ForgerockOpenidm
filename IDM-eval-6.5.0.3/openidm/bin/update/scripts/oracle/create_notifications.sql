-- DROP SEQUENCE notificationobjects_id_SEQ;


PROMPT Creating Sequence notificationobjects_id_SEQ ...
CREATE SEQUENCE  notificationobjects_id_SEQ
  MINVALUE 1 MAXVALUE 999999999999999999999999 INCREMENT BY 1  NOCYCLE ;

-- DROP TABLE notificationobjectproperties CASCADE CONSTRAINTS;


PROMPT Creating Table notificationobjectproperties ...
CREATE TABLE notificationobjectproperties (
  notificationobjects_id NUMBER(24,0) NOT NULL,
  propkey VARCHAR2(255 CHAR) NOT NULL,
  proptype VARCHAR2(255 CHAR),
  propvalue VARCHAR2(2000 CHAR)
);


PROMPT Creating Index fk_notificationproperties_conf on notificationobjectproperties ...
CREATE INDEX fk_notificationproperties_conf ON notificationobjectproperties
(
  notificationobjects_id
)
;
PROMPT Creating Index idx_notificationproperties_1 on notificationobjectproperties ...
CREATE INDEX idx_notificationproperties_1 ON notificationobjectproperties
(
  propkey
)
;
PROMPT Creating Index idx_notificationproperties_2 on notificationobjectproperties ...
CREATE INDEX idx_notificationproperties_2 ON notificationobjectproperties
(
  propvalue
)
;

PROMPT Creating Primary Key Constraint PRIMARY_24 on table notificationobjectproperties ...
ALTER TABLE notificationobjectproperties
ADD CONSTRAINT PRIMARY_24 PRIMARY KEY
(
  notificationobjects_id,
  propkey
)
;

-- DROP TABLE notificationobjects CASCADE CONSTRAINTS;


PROMPT Creating Table notificationobjects ...
CREATE TABLE notificationobjects (
  id NUMBER(24,0) NOT NULL,
  objecttypes_id NUMBER(24,0) NOT NULL,
  objectid VARCHAR2(255 CHAR) NOT NULL,
  rev VARCHAR2(38 CHAR) NOT NULL,
  fullobject CLOB
);


PROMPT Creating Primary Key Constraint PRIMARY_25 on table notificationobjects ...
ALTER TABLE notificationobjects
ADD CONSTRAINT PRIMARY_25 PRIMARY KEY
(
  id
)
ENABLE
;
PROMPT Creating Unique Index idx_notificationobjects_object on notificationobjects...
CREATE UNIQUE INDEX idx_notificationobjects_object ON notificationobjects
(
  objecttypes_id,
  objectid
)
;
PROMPT Creating Index fk_notification_objecttypes on notificationobjects ...
CREATE INDEX fk_notification_objecttypes ON notificationobjects
(
  objecttypes_id
)
;

PROMPT Creating Foreign Key Constraint fk_notificationproperties_conf on table notificationobjects...
ALTER TABLE notificationobjectproperties
ADD CONSTRAINT fk_notificationproperties_conf FOREIGN KEY
(
  notificationobjects_id
)
REFERENCES notificationobjects
(
  id
)
ON DELETE CASCADE
ENABLE
;

PROMPT Creating Foreign Key Constraint fk_notification_objecttypes on table objecttypes...
ALTER TABLE notificationobjects
ADD CONSTRAINT fk_notification_objecttypes FOREIGN KEY
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

CREATE OR REPLACE TRIGGER notificationobjects_id_TRG BEFORE INSERT ON notificationobjects
FOR EACH ROW
DECLARE
v_newVal NUMBER(12) := 0;
v_incval NUMBER(12) := 0;
BEGIN
  IF INSERTING AND :new.id IS NULL THEN
    SELECT  notificationobjects_id_SEQ.NEXTVAL INTO v_newVal FROM DUAL;
    -- If this is the first time this table have been inserted into (sequence == 1)
    IF v_newVal = 1 THEN
      --get the max indentity value from the table
      SELECT NVL(max(id),0) INTO v_newVal FROM notificationobjects;
      v_newVal := v_newVal + 1;
      --set the sequence to that value
      LOOP
           EXIT WHEN v_incval>=v_newVal;
           SELECT notificationobjects_id_SEQ.nextval INTO v_incval FROM dual;
      END LOOP;
    END IF;
    --used to emulate LAST_INSERT_ID()
    --mysql_utilities.identity := v_newVal;
   -- assign the value from the sequence to emulate the identity column
   :new.id := v_newVal;
  END IF;
END;

/
