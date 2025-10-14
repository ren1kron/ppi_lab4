import { RouteObject } from "react-router-dom";
import Dashboard from "@pages/Dashboard";
import TicketsPage from "@pages/tickets/TicketsPage";
import CandidatesPage from "@pages/candidates/CandidatesPage";
import RebootPage from "@pages/reboot/RebootPage";
import OrphansPage from "@pages/orphans/OrphansPage";
import ReportsPage from "@pages/reports/ReportsPage";
import NotFound from "@pages/NotFound";

export const routes: RouteObject[] = [
  { path: "/", element: <Dashboard /> },
  { path: "/tickets", element: <TicketsPage /> },
  { path: "/candidates", element: <CandidatesPage /> },
  { path: "/reboot", element: <RebootPage /> },
  { path: "/orphans", element: <OrphansPage /> },
  { path: "/reports", element: <ReportsPage /> },
  { path: "*", element: <NotFound /> }
];
