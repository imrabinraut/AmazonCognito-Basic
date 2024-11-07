"use client"

import { useRouter, useSearchParams } from "next/navigation";
import ConfirmForgotPasswordService from "../service/confirm-forgot-password.service";
import { useEffect } from "react";

export default function ConfirmForgotPassword() {
    const searchParams = useSearchParams();
    const userName: any = searchParams.get('userName')?.toString();
    const { error, handleConfirmForgotPassword, userData, setUserData } = ConfirmForgotPasswordService(userName);
    const router = useRouter();

    useEffect(() => {
        if (!userName) {
            router.push('/forgot-password');
        }
        setUserData((prev) => ({ ...prev, userName: userName }))
    }, []);

    return (
        <div style={{ maxWidth: '480px', margin: '0 auto' }}>
            <h2>Confirm Forgot Password</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form>
                <label>
                    Confirmation Code:
                    <input
                        type="text"
                        value={userData.confirmationCode}
                        name="confirmationCode"
                        onChange={(e) => setUserData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
                        required
                    />
                </label>
                <br />
                <label>
                    New Password:
                    <input
                        type="password"
                        value={userData.newPassword}
                        name="newPassword"
                        onChange={(e) => setUserData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
                        required
                    />
                </label>
                <br />
                <button onClick={handleConfirmForgotPassword} type="submit">Submit</button>
            </form>
        </div>
    );
}