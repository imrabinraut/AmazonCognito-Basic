import axios from "axios";
import UserService from "./user.service";
import LogOutService from "./logout.service";

const API_URL = 'http://localhost:5169/api';

const DashboardService = (router: any) => {
    const user = UserService();
    if (!user.accessToken && !user.refreshToken && !user.userName) {
        router.push('/login');
    }
    const getDashboardDetail = async () => {
        try {

            const response = await axios.get(`${API_URL}/dashboard?accessToken=${user.accessToken}`);
            if (response?.data?.status != "200") {
                LogOutService(router).handleLogout();
            }
        } catch (e: any) {
            LogOutService(router).handleLogout();
        }
    };
    return { getDashboardDetail }
};

export default DashboardService;