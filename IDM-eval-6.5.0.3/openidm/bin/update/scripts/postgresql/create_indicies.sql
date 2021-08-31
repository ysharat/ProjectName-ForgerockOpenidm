-- Add indices for various tables, not otherwise altered
CREATE INDEX idx_genericobjects_reconid on openidm.genericobjects (json_extract_path_text(fullobject, 'reconId'), objecttypes_id);

CREATE INDEX idx_json_clusterobjects_timestamp ON openidm.clusterobjects ( json_extract_path_text(fullobject, 'timestamp') );
CREATE INDEX idx_json_clusterobjects_state ON openidm.clusterobjects ( json_extract_path_text(fullobject, 'state') );
CREATE INDEX idx_json_clusterobjects_event_instanceid ON openidm.clusterobjects ( json_extract_path_text(fullobject, 'type'), json_extract_path_text(fullobject, 'instanceId') );
