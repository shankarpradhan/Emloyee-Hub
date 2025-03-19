"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
const employeeData = [
  {
    id: "employee-records",
    title: "Employee Record Management",
    description: "Effortlessly manage employee records with our intuitive system.",
    image: "/images/records.jpeg",
    fullText: `
      Our Employee Record Management system helps organizations efficiently store, retrieve, and manage employee details.
      It ensures all employee records are centralized, secure, and easily accessible. The system supports document uploads, 
      work history tracking, and compliance management. With automated reminders for contract renewals and performance 
      reviews, HR teams can focus on strategic initiatives rather than paperwork.
    `,
  },
  {
    id: "attendance-tracking",
    title: "Attendance Tracking",
    description: "Track employee attendance effortlessly with our innovative tool.",
    image: "/images/attendance.jpeg",
    fullText: `
      Keep your workforce accountable with EmployeeHub's attendance tracking feature. Our system simplifies the process 
      of recording and monitoring employee attendance, ensuring you have accurate data at your fingertips. Employees can 
      clock in and out seamlessly, while managers can generate reports to analyze attendance patterns. This feature helps 
      to identify trends, reduce absenteeism, and improve overall productivity. By automating attendance tracking, you 
      free up valuable time for your HR team to focus on strategic initiatives. 

      Embrace a smarter way to manage attendance and enhance workplace efficiency today!
    `,
  },
  {
    id: "payroll-management",
    title: "Payroll Management",
    description: "Simplify payroll processing with our comprehensive solution.",
    image: "/images/payroll.jpeg",
    fullText: `
      Our Payroll Management solution automates salary calculations, tax deductions, and benefits administration.
      It integrates seamlessly with attendance and performance tracking to ensure accurate and timely payroll processing.
      Employees can access payslips online, request reimbursements, and update tax information via a self-service portal.
      The system complies with government tax regulations and generates financial reports for audits.
    `,
  },
];

export default function EmployeeDetail() {
  const { id } = useParams(); // Get the dynamic route parameter
  const today = new Date();
  const [showScheduler, setShowScheduler] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availableSlots, setAvailableSlots] = useState<{ time: string; available: boolean }[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const employee = employeeData.find((item) => item.id === id);

  

  // Generate available slots dynamically when a date is selected
  useEffect(() => {
    setAvailableSlots(selectedDate ? generateSlots(selectedDate) : []);
  }, [selectedDate]);
  
  if (!employee) {
    return <div className="text-center text-red-600">Employee not found.</div>;
  }


  // Function to generate available time slots
  function generateSlots(date: Date) {
    const now = new Date();
    const dayDiff = (date.getTime() - now.getTime()) / (1000 * 3600 * 24);

    if (dayDiff < -2) {
      // If it's more than 2 days in the past, disable it
      return [];
    }

    if (dayDiff > 3) {
      // If it's beyond 3 days, make slots unavailable
      return [
        { time: "11:00–11:30 am", available: false },
        { time: "11:30–12:00 pm", available: false },
        { time: "12:00–12:30 pm", available: false },
        { time: "12:30–1:00 pm", available: false },
        { time: "1:00–1:30 pm", available: false },
        { time: "1:30–2:00 pm", available: false },
      ];
    }

    return [
      { time: "11:00–11:30 am", available: true },
      { time: "11:30–12:00 pm", available: true },
      { time: "12:00–12:30 pm", available: true },
      { time: "12:30–1:00 pm", available: true },
      { time: "1:00–1:30 pm", available: true },
      { time: "1:30–2:00 pm", available: true },
    ];
  }

  return (
    <div className="flex justify-center p-6 mt-10">
      <div className="max-w-6xl mx-auto p-6  items-center">
        {/* Left Side - Image */}
        <div>
          <Image
            src={employee.image}
            alt={employee.title}
            width={100}
            height={50}
            className="w-full h-[50vh] object-cover rounded-lg shadow-lg"
          />
        </div>

        {/* Right Side - Content */}
        <div>
          <h1 className="text-xl font-bold text-green-600 uppercase">{employee.title}</h1>
          <p className="text-gray-700 mt-4">{employee.fullText}</p>

          {/* Schedule Appointment Button */}
          {!showScheduler ? (
            <button
              onClick={() => setShowScheduler(true)}
              className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-green-700 transition"
            >
              Schedule Appointment
            </button>
          ) : (
            <>
              {/* Date Selection */}
              <div className="mt-6">
                <h2 className="text-lg font-semibold">Select a date</h2>
                <div className="flex gap-4 mt-4">
                  {Array.from({ length: 7 }, (_, index) => {
                    const date = new Date();
                    date.setDate(today.getDate() + index - 2);
                    const isDisabled = index < 2;

                    return (
                      <button
                        key={index}
                        disabled={isDisabled}
                        onClick={() => setSelectedDate(date)}
                        className={`p-3 border rounded-md ${
                          isDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"
                        } ${selectedDate?.toDateString() === date.toDateString() ? "bg-black text-white" : "bg-white"}`}
                      >
                        {date.toDateString().slice(0, 10)}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Slot Selection */}
              {selectedDate && (
                <div className="mt-6">
                  <h2 className="text-lg font-semibold">Available Slots</h2>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    {availableSlots.map((slot, index) => (
                      <button
                        key={index}
                        disabled={!slot.available}
                        onClick={() => setSelectedTime(slot.time)}
                        className={`p-4 text-center border rounded-lg ${
                          selectedTime === slot.time ? "bg-black text-white" : "bg-white"
                        } ${slot.available ? "cursor-pointer hover:bg-gray-100" : "cursor-not-allowed opacity-50"}`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Confirmation Message */}
              {selectedTime && (
                <div className="bg-green-300 p-4 mt-6 text-lg font-semibold text-center">
                  Appointment Confirmed: {selectedDate?.toDateString()} at {selectedTime}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
