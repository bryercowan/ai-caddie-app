ALTER TABLE courses
ADD COLUMN course_name VARCHAR NOT NULL;

INSERT INTO courses (course_id, course_name)
VALUES (6758, 'Appanoose Country Club');
