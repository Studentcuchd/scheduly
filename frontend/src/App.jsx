import { lazy, Suspense } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import Sidebar from "./components/common/Sidebar";
import { ROUTES } from "./constants";

const EventTypesPage = lazy(() => import("./pages/admin/EventTypesPage"));
const AvailabilityPage = lazy(() => import("./pages/admin/AvailabilityPage"));
const MeetingsPage = lazy(() => import("./pages/admin/MeetingsPage"));
const AnalyticsDashboard = lazy(() => import("./pages/admin/AnalyticsDashboard"));
const SettingsPage = lazy(() => import("./pages/admin/SettingsPage"));
const BookingPage = lazy(() => import("./pages/public/BookingPage"));
const ConfirmationPage = lazy(() => import("./pages/public/ConfirmationPage"));

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-[var(--brand-bg)] md:flex transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 md:h-screen md:overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--brand-bg)] flex items-center justify-center text-[var(--brand-muted)]">
          Loading...
        </div>
      }
    >
      <Routes>
        <Route path={ROUTES.ROOT} element={<Navigate to={ROUTES.ANALYTICS} replace />} />
        <Route path="/admin" element={<Navigate to={ROUTES.ANALYTICS} replace />} />

        <Route element={<AdminLayout />}>
          <Route path={ROUTES.ANALYTICS} element={<AnalyticsDashboard />} />
          <Route path={ROUTES.EVENT_TYPES} element={<EventTypesPage />} />
          <Route path={ROUTES.AVAILABILITY} element={<AvailabilityPage />} />
          <Route path={ROUTES.MEETINGS} element={<MeetingsPage />} />
          <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
        </Route>

        <Route path="/book/:slug" element={<BookingPage />} />
        <Route path="/book/:slug/confirm" element={<ConfirmationPage />} />
        <Route path="/:username/:slug" element={<BookingPage />} />
        <Route path="/:username/:slug/confirm" element={<ConfirmationPage />} />
        <Route path="*" element={<Navigate to={ROUTES.ANALYTICS} replace />} />
      </Routes>
    </Suspense>
  );
};

export default App;
