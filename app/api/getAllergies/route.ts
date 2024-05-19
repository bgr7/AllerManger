import { NextResponse } from "next/server"
import { client } from "../../lib/sanity"

export async function GET() {
  try {
    const query = `*[_type == "allergies"]`
    const allergies = await client.fetch(query)

    return NextResponse.json(allergies)
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching allergies", error },
      { status: 500 }
    )
  }
}
