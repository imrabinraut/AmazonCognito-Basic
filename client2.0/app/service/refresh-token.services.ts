import { useState } from "react";
import UserService from "./user.service";
import axios from "axios";
import LogOutService from "./logout.service";

const API_URL = 'http://localhost:5169/api';

export const RefreshTokenServices = () => {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const user = UserService();

    const handleRefreshToken = async (e: any) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post(`${API_URL}/refresh-token`, { userName: user.userName, RefreshToken: user.refreshToken });
            if (!!(response?.data.status == "200")) {
                if (response?.data?.accessToken != null) {
                    localStorage.setItem('accessToken', response.data.accessToken);
                    setSuccess('Access token generated successfully');
                }
                else {
                    LogOutService();
                    setError('Access token generation failed');
                }
            }
            else {
                LogOutService();
                setError('Access token generation failed');
            }
        } catch (e: any) {
            LogOutService();
            setError(`Something went wrong. Message:- ${e.Message}`);
        }
    };

    return { error, handleRefreshToken, success };
}