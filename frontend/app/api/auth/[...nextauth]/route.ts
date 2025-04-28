// app/api/auth/[...nextauth].ts

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google"; // If you're using Google OAuth

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt", // or "database" depending on your setup
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // Example of adding user info to the JWT
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id; // Attach token information to the session
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
