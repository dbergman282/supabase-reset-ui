"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [session, setSession] = useState(null);
  const [message, setMessage] = useState("");

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
          setMessage("Failed to set session");
        } else {
          setSession(data.session);
        }
      });
    } else {
      setMessage("Auth session missing!");
    }
  }, []);

  const handleUpdate = async () => {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      console.error(error);
      setMessage(error.message);
    } else {
      setMessage("✅ Password updated! Return to your app to log in.");
    }
  };

  return (
    <main style={{ maxWidth: 400, margin: "2rem auto", textAlign: "center" }}>
      <h1>Reset Password</h1>
      {session ? (
        <>
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ margin: "1rem 0", padding: "0.5rem", width: "100%" }}
          />
          <button onClick={handleUpdate} style={{ padding: "0.5rem 1rem" }}>
            Update Password
          </button>
        </>
      ) : (
        <p>{message || "Loading..."}</p>
      )}
      {message && <p>{message}</p>}
      <p style={{ marginTop: "1rem" }}>
        <a href="https://gamificationinstructorapp.streamlit.app">← Back to your App</a>
      </p>
    </main>
  );
}
