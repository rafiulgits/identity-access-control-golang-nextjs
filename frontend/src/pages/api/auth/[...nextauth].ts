import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials";
import AzureADProvider from "next-auth/providers/azure-ad";
import { GoogleAuth } from "@/auth/google";
import { CredentialAuth } from "@/auth/credential";
import { AuthService } from "@/service/auth";
import { MicrosoftAuth } from "@/auth/microsoft";



export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider(GoogleAuth.config),
    CredentialsProvider(CredentialAuth.config),
    AzureADProvider(MicrosoftAuth.config)
  ],

  callbacks: {
    async signIn(ctx: any) {
      const { account } = ctx;
      if (GoogleAuth.canProvide(account.provider)) {
        return GoogleAuth.handle(ctx);
      } else if (CredentialAuth.canProvide(account.provider)) {
        return CredentialAuth.handle(ctx);
      } else if (MicrosoftAuth.canProvide(account.provider)) {
        return MicrosoftAuth.handle(ctx)
      }
      return "/auth/error";
    },


    async redirect(ctx: any) {
      const { url, baseUrl } = ctx;
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      } else if (new URL(url).origin === baseUrl) {
        return url;
      }
      return baseUrl;
    },

    async jwt(ctx: any) {
      const { account, token } = ctx;
      if (account) {
        if (GoogleAuth.canProvide(account.provider)) {
          const profile = await GoogleAuth.getProfile(ctx);
          return profile;
        }
        if (CredentialAuth.canProvide(account.provider)) {
          const profile = await CredentialAuth.getProfile(ctx);
          return profile;
        }
        if (MicrosoftAuth.canProvide(account.provider)) {
          const profile = await MicrosoftAuth.getProfile(ctx);
          return profile;
        }
        throw new Error("no authentication provider found");
      }

      // client side access token validate from server side each time
      // skip if client side has stable auth session time
      // return the `token` object only
      const profile = await AuthService.getProfile(token.accessToken);
      return {
        ...profile,
        accessToken: token.accessToken,
      };
    },

    async session(ctx: any) {
      const { session, token } = ctx;
      session.user.id = token.id;
      session.user.name = token.name;
      session.user.policies = token.policies;
      session.user.accounts = token.accounts
      session.accessToken = token.accessToken

      return session;
    },
  },

  // Define custom pages for
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
}

export default NextAuth(authOptions)