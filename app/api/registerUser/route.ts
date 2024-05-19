import { NextResponse } from "next/server"
import { client } from "../../lib/sanity"
import { v4 as uuidv4 } from "uuid"

interface UserData {
  email: string
  name: string
  username: string
  role: string
  allergies: { _ref: string }[]
  favoriteProducts: { _ref: string }[]
}

export async function POST(request: Request) {
  try {
    const userData: UserData = await request.json()

    // Verify the structure of userData
    if (
      !userData.email ||
      !userData.name ||
      !userData.username ||
      !userData.role
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      )
    }

    const userDoc = {
      _type: "user",
      _id: uuidv4(), // Benzersiz bir ID oluşturmak için
      ...userData,
    }

    const createdUser = await client.create(userDoc)

    return NextResponse.json({
      message: "User registered successfully",
      userId: createdUser._id,
    })
  } catch (error) {
    console.error("Error registering user:", error) // Log the error for debugging
    return NextResponse.json(
      { message: "Error registering user", error },
      { status: 500 }
    )
  }
}
