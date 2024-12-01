import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

const API_URL = 'http://localhost:5169/api';

export const ChangePasswordService = () => {
    const router = useRouter();
    const [error, setError] = useState('');
    const [userData, setUserData] = useState({ accessToken: '', oldPassword: '', newPassword: '' });

    const handleChangePassword = async (e: any) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post(`${API_URL}/`)
        } catch (e: any) {
            setError(`Something went wrong. Message:- ${e.Message}`);
        }
    };
};