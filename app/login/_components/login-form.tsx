"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/";
  const [errors, setErrors] = useState<{ [key: string]: string | undefined }>(
    {}
  );

  async function handleAction(formData: FormData) {
    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
      callbackUrl: searchParams?.get("from") || "/",
    });
    if (result?.ok) {
      router.replace(result.url ?? "/");
    } else if (result?.error) {
      setErrors({ other: result?.error });
    }
  }
  //
  return (
    <div className="flex min-h-screen flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8">
        <form className="space-y-6" action={handleAction}>
          <fieldset>
            <input type="hidden" name="redirectTo" value={redirectTo} />
            <div className="flex flex-col gap-4 items-center">
              {errors?.other ? <div>{errors.other}</div> : null}
              <label className=" w-full flex gap-4 items-center">
                <span className=" w-20 text-slate-950 dark:text-slate-100">
                  Email
                </span>
                <input
                  name="email"
                  placeholder="Enter email address"
                  required={true}
                  autoFocus={true}
                  type="email"
                  autoComplete="email"
                  aria-describedby="email-error"
                  className=" bg-transparent border border-slate-200 dark:border-slate-900 p-2 rounded-md"
                />
              </label>

              <label className="w-full flex gap-4 items-center">
                <span className="w-20 text-slate-950 dark:text-slate-100">
                  Password
                </span>
                <input
                  name="password"
                  type="password"
                  placeholder="Enter password"
                  required={true}
                  autoComplete="current-password"
                  aria-describedby="password-error"
                  className=" bg-transparent border border-slate-200 dark:border-slate-900 p-2 rounded-md"
                />
              </label>

              <button
                type="submit"
                aria-label="Login"
                name="_method"
                value="post"
                className=" w-48 bg-sky-500 text-sky-100 p-2 rounded-md"
              >
                Login
              </button>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  );
}
