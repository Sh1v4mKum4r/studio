
'use client';
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ShieldAlert } from "lucide-react";
import { AddHealthStatDialog } from "../dashboard/add-health-stat-dialog";
import SOSButton from "../sos/sos-button";
import { useUser } from "@/firebase";

type AppHeaderProps = {
  userName: string;
}

export function AppHeader({ userName }: AppHeaderProps) {
  const { user } = useUser();

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <SidebarTrigger className="md:hidden" />
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="hidden text-xl font-semibold md:block">
            Welcome back, {userName}!
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <AddHealthStatDialog />
          {user && (
            <SOSButton />
          )}
        </div>
      </div>
    </header>
  );
}
