import type { Metadata } from "next";
import { SignupForm } from "@/components/signup-form";

export const metadata: Metadata = { title: "Create an account", description: "Create a secure Farz+ family account." };
export default function SignupPage() { return <SignupForm />; }
