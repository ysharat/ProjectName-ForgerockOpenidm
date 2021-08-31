-- -----------------------------------------------------
-- Table openidm.notificationobjects
-- -----------------------------------------------------

CREATE TABLE openidm.notificationobjects (
  id BIGSERIAL NOT NULL,
  objecttypes_id BIGINT NOT NULL,
  objectid VARCHAR(255) NOT NULL,
  rev VARCHAR(38) NOT NULL,
  fullobject JSON,
  PRIMARY KEY (id),
  CONSTRAINT fk_notificationobjects_objecttypes FOREIGN KEY (objecttypes_id) REFERENCES openidm.objecttypes (id) ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE UNIQUE INDEX idx_notificationobjects_object ON openidm.notificationobjects (objecttypes_id,objectid);
CREATE INDEX fk_notificationobjects_objecttypes ON openidm.notificationobjects (objecttypes_id);
