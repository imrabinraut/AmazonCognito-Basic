import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

const API_URL = 'http://localhost:5169/api';

export const ConfirmSignUpService = () => {
    const router = useRouter();
    const [data, setData] = useState({ userName: '', confirmationCode: '' });
    const [error, setError] = useState('');

    const handleConfirmSignUp = async (e: any) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post(`${API_URL}/confirm-sign-up`, { ...data });
            if (!!(response?.data?.status == "200")) {
                router.push('/login');
            }
            else {
                setError('Invalid confirmation code');
            }
        } catch (e: any) {
            setError(`Something went wrong. Message:- ${e.Message}`);
        }
    };

    return { error, handleConfirmSignUp, data, setData };
};
