use std::process::Command;
use serde_json::Value;
use diesel::prelude::*;
use diesel::pg::PgConnection;
use dotenv::dotenv;
use std::env;
use crate::schema::{holes, vectors, polygons};

#[derive(Insertable, AsChangeset)]
#[diesel(table_name = holes)]
struct NewHole {
    hole_id: i32,
    number: Option<i32>,
    course_id: Option<i32>,
    rotation: Option<f64>,
    range_x_min: Option<f64>,
    range_x_max: Option<f64>,
    range_y_min: Option<f64>,
    range_y_max: Option<f64>,
    dimensions_width: Option<i32>,
    dimensions_height: Option<i32>,
    flag_lat: Option<f64>,
    flag_long: Option<f64>,
}

#[derive(Insertable)]
#[diesel(table_name = vectors)]
struct NewVector {
    hole_id: i32,
    vector_type: String,
    lat: f64,
    long: f64,
}

#[derive(Insertable)]
#[diesel(table_name = polygons)]
struct NewPolygon {
    hole_id: i32,
    surface_type: String,
    lat: f64,
    long: f64,
}

fn run_command(command: &str, args: &[&str], access_key: &str, secret_key: &str) -> Result<String, std::io::Error> {
    let mut full_args = vec![
        "--access_key", access_key,
        "--secret_key", secret_key,
    ];
    full_args.extend_from_slice(args);

    println!("Executing command: {} {:?}", command, full_args);

    let output = Command::new(command)
        .args(&full_args)
        .output()?;

    if output.status.success() {
        Ok(String::from_utf8_lossy(&output.stdout).into_owned())
    } else {
        Err(std::io::Error::new(
            std::io::ErrorKind::Other,
            format!("Command failed with status {}: {}",
                    output.status,
                    String::from_utf8_lossy(&output.stderr)),
        ))
    }
}

fn establish_connection() -> PgConnection {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set");
    PgConnection::establish(&database_url)
        .expect(&format!("Error connecting to {}", database_url))
}

pub async fn  get_holes_from_golfbert(course_id: String) -> Result<(), Box<dyn std::error::Error>> {

    match dotenv() {
        Ok(_) => println!(".env file loaded successfully"),
        Err(e) => eprintln!("Error loading .env file: {}", e),
    }

    let access_key = env::var("AWS_ACCESS_KEY").expect("AWS_ACCESS_KEY must be set");
    let secret_key = env::var("AWS_SECRET_KEY").expect("AWS_SECRET_KEY must be set");
    let api_key = env::var("GOLFBERT_API_KEY").expect("GOLFBERT_API_KEY must be set");

    println!("Fetching courses data...");
    let courses_output = run_command("awscurl", &[
        "--request", "GET",
        &format!("https://api.golfbert.com/v1/courses/{}/holes", course_id),
        "--header", &format!("x-api-key: {}", api_key),
    ], &access_key, &secret_key)?;

    let courses_data: Value = serde_json::from_str(&courses_output)?;

    let mut connection = establish_connection();

    if let Some(resources) = courses_data["resources"].as_array() {
        for hole in resources {
            if let (Some(id), Some(number), Some(course_id)) = (
                hole["id"].as_i64(),
                hole["number"].as_i64(),
                hole["courseid"].as_i64()
            ) {
                let new_hole = NewHole {
                    hole_id: id as i32,
                    number: Some(number as i32),
                    course_id: Some(course_id as i32),
                    rotation: hole["rotation"].as_f64(),
                    range_x_min: hole["range"]["x"]["min"].as_f64(),
                    range_x_max: hole["range"]["x"]["max"].as_f64(),
                    range_y_min: hole["range"]["y"]["min"].as_f64(),
                    range_y_max: hole["range"]["y"]["max"].as_f64(),
                    dimensions_width: hole["dimensions"]["width"].as_i64().map(|n| n as i32),
                    dimensions_height: hole["dimensions"]["height"].as_i64().map(|n| n as i32),
                    flag_lat: hole["flagcoords"]["lat"].as_f64(),
                    flag_long: hole["flagcoords"]["long"].as_f64(),
                };

                diesel::insert_into(holes::table)
                    .values(&new_hole)
                    .on_conflict(holes::hole_id)
                    .do_update()
                    .set(&new_hole)
                    .execute(&mut connection)?;

                // Delete existing vectors for this hole
                diesel::delete(vectors::table.filter(vectors::hole_id.eq(id as i32)))
                    .execute(&mut connection)?;

                if let Some(vectors) = hole["vectors"].as_array() {
                    for vector in vectors {
                        if let (Some(vector_type), Some(lat), Some(long)) = (
                            vector["type"].as_str(),
                            vector["lat"].as_f64(),
                            vector["long"].as_f64()
                        ) {
                            let new_vector = NewVector {
                                hole_id: id as i32,
                                vector_type: vector_type.to_string(),
                                lat,
                                long,
                            };

                            diesel::insert_into(vectors::table)
                                .values(&new_vector)
                                .execute(&mut connection)?;
                        }
                    }
                }

                // Fetch polygons for this hole
                println!("Fetching polygons for hole {}...", id);
                let polygons_output = run_command("awscurl", &[
                    "--request", "GET",
                    &format!("https://api.golfbert.com/v1/holes/{}/polygons", id),
                    "--header", &format!("x-api-key: {}", api_key),
                ], &access_key, &secret_key)?;

                let polygons_data: Value = serde_json::from_str(&polygons_output)?;

                // Delete existing polygons for this hole
                diesel::delete(polygons::table.filter(polygons::hole_id.eq(id as i32)))
                    .execute(&mut connection)?;

                if let Some(resources) = polygons_data["resources"].as_array() {
                    for polygon in resources {
                        if let (Some(surface_type), Some(polygon_coords)) = (
                            polygon["surfacetype"].as_str(),
                            polygon["polygon"].as_array()
                        ) {
                            for coord in polygon_coords {
                                if let (Some(lat), Some(long)) = (coord["lat"].as_f64(), coord["long"].as_f64()) {
                                    let new_polygon = NewPolygon {
                                        hole_id: id as i32,
                                        surface_type: surface_type.to_string(),
                                        lat,
                                        long,
                                    };

                                    diesel::insert_into(polygons::table)
                                        .values(&new_polygon)
                                        .execute(&mut connection)?;
                                }
                            }
                        }
                    }
                }
            }
        }
    } else {
        eprintln!("No holes found in the response");
    }

    println!("Data successfully inserted into the database.");

    Ok(())
}