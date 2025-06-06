import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@env';


export type RequestType = {
    action: 'post' | 'get' | 'patch' |'delete'; 
    payload?: object;
    path: 'auth' | 'users' | 'expenses' | 'vehicle' | 'reports';
    route?: 'register' | 'login' | 'monthly' | 'yearly' | 'quarterly' | 'categories' | 'me'|'download' |'mileage-details' | 'previous-mileage';
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
            const headers = config.payload instanceof FormData ? {
                'Accept': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            } : {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            };
            
            const { action, payload, path, route, id } = config;
            const url = `${BASE_URL}${path}${route ? `/${route}` : ''}${id ? `/${id}` : ''}`;
           
            const result = await fetch(url, {
                method: action.toUpperCase(),
                headers: headers,
                body: action !== 'get' ? payload instanceof FormData ? payload : JSON.stringify(payload) : undefined   ,
            }).then(response => response.json()).then(data => {
                if(data.msg) return resolve({ data: null, error: data.msg });
                resolve({ data, error: null });
            }).catch(err =>{
                console.log(err.message)
            });

            
            
            
            
     
    });
};

export default useRequest;