import { Badge } from "@/components/ui/badge";
import { Radio } from "lucide-react";

export function LiveBadge({ isLive }: { isLive: boolean }) {
  if (!isLive) return null;
  return (
    <Badge variant="live">
      <Radio className="h-3 w-3" />
      AO VIVO
    </Badge>
  );
}
