import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Medal } from "lucide-react";

export default function Profile() {
  return (
    <div className="p-8 bg-background min-h-screen">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-6 mb-8">
          <Avatar className="h-24 w-24">
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-4xl font-bold">John Doe</h1>
            <p className="text-muted-foreground">Joined January 2024</p>
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
                <span>5 Gold</span>
              </div>
              <div className="flex items-center gap-2">
                <Medal className="h-5 w-5 text-gray-400" />
                <span>8 Silver</span>
              </div>
              <div className="flex items-center gap-2">
                <Medal className="h-5 w-5 text-amber-700" />
                <span>12 Bronze</span>
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
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">30 Days of Running</p>
                    <p className="text-sm text-muted-foreground">
                      Completed Jan 2024
                    </p>
                  </div>
                  <Medal className="h-5 w-5 text-yellow-500" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
