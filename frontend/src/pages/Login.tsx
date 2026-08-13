import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { AxiosError } from "axios";
import { Satellite, Lock, AlertCircle } from "lucide-react";

import { api } from "../lib/axios";
import { useAuthStore } from "../store/authStore";
import { Button, Input } from "../components";
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

  return (
    <div className="min-h-screen flex flex-col bg-page">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Stars */}
        <div className="absolute inset-0">
          {Array.from({ length: 80 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: `${Math.random() * 1.5 + 0.5}px`,
                height: `${Math.random() * 1.5 + 0.5}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.1,
              }}
            />
          ))}
        </div>

        {/* Earth */}
        <div
          className="
            absolute
            right-[-10%]
            top-1/2
            -translate-y-1/2
            w-[350px]
            h-[350px]
            sm:w-[420px]
            sm:h-[420px]
            lg:w-[520px]
            lg:h-[520px]
            pointer-events-none
            opacity-30
          "
        >
          <img
            src="https://eoimages.gsfc.nasa.gov/images/imagerecords/57000/57723/globe_east_2048.jpg"
            alt=""
            className="w-full h-full rounded-full object-cover"
            style={{
              maskImage:
                "radial-gradient(circle at 50% 50%, black 50%, transparent 72%)",
              WebkitMaskImage:
                "radial-gradient(circle at 50% 50%, black 50%, transparent 72%)",
              filter: "brightness(0.5) saturate(0.8)",
            }}
          />
        </div>

        {/* Planet glow */}
        <div
          className="
            absolute
            right-0
            top-0
            bottom-0
            w-1/2
            pointer-events-none
          "
          style={{
            background:
              "radial-gradient(ellipse at right, rgba(37,99,235,0.08) 0%, transparent 60%)",
          }}
        />
      </div>

      <nav className="nav-glass relative z-10">
        <div
          className="
            max-w-7xl
            mx-auto
            px-4
            sm:px-6
            h-14
            flex
            items-center
            gap-3
          "
        >
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div
              className="
                w-6
                h-6
                rounded
                bg-accent/20
                flex
                items-center
                justify-center
              "
            >
              <Satellite className="w-3.5 h-3.5 text-accent-light" />
            </div>

            <span className="text-sm font-bold text-text-primary">
              ISTRAC FMS
            </span>
          </div>

          {/* Navigation */}
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="btn-outline py-1.5 text-xs"
            >
              Home
            </button>

            <button
              type="button"
              onClick={() => navigate("/register")}
              className="btn-primary py-1.5 text-xs"
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      <main
        className="
          flex-1
          relative
          z-10
          flex
          items-center
          justify-center
          p-4
          sm:p-6
        "
      >
        <div className="w-full max-w-sm">
          {/* =================================================
              LOGIN CARD
              ================================================= */}

          <div
            className="
              rounded-xl
              border
              border-border-default/60
              p-6
              sm:p-8
              text-center
              mb-4
              shadow-card-lg
            "
            style={{
              background: "rgba(10,15,25,0.85)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          >
            {/* Lock Icon */}

            <div
              className="
                w-12
                h-12
                rounded-full
                border
                border-border-default/60
                bg-surface/60
                flex
                items-center
                justify-center
                mx-auto
                mb-4
              "
            >
              <Lock className="w-5 h-5 text-text-muted" />
            </div>

            {/* Heading */}

            <h1
              className="
                text-base
                sm:text-lg
                font-bold
                text-text-primary
                mb-1.5
              "
            >
              Sign In to ISTRAC FMS
            </h1>

            <p
              className="
                text-xs
                text-text-muted
                mb-6
                leading-relaxed
              "
            >
              Access satellite operations reports, mission files and department
              resources.
            </p>

            {/* =================================================
                LOCKOUT ERROR
                ================================================= */}

            {lockoutRemaining !== null && (
              <div
                className="
                  flex
                  items-start
                  gap-2
                  px-3
                  py-2.5
                  mb-4
                  rounded-lg
                  border
                  border-critical/30
                  bg-critical-bg
                  text-critical
                  text-xs
                  text-left
                "
              >
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />

                <span>
                  Too many failed attempts. Try again in{" "}
                  {Math.ceil(lockoutRemaining / 60)} minute
                  {Math.ceil(lockoutRemaining / 60) !== 1 ? "s" : ""}.
                </span>
              </div>
            )}

            {/* =================================================
                SERVER ERROR
                ================================================= */}

            {serverError && lockoutRemaining === null && (
              <div
                className="
                  flex
                  items-start
                  gap-2
                  px-3
                  py-2.5
                  mb-4
                  rounded-lg
                  border
                  border-critical/30
                  bg-critical-bg
                  text-critical
                  text-xs
                  text-left
                "
              >
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />

                <span>{serverError}</span>
              </div>
            )}

            {/* =================================================
                FORM
                ================================================= */}

            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="space-y-3 text-left"
            >
              {/* Email */}

              <div>
                <Input
                  id="email"
                  label="Email Address"
                  type="email"
                  autoComplete="username"
                  disabled={lockoutRemaining !== null}
                  error={errors.email?.message}
                  {...register("email")}
                />
              </div>

              {/* Password */}

              <div>
                <Input
                  id="password"
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                  disabled={lockoutRemaining !== null}
                  error={errors.password?.message}
                  {...register("password")}
                />
              </div>

              {/* Forgot Password */}

              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="
                    text-xs
                    text-accent-light
                    hover:text-text-primary
                    hover:underline
                    transition-colors
                  "
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit */}

              <Button
                type="submit"
                variant="primary"
                className="
                  w-full
                  py-2.5
                  rounded-md
                "
                disabled={isSubmitting || lockoutRemaining !== null}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span
                      className="
                        w-3.5
                        h-3.5
                        border-2
                        border-white
                        border-t-transparent
                        rounded-full
                        animate-spin
                      "
                    />
                    Signing in...
                  </span>
                ) : (
                  "Login"
                )}
              </Button>
            </form>

            {/* Register */}

            <p className="text-xs text-text-muted mt-4">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="
                  text-accent-light
                  hover:text-text-primary
                  hover:underline
                  transition-colors
                "
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
