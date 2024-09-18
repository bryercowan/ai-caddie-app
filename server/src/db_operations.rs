use std::collections::HashMap;

use diesel::prelude::*;
use diesel::result::Error as DieselError;
use svg::Document;
use svg::node::element::{Group, Path};

use crate::models::{Course, CourseWithHoles, Hole, HoleData, Polygon, PolyVectorData, Vector};
use crate::schema::{courses, holes, polygons, vectors};

pub fn fetch_courses(conn: &mut PgConnection) -> Result<Vec<CourseWithHoles>, DieselError> {
    let courses = courses::table.load::<Course>(conn)?;

    let mut courses_with_holes: Vec<CourseWithHoles> = Vec::new();

    for course in courses {
        let holes = fetch_holes_from_course_id(conn, course.course_id)?;
        courses_with_holes.push(CourseWithHoles { course, holes })
    }

    Ok(courses_with_holes)
}

pub fn fetch_hole_data(conn: &mut PgConnection, hole_id: i32) -> Result<HoleData, DieselError> {
    let hole_data = fetch_hole_from_hole_id(conn, hole_id)?;
    //let svg = generate_svg(&hole_data);
    Ok(hole_data)
}

fn fetch_holes_from_course_id(
    conn: &mut PgConnection,
    course_id: i32,
) -> Result<Vec<Hole>, DieselError> {
    let holes = holes::table
        .filter(holes::course_id.eq(Some(course_id)))
        .load::<Hole>(conn)?;

    Ok(holes)
}

fn fetch_poly_vector_data(
    conn: &mut PgConnection,
    hole_id: i32,
) -> Result<PolyVectorData, DieselError> {
    let polygons = polygons::table
        .filter(polygons::hole_id.eq(hole_id))
        .load::<Polygon>(conn)?;

    let vectors = vectors::table
        .filter(vectors::hole_id.eq(hole_id))
        .load::<Vector>(conn)?;
    Ok(PolyVectorData { polygons, vectors })
}

fn fetch_hole_from_hole_id(conn: &mut PgConnection, hole_id: i32) -> Result<HoleData, DieselError> {
    let hole = holes::table
        .filter(holes::hole_id.eq(hole_id))
        .first::<Hole>(conn)?;

    let polygons = polygons::table
        .filter(polygons::hole_id.eq(hole_id))
        .load::<Polygon>(conn)?;

    let vectors = vectors::table
        .filter(vectors::hole_id.eq(hole_id))
        .load::<Vector>(conn)?;

    Ok(HoleData {
        hole,
        polygons,
        vectors,
    })
}

fn generate_svg(hole_data: &HoleData) -> String {
    let hole = &hole_data.hole;
    let width = 1000.0;
    let height = 1000.0;

    // Find the min and max coordinates
    let (mut min_x, mut min_y, mut max_x, mut max_y) = (f64::MAX, f64::MAX, f64::MIN, f64::MIN);
    for polygon in &hole_data.polygons {
        if let (Some(lat), Some(long)) = (polygon.lat, polygon.long) {
            min_x = min_x.min(lat);
            max_x = max_x.max(lat);
            min_y = min_y.min(long);
            max_y = max_y.max(long);
        }
    }

    let x_scale = width / (max_x - min_x);
    let y_scale = height / (max_y - min_y);
    let scale = x_scale.min(y_scale) * 0.9; // Use 90% of the available space

    let mut document = Document::new()
        .set("viewBox", (0, 0, width, height))
        .set("width", "100%")
        .set("height", "100%");

    let mut surface_groups: HashMap<String, Vec<Vec<&Polygon>>> = HashMap::new();
    for polygon in &hole_data.polygons {
        let surface_type = polygon
            .surface_type
            .clone()
            .unwrap_or_else(|| "Unknown".to_string());
        surface_groups
            .entry(surface_type)
            .or_insert_with(Vec::new)
            .push(vec![polygon]);
    }

    // Merge adjacent polygons only for Woods and Bunker
    for (surface_type, polygons) in surface_groups.iter_mut() {
        if surface_type == "Woods" || surface_type == "Sand" {
            let mut i = 0;
            while i < polygons.len() {
                let mut j = i + 1;
                while j < polygons.len() {
                    if are_adjacent(&polygons[i], &polygons[j]) {
                        let mut merged = polygons[i].clone();
                        merged.extend(polygons[j].iter());
                        polygons[i] = merged;
                        polygons.remove(j);
                    } else {
                        j += 1;
                    }
                }
                i += 1;
            }
        } else {
            // For other surface types, merge all polygons into a single group
            let all_polygons: Vec<&Polygon> = polygons
                .iter()
                .flat_map(|group| group.iter().cloned())
                .collect();
            *polygons = vec![all_polygons];
        }
    } // Group polygons by surface type

    // Create paths for each surface type
    for (surface_type, polygon_groups) in surface_groups {
        for polygons in polygon_groups {
            let mut path_data = String::new();
            for (i, polygon) in polygons.iter().enumerate() {
                if let (Some(lat), Some(long)) = (polygon.lat, polygon.long) {
                    let x = (lat - min_x) * scale;
                    let y = height - (long - min_y) * scale; // Flip y-axis

                    if i == 0 {
                        path_data += &format!("M {:.2} {:.2} ", x, y);
                    } else {
                        path_data += &format!("L {:.2} {:.2} ", x, y);
                    }
                }
            }
            path_data += "Z";

            let color = match surface_type.as_str() {
                "Green" => "#228B22",
                "Fairway" => "#32CD32",
                "Rough" => "#006400",
                "Bunker" => "#F4A460",
                "Water" => "#4169E1",
                "Woods" => "#006400",
                "Sand" => "#C2B280",
                _ => "#808080",
            };

            let path = Path::new()
                .set("d", path_data)
                .set("fill", color)
                .set("stroke", "black")
                .set("stroke-width", 1);

            let group = Group::new().add(path).set("class", surface_type.clone());
            document = document.add(group);
        }
    }

    // Add vector points
    for vector in &hole_data.vectors {
        if let (Some(lat), Some(long)) = (vector.lat, vector.long) {
            let x = (lat - min_x) * scale;
            let y = height - (long - min_y) * scale; // Flip y-axis

            let (color, size) = match vector.vector_type.as_deref() {
                Some("Flag") => ("#FFD700", 5.0),
                Some("White") => ("#FFF", 3.0),
                Some("Red") => ("#FF0000", 3.0),
                _ => ("#000000", 2.0),
            };

            let vector_point = svg::node::element::Circle::new()
                .set("cx", x)
                .set("cy", y)
                .set("r", size)
                .set("fill", color)
                .set("stroke", "black");

            document = document.add(vector_point);
        }
    }

    document.to_string()
}

fn are_adjacent(group1: &[&Polygon], group2: &[&Polygon]) -> bool {
    for poly1 in group1 {
        for poly2 in group2 {
            if let (Some(lat1), Some(long1), Some(lat2), Some(long2)) =
                (poly1.lat, poly1.long, poly2.lat, poly2.long)
            {
                let distance = ((lat1 - lat2).powi(2) + (long1 - long2).powi(2)).sqrt();
                if distance < 0.00008 {
                    return true;
                }
            }
        }
    }
    false
}
