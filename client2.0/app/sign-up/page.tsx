'use client'

import { useRouter } from "next/navigation";
import SignUpService from "../service/signup.service";
import UserService from "../service/user.service";
import { useEffect } from "react";

export default function SignUp() {
    const router = useRouter();
    const user = UserService();
    const { error, handleSignUp, userData, setUserData } = SignUpService();

    useEffect(() => {
        if (user.accessToken && user.refreshToken) {
            router.push('/dashboard');
        }
    });

    return (!user.accessToken && !user.refreshToken) ?
        (
            <div style={{ maxWidth: '400px', margin: '0 auto' }}>
                <h2>Sign up</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}

                <form onSubmit={handleSignUp}>
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
                    <label>
                        Email:
                        <input
                            type="email"
                            value={userData.email}
                            name="email"
                            onChange={(e) => setUserData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
                            required
                        />
                    </label>
                    <br />
                    <button type="submit">Sign up</button>
                </form>

                <p>Already have an account? <a href="/login">Log in here</a></p>
            </div>
        ) : (
            <p>Loading......</p>
        );
}