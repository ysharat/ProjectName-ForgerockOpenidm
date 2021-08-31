-- -----------------------------------------------------
-- Table openidm.notificationobjects
-- -----------------------------------------------------

CREATE TABLESPACE SOIDM29 MANAGED BY AUTOMATIC STORAGE ;
CREATE TABLE SOPENIDM.NOTIFICATIONOBJECTS (
    id                         INTEGER GENERATED BY DEFAULT AS IDENTITY ( CYCLE ),
    objecttypes_id             INTEGER        NOT NULL,
    objectid                   VARCHAR(255)   NOT NULL,
    rev                        VARCHAR(38)    NOT NULL,
    fullobject                 CLOB(2M),
    PRIMARY KEY (ID),
    CONSTRAINT FK_NOTIFICATIONOBJECTS_OBJECTTYPES
        FOREIGN KEY (OBJECTTYPES_ID )
        REFERENCES SOPENIDM.OBJECTTYPES (ID )
        ON DELETE CASCADE
) IN DOPENIDM.SOIDM29;
COMMENT ON TABLE SOPENIDM.NOTIFICATIONOBJECTS IS 'OPENIDM - Generic Table For Notification Objects';
CREATE INDEX SOPENIDM.FK_NOTIFICATIONOBJECTS_OBJECTTYPES ON SOPENIDM.NOTIFICATIONOBJECTS (OBJECTTYPES_ID ASC);
CREATE UNIQUE INDEX SOPENIDM.IDX_NOTIFICATIONOBJECTS_OBJECT ON SOPENIDM.NOTIFICATIONOBJECTS (OBJECTID ASC, OBJECTTYPES_ID ASC);

-- -----------------------------------------------------
-- Table openidm.notificationobjectproperties
-- -----------------------------------------------------

CREATE TABLESPACE SOIDM30 MANAGED BY AUTOMATIC STORAGE;
CREATE TABLE SOPENIDM.NOTIFICATIONOBJECTPROPERTIES (
    NOTIFICATIONOBJECTS_ID           INTEGER        NOT NULL,
    PROPKEY                    VARCHAR(255)   NOT NULL,
    PROPTYPE                   VARCHAR(255),
    PROPVALUE                  VARCHAR(2000),
    PRIMARY KEY (NOTIFICATIONOBJECTS_ID, PROPKEY),
    CONSTRAINT FK_NOTIFICATIONOBJECTPROPERTIES_NOTIFICATIONOBJECTS
        FOREIGN KEY (NOTIFICATIONOBJECTS_ID )
        REFERENCES SOPENIDM.NOTIFICATIONOBJECTS (ID )
        ON DELETE CASCADE
) IN DOPENIDM.SOIDM30;
COMMENT ON TABLE SOPENIDM.NOTIFICATIONOBJECTPROPERTIES IS 'OPENIDM - Properties of Notification Objects';
CREATE INDEX SOPENIDM.IDX_NOTIFICATIONOBJECTPROPERTIES_NOTIFICATIONOBJECTS ON SOPENIDM.NOTIFICATIONOBJECTPROPERTIES (NOTIFICATIONOBJECTS_ID ASC);
CREATE INDEX SOPENIDM.IDX_NOTIFICATIONOBJECTPROPERTIES_PROPKEY ON SOPENIDM.NOTIFICATIONOBJECTPROPERTIES (PROPKEY ASC);
CREATE INDEX SOPENIDM.IDX_NOTIFICATIONOBJECTPROPERTIES_PROPVALUE ON SOPENIDM.NOTIFICATIONOBJECTPROPERTIES (PROPVALUE ASC);