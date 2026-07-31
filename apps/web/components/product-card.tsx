import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface ProductCardProps {
  product: {
    id: string
    title: string
    image: string
    price: string
    category: string
    sales: number
    rating: number
  }
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="dream-card overflow-hidden group">
      <CardContent className="p-0">
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.title}
            fill
            className="object-cover transition-all duration-700 group-hover:scale-105"
          />
          <Badge className="absolute top-3 right-3 bg-primary/90 text-primary-foreground backdrop-blur-sm">{product.category}</Badge>
        </div>
        <div className="p-5">
          <div className="space-y-2">
            <Link
              href={`/product/${product.id}`}
              className="font-semibold line-clamp-1 hover:text-primary transition-colors"
            >
              {product.title}
            </Link>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="font-bold text-xl text-primary">{product.price}</div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-medium text-muted-foreground">{product.rating}</span>
            </div>
          </div>
          <div className="text-sm text-muted-foreground mt-1">{product.sales} sold</div>
        </div>
      </CardContent>
      <CardFooter className="p-5 pt-0">
        <Button className="w-full gap-2 rounded-xl shadow-[var(--shadow-glow)]">
          <ShoppingCart className="h-4 w-4" />
          View Product
        </Button>
      </CardFooter>
    </Card>
  )
}
