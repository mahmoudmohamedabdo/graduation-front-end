import React from "react";
import { SidebarLayout } from "../../../layouts/SidebarLayout";
import { ActionButtons } from "./components/ActionButtons";
import { TopPerformingJobs } from "./components/TopPerformingJobs";
import { RecentActivity } from './components/RecentActivity';
import { OverviewCards } from "./components/OverviewCards";
import { ActiveJobs } from "./components/ActiveJobs";
export default function CompanyDashboard() {
  return (
    <SidebarLayout>
      <div className="my-10 mx-5">
        <ActionButtons />
        <h2 className="text-lg font-medium mb-4">Overview</h2>
        <OverviewCards />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <RecentActivity />
          <TopPerformingJobs />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <ActiveJobs />
        </div>
      </div>
    </SidebarLayout>
  );
}
