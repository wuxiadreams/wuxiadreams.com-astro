import { createAuthClient } from "better-auth/react";

// 认证客户端
export const authClient = createAuthClient({});

export const { signIn, signOut, signUp } = authClient;
