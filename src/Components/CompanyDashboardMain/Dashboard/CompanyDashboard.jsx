import React, { useState } from "react";
import { SidebarLayout } from "../../../layouts/SidebarLayout";
import { ActionButtons } from "./components/ActionButtons";
import { TopPerformingJobs } from "./components/TopPerformingJobs";
import { RecentActivity } from "./components/RecentActivity";
import { OverviewCards } from "./components/OverviewCards";
import ActiveJobs from "./components/ActiveJobs";

export default function CompanyDashboard() {
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshJobs = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <SidebarLayout>
      <div className="my-10 mx-5">
        {/* ActionButtons should pass refreshJobs to JobPostForm via navigation state */}
        <ActionButtons refreshJobs={refreshJobs} />
        <h2 className="text-lg font-medium mb-4">Overview</h2>
        <OverviewCards />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <RecentActivity />
          <TopPerformingJobs />
        </div>
        <div className="grid grid-cols-1 gap-4 mt-4">
          <ActiveJobs refreshKey={refreshKey} refreshJobs={refreshJobs} />
        </div>
      </div>
    </SidebarLayout>
  );
}