import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

const API_URL = 'http://localhost:5169/api';

const ConfirmForgotPasswordService = (userName: string) => {
    const router = useRouter();
    const [error, setError] = useState('');
    const [userData, setUserData] = useState({ username: userName, confirmationCode: '', newPassword: '' })

    const handleConfirmForgotPassword = async (e: any) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post(`${API_URL}/confirm-forgot-password`, { ...userData });
            if (response?.data?.status == "200") {
                router.push('/login');
            }
            else {
                setError('Invalid request');
            }
        } catch (e: any) {
            setError(`Something went wrong. Message:- ${e.Message}`);
        }
    };

    return { error, handleConfirmForgotPassword, userData, setUserData };
};

export default ConfirmForgotPasswordService;