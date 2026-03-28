import { useEffect } from "react";
import Header from "../../components/common/Header";
import AvailabilityForm from "../../components/availability/AvailabilityForm";
import Loader from "../../components/common/Loader";
import { STRINGS } from "../../constants";
import { useAvailability } from "../../hooks/useAvailability";

const AvailabilityPage = () => {
  const { availability, loading, fetchAvailability, saveAvailability } = useAvailability();

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  return (
    <div className="flex h-screen md:h-auto flex-col">
      <Header title={STRINGS.availabilityTitle} subtitle="Set your working hours and availability" />
      <main className="flex-1 overflow-auto p-4 pb-20 md:p-8 md:pb-8">
        {loading ? <Loader /> : <AvailabilityForm availability={availability} onSave={saveAvailability} />}
      </main>
    </div>
  );
};

export default AvailabilityPage;
