import { Card, CardContent } from "@/components/ui/card"
import { Users, Target } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { getUserAbout } from "@/lib/user-profile/user-about"
import { handleUpdateUserAbout } from "@/lib/user-profile/user-about-actions"

export async function UserAbout() {
  const about = await getUserAbout()

  return (
    <form action={handleUpdateUserAbout}>
      <Card className="dream-card w-full max-w-2xl mx-auto">
        <CardContent className="pt-6 space-y-6">

          {/* About Me */}
          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              About Me
            </h3>
            <textarea
              name="about"
              className="w-full p-3 border rounded-lg bg-muted/10 resize-none"
              defaultValue={about?.about || ""}
              rows={4}
            />
          </div>

          {/* Goals */}
          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              My Goals
            </h3>
            <textarea
              name="goals"
              className="w-full p-3 border rounded-lg bg-muted/10 resize-none"
              defaultValue={about?.goals || ""}
              rows={4}
            />
          </div>

          {/* Skills */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Skills & Expertise</h3>

            <div className="flex flex-wrap gap-2 mb-2">
              {(about?.skills || []).map((skill, index) => (
                <div key={index}>
                  <input type="hidden" name="skills" value={skill} />
                  <Badge variant="outline" className="bg-muted/50 hover:bg-muted">
                    {skill}
                  </Badge>
                </div>
              ))}
            </div>

            <input
              type="text"
              name="skills"
              className="mt-2 w-full border p-2 rounded bg-muted/5"
              placeholder="Add more skills (comma-separated)"
            />
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">
              Save Changes
            </button>
          </div>

        </CardContent>
      </Card>
    </form>
  )
}
