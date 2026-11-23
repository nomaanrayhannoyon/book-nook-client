import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.MONGODB_URI!);
const db = client.db("book-nook");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
    // Assignment requires a 6-character minimum; Better Auth defaults to 8.
    minPasswordLength: 6,
  },
  account: {
    accountLinking: {
      enabled: true,

      trustedProviders: ["google"],

      updateUserInfoOnLink: true,
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,

      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  databaseHooks: {
    user: {
      create: {
       
        before: async (user) => {
          if (user.emailVerified !== true) {
            return { data: { ...user, emailVerified: true } };
          }
        },
      },
    },
  },
});
