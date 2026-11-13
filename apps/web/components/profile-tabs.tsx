"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { SocialPost } from "./social-post"
import { ProductCard } from "./product-card"
import { SubscriptionTier } from "./subscription-tier"
import { Button } from "@/components/ui/button"
import { Star, Calendar, Award } from "lucide-react"
import { UserAbout } from "./user-about"

const socialPosts = [
  {
    id: "1",
    user: {
      name: "Jane Doe",
      handle: "@janedoe",
      avatar: "/placeholder.svg",
      verified: true,
    },
    timestamp: "2h",
    content: {
      text: "Just finished this amazing piece! What do you think? ✨ #digitalart #creativity",
      media: [
        {
          type: "image" as const,
          url: "/placeholder.svg?height=400&width=600",
          alt: "Digital artwork",
        },
      ],
    },
    engagement: {
      likes: 1243,
      comments: 89,
      shares: 34,
      bookmarks: 156,
    },
    isLiked: false,
    isBookmarked: false,
  },
]

const products = [
  {
    id: "1",
    title: "Digital Art Collection: Neon Dreams",
    image: "/placeholder.svg?height=300&width=400",
    price: "$45",
    category: "Art",
    sales: 243,
    rating: 4.8,
  },
  {
    id: "2",
    title: "Urban Photography Masterclass",
    image: "/placeholder.svg?height=300&width=400",
    price: "$79",
    category: "Course",
    sales: 189,
    rating: 4.9,
  },
]

const subscriptionTiers = [
  {
    id: "basic",
    name: "Dream Supporter",
    price: "$5",
    description: "Support my creative journey",
    benefits: ["Early access to new content", "Exclusive behind-the-scenes", "Monthly Q&A sessions"],
    subscribers: 234,
  },
  {
    id: "premium",
    name: "Dream Collaborator",
    price: "$15",
    description: "Get deeply involved in the creative process",
    benefits: [
      "All Dream Supporter benefits",
      "Monthly 1-on-1 video calls",
      "Custom artwork requests",
      "Priority support",
    ],
    subscribers: 89,
  },
]

export function ProfileTabs({ userId = "" }: { isOwnProfile?: boolean; userId?: string }) {
  return (
    <Tabs defaultValue="posts" className="w-full">
      <TabsList className="grid w-full grid-cols-4 rounded-xl">
        <TabsTrigger value="posts" className="rounded-l-xl">
          Posts
        </TabsTrigger>
        <TabsTrigger value="products">Products</TabsTrigger>
        <TabsTrigger value="collections">Collections</TabsTrigger>
        <TabsTrigger value="about" className="rounded-r-xl">
          About
        </TabsTrigger>
      </TabsList>

      <TabsContent value="posts" className="mt-6">
        <div className="space-y-6">
          {socialPosts.map((post) => (
            <SocialPost key={post.id} post={post} />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="products" className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="subscriptions" className="mt-6">
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">Support My Creative Journey</h3>
            <p className="text-muted-foreground">
              Choose a tier that works for you and get exclusive access to my creative process
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {subscriptionTiers.map((tier) => (
              <SubscriptionTier key={tier.id} tier={tier} />
            ))}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="collections" className="mt-6">
        <Card className="dream-card">
          <CardContent className="pt-6 text-center py-12">
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
                <Star className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">No Collections Yet</h3>
                <p className="text-muted-foreground">Collections will appear here when created</p>
              </div>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Create Collection</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="about" className="mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <UserAbout userId={userId} />
          </div>

          <div className="space-y-6">
            <Card className="dream-card">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Achievements
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span className="text-sm">Featured Artist of the Month</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-secondary"></div>
                    <span className="text-sm">10K+ Followers Milestone</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-accent"></div>
                    <span className="text-sm">Top Seller in Digital Art</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span className="text-sm">Community Choice Award 2024</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="dream-card">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Recent Activity
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last post</span>
                    <span>2 hours ago</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">New product</span>
                    <span>3 days ago</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Live stream</span>
                    <span>1 week ago</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Collection update</span>
                    <span>2 weeks ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}
