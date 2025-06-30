"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// ✅ Create Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [session, setSession] = useState(null);
  const [message, setMessage] = useState("");

  // ✅ This part STAYS EXACTLY THE SAME
  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1));
    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");

    if (access_token && refresh_token) {
      supabase.auth.setSession({
        access_token,
        refresh_token,
      }).then(({ data, error }) => {
        if (error) {
          console.error(error);
          setMessage("❌ Failed to set session");
        } else {
          setSession(data.session);
        }
      });
    } else {
      setMessage("❌ Auth session missing!");
    }
  }, []);

  // ✅ Matches your Streamlit password rules
  function passwordValid(password: string) {
    return (
      password.length >= 8 &&
      /[A-Za-z]/.test(password) &&
      /\d/.test(password) &&
      /[!@#$%^&*(),.?":{}|<>]/.test(password)
    );
  }

  const handleUpdate = async () => {
    setMessage("");

    if (password !== confirmPassword) {
      setMessage("❌ Passwords do not match.");
      return;
    }

    if (!passwordValid(password)) {
      setMessage(
        "❌ Password must be at least 8 characters and include a letter, a number, and a special character."
      );
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      console.error(error);
      setMessage(`❌ ${error.message}`);
    } else {
      setMessage("✅ Password updated! You can return to your app.");
    }
  };

  return (
    <main style={{ maxWidth: 400, margin: "2rem auto", textAlign: "center" }}>
      <h1>🔒 Reset Password</h1>

      {session ? (
        <>
          <p style={{ fontSize: "0.9rem", margin: "0.5rem 0", color: "#555" }}>
            Your new password must:
            <br />• Be at least 8 characters
            <br />• Include a letter, a number, and a special character
          </p>

          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ margin: "0.5rem 0", padding: "0.5rem", width: "100%" }}
          />

          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{ margin: "0.5rem 0", padding: "0.5rem", width: "100%" }}
          />

          <button onClick={handleUpdate} style={{ padding: "0.5rem 1rem" }}>
            Update Password
          </button>
        </>
      ) : (
        <p>{message || "Loading session..."}</p>
      )}

      {message && <p style={{ marginTop: "1rem" }}>{message}</p>}

      <p style={{ marginTop: "1.5rem" }}>
        <a href="https://gamificationinstructorapp.streamlit.app">
          ← Back to your Streamlit App
        </a>
      </p>
    </main>
  );
}
