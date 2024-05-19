import { NextResponse } from "next/server"
import { client } from "../../lib/sanity"

export async function GET() {
  try {
    const query = `*[_type == "product"]`
    const products = await client.fetch(query)

    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching products", error },
      { status: 500 }
    )
  }
}
