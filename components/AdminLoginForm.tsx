"use client";

import { useActionState } from "react";
import { adminLogin, type FormState } from "@/app/actions";

export function AdminLoginForm() {
  const [state, formAction, pending] = useActionState<FormState, FormData>(adminLogin, null);

  return (
    <form action={formAction} className="flex max-w-sm gap-2">
      <input
        type="password"
        name="password"
        required
        placeholder="Admin password"
        className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-stone-800 px-4 py-2 text-sm font-medium text-white hover:bg-stone-900 disabled:opacity-50"
      >
        {pending ? "…" : "Log in"}
      </button>
      {state?.error && <p className="self-center text-sm text-rose-600">{state.error}</p>}
    </form>
  );
}
