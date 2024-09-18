import {api} from "@/services/api";
import {Course, CourseData} from "@/constants/interfaces";

export const fetchCourses = async () => {
    try {
        const courses: CourseData[] = await api.get('/courses');
        console.log('Courses:', courses);
        if(!courses) {
            return [];
        }
        return courses;
    } catch (error) {
        console.error('Failed to fetch courses:', error);
    }
};
