"use client";

import { useActionState } from "react";
import { createDiscussion, type FormState } from "@/app/actions";

const inputCls =
  "w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm focus:border-amber-500 focus:outline-none";

export function DiscussionForm() {
  const [state, formAction, pending] = useActionState<FormState, FormData>(createDiscussion, null);

  return (
    <form action={formAction} className="space-y-4">
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <label className="block">
        <span className="text-sm font-medium text-stone-800">Title *</span>
        <input
          type="text"
          name="title"
          required
          maxLength={200}
          placeholder="e.g., Research idea: measuring phantom waitlists across cities"
          className={`mt-1 ${inputCls}`}
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-stone-800">Your post *</span>
        <textarea
          name="body"
          required
          rows={5}
          maxLength={8000}
          placeholder="Describe your research idea, question, policy proposal, or the problem you want to brainstorm…"
          className={`mt-2 ${inputCls}`}
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-stone-800">Display name (optional)</span>
          <input
            type="text"
            name="displayName"
            maxLength={60}
            placeholder="Anonymous"
            className={`mt-1 ${inputCls}`}
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-stone-800">
            Contact email (optional, shown publicly)
          </span>
          <input
            type="email"
            name="contactEmail"
            maxLength={200}
            placeholder="Leave empty to stay fully anonymous"
            className={`mt-1 ${inputCls}`}
          />
        </label>
      </div>

      {state?.error && <p className="text-sm text-rose-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-50"
      >
        {pending ? "Posting…" : "Start discussion"}
      </button>
    </form>
  );
}
