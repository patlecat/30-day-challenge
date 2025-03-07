import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Medal } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";

interface UserProfile {
  display_name?: string;
  joined_date: string;
}

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [completedChallenges, setCompletedChallenges] = useState<any[]>([]);
  const [achievements, setAchievements] = useState({
    gold: 0,
    silver: 0,
    bronze: 0,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      // Get or create profile
      let { data: profile } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!profile) {
        const { data: newProfile } = await supabase
          .from("user_profiles")
          .insert([{ id: user.id }])
          .select()
          .single();
        profile = newProfile;
      }

      setProfile(profile);

      // Fetch completed challenges
      const { data: challenges } = await supabase
        .from("challenge_participants")
        .select(
          `
          *,
          challenges:challenge_id(*)
        `,
        )
        .eq("user_id", user.id)
        .eq("status", "completed");

      setCompletedChallenges(challenges || []);

      // Fetch achievements
      const { data: achievements } = await supabase
        .from("achievements")
        .select("type")
        .eq("user_id", user.id);

      if (achievements) {
        const counts = achievements.reduce(
          (acc, curr) => {
            acc[curr.type] = (acc[curr.type] || 0) + 1;
            return acc;
          },
          { gold: 0, silver: 0, bronze: 0 },
        );

        setAchievements(counts);
      }
    };

    fetchProfile();
  }, [user]);

  if (!user || !profile) return null;

  return (
    <div className="p-8 bg-background min-h-screen">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-6 mb-8">
          <Avatar className="h-24 w-24">
            <AvatarImage
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
            />
            <AvatarFallback>
              {user.email?.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-4xl font-bold">
              {profile.display_name || user.email}
            </h1>
            <p className="text-muted-foreground">
              Joined {format(new Date(profile.joined_date), "MMMM yyyy")}
            </p>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <Medal className="h-5 w-5 text-yellow-500" />
                <span>{achievements.gold} Gold</span>
              </div>
              <div className="flex items-center gap-2">
                <Medal className="h-5 w-5 text-gray-400" />
                <span>{achievements.silver} Silver</span>
              </div>
              <div className="flex items-center gap-2">
                <Medal className="h-5 w-5 text-amber-700" />
                <span>{achievements.bronze} Bronze</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Challenge History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {completedChallenges.map((participation) => (
                <div
                  key={participation.id}
                  className="flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">
                      {participation.challenges.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Completed{" "}
                      {format(new Date(participation.created_at), "MMM yyyy")}
                    </p>
                  </div>
                  <Medal className="h-5 w-5 text-yellow-500" />
                </div>
              ))}

              {completedChallenges.length === 0 && (
                <p className="text-muted-foreground text-center py-4">
                  No completed challenges yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
