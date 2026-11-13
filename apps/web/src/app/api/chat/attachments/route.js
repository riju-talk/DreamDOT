import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"

const CHAT_API_URL = process.env.CHAT_API_URL || "http://localhost:3001"
const JWT_SECRET = process.env.NEXTAUTH_SECRET || "your-secret"

export async function POST(req) {
  const authHeader = req.headers.get("authorization")
  let sessionToken = null

  if (authHeader && authHeader.startsWith("Bearer ")) {
    sessionToken = authHeader.split(" ")[1]
    try {
      jwt.verify(sessionToken, JWT_SECRET)
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }
  } else {
    return NextResponse.json({ error: "Missing token" }, { status: 401 })
  }

  const formData = await req.formData()
  const body = new FormData()
  for (const [key, value] of formData.entries()) body.append(key, value)
  const res = await fetch(`${CHAT_API_URL}/api/chat/attachments`, {
    method: "POST",
    headers: { Authorization: `Bearer ${sessionToken}` },
    body
  })
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}
