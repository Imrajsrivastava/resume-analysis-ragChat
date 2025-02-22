import axiosInstance from './axiosInstance';

export const uploadResumeApi = async (formData: FormData): Promise<any> => {
    try {
        const response = await axiosInstance.post('/resume/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data', 
            },
        });
        return response.data;
    } catch (error: any) {
        console.error("Error uploading resume:", error);
        throw error;
    }
};

export const sendMessageToChatbot = async (message: string): Promise<string> => {
    try {
        const response = await axiosInstance.post('/resume/chat', { question: message });
        return response.data.answer; 
    } catch (error: any) {
        console.error("Error sending message to chatbot in API call:", error);
        throw error;
    }
};