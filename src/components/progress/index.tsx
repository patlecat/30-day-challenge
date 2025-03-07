import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function TrackProgress() {
  return (
    <div className="p-8 bg-background min-h-screen">
      <h1 className="text-4xl font-bold mb-8">Track Progress</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>30 Days of Running</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={33} className="mb-4" />
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className={`aspect-square rounded border flex items-center justify-center
                  ${i < 10 ? "bg-primary text-primary-foreground" : ""}`}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Daily Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Today's Goal</span>
                <span>5km</span>
              </div>
              <div className="flex justify-between">
                <span>Completed</span>
                <span>3km</span>
              </div>
              <Progress value={60} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Leaderboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{i}.</span>
                    <span>User {i}</span>
                  </div>
                  <span>{30 - i} days streak</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
