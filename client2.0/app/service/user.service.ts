const UserService = () => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const userName = localStorage.getItem('userName');

    return { accessToken, refreshToken, userName }
};

export default UserService;