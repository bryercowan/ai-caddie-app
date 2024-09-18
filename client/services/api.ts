import { Platform } from 'react-native';

const API_URL = 'https://3fc4-204-144-197-155.ngrok-free.app';

export const api = {
    async get(endpoint: string) {
        try {
            const response = await fetch(`${API_URL}${endpoint}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            console.error('API Get Error:', error);
            throw error;
        }
    },

    async getImage(endpoint: string) {
        try {
            const response = await fetch(`${API_URL}${endpoint}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.blob();
        } catch (error) {
            console.error('API Get Image Error:', error);
            throw error;
        }
    },

    async post(endpoint: string, data: any) {
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            console.error('API Post Error:', error);
            throw error;
        }
    },

    // Add other methods (PUT, DELETE, etc.) as needed
};
