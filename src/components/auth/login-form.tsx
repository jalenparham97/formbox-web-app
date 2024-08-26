"use client";

import { LoginSchema } from "@/utils/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { AlertSuccess } from "./alert-success";
import { AlertError } from "./alert-error";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { DEFAULT_LOGIN_REDIRECT } from "@/utils/constants";
import type { LoginCreds } from "@/types/auth.types";
import { COMPANY_NAME } from "@/utils/constants";
import { Logo } from "@/components/ui/logo";
import Link from "next/link";

export function LoginForm() {
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [successMessage, setSuccessMessage] = useState<string | undefined>();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginCreds>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: LoginCreds) {
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const result = await signIn("resend", {
        email: data.email,
        redirect: false,
        callbackUrl: `${window?.location.origin}${DEFAULT_LOGIN_REDIRECT}`,
      });
      if (result?.ok && !result?.error) {
        setSuccessMessage(
          "Email sent, check your inbox on this device! If you don't see it, check your spam folder.",
        );
      } else {
        setErrorMessage("Error sending email - try again?");
      }
    } catch (error) {
      setErrorMessage("Something went wrong - try again?");
    }
  }

  async function loginWithGoogle() {
    await signIn("google", { callbackUrl: DEFAULT_LOGIN_REDIRECT });
  }

  return (
    <>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex items-center justify-center">
          <Logo className="w-40" href="https://formbox.app" />
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-[450px]">
        <div className="rounded-xl border border-gray-300 bg-white px-10 py-8 shadow-sm">
          <h2 className="text-xl font-bold leading-9 text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-3 text-gray-600">
            New to {COMPANY_NAME}? Just sign in. We&apos;ll create your account
            and email you a login link.
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
            <div className="space-y-4">
              <Input
                label="Email"
                {...register("email")}
                error={errors.email !== undefined}
                errorMessage={errors?.email?.message}
              />
            </div>

            <AlertSuccess message={successMessage} />
            <AlertError message={errorMessage} />

            <div>
              <Button type="submit" className="w-full" loading={isSubmitting}>
                Continue with email
              </Button>
            </div>
          </form>

          <div>
            <div className="relative my-6">
              <div
                className="absolute inset-0 flex items-center"
                aria-hidden="true"
              >
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm font-medium leading-6">
                <span className="bg-white px-6 text-gray-600">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                onClick={loginWithGoogle}
                className="w-full"
                variant="outline"
                leftIcon={
                  <Image
                    alt="Sign in with Google"
                    src="/logos/google-logo.svg"
                    className="h-4 w-4"
                    width={100}
                    height={100}
                  />
                }
              >
                Google
              </Button>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-6 max-w-sm text-center text-sm">
          <p>
            By signing up to create a new account, I accept {COMPANY_NAME}
            &apos;s{" "}
            <Link
              href="https://formbox.app/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline decoration-gray-400 underline-offset-4"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="https://formbox.app/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline decoration-gray-400 underline-offset-4"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </>
  );
}
