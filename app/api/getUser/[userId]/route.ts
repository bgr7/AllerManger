import { NextResponse } from "next/server"
import { client } from "../../../lib/sanity"

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const { userId } = params

  try {
    const query = `*[_type == "user" && id == "${userId}"][0]`
    const user = await client.fetch(query, { userId })

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching user", error },
      { status: 500 }
    )
  }
}
