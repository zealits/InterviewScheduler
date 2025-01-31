import { useLocation, useParams } from "react-router-dom";

const SlotDetails = () => {
  const { name } = useParams();
  const location = useLocation();
  const user = location.state?.user || {};

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-blue-800 mb-4">
          {name}'s Slot Details
        </h1>
        <div className="space-y-2">
          <p className="text-gray-700">
            <span className="font-semibold">Specialization:</span> {user.specialization || "N/A"}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Mode:</span> {user.mode || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SlotDetails;
