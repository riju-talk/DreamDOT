// app/api/auth/me/route.js
import { NextResponse} from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(req) {
  const session = await getServerSession(authOptions)
  return NextResponse.json({ user: session?.user ?? null })
}
