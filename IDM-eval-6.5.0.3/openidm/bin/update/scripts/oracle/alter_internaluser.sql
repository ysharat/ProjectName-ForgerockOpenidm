-- WARNING: This is a permanent operation and the associated data will be permanently deleted!
-- Drop 'roles' column from internaluser
ALTER TABLE internaluser DROP COLUMN roles;

-- Create index
PROMPT Creating Primary Key Constraint PRIMARY_2 on table internaluser ...
ALTER TABLE internaluser
ADD CONSTRAINT PRIMARY_2 PRIMARY KEY
(
  objectid
)
ENABLE
;