import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

let client;
let db;

async function getDb() {
  if (!client) {
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    db = client.db(process.env.DB_NAME);
  }
  return db;
}

export async function POST(request) {
  try {
    const { userId, email, photo, role } = await request.json();

    if (!userId && !email) {
      return NextResponse.json(
        { error: "userId or email is required." },
        { status: 400 },
      );
    }

    const db = await getDb();

    let filter;
    try {
      filter = { _id: new ObjectId(userId) };
    } catch {
      filter = { email };
    }

    const result = await db.collection("user").updateOne(filter, {
      $set: {
        image: photo ?? "",
        role: role ?? "tenant",
        updatedAt: new Date(),
      },
    });

    if (result.matchedCount === 0 && email) {
      await db
        .collection("user")
        .updateOne(
          { email },
          {
            $set: {
              image: photo ?? "",
              role: role ?? "tenant",
              updatedAt: new Date(),
            },
          },
        );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[update-profile]", err);
    return NextResponse.json(
      { error: "Failed to update profile." },
      { status: 500 },
    );
  }
}
