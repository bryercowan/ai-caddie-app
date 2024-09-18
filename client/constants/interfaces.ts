export interface Course {
    id: number;
    course_id: number;
    course_name: string;
}

export interface CourseData {
    course: Course;
    holes: Hole[];
}

export interface Hole {
    id: number;
    hole_id: number;
    number?: number | null;
    course_id?: number | null;
    rotation?: number | null;
    range_x_min?: number | null;
    range_x_max?: number | null;
    range_y_min?: number | null;
    range_y_max?: number | null;
    dimensions_width?: number | null;
    dimensions_height?: number | null;
    flag_lat?: number | null;
    flag_long?: number | null;
}

export interface Polygon {
    id: number;
    hole_id?: number;
    surface_type?: string;
    lat?: number;
    long?: number;
}

export interface Vector {
    id: number;
    hole_id?: number | null;
    vector_type?: string | null;
    lat?: number | null;
    long?: number | null;
}

export interface HoleData {
    hole: Hole;
    polygons: Polygon[];
    vectors: Vector[];
}

export interface HoleWithSVG {
    hole: Hole;
    svg: string;
}

export interface HoleCourseAssociation {
    course_id: number;
    hole_id: number;
}
