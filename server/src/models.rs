use diesel::prelude::*;
use crate::schema::*;
use serde::{Serialize, Deserialize};


#[derive(Queryable, Selectable, Identifiable, Serialize, Deserialize, Debug)]
#[diesel(table_name = courses)]
pub struct Course {
    pub id: i32,
    pub course_id: i32,
    pub course_name: String
}

#[derive(Queryable, Identifiable, Serialize, Deserialize, Associations, Debug)]
#[diesel(belongs_to(Course, foreign_key = course_id))]
#[diesel(table_name = holes)]
pub struct Hole {
    pub id: i32,
    pub hole_id: i32,
    pub number: Option<i32>,
    pub course_id: Option<i32>,
    pub rotation: Option<f64>,
    pub range_x_min: Option<f64>,
    pub range_x_max: Option<f64>,
    pub range_y_min: Option<f64>,
    pub range_y_max: Option<f64>,
    pub dimensions_width: Option<i32>,
    pub dimensions_height: Option<i32>,
    pub flag_lat: Option<f64>,
    pub flag_long: Option<f64>,
}

#[derive(Queryable, Associations, Serialize, Deserialize, Debug)]
#[diesel(belongs_to(Hole, foreign_key = hole_id))]
#[diesel(table_name = polygons)]
pub struct Polygon {
    pub id: i32,
    pub hole_id: Option<i32>,
    pub surface_type: Option<String>,
    pub lat: Option<f64>,
    pub long: Option<f64>,
}

#[derive(Queryable, Associations, Serialize, Deserialize, Debug)]
#[diesel(belongs_to(Hole, foreign_key = hole_id))]
#[diesel(table_name = vectors)]
pub struct Vector {
    pub id: i32,
    pub hole_id: Option<i32>,
    pub vector_type: Option<String>,
    pub lat: Option<f64>,
    pub long: Option<f64>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct HoleData {
    pub hole: Hole,
    pub polygons: Vec<Polygon>,
    pub vectors: Vec<Vector>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct PolyVectorData {
    pub polygons: Vec<Polygon>,
    pub vectors: Vec<Vector>,
}
#[derive(Serialize, Deserialize)]
pub struct HoleWithSVG {
    pub hole: Hole,
    pub svg: String,
}

#[derive(Queryable, Selectable, Associations, Serialize, Deserialize)]
#[diesel(belongs_to(Course))]
#[diesel(belongs_to(Hole))]
#[diesel(table_name = hole_course_associations)]
#[diesel(primary_key(course_id, hole_id))]
pub struct HoleCourseAssociation {
    pub course_id: i32,
    pub hole_id: i32,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct CourseWithHoles {
    pub course: Course,
    pub holes: Vec<Hole>,
}