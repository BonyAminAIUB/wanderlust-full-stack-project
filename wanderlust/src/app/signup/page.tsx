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
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import React from "react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export default function SignUpPage() {
  const router = useRouter();

  const handleEmailSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const user = Object.fromEntries(formData.entries()) as {
      name: string;
      image: string;
      email: string;
      password: string;
    };

    try {
      const { data, error } = await authClient.signUp.email({
        ...user,
      });

      if (error) {
        toast.error(error.message || "Sign up failed!");
        return;
      }

      if (data) {
        toast.success("Sign up successful!");
        setTimeout(() => {
          router.push("/");
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    }
  };

  const handleGoogleSignUp = async () => {
    await authClient.signIn.social({
      provider: "google",
    });
  }

  const handleGithubSignUp = async () => {
    await authClient.signIn.social({
      provider: "github",
    });
  }

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
              Sign Up with your GitHub or Google account
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4">
            <form onSubmit={handleEmailSignUp}>
              <FieldGroup className="gap-5">
                <Field className="gap-3">
                  <Button
                    onClick={handleGithubSignUp}
                    variant="outline"
                    type="button"
                    className="h-10 w-full cursor-pointer border-neutral-200 bg-white font-medium text-neutral-800 transition-colors hover:border-[#13A5BF]/50 hover:bg-neutral-50"
                  >
                    <svg
                      className="size-4"
                      viewBox="0 0 1024 1024"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z"
                        transform="scale(64)"
                        fill="#181717"
                      />
                    </svg>
                    Login with GitHub
                  </Button>

                  <Button
                    onClick={handleGoogleSignUp}
                    variant="outline"
                    type="button"
                    className="h-10 w-full cursor-pointer border-neutral-200 bg-white font-medium text-neutral-800 transition-colors hover:border-[#13A5BF]/50 hover:bg-neutral-50"
                  >
                    <svg
                      className="size-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                        fill="currentColor"
                      />
                    </svg>
                    Login with Google
                  </Button>
                </Field>

                <FieldSeparator className="*:data-[slot=field-separator-content]:bg-white *:data-[slot=field-separator-content]:text-xs *:data-[slot=field-separator-content]:text-neutral-500">
                  Or continue with
                </FieldSeparator>

                <Field>
                  <FieldLabel htmlFor="name" className="text-neutral-800">
                    Name
                  </FieldLabel>
                  <Input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    required
                    className="h-10 border-neutral-200 bg-neutral-50/50 transition-colors focus-visible:border-[#13A5BF] focus-visible:ring-[#13A5BF]/20"
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="image" className="text-neutral-800">
                    ImageUrl
                  </FieldLabel>
                  <Input
                    id="image"
                    type="url"
                    name="image"
                    placeholder="Image URL"
                    required
                    className="h-10 border-neutral-200 bg-neutral-50/50 transition-colors focus-visible:border-[#13A5BF] focus-visible:ring-[#13A5BF]/20"
                  />
                </Field>

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
                    SignUp
                  </Button>
                  <FieldDescription className="pt-2 text-center text-sm text-neutral-500">
                    Have an account?{" "}
                    <Link
                      href="/login"
                      className="font-medium text-[#13A5BF] underline-offset-4 hover:underline"
                    >
                      Login
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
  )
}