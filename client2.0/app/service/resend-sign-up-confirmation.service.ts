import axios from "axios";
import { useState } from "react";

const API_URL = 'http://localhost:5169/api';

export const ResendSignUpConfirmationService = (userName: string) => {
    const [error, setError] = useState('');
    const [success, setsuccess] = useState('');

    const handleResendSignUpConfirmation = async (e: any) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post(`${API_URL}/resend-confirmation`, { userName });
            if (!!(response?.data?.status == "200")) {
                setsuccess('Resend confirmation code success');
            }
            else {
                setError('Resend confirmation code failed');
            }
        } catch (e: any) {
            setError(`Something went wrong. Message:- ${e.Message}`);
        }
    };

    return { error, handleResendSignUpConfirmation, success };
}
