'use client'

import ForgotPasswordService from "../service/forgot-password.service"

export default function ForgotPassword() {
    const { error, handleForgotpassword, userData, setUserData } = ForgotPasswordService();

    return (
        <div style={{ maxWidth: '480px', margin: '0 auto' }}>
            <h2>Forgot Password</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form>
                <label>
                    Username:
                    <input
                        type="text"
                        value={userData.userName}
                        name="userName"
                        onChange={(e) => setUserData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
                        required
                    />
                </label>
                <br />
                <button onClick={handleForgotpassword} type="submit">Submit</button>
            </form>
        </div>
    )
}