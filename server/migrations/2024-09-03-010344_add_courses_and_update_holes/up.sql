CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    course_id INTEGER NOT NULL UNIQUE
);

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='holes' AND column_name='course_id') THEN
        ALTER TABLE holes
        ADD COLUMN course_id INTEGER REFERENCES courses(id);
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS hole_course_associations (
    course_id INTEGER REFERENCES courses(id),
    hole_id INTEGER REFERENCES holes(id),
    PRIMARY KEY (course_id, hole_id)
);