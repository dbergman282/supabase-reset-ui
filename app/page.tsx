"use client"

import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function Home() {
  const supabase = createClientComponentClient();

  return (
    <main style={{ maxWidth: 400, margin: "100px auto", textAlign: "center" }}>
      <h1>Reset Password</h1>
      <Auth
        supabaseClient={supabase}
        view="update_password"
        appearance={{ theme: ThemeSupa }}
      />
      <p style={{ marginTop: 20 }}>
        <a href="https://YOUR-STREAMLIT-APP.com">
          ← Back to your Streamlit App
        </a>
      </p>
    </main>
  );
}
