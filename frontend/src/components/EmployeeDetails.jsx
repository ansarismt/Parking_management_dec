import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  UserPlus,
  UserCheck,
  Building2,
  MapPin,
} from "lucide-react";
import { ParkingDashboard } from "./ParkingDashboard";

/* Reusable Stat Card */
function StatCard({ icon: Icon, label, count }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-bg shadow-neu">
      <div className="p-3 rounded-full bg-bg shadow-inner text-neu-blue">
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-xl font-bold text-gray-700">{count}</p>
      </div>
    </div>
  );
}

export function EmployeeDetails() {
  const [showParking, setShowParking] = useState(false);

  if (showParking) {
    return <ParkingDashboard />;
  }

  return (
    <div className="min-h-screen bg-bg p-6 font-sans text-text">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <div className="p-4 rounded-full bg-bg shadow-neu text-neu-blue">
              <MapPin size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-700">
                VDart
              </h1>
              <p className="text-gray-500">
                Employee Management Dashboard
              </p>
            </div>
          </motion.div>

          <div className="flex flex-wrap gap-4">
            <StatCard icon={Users} label="Total Employees" count={128} />
            <StatCard icon={UserCheck} label="Active Employees" count={112} />
            <StatCard icon={Building2} label="Visitors Today" count={14} />
          </div>
        </header>

        {/* ACTION CARDS */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* NEW EMPLOYEE */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            onClick={() => setShowParking(true)}
            className="p-8 rounded-2xl bg-bg shadow-neu hover:shadow-inner cursor-pointer transition"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="p-4 rounded-full bg-bg shadow-inner text-neu-blue">
                <UserPlus size={28} />
              </div>
              <h2 className="text-xl font-bold text-gray-700">
                Employee
              </h2>
            </div>
            <p className="text-sm text-gray-500">
              Add employee & manage parking access
            </p>
          </motion.div>

          {/* EXISTING EMPLOYEES */}
          {/*<motion.div
            whileHover={{ scale: 1.03 }}
            onClick={() => setShowParking(true)}
            className="p-8 rounded-2xl bg-bg shadow-neu hover:shadow-inner cursor-pointer transition"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="p-4 rounded-full bg-bg shadow-inner text-neu-blue">
                <Users size={28} />
              </div>
              <h2 className="text-xl font-bold text-gray-700">
                Existing Employees
              </h2>
            </div>
            <p className="text-sm text-gray-500">
              View employees & parking details
            </p>
          </motion.div>
          */}
          {/* VISITORS */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="p-8 rounded-2xl bg-bg shadow-neu hover:shadow-inner cursor-pointer transition"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="p-4 rounded-full bg-bg shadow-inner text-neu-blue">
                <Building2 size={28} />
              </div>
              <h2 className="text-xl font-bold text-gray-700">
                Visitors Lounge
              </h2>
            </div>
            <p className="text-sm text-gray-500">
              Visitor parking & entry management
            </p>
          </motion.div>

        </section>
      </div>
    </div>
  );
}
