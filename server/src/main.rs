use std::env;

use actix_cors::Cors;
use actix_web::{App, HttpResponse, HttpServer, Responder, web};
use diesel::PgConnection;
use diesel::r2d2::{self, ConnectionManager};
use dotenv::dotenv;

mod aws_operations;
mod db_operations;
mod models;
mod schema;

type DbPool = r2d2::Pool<ConnectionManager<PgConnection>>;

fn establish_connection() -> DbPool {
    dotenv().ok();
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let manager = ConnectionManager::<PgConnection>::new(database_url);
    r2d2::Pool::builder()
        .build(manager)
        .expect("Failed to create pool")
}

async fn get_courses(pool: web::Data<DbPool>) -> impl Responder {
    print!("HIT");
    let mut conn = pool.get().expect("couldn't get db connection from pool");
    let result = web::block(move || db_operations::fetch_courses(&mut conn)).await;

    match result {
        Ok(Ok(courses)) => {
            // Automatically serialize and return JSON
            HttpResponse::Ok().json(courses)
        }
        Ok(Err(_)) | Err(_) => {
            // Handle internal server errors
            HttpResponse::InternalServerError().finish()
        }
    }
}

async fn get_hole_data(pool: web::Data<DbPool>, hole_id: web::Path<i32>) -> impl Responder {
    let hole_id = hole_id.into_inner();
    let mut conn = pool.get().expect("couldn't get db connection from pool");

    match web::block(move || db_operations::fetch_hole_data(&mut conn, hole_id)).await {
        Ok(result) => match result {
            Ok(hole_data) => HttpResponse::Ok()
                .content_type("application/json")
                .json(hole_data),
            Err(e) => HttpResponse::InternalServerError().body(format!("Database error: {:?}", e)),
        },
        Err(e) => HttpResponse::InternalServerError().body(format!("Server error: {:?}", e)),
    }
}

async fn trigger_aws_curls(course_id: web::Path<String>) -> impl Responder {
    let course_id = course_id.into_inner();
    match aws_operations::get_holes_from_golfbert(course_id).await {
        Ok(_) => HttpResponse::Ok().body("AWS curls executed successfully"),
        Err(e) => HttpResponse::InternalServerError().body(format!("Error: {}", e)),
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let pool = establish_connection();

    HttpServer::new(move || {
        App::new()
            .wrap(Cors::permissive())
            .app_data(web::Data::new(pool.clone()))
            .route("/hole/{hole_id}", web::get().to(get_hole_data))
            .route("/trigger_aws", web::post().to(trigger_aws_curls))
            .route("/courses", web::get().to(get_courses))
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}
