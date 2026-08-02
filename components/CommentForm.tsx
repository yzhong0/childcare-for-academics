"use client";

import { useActionState } from "react";
import { createComment, type FormState } from "@/app/actions";

export function CommentForm({ sharingId }: { sharingId: number }) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(createComment, null);

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="sharingId" value={sharingId} />
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          name="displayName"
          placeholder="Your name (optional)"
          maxLength={60}
          className="w-full sm:w-56 rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
        />
      </div>
      <textarea
        name="body"
        required
        rows={3}
        maxLength={2000}
        placeholder="Add a comment…"
        className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
      />
      {state?.error && <p className="text-sm text-rose-600">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-stone-800 px-4 py-2 text-sm font-medium text-white hover:bg-stone-900 disabled:opacity-50"
      >
        {pending ? "Posting…" : "Post comment"}
      </button>
    </form>
  );
}
