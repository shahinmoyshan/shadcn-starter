import { Frown } from "lucide-react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

import { Link } from "react-router";
import { route } from "@/lib/utils";

export default function NotFound() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Frown />
        </EmptyMedia>
        <EmptyTitle>Not Found</EmptyTitle>
        <EmptyDescription>
          The page you are looking for does not exist. Please check the URL or
          return to the <Link to={route("/")}>dashboard</Link>.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyDescription>
        Need help? <Link to={route("support")}>Contact support</Link>
      </EmptyDescription>
    </Empty>
  );
}
