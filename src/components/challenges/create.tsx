import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export default function CreateChallenge() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<
    "distance" | "quantity" | "time" | "prose"
  >();
  const [dailyGoal, setDailyGoal] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!type) return;

    try {
      let goalValue = dailyGoal;

      // Format the goal value based on the challenge type
      if (type === "distance") {
        goalValue = dailyGoal; // Keep as is with format "value|unit"
      } else if (type === "time") {
        // Keep time format
      } else if (type !== "prose") {
        // For quantity type, convert to number
        goalValue = dailyGoal;
      }

      if (!user) {
        throw new Error("User not authenticated");
      }

      const { data, error } = await supabase.rpc("create_challenge", {
        title,
        description,
        challenge_type: type,
        daily_goal: goalValue,
        creator_id: user.id,
      });

      if (error) {
        console.error("Error creating challenge:", error);
        throw error;
      }

      console.log("Created challenge:", data);
      console.log("User ID used for creation:", user?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Challenge created successfully",
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create challenge",
      });
    }
  };

  return (
    <div className="p-8 bg-background min-h-screen">
      <h1 className="text-4xl font-bold mb-8">Create New Challenge</h1>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Challenge Name</Label>
              <Input
                placeholder="e.g. 30 Days of Running"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Challenge Description</Label>
              <textarea
                className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Describe your challenge and its rules"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Challenge Type</Label>
              <Select
                value={type}
                onValueChange={(
                  value: "distance" | "quantity" | "time" | "prose",
                ) => setType(value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="distance">Distance</SelectItem>
                  <SelectItem value="quantity">Quantity</SelectItem>
                  <SelectItem value="time">Time</SelectItem>
                  <SelectItem value="prose">Prose</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Daily Goal</Label>
              {type === "prose" ? (
                <textarea
                  className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Write your daily prose here"
                  value={dailyGoal}
                  onChange={(e) => setDailyGoal(e.target.value)}
                  required
                />
              ) : type === "time" ? (
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label className="text-xs">Hours</Label>
                    <Input
                      type="number"
                      min="0"
                      placeholder="0"
                      onChange={(e) => {
                        const hours = e.target.value;
                        const [_, minutes, seconds] = dailyGoal.split(":") || [
                          "0",
                          "0",
                          "0",
                        ];
                        setDailyGoal(
                          `${hours}:${minutes || "0"}:${seconds || "0"}`,
                        );
                      }}
                      value={dailyGoal.split(":")[0] || "0"}
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Minutes</Label>
                    <Input
                      type="number"
                      min="0"
                      max="59"
                      placeholder="0"
                      onChange={(e) => {
                        const minutes = e.target.value;
                        const [hours, _, seconds] = dailyGoal.split(":") || [
                          "0",
                          "0",
                          "0",
                        ];
                        setDailyGoal(
                          `${hours || "0"}:${minutes}:${seconds || "0"}`,
                        );
                      }}
                      value={dailyGoal.split(":")[1] || "0"}
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Seconds</Label>
                    <Input
                      type="number"
                      min="0"
                      max="59"
                      placeholder="0"
                      onChange={(e) => {
                        const seconds = e.target.value;
                        const [hours, minutes] = dailyGoal.split(":") || [
                          "0",
                          "0",
                        ];
                        setDailyGoal(
                          `${hours || "0"}:${minutes || "0"}:${seconds}`,
                        );
                      }}
                      value={dailyGoal.split(":")[2] || "0"}
                      required
                    />
                  </div>
                </div>
              ) : type === "distance" ? (
                <div className="flex space-x-2">
                  <Input
                    type="number"
                    placeholder="e.g. 5"
                    value={dailyGoal.split("|")[0] || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      const unit = dailyGoal.split("|")[1] || "km";
                      setDailyGoal(`${value}|${unit}`);
                    }}
                    className="flex-1"
                    required
                  />
                  <Select
                    value={dailyGoal.split("|")[1] || "km"}
                    onValueChange={(unit) => {
                      const value = dailyGoal.split("|")[0] || "";
                      setDailyGoal(`${value}|${unit}`);
                    }}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="km">Kilometers</SelectItem>
                      <SelectItem value="miles">Miles</SelectItem>
                      <SelectItem value="meters">Meters</SelectItem>
                      <SelectItem value="feet">Feet</SelectItem>
                      <SelectItem value="cm">Centimeters</SelectItem>
                      <SelectItem value="inches">Inches</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <Input
                  type="number"
                  placeholder="e.g. 5"
                  value={dailyGoal}
                  onChange={(e) => setDailyGoal(e.target.value)}
                  required
                />
              )}
            </div>

            <Button type="submit" className="w-full">
              Create Challenge
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
