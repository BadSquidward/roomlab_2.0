
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
          placeholder="Add specific changes you'd like in the regenerated design..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="resize-none"
        />
      </div>
    </div>
  );
};

export default RegenerationComments;
