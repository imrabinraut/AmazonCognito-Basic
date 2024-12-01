import axios from "axios";
import UserService from "./user.service";

const API_URL = 'http://localhost:5169/api';

const LogOutService = (router: any) => {
    const user = UserService();

    const handleLogout = async () => {
        try {
            await axios.post(`${API_URL}/sign-out`, { AccessToken: user.accessToken });
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('userName');
            router.push('/login');
        }
        catch (e: any) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('userName');
            router.push('/login');
        }
    }
    return { handleLogout }
};

export default LogOutService;