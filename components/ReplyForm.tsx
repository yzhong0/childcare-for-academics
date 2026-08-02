"use client";

import { useActionState } from "react";
import { createReply, type FormState } from "@/app/actions";

const inputCls =
  "w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm focus:border-amber-500 focus:outline-none";

export function ReplyForm({ discussionId }: { discussionId: number }) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(createReply, null);

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="discussionId" value={discussionId} />
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <textarea
        name="body"
        required
        rows={4}
        maxLength={8000}
        placeholder="Add your thoughts, build on the idea, or suggest a next step…"
        className={inputCls}
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <input
          type="text"
          name="displayName"
          maxLength={60}
          placeholder="Display name (optional)"
          className={inputCls}
        />
        <input
          type="email"
          name="contactEmail"
          maxLength={200}
          placeholder="Contact email (optional, shown publicly)"
          className={inputCls}
        />
      </div>

      {state?.error && <p className="text-sm text-rose-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-stone-800 px-4 py-2 text-sm font-medium text-white hover:bg-stone-900 disabled:opacity-50"
      >
        {pending ? "Posting…" : "Post reply"}
      </button>
    </form>
  );
}
