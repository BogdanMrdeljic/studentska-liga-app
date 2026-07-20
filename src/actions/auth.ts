"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { signOut } from "@/auth";

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

export type RegisterState = { error?: string } | undefined;

const PASSWORD_REQUIREMENTS =
  "Lozinka mora imati bar 9 karaktera, jedno veliko slovo, jedan broj i jedan specijalni karakter (+ - * / ! @ # $ % &).";
const PASSWORD_PATTERN = /^(?=.*[A-Z])(?=.*\d)(?=.*[+\-*/!@#$%&]).{9,}$/;

export async function registerUser(
  _prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!name || !email) {
    return { error: "Popuni sva polja." };
  }
  if (!PASSWORD_PATTERN.test(password)) {
    return { error: PASSWORD_REQUIREMENTS };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "Nalog sa ovim emailom već postoji." };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: { name, email, passwordHash, role: "USER" },
  });

  redirect("/prijava?registered=1");
}
