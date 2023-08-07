import { GoogleAuthClientID, GoogleAuthClientSecret } from "@/util/env-values"
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: GoogleAuthClientID,
      clientSecret: GoogleAuthClientSecret,
    }),
    // ...add more providers here
  ],
}

export default NextAuth(authOptions)