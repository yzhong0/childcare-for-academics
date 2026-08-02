"use client";

import { useActionState } from "react";
import { createSharing, type FormState } from "@/app/actions";
import { QUESTIONS } from "@/lib/questions";

const inputCls =
  "w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm focus:border-amber-500 focus:outline-none";

export function ShareForm() {
  const [state, formAction, pending] = useActionState<FormState, FormData>(createSharing, null);

  return (
    <form action={formAction} className="space-y-6">
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

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
          <span className="text-sm font-medium text-stone-800">Country (optional)</span>
          <input
            type="text"
            name="country"
            maxLength={60}
            placeholder="e.g., USA, Singapore"
            className={`mt-1 ${inputCls}`}
          />
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-medium text-stone-800">1/5. {QUESTIONS.q1}</span>
        <textarea name="q1" rows={4} maxLength={4000} className={`mt-2 ${inputCls}`} />
      </label>

      <fieldset>
        <legend className="text-sm font-medium text-stone-800">2/5. {QUESTIONS.q2}</legend>
        <div className="mt-2 flex gap-6 text-sm text-stone-700">
          <label className="flex items-center gap-2">
            <input type="radio" name="q2" value="yes" className="accent-amber-600" /> Yes
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="q2" value="no" className="accent-amber-600" /> No
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="q2" value="" defaultChecked className="accent-amber-600" />{" "}
            Prefer not to say
          </label>
        </div>
      </fieldset>

      <label className="block">
        <span className="text-sm font-medium text-stone-800">3/5. {QUESTIONS.q3}</span>
        <textarea name="q3" rows={4} maxLength={4000} className={`mt-2 ${inputCls}`} />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-stone-800">4/5. {QUESTIONS.q4}</span>
        <textarea name="q4" rows={3} maxLength={4000} className={`mt-2 ${inputCls}`} />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-stone-800">5/5. {QUESTIONS.q5}</span>
        <textarea name="q5" rows={3} maxLength={4000} className={`mt-2 ${inputCls}`} />
      </label>

      {state?.error && <p className="text-sm text-rose-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-50"
      >
        {pending ? "Posting…" : "Post my sharing"}
      </button>
    </form>
  );
}
