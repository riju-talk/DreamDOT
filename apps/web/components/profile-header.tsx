import { redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Settings,
  Share2,
  MapPin,
  Calendar,
  LinkIcon,
} from "lucide-react";
import { getUserProfile } from "@/lib/user-profile/profile-header";
import Link from "next/link";
import Image from "next/image";

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

export async function ProfileHeader() {
  let data: UserProfileData | null = null;

  try {
    data = await getUserProfile();

    // Also handle if user_id or username were not available
    if (!data?.username && !data?.display_name) {
      redirect("/");
    }

  } catch (err) {
    // Redirect on Prisma errors like undefined user_id
    redirect("/");
  }

  return (
    <div className="relative mb-8">
      <div className="relative h-64 w-full rounded-2xl overflow-hidden bg-primary/10">
      <Image
    src={data.banner_url || "/default-banner.jpg"}
    alt="Banner"
    fill
    className="object-cover"
    priority
  />
      </div>

      {/* Profile Content */}
      <Card className="dream-card -mt-16 mx-4 relative z-10">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
              <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
                <AvatarImage src={data.avatar_url || "/placeholder.svg"} alt="@user" />
                <AvatarFallback className="bg-primary text-primary-foreground text-4xl">
                  {data.username?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="text-center md:text-left md:mb-2">
                <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                  <h1 className="text-3xl font-bold">{data.display_name}</h1>
                </div>
                <p className="text-muted-foreground text-lg mb-3">@{data.username}</p>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {data.location || <Link href="/settings">Add your location</Link>}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {data.join_date?.toDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <LinkIcon className="h-4 w-4" />
                    <a href={data.website || "#"} className="hover:text-primary transition-colors">
                      {data.website || <Link href="/settings">Add your website link</Link>}
                    </a>
                  </div>
                </div>

                <p className="max-w-2xl text-muted-foreground">
                  {data.bio || "Add your bio here"}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 justify-center md:justify-end mb-2">
              <Button variant="outline" size="icon" className="rounded-full border-primary/20 hover:bg-primary/10">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full border-primary/20 hover:bg-primary/10 hover:cursor-pointer">
                <Link href="/settings"><Settings className="h-4 w-4" /></Link>
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center md:justify-start space-x-8 text-center mt-6 pt-6 border-t">
            <div>
              <div className="text-2xl text-primary font-bold">{data.followers}</div>
              <div className="text-sm text-muted-foreground">Followers</div>
            </div>
            <div>
              <div className="text-2xl text-primary font-bold">{data.following}</div>
              <div className="text-sm text-muted-foreground">Following</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
