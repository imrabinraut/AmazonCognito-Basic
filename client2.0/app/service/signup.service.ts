import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

const API_URL = 'http://localhost:5169/api';

const SignUpService = () => {
    const router = useRouter();
    const [userData, setUserData] = useState({ userName: '', password: '', email: '' });
    const [error, setError] = useState('');

    const handleSignUp = async (e: any) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post(`${API_URL}/sign-up`, { ...userData });
            if (response != null && response.data.status == "200") {
                router.push(`/confirm-sign-up?userName=${userData.userName}`);
            }
            else {
                setError('Sign up failed');
            }
        }
        catch (e: any) {
            setError(`Something went wrong. Message:- ${e.Message}`);
        }
    };

    return { error, handleSignUp, userData, setUserData };
};

export default SignUpService;