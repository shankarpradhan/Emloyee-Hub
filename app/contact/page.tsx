"use client";

declare global {
  interface Window {
    grecaptcha?: {
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

import React, { useState, useEffect } from "react";
import Script from "next/script";

export default function ContactForm() {

  const [submit, setSubmit] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    consent: false,
  });

  const [recaptchaReady, setRecaptchaReady] = useState(false);

  // Handle Input Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  // Ensure reCAPTCHA is loaded
  useEffect(() => {
    if (window.grecaptcha) {
      setRecaptchaReady(true);
    }
  }, []);

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();


    if (!recaptchaReady) {
      alert("reCAPTCHA is not ready. Please wait.");
      return;
    }

    setSubmit(true);

    try {
      // Execute reCAPTCHA
      const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "";
      const recaptchaToken = await window.grecaptcha?.execute(recaptchaSiteKey, { action: "submit" });

      if (!recaptchaToken) {
        alert("reCAPTCHA verification failed. Please try again.");
        return;
      }

      // Submit form data with reCAPTCHA token
      const response = await fetch("/api/sendEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, recaptchaToken }),
      });

      await response.json();
      if (response.ok) {
        alert("✅ Email sent successfully!");

        setTimeout(()=>{
          setFormData({
            name: "",
            email: "",
            phone: "",
            message: "",
            consent: false,
          });
          setSubmit(false);
        }, 2000);
        
      } else {
        alert("❌ Failed to send email.");
        setSubmit(false);
      }
    } catch (error) {
      console.error("🔥 Email error:", error);
      setSubmit(false);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div id="contact" className="max-w-6xl mx-auto p-6 grid md:grid-cols-2 gap-8 items-start">
      {/* Left Side - Contact Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
            placeholder="Jane Smith"
          />
        </div>

        <div>
          <label className="block font-semibold">
            Email address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
            placeholder="email@website.com"
          />
        </div>

        <div>
          <label className="block font-semibold">
            Phone number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
            placeholder="555-555-5555"
          />
        </div>

        <div>
          <label className="block font-semibold">Message</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded h-28"
            placeholder="Your message..."
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="consent"
            checked={formData.consent}
            onChange={handleChange}
            required
            className="mr-2"
          />
          <label className="text-sm">
            I allow this website to store my submission so they can respond to my inquiry.{" "}
            <span className="text-red-500">*</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={submit}
          className={`w-full font-semibold py-2 rounded transition ${
            submit ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 text-white"
          }`}
        >
          {submit ? "Submitting..." : "SUBMIT"}
        </button>
      </form>

      {/* Right Side - Contact Info */}
      <div className="bg-gray-100 p-6 rounded-lg">
        <h2 className="text-lg font-bold">Get in touch</h2>
        <p className="text-green-600 mt-2">
          📧{" "}
          <a href="mailto:shankarpradhan845@gmail.com" className="underline">
            shankarpradhan845@gmail.com
          </a>
        </p>
        <h2 className="text-lg font-bold mt-4">Hours</h2>
        <ul className="mt-2 space-y-1 text-gray-700">
          <li>Monday &nbsp;&nbsp;&nbsp;&nbsp; 9:00am – 10:00pm</li>
          <li>Tuesday &nbsp;&nbsp;&nbsp;&nbsp; 9:00am – 10:00pm</li>
          <li>Wednesday &nbsp;&nbsp;&nbsp;&nbsp; 9:00am – 10:00pm</li>
          <li>Thursday &nbsp;&nbsp;&nbsp;&nbsp; 9:00am – 10:00pm</li>
          <li>Friday &nbsp;&nbsp;&nbsp;&nbsp; 9:00am – 10:00pm</li>
          <li>Saturday &nbsp;&nbsp;&nbsp;&nbsp; 9:00am – 6:00pm</li>
          <li>Sunday &nbsp;&nbsp;&nbsp;&nbsp; 9:00am – 12:00pm</li>
        </ul>
      </div>

      {/* Load reCAPTCHA Script */}
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
        strategy="lazyOnload"
        onLoad={() => setRecaptchaReady(true)}
      />
    </div>
  );
}
