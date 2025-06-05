
import axios from "axios";

const BASE_URL = "http://localhost:5000/api";
const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("token")}`,

};
//============================= APIs for Users =============================//
//===============================================================================//
const fetchUsers = async ()=>{
    try {
        const response = await axios.get(`${BASE_URL}/users`);
        return response.data?.data[0];

    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
};



//============================= APIs for Skills =============================//
//===============================================================================//

const fetchSkills = async ()=>{
    try {
        const response = await axios.get(`${BASE_URL}/skills`);
        return response.data?.data;
    } catch (error) {
        console.error('Error fetching skills:', error);
        throw error;
    }
};
const updateSkill = async (idtring, updatedSkill)=>{
    try {
        const response = await axios.patch(`${BASE_URL}/skills/${id}`,updatedSkill, {headers});
        return response.data?.data;
    } catch (error) {
        console.error('Error updating skill:', error);
        throw error;
    }
}
const deleteSkill = async (id)=>{
    try {
        const response = await axios.delete(`${BASE_URL}/skills/${id}`,{headers});
        // Check if the response is successful
        return response.data?.data;
    } catch (error) {
        console.error('Error deleting skill:', error);
        throw error;
    }
}
const createSkill = async (newSkill)=>{
    try {
        const response = await axios.post(`${BASE_URL}/skills`, newSkill, {headers});
        return response.data?.data;
    } catch (error) {
        console.error('Error creating skill:', error);
        throw error;
    }
}


//============================= APIs for Profile =============================//
//===============================================================================//    
const fetchProfile = async ()=>{
    try {
        const response = await axios.get(`${BASE_URL}/profiles/`);
        return response.data?.data[0];
    } catch (error) {
        console.error('Error fetching profile:', error);
        throw error;
    }
};
const updateProfile = async (id, updateData)=>{
    try {
        const response = await axios.patch(`${BASE_URL}/profiles/${id}`,updateData, {
            headers: {
            'Content-Type': 'multipart/form-data',
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },}  );
        return response.data?.data;
    } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
    }
};




//============================= APIs for Projects =============================//
//===============================================================================//
const fetchProjects = async ()=>{
    try {
        const response = await axios.get(`${BASE_URL}/projects`);
        return response.data?.data;
    } catch (error) {
        console.error('Error fetching projects:', error);
        throw error;
    }
};

const updateProject = async (id, updateData) => {
    const formData = new FormData();

    // Append all fields from updateData to formData
    for (const key in updateData) {
        if (updateData.hasOwnProperty(key)) {
            // Check if the value is a File object (our image)
            if (updateData[key] instanceof File) {
                formData.append(key, updateData[key], updateData[key].name);
            } else if (updateData[key] !== null && updateData[key] !== undefined) {
                // Append other fields
                 if (Array.isArray(updateData[key])) {
                    // Handle arrays (adjust based on backend expectation)
                    updateData[key].forEach(item => formData.append(`${key}[]`, item));
                    // Or: formData.append(key, JSON.stringify(updateData[key]));
                } else {
                    formData.append(key, updateData[key]);
                }
            }
            // Note: If the backend requires null/undefined to clear a field,
            // you might need to adjust the condition above.
            // If you only want to send changed fields, the logic would be different.
        }
    }

    try {
        // Note: PATCH with multipart/form-data might not be universally supported by backends/servers.
        // Alternatives: Use PUT, or use POST with a method override header/field (e.g., _method=PATCH).
        // Check your backend framework's documentation.
        const response = await axios.patch(`${BASE_URL}/projects/${id}`, formData, {
             headers: {
                'Content-Type': 'multipart/form-data',
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return response.data?.data;
    } catch (error) {
        console.error('Error updating project:', error.response?.data || error.message);
        throw error;
    }
};
const deleteProject = async (id)=>{
    try {
        const response = await axios.delete(`${BASE_URL}/projects/${id}`,{headers});
        return response.data?.data;
    } catch (error) {
        console.error('Error deleting project:', error);
        throw error;
    }
};
const createProject = async (projectData) => {
    const formData = new FormData();

    // Append all fields from projectData to formData
    // Handle the image file specifically
    for (const key in projectData) {
        if (projectData.hasOwnProperty(key)) {
            // Check if the value is a File object (our image)
            if (projectData[key] instanceof File) {
                formData.append(key, projectData[key], projectData[key].name);
            } else if (projectData[key] !== null && projectData[key] !== undefined) {
                // Append other fields as strings (or handle arrays if needed)
                 if (Array.isArray(projectData[key])) {
                    // If backend expects array as multiple entries with same key:
                    projectData[key].forEach(item => formData.append(`${key}[]`, item));
                    // Or if backend expects JSON stringified array:
                    // formData.append(key, JSON.stringify(projectData[key]));
                } else {
                    formData.append(key, projectData[key]);
                }
            }
        }
    }

    try {
        const response = await axios.post(`${BASE_URL}/projects`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // Important for file uploads
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return response.data?.data;
    } catch (error) {
        console.error('Error creating project:', error.response?.data || error.message);
        throw error;
    }
};


//============================= APIs for Blog Posts ============================//
//===============================================================================//
const fetchPosts = async ()=>{
    try {
        const response = await axios.get(`${BASE_URL}/blogposts`);
        return response.data?.data;
    } catch (error) {
        console.error('Error fetching posts:', error);
        throw error;
    }
};
const fetchPost = async (id)=>{
    try {
        const response = await axios.get(`${BASE_URL}/blogposts/${id}`);
        return response.data?.data;
    } catch (error) {
        console.error('Error fetching post:', error);
        throw error;
    }
};
const updatePost = async (id, updatedPost)=>{
    try {
        const response = await axios.patch(`${BASE_URL}/blogposts/${id}`, updatedPost, {
            headers: {
                'Content-Type': 'multipart/form-data', // Important for file uploads
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return response.data?.data;
    } catch (error) {
        console.error('Error updating post:', error);
        throw error;
    }
 };

const deletePost = async (id)=>{
    try {
        const response = await axios.delete(`${BASE_URL}/blogposts/${id}`,{headers});
        return response.data?.data;
    } catch (error) {
        console.error('Error deleting post:', error);
        throw error;
    }
};
const createPost = async (newPost)=>{
    try {
        const response = await axios.post(`${BASE_URL}/blogposts`, newPost, {
            headers: {
                'Content-Type': 'multipart/form-data', // Important for file uploads
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },});
        return response.data?.data;
    } catch (error) {
        console.error('Error creating post:', error);
        throw error;
    }
};



//============================= APIs for Timeline =============================//
//===============================================================================//
const fetchTimeLine = async ()=>{
    try {
        const response = await axios.get(`${BASE_URL}/timeline`);
        return response.data?.data;
    } catch (error) {
        console.error('Error fetching timeline:', error);
        throw error;
    }
};
const updateTimeLine = async (timelineItems)=>{
    try {
        const response = await axios.patch(`${BASE_URL}/timeline`, timelineItems,{
            headers: {
                'Content-Type': 'multipart/form-data',
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return response.data?.data;
    } catch (error) {
        console.error('Error updating timeline:', error);
        throw error;
    }
};
const deleteTimeLine = async (id)=>{
    try {
        const response = await axios.delete(`${BASE_URL}/timeline/${id}`);
        return response.data?.data;
    } catch (error) {
        console.error('Error deleting timeline:', error);
        throw error;
    }
};

//============================= APIs for Messages =============================//
//===============================================================================//
const createMessage = async (newMessage)=>{
    try {
        const response = await axios.post(`${BASE_URL}/contactmessages`, newMessage, { headers});
        return response.data?.data;
    } catch (error) {
        console.error('Error creating message:', error);
        throw error;
    }
};

const fetchMessages = async ()=>{
    try {
        const response = await axios.get(`${BASE_URL}/contactmessages`, { headers});
        return response.data?.data;
    } catch (error) {
        console.error('Error fetching messages:', error);
        throw error;
    }
}
const updateMessage = async (id, data)=>{

    try {
        const response = await axios.patch(`${BASE_URL}/contactmessages/${id}`, data, { headers});
        
        return response.data?.data;
    } catch (error) {
        console.error('Error updating message:', error);
        throw error;
    }
}

const deleteMessage = async (id)=>{
    try {
        const response = await axios.delete(`${BASE_URL}/contactmessages/${id}`, { headers});
        return response.data?.data;
    } catch (error) {
        console.error('Error deleting message:', error);
        throw error;
    }
}



export {
    fetchPost,
    updateTimeLine,
    deleteTimeLine, 
    fetchSkills, 
    fetchUsers, 
    fetchTimeLine, 
    fetchProfile, 
    updateProfile, 
    fetchProjects, 
    updateProject, 
    deleteProject, 
    createProject, 
    fetchPosts, 
    updatePost, 
    deletePost,
    createPost,
    createSkill, 
    updateSkill, 
    deleteSkill,
    fetchMessages,
    createMessage,
    updateMessage,
    deleteMessage,
    
};