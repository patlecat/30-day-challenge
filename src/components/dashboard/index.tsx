import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Users, Calendar } from "lucide-react";
import { AddProgressDialog } from "@/components/challenges/add-progress-dialog";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/supabase";
import { format, differenceInDays, parseISO, addDays } from "date-fns";
import { useAuth } from "@/lib/auth";

type Challenge = Database["public"]["Tables"]["challenges"]["Row"];
type ProgressLog = Database["public"]["Tables"]["progress_logs"]["Row"];

export default function Dashboard() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [progressData, setProgressData] = useState<Record<string, number>>({});
  const { user } = useAuth();

  useEffect(() => {
    const fetchChallenges = async () => {
      if (!user) return;

      // Get challenges for the current user
      const { data, error } = await supabase.rpc("get_challenges_for_user", {
        user_id: user.id,
      });

      console.log("User ID:", user.id);
      console.log("Query error:", error);

      console.log("Fetched challenges:", data);
      if (data) setChallenges(data);

      // Fetch progress data for each challenge
      if (data && data.length > 0) {
        const progressPromises = data.map(async (challenge) => {
          const { data: logs } = await supabase
            .from("progress_logs")
            .select("*")
            .eq("challenge_id", challenge.id)
            .eq("user_id", user.id);

          return {
            challengeId: challenge.id,
            completedDays: logs ? new Set(logs.map((log) => log.date)).size : 0,
          };
        });

        const progressResults = await Promise.all(progressPromises);
        const progressMap = progressResults.reduce(
          (acc, { challengeId, completedDays }) => {
            acc[challengeId] = completedDays;
            return acc;
          },
          {} as Record<string, number>,
        );

        setProgressData(progressMap);
      }
    };

    fetchChallenges();
  }, [user]);

  const calculateRemainingDays = (createdAt: string) => {
    const startDate = parseISO(createdAt);
    const endDate = addDays(startDate, 30);
    const today = new Date();
    const remaining = differenceInDays(endDate, today);
    return remaining > 0 ? remaining : 0;
  };

  const formatGoalDisplay = (challenge: Challenge) => {
    if (!challenge.daily_goal) return "";

    switch (challenge.type) {
      case "distance":
        const [value, unit] = String(challenge.daily_goal).split("|");
        return `${value} ${unit}`;
      case "time":
        const [hours, minutes, seconds] = String(challenge.daily_goal).split(
          ":",
        );
        return `${hours}h ${minutes}m ${seconds}s`;
      case "prose":
        return "Daily writing";
      default:
        return challenge.daily_goal;
    }
  };

  return (
    <div className="p-8 bg-background min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Your Challenges</h1>
        <Link to="/challenges/create">
          <Button>Create Challenge</Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {challenges.map((challenge) => {
          const completedDays = progressData[challenge.id] || 0;
          const remainingDays = calculateRemainingDays(challenge.created_at);
          const progressPercentage = (completedDays / 30) * 100;

          return (
            <Link key={challenge.id} to={`/progress/${challenge.id}`}>
              <Card className="hover:bg-muted/50 transition-colors h-full">
                <CardHeader>
                  <CardTitle>{challenge.title}</CardTitle>
                  {challenge.description && (
                    <CardDescription className="line-clamp-2">
                      {challenge.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{completedDays}/30 days</span>
                    </div>
                    <Progress value={progressPercentage} className="mb-2" />
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        Remaining
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {remainingDays} days
                        </span>
                        <AddProgressDialog
                          challenge={challenge}
                          userId={user?.id || ""}
                          onProgressAdded={() => fetchChallenges()}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <span>Daily Goal</span>
                      <span className="font-medium">
                        {formatGoalDisplay(challenge)}
                      </span>
                    </div>

                    <div className="flex items-center mt-4 text-muted-foreground">
                      <Users className="h-4 w-4 mr-2" />
                      <span>5 participants</span>
                      <Trophy className="h-4 w-4 ml-4 mr-2" />
                      <span>2nd place</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}

        {challenges.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground mb-4">
                You haven't created any challenges yet
              </p>
              <Link to="/challenges/create">
                <Button>Create Your First Challenge</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
