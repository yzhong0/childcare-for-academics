import { ShareForm } from "@/components/ShareForm";

export default function SharePage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-stone-900">
          Share your experience
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          Answer as many of the five questions as you like — every question is optional, and you
          can post anonymously. Your sharing will appear publicly on this forum and will be
          included in the topic word cloud.
        </p>
      </div>
      <div className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8">
        <ShareForm />
      </div>
    </div>
  );
}
