"use client"

import { useEffect } from "react";
import LogOutService from "../service/logout.service"
import UserService from "../service/user.service";
import { useRouter } from "next/navigation";
import { RefreshTokenServices } from "../service/refresh-token.services";

export default function Dashboard() {
    const router = useRouter();
    const user = UserService();
    const { error, handleRefreshToken, success } = RefreshTokenServices();

    useEffect(() => {
        if (!user.accessToken && !user.refreshToken && !user.userName) {
            router.push('/login');
        }
    }, []);

    return (user.accessToken && user.refreshToken) ? (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome to Dashboard</p>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <button onClick={() => LogOutService(router)}>Logout</button>
            <p>Want to refresh access token?<a onClick={handleRefreshToken}>Refresh</a></p>
        </div>
    ) : (
        <p>Loading......</p>
    );
}