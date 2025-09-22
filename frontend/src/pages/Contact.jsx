import { useState } from "react";
import API from "../api/axios";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState(null); // null | "sending" | "sent" | "error"

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    try {
      await API.post("contact/messages/", form);
      setForm({ name: "", email: "", subject: "", message: "" });
      setStatus("sent");
      setTimeout(() => setStatus(null), 3000); // auto close modal
    } catch (err) {
      console.error(err);
      setStatus("error");
      setTimeout(() => setStatus(null), 3000);
    }
  };

  const inputBase =
    "w-full p-3 rounded transition-colors duration-150 outline-none placeholder-gray-400 " +
    "bg-gray-900 border-2 border-gradient-to-r from-cyan-400 to-purple-600 text-gray-100 hover:bg-white hover:text-black focus:bg-white focus:text-black focus:ring-2 focus:ring-cyan-400";

  return (
    <div className="max-w-xl mx-auto py-8">
      <h2 className="text-3xl font-bold mb-4 text-white">Contact</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Your name"
          className={inputBase}
          required
        />
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Your email"
          className={inputBase}
          required
        />
        <input
          name="subject"
          value={form.subject}
          onChange={handleChange}
          placeholder="Subject"
          className={inputBase}
        />
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Message"
          rows="6"
          className={inputBase}
          required
        />

        <button
          type="submit"
          className="px-6 py-3 rounded bg-gradient-to-r from-cyan-400 to-purple-600 text-black font-semibold hover:scale-[1.2] transition-transform"
        >
          Send message
        </button>
      </form>

      {/* 🔄 Modal States */}
      {status && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl shadow-xl p-8 flex flex-col items-center animate-pop">
            {status === "sending" && (
              <>
                <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-white font-medium">Sending your message...</p>
              </>
            )}
            {status === "sent" && (
              <>
                <svg
                  className="w-16 h-16 text-green-400 animate-bounce"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <p className="mt-4 text-green-400 font-semibold">Message sent successfully!</p>
              </>
            )}
            {status === "error" && (
              <>
                <svg
                  className="w-16 h-16 text-red-500 animate-pulse"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <p className="mt-4 text-red-400 font-semibold">Failed to send. Try again later.</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
