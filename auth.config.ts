import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

export default {
  providers: [Google],
  callbacks: {
    session({ session, token }) {
      session.user.id = token.id;
      return session;
    },
  },
} satisfies NextAuthConfig;
