'use client'

import LoginService from "../service/login.service";

export default function Login() {
    const { error, handleLogin, userData, setUserData } = LoginService();

    return (
        <div style={{ maxWidth: '480px', margin: '0 auto' }}>
            <h2>Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleLogin}>
                <label>
                    Username:
                    <input
                        type="text"
                        value={userData.userName}
                        name='userName'
                        onChange={(e) => setUserData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
                        required
                    />
                </label>
                <br />
                <label>
                    Password:
                    <input
                        type="password"
                        value={userData.password}
                        name="password"
                        onChange={(e) => setUserData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
                        required
                    />
                </label>
                <br />
                <button type="submit">Login</button>
            </form>

            <p>Don't have an account? <a href="/sign-up">Sign up here</a></p>
            <a href="/forgot-password">Forgot Password?</a>
        </div>
    );
}