
"use client";

import React, { createContext, useState, useEffect, useContext } from 'react';
import userService from '../services/userService'; 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const initAuth = () => {
            if (typeof window !== "undefined") {
                const token = localStorage.getItem('token');
                const savedUser = localStorage.getItem('user');

                if (token && savedUser) {
                    try {
                        setUser(JSON.parse(savedUser));
                    } catch (e) {
                        console.error("Erreur session corrompue", e);
                        localStorage.clear();
                    }
                }
                setLoading(false);
            }
        };
        initAuth();
    }, []);
    const login = async (email, password) => {
        try {
            const data = await userService.login(email, password);
            const token = data.accessToken || data.token;
        
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('role', data.user?.role);
            localStorage.setItem('userId', data.user?.id?.toString());
            setUser(data.user);
            return data;
        } catch (error) {
            throw error;
        }
    };
    const logout = () => {
        localStorage.clear();
    
        setUser(null);
        if (typeof window !== "undefined") {
            window.location.replace("/"); 
        }
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            login, 
            logout, 
            loading, 
            isAuthenticated: !!user 
        }}>
            {!loading ? children : (
                <div className="min-h-screen flex items-center justify-center bg-white">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#002FA7]"></div>
                </div>
            )}
        </AuthContext.Provider>
    );
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
    }
    return context;
};