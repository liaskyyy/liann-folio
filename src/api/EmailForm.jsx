import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";


export default function EmailForm() {
  const formRef = useRef();
  const [status, setStatus] = useState(null);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");

    const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID;
    const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;

    try {
      await emailjs.sendForm(serviceId, templateId, formRef.current, publicKey);
      setStatus("success");
      formRef.current.reset();
    } catch (error) {
      console.error(error.text);
      setStatus("error");
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-6 rounded-2xl shadow-md"
    >
      <h3 className="text-2xl font-semibold mb-4 text-center text-[#3246ea]">
        Send Me a Message
      </h3>

      <label className="block mb-3 text-left">
        <span className="block text-gray-700 mb-1">Name</span>
        <input
          type="text"
          name="user_name"
          className="w-full border p-2 rounded"
          required
        />
      </label>

      <label className="block mb-3 text-left">
        <span className="block text-gray-700 mb-1">Email</span>
        <input
          type="email"
          name="user_email"
          className="w-full border p-2 rounded"
          required
        />
      </label>


      <label className="block mb-3 text-left">
        <span className="block text-gray-700 mb-1">Subject</span>
        <input
          type="text"
          name="subject"
          className="w-full border p-2 rounded"
          required
        />
      </label>

      <label className="block mb-4 text-left">
        <span className="block text-gray-700 mb-1">Message</span>
        <textarea
          name="message"
          rows="5"
          className="w-full border p-2 rounded"
          required
        />
      </label>

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full py-2 bg-[#3246ea] text-white font-semibold rounded hover:bg-blue-700"
      >
        {status === "sending" ? "Sending..." : "Send Message"}
      </button>

      {status === "success" && (
        <p className="text-green-600 mt-3 text-center">
          ✅ Message sent successfully!
        </p>
      )}
      {status === "error" && (
        <p className="text-red-600 mt-3 text-center">
          ❌ Failed to send. Try again later.
        </p>
      )}
    </form>
  );
}
