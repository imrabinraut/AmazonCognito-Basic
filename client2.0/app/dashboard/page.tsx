"use client"

import LogOutService from "../service/logout.service"
import UserService from "../service/user.service";
import { useRouter } from "next/navigation";
import { RefreshTokenServices } from "../service/refresh-token.services";
import DashboardService from "../service/dashboard.service";

export default function Dashboard() {
    const router = useRouter();
    const user = UserService();
    const { getDashboardDetail } = DashboardService(router)
    const { error, handleRefreshToken, success } = RefreshTokenServices();
    getDashboardDetail()

    return (user.accessToken && user.refreshToken) ? (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome to Dashboard</p>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <button onClick={() => LogOutService(router).handleLogout()}>Logout</button>
            <p>Want to refresh access token?<a onClick={handleRefreshToken}>Refresh</a></p>
        </div >
    ) : (
        <p>Loading......</p>
    );
}