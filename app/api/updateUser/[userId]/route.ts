// pages/api/updateUser/[userId].ts

import { NextResponse } from "next/server"
import { client } from "../../../lib/sanity"

interface UserData {
  email?: string
  name?: string
  username?: string
  role?: string
  allergies?: { _ref: string }[]
  favoriteProducts?: { _ref: string }[]
}

export async function PATCH(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const { userId } = params
  console.log("PATCH request received -->>> UserId: " + userId)
  const data: UserData & { _id?: string } = await request.json()
  console.log("PATCH request received -->>> Data: ", data)

  try {
    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { message: "No fields to update" },
        { status: 400 }
      )
    }

    const documentId = data._id || userId

    const existingUser = await client.getDocument(documentId)
    if (!existingUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    const updatedUser = await client.patch(documentId).set(data).commit()

    return NextResponse.json({
      message: "User updated successfully",
      userId: updatedUser._id,
    })
  } catch (error) {
    console.error("Error updating user:", error) // Log the error for debugging
    return NextResponse.json(
      { message: "Error updating user", error },
      { status: 500 }
    )
  }
}
