DROP TABLE IF EXISTS hole_course_associations;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns
               WHERE table_name='holes' AND column_name='course_id') THEN
        ALTER TABLE holes DROP COLUMN course_id;
    END IF;
END $$;

DROP TABLE IF EXISTS courses;