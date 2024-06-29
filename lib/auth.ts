import { NextAuthOptions, User, getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";

import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";
import prisma from "./prisma";

export const authConfig: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Sign in",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.email || !credentials.password)
          return null;
      
        console.log(credentials.email, credentials.password);
      
        try {
          console.log("Authorizing with credentials:", credentials);
      
          const formData = new FormData();
          formData.append("username", credentials.email);
          formData.append("password", credentials.password);
      
          const res = await axios.post("http://localhost:8000/token", formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
      
          // console.log("Response from token endpoint:", res.data);
          const user = res.data;
      
          if (user && user.access_token) {
            return { email: credentials.email, accessToken: user.access_token };
          } else {
            return null;
          }
        } catch (error) {
          // console.error("Error during authorization:", error);
          return null;
        }
      }
      
    }),
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID as string,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    // }),
    // Uncomment if you need GitHub provider
    // GithubProvider({
    //   clientId: process.env.GITHUB_CLIENT_ID as string,
    //   clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    // }),
  ],
};
