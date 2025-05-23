
import { Card } from "@/components/ui/card";

interface DesignDetailsProps {
  roomType: string;
  style: string;
  colorScheme: string;
  dimensions: string;
  budget?: string; // Make budget optional for backward compatibility
}

const DesignDetails = ({ roomType, style, colorScheme, dimensions, budget }: DesignDetailsProps) => {
  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-2">Design Details</h3>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-muted-foreground">Room Type:</span>
          <p>{roomType === "living-room" ? "Living Room" : roomType}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Style:</span>
          <p>{style}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Color Scheme:</span>
          <p>{colorScheme}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Dimensions:</span>
          <p>{dimensions}</p>
        </div>
        {budget && (
          <div className="col-span-2">
            <span className="text-muted-foreground">Budget Range:</span>
            <p>{budget}</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default DesignDetails;
