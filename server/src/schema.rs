// @generated automatically by Diesel CLI.

diesel::table! {
    courses (id) {
        id -> Int4,
        course_id -> Int4,
        course_name -> Varchar,
    }
}

diesel::table! {
    hole_course_associations (course_id, hole_id) {
        course_id -> Int4,
        hole_id -> Int4,
    }
}

diesel::table! {
    holes (id) {
        id -> Int4,
        hole_id -> Int4,
        number -> Nullable<Int4>,
        course_id -> Nullable<Int4>,
        rotation -> Nullable<Float8>,
        range_x_min -> Nullable<Float8>,
        range_x_max -> Nullable<Float8>,
        range_y_min -> Nullable<Float8>,
        range_y_max -> Nullable<Float8>,
        dimensions_width -> Nullable<Int4>,
        dimensions_height -> Nullable<Int4>,
        flag_lat -> Nullable<Float8>,
        flag_long -> Nullable<Float8>,
    }
}

diesel::table! {
    polygons (id) {
        id -> Int4,
        hole_id -> Nullable<Int4>,
        #[max_length = 20]
        surface_type -> Nullable<Varchar>,
        lat -> Nullable<Float8>,
        long -> Nullable<Float8>,
    }
}

diesel::table! {
    vectors (id) {
        id -> Int4,
        hole_id -> Nullable<Int4>,
        #[max_length = 10]
        vector_type -> Nullable<Varchar>,
        lat -> Nullable<Float8>,
        long -> Nullable<Float8>,
    }
}

diesel::joinable!(hole_course_associations -> courses (course_id));
diesel::joinable!(hole_course_associations -> holes (hole_id));

diesel::allow_tables_to_appear_in_same_query!(
    courses,
    hole_course_associations,
    holes,
    polygons,
    vectors,
);
