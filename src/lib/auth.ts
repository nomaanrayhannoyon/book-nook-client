import { APIError, betterAuth } from "better-auth";
import { MongoClient, type Db } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

function createBetterAuth(client: MongoClient, db: Db, baseURL: string) {
  return betterAuth({
    baseURL,
    trustedOrigins: [baseURL],
    database: mongodbAdapter(db, { client }),
    // The UI validates this too, but enforce it at the API boundary so direct
    // requests cannot create weak-password accounts.
    hooks: {
      before: async (ctx) => {
        // Runs for every auth endpoint; only sign-up sends name + email + password.
        const body = ctx.body as
          | { name?: unknown; email?: unknown; password?: unknown }
          | undefined;
        if (
          !body ||
          typeof body.name !== "string" ||
          typeof body.email !== "string"
        ) {
          return;
        }
        const password = body.password;
        if (
          typeof password !== "string" ||
          password.length < 6 ||
          !/[A-Z]/.test(password) ||
          !/[a-z]/.test(password)
        ) {
          throw new APIError("BAD_REQUEST", {
            message:
              "Password must be at least 6 characters and contain both uppercase and lowercase letters",
            code: "PASSWORD_REQUIREMENTS_NOT_MET",
          });
        }
      },
    },
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
}

type AuthInstance = ReturnType<typeof createBetterAuth>;

interface AuthCache {
  client: MongoClient;
  db: Db;
  auth: AuthInstance;
}

// Reuse across warm serverless invocations, but never reuse a dead topology.
const globalForAuth = globalThis as unknown as { bookNookAuth?: AuthCache };

function createAuthCache(): AuthCache {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is missing from the environment");

  const client = new MongoClient(uri, {
    // Fail fast instead of hanging for 30s when Atlas is briefly unavailable.
    serverSelectionTimeoutMS: 10_000,
    // Vercel lambdas + a shared Atlas cluster have a low connection ceiling.
    maxPoolSize: 5,
    minPoolSize: 0,
    retryWrites: true,
  });
  const db = client.db("book-nook");
  const baseURL = process.env.BETTER_AUTH_URL || "http://localhost:3000";

  const auth = createBetterAuth(client, db, baseURL);
  return { client, db, auth };
}

/**
 * Returns a Better Auth instance backed by a live MongoDB client.
 *
 * A serverless function that loses its Atlas connection keeps the same closed
 * driver topology on every warm invocation ("MongoTopologyClosedError"). A
 * cheap ping detects that state and replaces both the client and the auth
 * instance before any credential/session work is attempted.
 */
export async function getAuth(): Promise<AuthInstance> {
  let cache = globalForAuth.bookNookAuth ?? createAuthCache();

  try {
    await cache.client.db("admin").command({ ping: 1 });
  } catch {
    await cache.client.close().catch(() => {});
    cache = createAuthCache();
    globalForAuth.bookNookAuth = cache;
    await cache.client.db("admin").command({ ping: 1 });
  }

  globalForAuth.bookNookAuth = cache;
  return cache.auth;
}
