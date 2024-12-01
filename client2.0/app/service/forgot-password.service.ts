import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

const API_URL = 'http://localhost:5169/api';

const ForgotPasswordService = () => {
    const router = useRouter();
    const [error, setError] = useState('');
    const [userData, setUserData] = useState({ userName: '' })

    const handleForgotpassword = async (e: any) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post(`${API_URL}/forgot-password`, { ...userData });

            if (response?.data?.status == "200") {
                router.push(`/confirm-forgot-password?userName=${userData.userName}`);
            }
            else {
                setError('Invalid details');
            }
        } catch (e: any) {
            setError(`Something went wrong. Message:- ${e.Message}`);
        }
    };

    return { error, handleForgotpassword, userData, setUserData };
};


export default ForgotPasswordService;