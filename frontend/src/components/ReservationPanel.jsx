import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  User,
  Mail,
  Lock,
  Car,
  Bike,
  Clock,
} from "lucide-react";
import { MonthlyPassForm } from "./MonthlyPassForm";
import { YearlyPassForm } from "./YearlyPassForm.jsx";

export function ReservationPanel({
  spotId,
  spotType = "car",
  capacity = 1,
  occupancy = 0,
  isOpen,
  onClose,
  // Note: I've updated these to use the internal async logic if you want, 
  // or you can continue passing them from props. 
  // For now, I'm integrating the fetch calls directly inside the handlers.
}) {
  const [step, setStep] = useState(1);
  const [showMonthlyPass, setShowMonthlyPass] = useState(false);
  const [showYearlyPass, setShowYearlyPass] = useState(false);
  const [isVerifyingBikeCancel, setIsVerifyingBikeCancel] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    startTime: "",
    endTime: "",
    vehicleType: spotType,
    durationHours: 0,
  });

  const isOccupiedView = spotType === "car" && occupancy >= capacity;
  const isBikeOccupied = spotType === "bike" && occupancy >= 1;

  const canProceed = (...fields) =>
    fields.every(
      (f) => f !== undefined && f !== null && String(f).trim() !== ""
    );

  /* =======================
      FETCH API FUNCTIONS
  ======================= */
  const onSubmit = async (spotId, data) => {
    try {
      await fetch("http://localhost:5000/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spotId, ...data })
      });
      alert("Reservation Successful!");
      onClose();
    } catch (error) {
      console.error("Error submitting reservation:", error);
    }
  };

  const onCancel = async (spotId, type, count = 1) => {
    try {
      await fetch("http://localhost:5000/api/reservations/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spotId, type, count })
      });
      alert("Reservation Cancelled/Released");
      onClose();
    } catch (error) {
      console.error("Error cancelling reservation:", error);
    }
  };

  /* =======================
      RESET ON OPEN
  ======================= */
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setShowMonthlyPass(false);
      setShowYearlyPass(false);
      setIsVerifyingBikeCancel(false);
      setFormData({
        name: "",
        email: "",
        password: "",
        startTime: "",
        endTime: "",
        vehicleType: spotType,
        durationHours: 0,
      });
    }
  }, [isOpen, spotType]);

  const handlePassSelection = (type) => {
    if (type === "monthly") {
      setShowMonthlyPass(true);
      setShowYearlyPass(false);
    }
    if (type === "yearly") {
      setShowYearlyPass(true);
      setShowMonthlyPass(false);
    }
  };

  const handleReservationSubmit = (e) => {
    e.preventDefault();
    if (!spotId) return;

    const [sh, sm] = formData.startTime.split(":").map(Number);
    const [eh, em] = formData.endTime.split(":").map(Number);

    let start = sh * 60 + sm;
    let end = eh * 60 + em;
    if (end <= start) end += 1440;

    const duration = (end - start) / 60;

    // Trigger the API call
    onSubmit(spotId, { ...formData, durationHours: duration });
  };

  const handleExtendTime = () => {
    if (!formData.endTime) return alert("No end time found");
    const [h, m] = formData.endTime.split(":").map(Number);
    const newHour = Math.min(h + 1, 23);
    const newEnd = `${newHour.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}`;
    setFormData({ ...formData, endTime: newEnd });
    alert(`Extended till ${newEnd}`);
  };

  const setQuickTime = (hrs) => {
    const now = new Date();
    const end = new Date(now.getTime() + hrs * 60 * 60 * 1000);
    const f = (n) => n.toString().padStart(2, "0");

    setFormData({
      ...formData,
      startTime: `${f(now.getHours())}:${f(now.getMinutes())}`,
      endTime: `${f(end.getHours())}:${f(end.getMinutes())}`,
    });
  };

  const PassButtons = () => (
    <div className="mt-10 flex flex-col gap-4">
      {["monthly", "yearly"].map((id) => (
        <motion.button
          key={id}
          type="button"
          onClick={() => handlePassSelection(id)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="w-full py-4 rounded-2xl font-extrabold bg-yellow-400"
        >
          {id === "monthly" ? "Monthly Pass" : "Yearly Pass"}
        </motion.button>
      ))}
    </div>
  );

  /* =======================
      BIKE CANCEL VERIFICATION FORM
  ======================= */
  const BikeVerificationForm = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 mt-4 p-4 border-t border-gray-100"
    >
      <p className="text-sm font-bold text-red-500 uppercase tracking-tight">
        Verify to Release One Slot
      </p>
      <div className="space-y-3">
        <div className="relative">
          <Mail className="absolute left-3 top-3 text-gray-400" size={16} />
          <input
            placeholder="Email"
            className="w-full pl-10 pr-4 py-2 rounded-xl shadow-neu-inset bg-transparent outline-none text-sm"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-3 text-gray-400" size={16} />
          <input
            type="password"
            placeholder="Password"
            className="w-full pl-10 pr-4 py-2 rounded-xl shadow-neu-inset bg-transparent outline-none text-sm"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
        </div>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setIsVerifyingBikeCancel(false)}
          className="w-1/2 py-2 rounded-xl shadow-neu font-bold text-xs bg-gray-100"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => {
            if (canProceed(formData.email, formData.password)) {
              onCancel(spotId, "bike", 1);
              setIsVerifyingBikeCancel(false);
            } else {
              alert("Enter details to verify");
            }
          }}
          className="w-1/2 py-2 rounded-xl shadow-neu font-bold text-xs bg-red-500 text-white"
        >
          Confirm Release
        </button>
      </div>
    </motion.div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          className="fixed inset-y-0 right-0 w-full md:w-96 bg-bg z-50 p-8 overflow-y-auto"
        >
          {/* HEADER */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-700">
              {showMonthlyPass
                ? "Monthly Pass"
                : showYearlyPass
                ? "Yearly Pass"
                : isOccupiedView
                ? "Occupied Spot Access"
                : "Reserve Spot"}
            </h2>
            <button onClick={onClose} className="p-2 rounded-full shadow-neu">
              <X size={20} />
            </button>
          </div>

          {/* SLOT INFO */}
          <div className="mb-8 p-5 rounded-2xl shadow-neu-inset bg-bg flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 font-semibold uppercase">
                Slot Number
              </p>
              <p className="text-3xl font-extrabold text-neu-blue">{spotId}</p>
            </div>
            <div
              className={`h-12 w-12 rounded-full shadow-neu flex items-center justify-center text-white ${
                spotType === "bike" ? "bg-orange-400" : "bg-neu-blue"
              }`}
            >
              {spotType === "bike" ? <Bike size={24} /> : <Car size={24} />}
            </div>
          </div>

          {showMonthlyPass && (
            <MonthlyPassForm onBack={() => setShowMonthlyPass(false)} />
          )}
          {showYearlyPass && (
            <YearlyPassForm onBack={() => setShowYearlyPass(false)} />
          )}

          {!showMonthlyPass && !showYearlyPass && (
            <form onSubmit={handleReservationSubmit}>
              <AnimatePresence mode="wait">
                {/* CAR OCCUPIED FLOW */}
                {isOccupiedView && step === 1 && (
                  <motion.div className="space-y-4">
                    <label className="flex gap-2 text-sm font-bold">
                      <Mail size={16} /> Gmail
                    </label>
                    <input
                      className="w-full px-4 py-3 rounded-xl shadow-neu-inset"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                    <button
                      type="button"
                      onClick={() =>
                        canProceed(formData.email)
                          ? setStep(2)
                          : alert("Enter Gmail")
                      }
                      className="w-full py-3 rounded-xl shadow-neu font-bold"
                    >
                      Next
                    </button>
                  </motion.div>
                )}
                {isOccupiedView && step === 2 && (
                  <motion.div className="space-y-4">
                    <label className="flex gap-2 text-sm font-bold">
                      <Lock size={16} /> Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 rounded-xl shadow-neu-inset"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                    <button
                      type="button"
                      onClick={() =>
                        canProceed(formData.password)
                          ? setStep(3)
                          : alert("Enter Password")
                      }
                      className="w-full py-3 rounded-xl shadow-neu font-bold"
                    >
                      Continue
                    </button>
                  </motion.div>
                )}
                {isOccupiedView && step === 3 && (
                  <motion.div className="flex flex-col gap-4">
                    <button
                      type="button"
                      onClick={handleExtendTime}
                      className="py-3 rounded-xl shadow-neu font-extrabold flex justify-center gap-2"
                    >
                      <Clock size={18} /> Extend Time
                    </button>
                    <button
                      type="button"
                      onClick={() => onCancel(spotId, "car")}
                      className="py-3 rounded-xl shadow-neu font-extrabold text-red-500"
                    >
                      Cancel Reservation
                    </button>
                  </motion.div>
                )}

                {/* NORMAL FLOW & BIKE LOGIC */}
                {!isOccupiedView && step === 1 && (
                  <motion.div className="space-y-4">
                    {!isVerifyingBikeCancel ? (
                      <>
                        <label className="flex gap-2 text-sm font-bold">
                          <User size={16} /> Name
                        </label>
                        <input
                          className="w-full px-4 py-3 rounded-xl shadow-neu-inset"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                        />
                        <button
                          type="button"
                          onClick={() =>
                            canProceed(formData.name)
                              ? setStep(2)
                              : alert("Enter Name")
                          }
                          className="w-full py-3 rounded-xl shadow-neu font-bold"
                        >
                          Next
                        </button>

                        {isBikeOccupied && (
                          <div className="flex flex-col gap-4 mt-6">
                            <button
                              type="button"
                              onClick={handleExtendTime}
                              className="py-3 rounded-xl shadow-neu font-extrabold flex justify-center gap-2 bg-white"
                            >
                              <Clock size={18} /> Extend Time
                            </button>
                            <button
                              type="button"
                              onClick={() => setIsVerifyingBikeCancel(true)}
                              className="py-3 rounded-xl shadow-neu font-extrabold text-red-500 bg-white"
                            >
                              Cancel Reservation
                            </button>
                          </div>
                        )}
                        <PassButtons />
                      </>
                    ) : (
                      <BikeVerificationForm />
                    )}
                  </motion.div>
                )}

                {/* Reservation Steps 2, 3, 4 */}
                {!isOccupiedView && step === 2 && (
                  <motion.div className="space-y-4">
                    <label className="flex gap-2 text-sm font-bold">
                      <Mail size={16} /> Gmail
                    </label>
                    <input
                      className="w-full px-4 py-3 rounded-xl shadow-neu-inset"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                    <button
                      type="button"
                      onClick={() =>
                        canProceed(formData.email)
                          ? setStep(3)
                          : alert("Enter Gmail")
                      }
                      className="w-full py-3 rounded-xl shadow-neu font-bold"
                    >
                      Next
                    </button>
                    <PassButtons />
                  </motion.div>
                )}
                {!isOccupiedView && step === 3 && (
                  <motion.div className="space-y-4">
                    <label className="flex gap-2 text-sm font-bold">
                      <Lock size={16} /> Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 rounded-xl shadow-neu-inset"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                    <button
                      type="button"
                      onClick={() =>
                        canProceed(formData.password)
                          ? setStep(4)
                          : alert("Enter Password")
                      }
                      className="w-full py-3 rounded-xl shadow-neu font-bold"
                    >
                      Next
                    </button>
                    <PassButtons />
                  </motion.div>
                )}
                {!isOccupiedView && step === 4 && (
                  <motion.div className="space-y-5">
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setQuickTime(1)}
                        className="shadow-neu py-2 rounded-xl"
                      >
                        1 Hr
                      </button>
                      <button
                        type="button"
                        onClick={() => setQuickTime(2)}
                        className="shadow-neu py-2 rounded-xl"
                      >
                        2 Hr
                      </button>
                    </div>
                    <input
                      type="time"
                      className="w-full px-4 py-3 rounded-xl shadow-neu-inset"
                      value={formData.startTime}
                      onChange={(e) =>
                        setFormData({ ...formData, startTime: e.target.value })
                      }
                    />
                    <input
                      type="time"
                      className="w-full px-4 py-3 rounded-xl shadow-neu-inset"
                      value={formData.endTime}
                      onChange={(e) =>
                        setFormData({ ...formData, endTime: e.target.value })
                      }
                    />
                    <button
                      type="submit"
                      className="w-full py-4 rounded-xl shadow-neu font-extrabold flex justify-center gap-2"
                    >
                      <Calendar size={20} /> Confirm Reservation
                    </button>
                    <PassButtons />
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}