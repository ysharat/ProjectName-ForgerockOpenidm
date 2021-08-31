-- -----------------------------------------------------
-- Table openidm.files
-- -----------------------------------------------------

CREATE TABLE openidm.files (
  objectid VARCHAR(38) NOT NULL,
  rev VARCHAR(38) NOT NULL,
  content TEXT,
  PRIMARY KEY (objectid)
);
