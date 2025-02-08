import React from "react";
import { Home, Calendar, User, ListChecks, LogOut } from "lucide-react";

function UserHome() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <header className="bg-blue-600 w-full text-white p-4 shadow-lg">
        <h1 className="text-2xl font-semibold text-center">Welcome to User Dashboard</h1>
      </header>

      <main className="flex flex-col gap-6 w-full max-w-3xl mt-6">
        <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4 hover:bg-blue-50">
          <Home className="text-blue-600" size={32} />
          <div>
            <h2 className="text-lg font-bold">Home</h2>
            <p className="text-gray-600">Explore the main dashboard for an overview of all features.</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4 hover:bg-blue-50">
          <Calendar className="text-blue-600" size={32} />
          <div>
            <h2 className="text-lg font-bold">Availability</h2>
            <p className="text-gray-600">Set and manage your availability for upcoming events or tasks.</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4 hover:bg-blue-50">
          <User className="text-blue-600" size={32} />
          <div>
            <h2 className="text-lg font-bold">Upcoming Interviews</h2>
            <p className="text-gray-600">View and prepare for your scheduled interviews.</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4 hover:bg-blue-50">
          <ListChecks className="text-blue-600" size={32} />
          <div>
            <h2 className="text-lg font-bold">Profile Update</h2>
            <p className="text-gray-600">Keep your profile updated with the latest information.</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4 hover:bg-blue-50">
          <ListChecks className="text-blue-600" size={32} />
          <div>
            <h2 className="text-lg font-bold">Pending Approvals</h2>
            <p className="text-gray-600">Review and respond to any pending approvals.</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4 hover:bg-blue-50">
          <LogOut className="text-blue-600" size={32} />
          <div>
            <h2 className="text-lg font-bold">Logout</h2>
            <p className="text-gray-600">Sign out of your account securely.</p>
          </div>
        </div>
      </main>

      <footer className="bg-gray-200 w-full text-center py-4 mt-6">
        <p className="text-gray-600">© 2024 Your Company Name. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default UserHome;
