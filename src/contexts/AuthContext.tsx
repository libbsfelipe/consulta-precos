import { createContext } from "react";
import { signInRequest } from "../pages/api/auth";
import { setCookie, parseCookies } from 'nookies'
import { useState } from "react";
import Router from 'next/router'
import { useEffect } from "react";

interface AuthContextType  {
    isAuthenticated: boolean;
    user: User;
    signIn: (data: SignInData) => Promise<void>
}

interface SignInData  {
    email: string;
    password: string;
}

interface User  {
    name: string;
    email: string;
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({chieldren}){
    const [user, setUser] = useState<User | null>(null);

    const isAuthenticated = !!user;

    useEffect(() => {
        const {'monitor-b2c-token': token} = parseCookies();

        if(token){
            
        }
    }, []);

    async function signIn({email, password}: SignInData) {
        const {token, user} = await signInRequest({
            email,
            password
        });

        setCookie(undefined, 'monitor-b2c-token', token, {
            maxAge: 60 * 60 * 1, // 1 hour  

        });

        setUser(user);

        Router.push('/dashboard');
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, signIn }}>
            {chieldren}
        </AuthContext.Provider>
    )
}