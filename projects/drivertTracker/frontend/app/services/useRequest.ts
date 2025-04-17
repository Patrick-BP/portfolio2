import AsyncStorage from '@react-native-async-storage/async-storage';
 const baseUrl = "http://192.168.0.233:3000/api/";
// const baseUrl = "http://localhost:3000/api/";

export type RequestType = {
    action: 'post' | 'get' | 'patch' |'delete'; 
    payload?: object;
    path: 'auth' | 'users' | 'expenses' | 'vehicle';
    route?: 'register' | 'login' | 'category-breakdown' | 'fuel-efficiency' | 'import-csv' | 'export-csv' | 'me';
    id?: string;
}

export type RequestResult = {
    data: any | null;
    error: string | null;
}

// Simple function that performs API requests - no hooks, no async default export
const useRequest = (config: RequestType): Promise<RequestResult> => { 
    return new Promise(async (resolve) => {
       
            const token = await AsyncStorage.getItem('token');
            const headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            };
            
            const { action, payload, path, route, id } = config;
            const url = `${baseUrl}${path}${route ? `/${route}` : ''}${id ? `/${id}` : ''}`;
           
            const result = await fetch(url, {
                method: action.toUpperCase(),
                headers: headers,
                body: action !== 'get' ? JSON.stringify(payload) : undefined,
            }).then(response => response.json()).then(data => {
                if(data.msg) return resolve({ data: null, error: data.msg });
                resolve({ data, error: null });
            }).catch(err =>{
                console.log(err.message)
            });

            
            
            
            
     
    });
};

export default useRequest;