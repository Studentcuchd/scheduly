import { useEffect, useMemo } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import BookingConfirmation from "../../components/booking/BookingConfirmation";
import { ROUTES } from "../../constants";

const ConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const bookingData = useMemo(() => location.state || null, [location.state]);

  useEffect(() => {
    if (!bookingData) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      navigate(ROUTES.EVENT_TYPES, { replace: true });
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [bookingData, navigate]);

  if (!bookingData) {
    return <Navigate to={ROUTES.EVENT_TYPES} replace />;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f9fafb] p-4">
      <div className="w-full max-w-lg">
        <BookingConfirmation bookingData={bookingData} />
      </div>
    </main>
  );
};

export default ConfirmationPage;
