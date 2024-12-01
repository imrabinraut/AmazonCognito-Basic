import axios from "axios";
import { useRouter } from "next/navigation"
import { useState } from "react";

const API_URL = 'http://localhost:5169/api';

const LoginService = () => {
    const router = useRouter();
    const [userData, setUserData] = useState({ userName: '', password: '' });
    const [error, setError] = useState('');

    const handleLogin = async (e: any) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post(`${API_URL}/sign-in`, { ...userData });
            if (response?.data?.status == "200") {
                if (response?.data?.accessToken != null && response?.data?.refreshToken) {
                    localStorage.setItem('accessToken', response.data.accessToken);
                    localStorage.setItem('refreshToken', response.data.refreshToken);
                    localStorage.setItem('userName', userData.userName);
                    router.push('/dashboard');
                }
                else {
                    setError('Invalid credentials');
                }
            } else {
                setError('Invalid credentials');
            }
        } catch (e: any) {
            setError(`Something went wrong. Message:- ${e.Message}`);
        }
    };

    return { error, handleLogin, userData, setUserData };
};

export default LoginService;