import { signInAdmin } from "@/lib/firebase/service";
// import { compare } from "bcrypt";
import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials as { email: string; password: string };
        const admin: any = await signInAdmin({ email });
        if (admin) {
          // const passwordConfirm = await compare(password, admin.password);
          const passwordConfirm = password === admin.password;
          if (passwordConfirm) {
            return admin;
          } else {
            return null;
          }
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    // pakai user karena ini credentials yang harus memakai parameter user!
    async jwt({ token, account, user }: any) {
      if (account?.provider === "credentials") {
        token.nidn = user.nidn;
        token.fullname = user.fullname;
        token.dosenPengajar = user.dosenPengajar;
        token.jabatanDosen = user.jabatanDosen;
        token.email = user.email;
        token.password = user.password;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: any) {
      if ("nidn" in token) {
        session.user.nidn = token.nidn || "Tidak ada Data";
      }
      if ("fullname" in token) {
        session.user.fullname = token.fullname || "Tidak ada Data";
      }
      if ("dosenPengajar" in token) {
        session.user.dosenPengajar = token.dosenPengajar || "Tidak ada Data";
      }
      if ("jabatanDosen" in token) {
        session.user.jabatanDosen = token.jabatanDosen || "Tidak ada Data";
      }
      if ("email" in token) {
        session.user.email = token.email;
      }
      if ("password" in token) {
        session.user.password = token.password;
      }
      if ("role" in token) {
        session.user.role = token.role;
      }
      if ("image" in token) {
        session.user.image = token.image;
      }
      return session;
    },
  },
  pages: {
    signOut: "/",
  },
};

export default NextAuth(authOptions);
export { authOptions };
