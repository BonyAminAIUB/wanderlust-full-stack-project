'use client'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import React from "react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export default function LoginPage() {
  const router = useRouter();

  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const user = Object.fromEntries(formData.entries()) as {
      email: string;
      password: string;
    };

    try {
      const { data, error } = await authClient.signIn.email({
        ...user,
      });

      if (error) {
        toast.error(error.message || "Invalid email or password!");
        return;
      }

      if (data) {
        toast.success("Login successful!");
        setTimeout(() => {
          router.push("/");
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex w-full max-w-md flex-col gap-6">
        <Card className="rounded-xl border border-neutral-200/80 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
          <CardHeader className="space-y-1.5 pb-2 text-center">
            <CardTitle className="text-2xl font-semibold tracking-tight text-neutral-950">
              Welcome back
            </CardTitle>
            <CardDescription className="text-sm text-neutral-500">
              Enter your email and password to login to your account
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4">
            <form onSubmit={handleEmailLogin}>
              <FieldGroup className="gap-5">
                <Field>
                  <FieldLabel htmlFor="email" className="text-neutral-800">
                    Email
                  </FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="m@example.com"
                    required
                    className="h-10 border-neutral-200 bg-neutral-50/50 transition-colors focus-visible:border-[#13A5BF] focus-visible:ring-[#13A5BF]/20"
                  />
                </Field>

                <Field>
                  <div className="flex items-center">
                    <FieldLabel htmlFor="password" className="text-neutral-800">
                      Password
                    </FieldLabel>
                    <a
                      href="#"
                      className="ml-auto text-xs text-neutral-500 underline-offset-4 transition-colors hover:text-[#13A5BF] hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="h-10 border-neutral-200 bg-neutral-50/50 transition-colors focus-visible:border-[#13A5BF] focus-visible:ring-[#13A5BF]/20"
                  />
                </Field>

                <Field className="pt-1">
                  <Button
                    type="submit"
                    className="h-10 w-full cursor-pointer bg-[#13A5BF] font-medium text-white transition-colors hover:bg-[#108da4]"
                  >
                    Login
                  </Button>
                  <FieldDescription className="pt-2 text-center text-sm text-neutral-500">
                    Don&apos;t have an account?{" "}
                    <Link
                      href="/signup"
                      className="font-medium text-[#13A5BF] underline-offset-4 hover:underline"
                    >
                      Signup
                    </Link>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>

        <FieldDescription className="px-6 text-center text-xs text-neutral-500">
          By clicking continue, you agree to our{" "}
          <a href="#" className="underline underline-offset-4 hover:text-neutral-800">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="underline underline-offset-4 hover:text-neutral-800">
            Privacy Policy
          </a>
          .
        </FieldDescription>
      </div>
    </div>
  );
}