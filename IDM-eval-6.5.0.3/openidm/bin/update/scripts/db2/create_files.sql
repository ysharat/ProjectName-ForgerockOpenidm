-- -----------------------------------------------------
-- Table openidm.files
-- -----------------------------------------------------

CREATE TABLESPACE SOIDM33 MANAGED BY AUTOMATIC STORAGE;
CREATE TABLE SOPENIDM.FILES (
    objectid                   VARCHAR(38)    NOT NULL,
    rev                        VARCHAR(38)    NOT NULL,
    content                    CLOB(2G)       NULL,
    PRIMARY KEY (OBJECTID)
) IN DOPENIDM.SOIDM33;
COMMENT ON TABLE SOPENIDM.FILES IS 'OPENIDM - files';
