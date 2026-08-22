import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { AxiosError } from "axios";

import { api } from "../lib/axios";
import { useAuthStore } from "../store/authStore";
import { Alert, AuthCard, AuthFrame, Button, Input } from "../components";
import { loginSchema, type LoginFormData } from "../../schemas/authSchemas";

export function Login() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [serverError, setServerError] = useState<string | null>(null);
  const [lockoutRemaining, setLockoutRemaining] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormData) {
    setServerError(null);
    setLockoutRemaining(null);

    try {
      const response = await api.post("/auth/login", data);

      setAuth(response.data.user, response.data.accessToken);

      navigate("/dashboard");
    } catch (err) {
      const error = err as AxiosError<{
        error: {
          code: string;
          message: string;
        };
        lockoutSecondsRemaining?: number;
      }>;

      if (
        error.response?.status === 429 &&
        error.response.data.lockoutSecondsRemaining
      ) {
        setLockoutRemaining(error.response.data.lockoutSecondsRemaining);
      } else if (error.response?.data?.error?.message) {
        setServerError(error.response.data.error.message);
      } else {
        setServerError("Something went wrong. Please try again.");
      }
    }
  }

  const lockedOut = lockoutRemaining !== null;

  return (
    <AuthFrame
      actions={
        <>
          <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
            Home
          </Button>

          <Button variant="outline" size="sm" onClick={() => navigate("/register")}>
            Request access
          </Button>
        </>
      }
    >
      <AuthCard
        eyebrow="Restricted"
        status="SIGNED OUT"
        title="Sign in to ISTRAC-FMS"
        description="Access satellite operations reports, mission files and department resources."
      >
        {/* Lockout takes precedence over any other server message. */}
        {lockoutRemaining !== null && (
          <Alert variant="critical" title="Locked out" className="mb-5">
            Too many failed attempts. Try again in{" "}
            {Math.ceil(lockoutRemaining / 60)} minute
            {Math.ceil(lockoutRemaining / 60) !== 1 ? "s" : ""}.
          </Alert>
        )}

        {serverError && lockoutRemaining === null && (
          <Alert variant="critical" title="Sign-in failed" className="mb-5">
            {serverError}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <Input
            id="email"
            label="Email address"
            type="email"
            autoComplete="username"
            disabled={lockedOut}
            error={errors.email?.message}
            {...register("email")}
          />

          <div>
            <Input
              id="password"
              label="Password"
              type="password"
              autoComplete="current-password"
              disabled={lockedOut}
              error={errors.password?.message}
              {...register("password")}
            />

            <div className="mt-2 flex justify-end">
              <Link
                to="/forgot-password"
                className="text-xs text-accent-light underline decoration-accent/30 underline-offset-2 transition-colors duration-150 hover:text-text-primary hover:decoration-accent"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={isSubmitting || lockedOut}
          >
            {isSubmitting ? (
              <>
                <span
                  aria-hidden="true"
                  className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"
                />
                Signing in…
              </>
            ) : (
              "Log in"
            )}
          </Button>
        </form>

        <p className="mt-6 border-t border-border-subtle pt-5 text-center text-xs text-text-muted">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-accent-light underline decoration-accent/30 underline-offset-2 transition-colors duration-150 hover:text-text-primary hover:decoration-accent"
          >
            Request access
          </Link>
        </p>
      </AuthCard>
    </AuthFrame>
  );
}
