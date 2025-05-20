
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface RegenerationCommentsProps {
  value: string;
  onChange: (value: string) => void;
}

const RegenerationComments = ({ value, onChange }: RegenerationCommentsProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="regenerationComment">Regeneration Comments</Label>
        <Textarea
          id="regenerationComment"
          placeholder="Add specific changes you'd like in the regenerated design... (e.g., 'more minimalist', 'brighter colors', 'add a plant')"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="resize-none"
          rows={3}
        />
        <p className="text-xs text-muted-foreground">
          Your comments will guide the AI to modify the current design based on your feedback.
          Be specific about what elements you want to change or add.
        </p>
      </div>
    </div>
  );
};

export default RegenerationComments;
