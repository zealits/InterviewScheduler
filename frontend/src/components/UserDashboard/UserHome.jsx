import React, { useState } from "react";
import { Calendar, User, ListChecks, Clock, Users, CheckCircle, TrendingUp, ArrowRight } from "lucide-react";

function UserHome() {
  const [profile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    linkedin: "linkedin.com/in/johndoe"
  });

  const [stats] = useState({
    upcomingInterviews: 12,
    pendingInterviews: 5,
    completedToday: 3,
    growth: "+14%"
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center">
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 w-full text-white p-6 shadow-lg">
        <div className="max-w-8xl  flex justify-between items-center">
          <h1 className="text-3xl mx-auto font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className=" rounded-full bg-white/20 flex items-center justify-center">
                <User size={20} className="text-white" />
              </div>
              <span className="text-white font-medium">{profile.name}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="w-full max-w-7xl p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Calendar Section - Blue Theme */}
          <div className="group relative overflow-hidden bg-white rounded-2xl shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 opacity-95"></div>
            <div className="absolute inset-0 bg-[linear-gradient(40deg,transparent_40%,rgba(255,255,255,0.1)_60%)]"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-400/30 backdrop-blur-md rounded-xl">
                    <Calendar className="text-blue-50" size={24} />
                  </div>
                  <h2 className="text-xl font-bold text-blue-50">Availability Calendar</h2>
                </div>
                <span className="text-blue-100 font-medium">Today's Schedule</span>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-lg">
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 31 }, (_, i) => (
                    <div key={i} 
                         className="aspect-square border border-blue-100 rounded-lg flex items-center justify-center 
                                  hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-all duration-200 
                                  text-blue-900 font-medium group">
                      <span className="group-hover:scale-110 transition-transform duration-200">{i + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Interviews Section - Red Theme */}
          <div className="group relative overflow-hidden bg-white rounded-2xl shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500 to-red-600 opacity-95"></div>
            <div className="absolute inset-0 bg-[linear-gradient(40deg,transparent_40%,rgba(255,255,255,0.1)_60%)]"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-400/30 backdrop-blur-md rounded-xl">
                    <Users className="text-red-50" size={24} />
                  </div>
                  <h2 className="text-xl font-bold text-red-50">Upcoming Interviews</h2>
                </div>
                <div className="flex items-center gap-2 bg-red-400/30 rounded-full px-3 py-1">
                  <TrendingUp size={14} className="text-red-50" />
                  <span className="text-red-50 font-medium">{stats.growth}</span>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center h-48">
                <span className="text-7xl font-bold text-red-50">{stats.upcomingInterviews}</span>
                <div className="flex items-center gap-2 mt-4">
                  <Clock className="text-red-100" size={20} />
                  <p className="text-red-50 text-xl font-medium">Scheduled Today</p>
                </div>
              </div>
              <div className="mt-4 bg-red-400/30 rounded-xl p-4 backdrop-blur-md">
                <div className="flex justify-between items-center">
                  <span className="text-red-100 font-medium">Completed Today</span>
                  <span className="text-red-50 font-bold">{stats.completedToday}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pending Reviews Section - Yellow Theme */}
          <div className="group relative overflow-hidden bg-white rounded-2xl shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-yellow-500 opacity-95"></div>
            <div className="absolute inset-0 bg-[linear-gradient(40deg,transparent_40%,rgba(255,255,255,0.1)_60%)]"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-400/30 backdrop-blur-md rounded-xl">
                    <ListChecks className="text-yellow-900" size={24} />
                  </div>
                  <h2 className="text-xl font-bold text-yellow-900">Pending Reviews</h2>
                </div>
                <button className="bg-yellow-400/30 hover:bg-yellow-400/40 transition-colors rounded-full px-3 py-1 text-yellow-900 font-medium text-sm flex items-center gap-2">
                  View All <ArrowRight size={14} />
                </button>
              </div>
              <div className="flex flex-col items-center justify-center h-48">
                <span className="text-7xl font-bold text-yellow-900">{stats.pendingInterviews}</span>
                <div className="flex items-center gap-2 mt-4">
                  <CheckCircle className="text-yellow-900" size={20} />
                  <p className="text-yellow-900 text-xl font-medium">Awaiting Feedback</p>
                </div>
              </div>
              <div className="mt-4 bg-yellow-400/30 rounded-xl p-4 backdrop-blur-md">
                <div className="flex justify-between items-center">
                  <span className="text-yellow-900 font-medium">Average Response Time</span>
                  <span className="text-yellow-900 font-bold">2.4 hrs</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Section - Purple Theme */}
          <div className="group relative overflow-hidden bg-white rounded-2xl shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-purple-600 opacity-95"></div>
            <div className="absolute inset-0 bg-[linear-gradient(40deg,transparent_40%,rgba(255,255,255,0.1)_60%)]"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-400/30 backdrop-blur-md rounded-xl">
                    <User className="text-purple-50" size={24} />
                  </div>
                  <h2 className="text-xl font-bold text-purple-50">Profile Information</h2>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-purple-400/30 backdrop-blur-md rounded-xl p-4 hover:bg-purple-400/40 transition-colors">
                  <span className="text-purple-200 font-medium text-sm block mb-1">Full Name</span>
                  <span className="text-purple-50 font-medium">{profile.name}</span>
                </div>
                <div className="bg-purple-400/30 backdrop-blur-md rounded-xl p-4 hover:bg-purple-400/40 transition-colors">
                  <span className="text-purple-200 font-medium text-sm block mb-1">Email Address</span>
                  <span className="text-purple-50 font-medium">{profile.email}</span>
                </div>
                <div className="bg-purple-400/30 backdrop-blur-md rounded-xl p-4 hover:bg-purple-400/40 transition-colors">
                  <span className="text-purple-200 font-medium text-sm block mb-1">LinkedIn Profile</span>
                  <a 
                    href={`https://${profile.linkedin}`} 
                    className="text-purple-50 font-medium hover:text-white transition-colors" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    {profile.linkedin}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full text-center py-6 text-gray-600">
        <p>© 2025 Your Company Name. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default UserHome;