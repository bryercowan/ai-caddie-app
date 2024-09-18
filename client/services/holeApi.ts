import {api} from "@/services/api";
import {HoleWithSVG} from "@/constants/interfaces";

export const fetchHole = async (holeId: number) => {
    console.log(holeId);
    try {
        const hole = await api.get(`/hole/${holeId}`);
        if (!hole) {
            return null;
        }
        return hole;
    } catch (error) {
        console.error('Failed to fetch hole:', error);
    }
}
