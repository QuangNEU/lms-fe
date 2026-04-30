import { useContext } from "react";
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../context/authContext";


export const useFetch = () => {
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext)

    const fetchAPI = async (url, options = {}) => {
        const token = localStorage.getItem('access_token');
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }

        try {
            const response = fetch(url, { ...options, headers });

            if (response.status == 401) {
                console.warn('Token da het han');
                logout();
                navigate('/login');
                throw new Error('Unauthorized')
            }
            return response;
        }
        catch (error) {
            throw error
        }
    }
    return fetchAPI
}