"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { allow } from "@/lib/rate-limit";
import { adminPassword, clearAdminCookie, isAdmin, setAdminCookie } from "@/lib/admin";

async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0].trim() || "local";
}

function cleanField(value: FormDataEntryValue | null, maxLen: number): string | null {
  if (typeof value !== "string") return null;
  const text = value.trim().slice(0, maxLen);
  return text || null;
}

export type FormState = { error?: string } | null;

export async function createSharing(_prev: FormState, formData: FormData): Promise<FormState> {
  // Honeypot: real users never see or fill this field.
  if (cleanField(formData.get("website"), 100)) return null;

  if (!allow(await clientIp())) {
    return { error: "You are posting too fast. Please wait a few minutes and try again." };
  }

  const q1 = cleanField(formData.get("q1"), 4000);
  const q3 = cleanField(formData.get("q3"), 4000);
  const q4 = cleanField(formData.get("q4"), 4000);
  const q5 = cleanField(formData.get("q5"), 4000);
  const q2raw = formData.get("q2");
  const q2 = q2raw === "yes" ? true : q2raw === "no" ? false : null;

  if (!q1 && !q3 && !q4 && !q5) {
    return { error: "Please answer at least one of the questions before posting." };
  }

  const sharing = await prisma.sharing.create({
    data: {
      displayName: cleanField(formData.get("displayName"), 60) ?? "Anonymous",
      country: cleanField(formData.get("country"), 60),
      q1Solutions: q1,
      q2MultipleWaitlists: q2,
      q3Challenges: q3,
      q4OneChange: q4,
      q5Insights: q5,
      source: "web",
    },
  });

  revalidatePath("/");
  revalidatePath("/sharings");
  redirect(`/sharings/${sharing.id}`);
}

export async function createComment(_prev: FormState, formData: FormData): Promise<FormState> {
  if (cleanField(formData.get("website"), 100)) return null;

  const sharingId = Number(formData.get("sharingId"));
  const body = cleanField(formData.get("body"), 2000);
  if (!Number.isInteger(sharingId)) return { error: "Invalid sharing." };
  if (!body) return { error: "Please write a comment before posting." };

  if (!allow(await clientIp(), 10)) {
    return { error: "You are posting too fast. Please wait a few minutes and try again." };
  }

  const sharing = await prisma.sharing.findUnique({ where: { id: sharingId } });
  if (!sharing || sharing.hidden) return { error: "This sharing no longer accepts comments." };

  await prisma.comment.create({
    data: {
      sharingId,
      displayName: cleanField(formData.get("displayName"), 60) ?? "Anonymous",
      body,
    },
  });

  revalidatePath(`/sharings/${sharingId}`);
  return null;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function createDiscussion(_prev: FormState, formData: FormData): Promise<FormState> {
  if (cleanField(formData.get("website"), 100)) return null;

  const title = cleanField(formData.get("title"), 200);
  const body = cleanField(formData.get("body"), 8000);
  const contactEmail = cleanField(formData.get("contactEmail"), 200);
  if (!title || !body) {
    return { error: "Please provide both a title and a description for your discussion." };
  }
  if (contactEmail && !EMAIL_RE.test(contactEmail)) {
    return { error: "Please enter a valid contact email, or leave it empty to stay anonymous." };
  }

  if (!allow(`discussion:${await clientIp()}`, 5)) {
    return { error: "You are posting too fast. Please wait a few minutes and try again." };
  }

  const discussion = await prisma.discussion.create({
    data: {
      title,
      body,
      displayName: cleanField(formData.get("displayName"), 60) ?? "Anonymous",
      contactEmail,
    },
  });

  revalidatePath("/discussions");
  redirect(`/discussions/${discussion.id}`);
}

export async function createReply(_prev: FormState, formData: FormData): Promise<FormState> {
  if (cleanField(formData.get("website"), 100)) return null;

  const discussionId = Number(formData.get("discussionId"));
  const body = cleanField(formData.get("body"), 8000);
  const contactEmail = cleanField(formData.get("contactEmail"), 200);
  if (!Number.isInteger(discussionId)) return { error: "Invalid discussion." };
  if (!body) return { error: "Please write a reply before posting." };
  if (contactEmail && !EMAIL_RE.test(contactEmail)) {
    return { error: "Please enter a valid contact email, or leave it empty to stay anonymous." };
  }

  if (!allow(`reply:${await clientIp()}`, 10)) {
    return { error: "You are posting too fast. Please wait a few minutes and try again." };
  }

  const discussion = await prisma.discussion.findUnique({ where: { id: discussionId } });
  if (!discussion || discussion.hidden) {
    return { error: "This discussion no longer accepts replies." };
  }

  await prisma.discussionReply.create({
    data: {
      discussionId,
      body,
      displayName: cleanField(formData.get("displayName"), 60) ?? "Anonymous",
      contactEmail,
    },
  });

  revalidatePath(`/discussions/${discussionId}`);
  revalidatePath("/discussions");
  return null;
}

export async function adminLogin(_prev: FormState, formData: FormData): Promise<FormState> {
  if (formData.get("password") !== adminPassword()) {
    return { error: "Incorrect password." };
  }
  await setAdminCookie();
  redirect("/admin");
}

export async function adminLogout(): Promise<void> {
  await clearAdminCookie();
  redirect("/admin");
}

async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) throw new Error("Not authorized");
}

export async function adminToggleSharing(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const sharing = await prisma.sharing.findUnique({ where: { id } });
  if (!sharing) return;
  await prisma.sharing.update({ where: { id }, data: { hidden: !sharing.hidden } });
  revalidatePath("/");
  revalidatePath("/sharings");
  revalidatePath(`/sharings/${id}`);
  revalidatePath("/admin");
}

export async function adminDeleteSharing(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  await prisma.sharing.delete({ where: { id } }).catch(() => {});
  revalidatePath("/");
  revalidatePath("/sharings");
  revalidatePath("/admin");
}

export async function adminToggleComment(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const comment = await prisma.comment.findUnique({ where: { id } });
  if (!comment) return;
  await prisma.comment.update({ where: { id }, data: { hidden: !comment.hidden } });
  revalidatePath(`/sharings/${comment.sharingId}`);
  revalidatePath("/admin");
}

export async function adminDeleteComment(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const comment = await prisma.comment.findUnique({ where: { id } });
  if (!comment) return;
  await prisma.comment.delete({ where: { id } });
  revalidatePath(`/sharings/${comment.sharingId}`);
  revalidatePath("/admin");
}

export async function adminToggleDiscussion(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const discussion = await prisma.discussion.findUnique({ where: { id } });
  if (!discussion) return;
  await prisma.discussion.update({ where: { id }, data: { hidden: !discussion.hidden } });
  revalidatePath("/discussions");
  revalidatePath(`/discussions/${id}`);
  revalidatePath("/admin");
}

export async function adminDeleteDiscussion(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  await prisma.discussion.delete({ where: { id } }).catch(() => {});
  revalidatePath("/discussions");
  revalidatePath("/admin");
}

export async function adminToggleReply(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const reply = await prisma.discussionReply.findUnique({ where: { id } });
  if (!reply) return;
  await prisma.discussionReply.update({ where: { id }, data: { hidden: !reply.hidden } });
  revalidatePath(`/discussions/${reply.discussionId}`);
  revalidatePath("/admin");
}

export async function adminDeleteReply(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const reply = await prisma.discussionReply.findUnique({ where: { id } });
  if (!reply) return;
  await prisma.discussionReply.delete({ where: { id } });
  revalidatePath(`/discussions/${reply.discussionId}`);
  revalidatePath("/admin");
}
