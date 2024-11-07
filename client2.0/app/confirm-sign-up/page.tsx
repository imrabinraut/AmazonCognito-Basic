'use client'

import { useEffect, } from "react";
import { ConfirmSignUpService } from "../service/confirm-sign-up.service";
import { useRouter, useSearchParams } from "next/navigation";
import { ResendSignUpConfirmationService } from "../service/resend-sign-up-confirmation.service";

export default function ConfirmSignUp() {
    const searchParams = useSearchParams();
    const userName: any = searchParams.get('userName')?.toString();
    const router = useRouter();
    const { error, handleConfirmSignUp, data, setData } = ConfirmSignUpService();
    const { error: err, handleResendSignUpConfirmation, success } = ResendSignUpConfirmationService(userName);

    useEffect(() => {
        if (!userName) {
            router.push('/sign-up');
        }
        setData((prev) => ({ ...prev, userName: userName }))
    }, []);

    return (
        <div style={{ maxWidth: '480px', margin: '0 auto' }}>
            <h2>Confirm Sign Up</h2>
            {error || err && <p style={{ color: 'red' }}>{error || err}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <form>
                <label>
                    Confirmation Code:
                    <input
                        type="text"
                        value={data.confirmationCode}
                        name="confirmationCode"
                        onChange={(e) => setData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
                        required
                    />
                </label>
                <br />
                <button onClick={handleConfirmSignUp} type="submit">Submit</button>
            </form>
            <br />
            <a onClick={handleResendSignUpConfirmation}>Resend</a>
            <br />
            <p>Already have an account? <a href="/login">Log in here</a></p>
        </div>
    );
}