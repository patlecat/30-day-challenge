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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from("progress_logs").insert({
        challenge_id: challenge.id,
        user_id: userId,
        date: new Date().toISOString().split("T")[0],
        value: Number(value),
        notes,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Progress logged successfully",
      });
      onProgressAdded();
      setOpen(false);
      setNotes("");
      setValue("");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to log progress",
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
