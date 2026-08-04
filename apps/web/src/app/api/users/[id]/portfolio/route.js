import { prismaItems } from '@/lib/prisma'

export async function GET(request, { params }) {
  try {
    const { id: userId } = await params
    if (!userId) {
      return Response.json({ error: 'User ID required' }, { status: 400 })
    }

    // Fetch all digital assets/items created by this user
    const items = await prismaItems.items.findMany({
      where: {
        user_id: userId,
      },
      select: {
        item_id: true,
        sql_id: true,
        title: true,
        description: true,
        price: true,
        category: true,
        visibility: true,
        created_at: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    })

    const publicItems = items.map((item) => ({
      id: item.sql_id || item.item_id,
      title: item.title,
      description: item.description,
      price: item.price ? parseFloat(item.price.toString()) : 0,
      category: item.category,
      visibility: item.visibility,
      createdAt: item.created_at,
    }))

    return Response.json({ items: publicItems })
  } catch (error) {
    console.error('Error fetching portfolio:', error)
    return Response.json({ error: 'Failed to fetch portfolio' }, { status: 500 })
  }
}
