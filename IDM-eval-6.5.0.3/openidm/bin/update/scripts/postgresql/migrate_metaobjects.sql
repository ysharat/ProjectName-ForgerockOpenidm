-- -----------------------------------------------------
-- Table openidm.metaobjects
-- -----------------------------------------------------

CREATE TABLE openidm.metaobjects (
  id BIGSERIAL NOT NULL,
  objecttypes_id BIGINT NOT NULL,
  objectid VARCHAR(255) NOT NULL,
  rev VARCHAR(38) NOT NULL,
  fullobject JSON,
  PRIMARY KEY (id),
  CONSTRAINT fk_metaobjects_objecttypes FOREIGN KEY (objecttypes_id) REFERENCES openidm.objecttypes (id) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT idx_metaobjects_object UNIQUE (objecttypes_id, objectid)
);
CREATE INDEX idx_metaobjects_reconid on openidm.metaobjects (json_extract_path_text(fullobject, 'reconId'), objecttypes_id);


START TRANSACTION;
-- -----------------------------------------------------
-- Migrate user meta data
-- -----------------------------------------------------
INSERT INTO openidm.metaobjects (objecttypes_id, objectid, rev, fullobject)
  SELECT objecttypes_id, objectid, rev, fullobject
  FROM openidm.genericobjects
    WHERE objecttypes_id = (SELECT id FROM openidm.objecttypes WHERE objecttype = 'internal/usermeta');


-- -----------------------------------------------------
-- Remove old user meta data
-- WARNING: This is a permanent operation and the associated data will be permanently deleted!
-- -----------------------------------------------------
DELETE FROM openidm.genericobjects
  WHERE objectid IN (SELECT objectid FROM openidm.metaobjects)
  AND objecttypes_id = (SELECT id FROM openidm.objecttypes WHERE objecttype = 'internal/usermeta');
COMMIT;
