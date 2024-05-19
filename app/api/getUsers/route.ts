import { NextResponse } from "next/server"
import { client } from "../../lib/sanity"

export async function GET() {
  try {
    const query = `*[_type == "user"]`
    const users = await client.fetch(query)

    return NextResponse.json(users)
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching users", error },
      { status: 500 }
    )
  }
}
