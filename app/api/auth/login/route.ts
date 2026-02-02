import { NextResponse } from "next/server"

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      message: "Password login disabled. Use email code login.",
    },
    { status: 410 }
  )
}
