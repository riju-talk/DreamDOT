import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"

const CHAT_API_URL = process.env.CHAT_API_URL || "http://localhost:3001"
const JWT_SECRET = process.env.NEXTAUTH_SECRET || "your-secret"

export async function GET(req, { params }) {
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

  const res = await fetch(`${CHAT_API_URL}/api/chat/attachments/${params.id}`, {
    headers: { Authorization: `Bearer ${sessionToken}` }
  })
  const headers = new Headers(res.headers)
  headers.set('Access-Control-Allow-Origin', '*')
  return new NextResponse(res.body, { status: res.status, headers })
}
