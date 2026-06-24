import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);

/**
 * POST /api/users/update-profile
 * Body: { userId: string, photo: string, role: string }
 *
 * BetterAuth (MongoDB adapter) stores users with _id as ObjectId.
 * We match by email as a reliable fallback since userId may be a
 * string that doesn't directly map to _id.
 */
export async function POST(request) {
  try {
    const { userId, email, photo, role } = await request.json();

    if (!userId && !email) {
      return NextResponse.json(
        { error: "userId or email is required." },
        { status: 400 },
      );
    }

    await client.connect();
    const db = client.db(process.env.DB_NAME);

    // Try matching by _id (ObjectId) first, fall back to email
    let filter;
    try {
      filter = { _id: new ObjectId(userId) };
    } catch {
      // userId isn't a valid ObjectId — match by email instead
      filter = { email };
    }

    const result = await db.collection("user").updateOne(filter, {
      $set: {
        image: photo ?? "",
        role: role ?? "tenant",
        updatedAt: new Date(),
      },
    });

    if (result.matchedCount === 0) {
      // Last resort: try matching by email if _id didn't work
      if (email) {
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
