import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Settings, Share2, MessageSquare, MapPin, Calendar, LinkIcon } from "lucide-react"
import { getUserProfileFromID } from "@/lib/user-profile/profile-header"
import Link from "next/link"

interface UserProfileData {
  username?: string | null;
  display_name?: string | null;
  avatar_url?: string | null;
  banner_url?: string | null;
  bio?: string | null;
  location?: string | null;
  website?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  social_links?: any;
  dob?: Date | null;
  followers: number;
  following: number;
  join_date?: Date | null;
}

export async function AccountHeader({user_id}: {user_id: string}) {
  const data: UserProfileData = await getUserProfileFromID(user_id);
  return (
    <div className="relative mb-8">
      <div className="relative h-64 w-full rounded-2xl overflow-hidden bg-primary/10">
        <div className="absolute inset-0 bg-primary/5"></div>
      </div>

      {/* Profile Content */}
      <Card className="dream-card -mt-16 mx-4 relative z-10">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
              <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
                <AvatarImage src="/placeholder.svg" alt="@janedoe" />
                <AvatarFallback className="bg-primary text-primary-foreground text-4xl"></AvatarFallback>
              </Avatar>

              <div className="text-center md:text-left md:mb-2">
                <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                  <h1 className="text-3xl font-bold">{data?.display_name}</h1>
                </div>
                <p className="text-muted-foreground text-lg mb-3">@{data?.username}</p>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{data?.location?data?.location:<Link href="/settings">Add your location</Link>}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {data?.join_date?.toDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <LinkIcon className="h-4 w-4" />
                    <a href="#" className="hover:text-primary transition-colors">
                      {data?.website?data?.website:<Link href="/settings">Add your website link here</Link>}
                    </a>
                  </div>
                </div>

                <p className="max-w-2xl text-muted-foreground">
                  {data?.bio===""?"Add your bio here":data?.bio}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 justify-center md:justify-end mb-2">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Follow</Button>
              <Button variant="outline" size="icon" className="rounded-full border-primary/20 hover:bg-primary/10">
                <MessageSquare className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full border-primary/20 hover:bg-primary/10">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full border-primary/20 hover:bg-primary/10">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center md:justify-start space-x-8 text-center mt-6 pt-6 border-t">
            <div>
              <div className="text-2xl text-primary font-bold">{data?.followers}</div>
              <div className="text-sm text-muted-foreground">Followers</div>
            </div>
            <div>
              <div className="text-2xl text-primary font-bold">{data?.following}</div>
              <div className="text-sm text-muted-foreground">Following</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}