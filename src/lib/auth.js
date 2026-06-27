import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

// ─── Lazy MongoDB connection ───────────────────────────────────────────────────
// Do NOT instantiate MongoClient at the top level — it runs at build time
// when MONGODB_URI is undefined, causing build failures on Vercel.
let client;
let db;

function getDb() {
  if (!client) {
    client = new MongoClient(process.env.MONGODB_URI);
    db = client.db(process.env.DB_NAME);
  }
  return db;
}

export const auth = betterAuth({
  database: mongodbAdapter(getDb(), {
    client: (() => {
      if (!client) {
        client = new MongoClient(process.env.MONGODB_URI);
        db = client.db(process.env.DB_NAME);
      }
      return client;
    })(),
  }),

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "tenant",
        input: false,
      },
      image: {
        type: "string",
        required: false,
        defaultValue: "",
        input: false,
      },
    },
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          return {
            data: {
              ...user,
              role: user.role ?? "tenant",
            },
          };
        },
      },
    },
  },
});
