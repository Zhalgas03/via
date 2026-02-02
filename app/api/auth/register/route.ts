import { NextResponse } from "next/server"

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      message: "Registration disabled. Users are created via email login.",
    },
    { status: 410 }
  )
}
