import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "email is required." },
        { status: 400 },
      );
    }

    await client.connect();
    const db = client.db(process.env.DB_NAME);

    const user = await db
      .collection("user")
      .findOne(
        { email },
        { projection: { image: 1, role: 1, name: 1, email: 1 } },
      );

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    return NextResponse.json({
      image: user.image ?? "",
      role: user.role ?? "tenant",
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    console.error("[users/me]", err);
    return NextResponse.json(
      { error: "Failed to fetch user." },
      { status: 500 },
    );
  }
}
