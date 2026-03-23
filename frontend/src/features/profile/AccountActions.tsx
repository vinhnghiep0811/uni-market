import { LockKeyhole, LogOut } from "lucide-react";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

type AccountActionsProps = {
  isLoggingOut: boolean;
  onLogout: () => void;
};

export default function AccountActions({
  isLoggingOut,
  onLogout,
}: AccountActionsProps) {
  return (
    <Card className="p-5">
      <h2 className="text-base font-semibold text-slate-900">Account Actions</h2>
      <div className="mt-4 space-y-3">
        <a
          href="#"
          className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition duration-200 hover:bg-slate-100"
        >
          <LockKeyhole className="h-4 w-4" />
          Privacy &amp; Security
        </a>

        <Button
          variant="danger"
          className="w-full"
          leadingIcon={<LogOut className="h-4 w-4" />}
          disabled={isLoggingOut}
          onClick={onLogout}
        >
          {isLoggingOut ? "Logging out..." : "Logout"}
        </Button>
      </div>
    </Card>
  );
}
