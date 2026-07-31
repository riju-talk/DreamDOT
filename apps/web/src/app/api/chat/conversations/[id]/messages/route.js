import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { fetchMessages, sendMessage } from "@/lib/mongoose/conversations"

export async function GET(req, { params }) {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params
    const { messages } = await fetchMessages(id, session.user.id)
    return NextResponse.json({ messages })
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req, { params }) {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { content, type } = body

    if (!content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { message } = await sendMessage({
      conversationId: params.id,
      senderId: session.user.id,
      senderName: session.user.name || 'User',
      senderAvatar: session.user.image,
      content,
      type: type || 'text'
    })

    return NextResponse.json({ message })
  } catch (error) {
    console.error("Error sending message:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
