import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import { authService } from "@/api/authService";
import { AuthResponse } from "@/types";
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";

export const useRegister = () => {
    const { login } = useAuthStore();

    return useMutation({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        mutationFn: async (userData: any) => {
            const response = await authService.registerUser({
                email: userData.email,
                password: userData.password,
                username: userData.username,
                identifier_name: userData.identifierName,
            });
            if (response.access_token && response.refresh_token) {

                login(response.access_token, response.refresh_token);

                return { access_token: response.access_token, refresh_token: response.refresh_token };

            } else {
                throw new Error('Registration failed');
            }
        },

        onSuccess: async (response: AuthResponse) => {
            login(response.access_token, response.refresh_token);
            console.log('Registration successful');
        },
    });
};

export const useLogin = () => {
    const { login, setUser } = useAuthStore();
    const navigate = useNavigate();

    return useMutation<
        { access_token: string; refresh_token: string },
        Error,                                         
        { email: string; password: string }
    >({
        mutationFn: async ({ email, password }) => {
            const response = await authService.loginUser({ email, password });
            if (response.access_token && response.refresh_token) {

                // Mettre à jour le store avec les tokens
                login(response.access_token, response.refresh_token);


                return { access_token: response.access_token, refresh_token: response.refresh_token };
            } else {
                throw new Error('Login failed');
            }
        },

        onSuccess: async (response: AuthResponse) => {
            login(response.access_token, response.refresh_token);
            const res = await authService.getUserByToken(response.access_token);
            setUser(res?.user || null);
            console.log('Login successful');
            navigate('/home');
        },
    });
};


export const useAutoLogin = () => {
    const { login, setUser, setIsAuthenticated } = useAuthStore();

    return useQuery({
        queryKey: ['autoLogin'],
        queryFn: async () => {
            const access_token = Cookies.get('access_token');
            const refresh_token = Cookies.get('refresh_token');
            if (access_token && refresh_token) {
                try {
                    const response = await authService.getUserByToken(access_token);
                    login(access_token, refresh_token);
                    setUser(response?.user || null);
                    setIsAuthenticated(true);
                    return true;

                } catch (error) {
                    console.error('Failed to fetch user by token:', error);
                    if (refresh_token) {
                        try {
                            const newTokens = await authService.refreshToken(refresh_token);
                            if (!newTokens) throw new Error('Failed to refresh tokens');

                            const userData = await authService.getUserByToken(newTokens.access_token);
                            login(newTokens.access_token, newTokens.refresh_token);
                            setUser(userData?.user || null);
                            setIsAuthenticated(true);
                            console.log('Auto login successful with refreshed token');
                            return true;
                        } catch (_) {
                            console.error('Failed to refresh token, user needs to log in again.');
                            handleLogout();
                        }
                    }
                }
            } else {
                handleLogout();
                console.log('No token available in localStorage');
            }
            return false;
        },
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });
};


export const useLogout = () => {

    return useMutation({
        mutationFn: async () => {
            const refresh_token = Cookies.get('refresh_token');
            if (refresh_token) {
                await authService.logout(refresh_token);
                handleLogout();
            }

        },
    });
};


const handleLogout = () => {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    useAuthStore.getState().logout();
};
