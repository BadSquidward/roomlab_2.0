
import { Card } from "@/components/ui/card";

interface DesignDetailsProps {
  roomType: string;
  style: string;
  colorScheme: string;
  dimensions: string;
}

const DesignDetails = ({ roomType, style, colorScheme, dimensions }: DesignDetailsProps) => {
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
      </div>
    </Card>
  );
};

export default DesignDetails;
