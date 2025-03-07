import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/supabase";

type Challenge = Database["public"]["Tables"]["challenges"]["Row"];

interface AddProgressDialogProps {
  challenge: Challenge;
  userId: string;
  onProgressAdded: () => void;
}

export function AddProgressDialog({
  challenge,
  userId,
  onProgressAdded,
}: AddProgressDialogProps) {
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [value, setValue] = useState("");
  const { toast } = useToast();

  const validateAndFormatValue = (value: string, type: string): string => {
    if (!value) throw new Error("Value is required");

    switch (type) {
      case "time": {
        const [hours = "0", minutes = "0", seconds = "0"] = value.split(":");
        const h = hours.padStart(2, "0");
        const m = minutes.padStart(2, "0");
        const s = seconds.padStart(2, "0");
        if (isNaN(Number(h)) || isNaN(Number(m)) || isNaN(Number(s))) {
          throw new Error("Invalid time format");
        }
        return `${h}:${m}:${s}`;
      }
      case "distance": {
        const [_, unit] = challenge.daily_goal.split("|");
        const numValue = Number(value);
        if (isNaN(numValue)) throw new Error("Invalid distance value");
        return `${numValue}|${unit}`;
      }
      case "quantity": {
        const numValue = Number(value);
        if (isNaN(numValue)) throw new Error("Invalid quantity value");
        return numValue.toString();
      }
      case "prose": {
        if (!value.trim()) throw new Error("Prose content cannot be empty");
        return value.trim();
      }
      default:
        throw new Error("Invalid challenge type");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formattedValue = validateAndFormatValue(value, challenge.type);

      const { data, error } = await supabase
        .from("progress_logs")
        .insert({
          challenge_id: challenge.id,
          user_id: userId,
          date: new Date().toISOString().split("T")[0],
          value: formattedValue,
          notes: notes?.trim() || "",
        })
        .select();

      if (error) {
        console.error("Supabase error:", error);
        throw new Error(error.message);
      }

      toast({
        title: "Success",
        description: "Progress logged successfully",
      });
      onProgressAdded();
      setOpen(false);
      setNotes("");
      setValue("");
    } catch (error: any) {
      console.error("Error logging progress:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.message || "Failed to log progress",
      });
    }
  };

  const renderProgressInput = () => {
    switch (challenge.type) {
      case "distance":
        const [_, unit] = challenge.daily_goal.split("|");
        return (
          <div className="space-y-2">
            <Label>Distance ({unit})</Label>
            <Input
              type="number"
              step="0.01"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              required
            />
          </div>
        );
      case "time":
        return (
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label className="text-xs">Hours</Label>
              <Input
                type="number"
                min="0"
                placeholder="0"
                onChange={(e) => {
                  const hours = e.target.value;
                  const [_, minutes, seconds] = value.split(":") || [
                    "0",
                    "0",
                    "0",
                  ];
                  setValue(`${hours}:${minutes || "0"}:${seconds || "0"}`);
                }}
                value={value.split(":")[0] || "0"}
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
                  const [hours, _, seconds] = value.split(":") || [
                    "0",
                    "0",
                    "0",
                  ];
                  setValue(`${hours || "0"}:${minutes}:${seconds || "0"}`);
                }}
                value={value.split(":")[1] || "0"}
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
                  const [hours, minutes] = value.split(":") || ["0", "0"];
                  setValue(`${hours || "0"}:${minutes || "0"}:${seconds}`);
                }}
                value={value.split(":")[2] || "0"}
                required
              />
            </div>
          </div>
        );
      case "quantity":
        return (
          <div className="space-y-2">
            <Label>Quantity</Label>
            <Input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              required
            />
          </div>
        );
      case "prose":
        return (
          <div className="space-y-2">
            <Label>Today's Writing</Label>
            <Textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              required
              className="min-h-[200px]"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Add Progress
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Progress for {challenge.title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {renderProgressInput()}
          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea
              placeholder="How did it go today?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <Button type="submit" className="w-full">
            Log Progress
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
