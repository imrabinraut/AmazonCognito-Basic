const LogOutService = (router: any) => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userName');

    router.push('/login');
};

export default LogOutService;