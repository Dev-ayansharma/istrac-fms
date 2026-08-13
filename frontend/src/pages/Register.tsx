import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { Satellite, UserPlus, AlertCircle } from "lucide-react";

import { api } from "../lib/axios";
import { Button, Input } from "../components";
import {
  registerSchema,
  type RegisterFormData,
} from "../../schemas/authSchemas";

// Hardcoded for now — replace with GET /departments once that endpoint is live
const DEPARTMENTS = ["Engineering", "HR", "Finance", "Operations"];

export function Register() {
  const navigate = useNavigate();

  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterFormData) {
    setServerError(null);

    try {
      await api.post("/auth/register", data);

      setSubmitted(true);
    } catch (err) {
      const error = err as AxiosError<{
        error: {
          message: string;
        };
      }>;

      setServerError(
        error.response?.data?.error?.message ??
          "Registration failed. Please try again.",
      );
    }
  }

  /* =========================================================
     SUCCESS STATE
     ========================================================= */

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-page">
        {/* Background */}
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

          {/* Glow */}
          <div
            className="absolute right-0 top-0 bottom-0 w-1/2"
            style={{
              background:
                "radial-gradient(ellipse at right, rgba(37,99,235,0.08) 0%, transparent 60%)",
            }}
          />
        </div>

        {/* Navbar */}
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
            "
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-accent/20 flex items-center justify-center">
                <Satellite className="w-3.5 h-3.5 text-accent-light" />
              </div>

              <span className="text-sm font-bold text-text-primary">
                ISTRAC FMS
              </span>
            </div>

            <div className="ml-auto">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="btn-outline py-1.5 text-xs"
              >
                Login
              </button>
            </div>
          </div>
        </nav>

        {/* Success */}
        <main className="flex-1 relative z-10 flex items-center justify-center p-4 sm:p-6">
          <div className="w-full max-w-sm">
            <div
              className="
                rounded-xl
                border
                border-border-default/60
                p-6
                sm:p-8
                text-center
                shadow-card-lg
              "
              style={{
                background: "rgba(10,15,25,0.85)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
              }}
            >
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
                <UserPlus className="w-5 h-5 text-accent-light" />
              </div>

              <h1 className="text-base sm:text-lg font-bold text-text-primary mb-2">
                Registration Submitted
              </h1>

              <p className="text-xs text-text-muted leading-relaxed mb-6">
                Your request is pending admin approval. You'll receive an email
                once it's reviewed.
              </p>

              <Link to="/login" className="btn-primary w-full">
                Back to Login
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  /* =========================================================
     REGISTER PAGE
     ========================================================= */

  return (
    <div className="min-h-screen flex flex-col bg-page">
      {/* =====================================================
          BACKGROUND
          ===================================================== */}

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
          className="absolute right-0 top-0 bottom-0 w-1/2"
          style={{
            background:
              "radial-gradient(ellipse at right, rgba(37,99,235,0.08) 0%, transparent 60%)",
          }}
        />
      </div>

      {/* =====================================================
          NAVBAR
          ===================================================== */}

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
          "
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-accent/20 flex items-center justify-center">
              <Satellite className="w-3.5 h-3.5 text-accent-light" />
            </div>

            <span className="text-sm font-bold text-text-primary">
              ISTRAC FMS
            </span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="btn-outline py-1.5 text-xs"
            >
              Home
            </button>

            <Link to="/login" className="btn-primary py-1.5 text-xs">
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* =====================================================
          MAIN
          ===================================================== */}

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
          py-8
        "
      >
        <div className="w-full max-w-md">
          {/* =================================================
              REGISTER CARD
              ================================================= */}

          <div
            className="
              rounded-xl
              border
              border-border-default/60
              p-6
              sm:p-8
              shadow-card-lg
            "
            style={{
              background: "rgba(10,15,25,0.85)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          >
            {/* Header */}
            <div className="text-center mb-6">
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
                <UserPlus className="w-5 h-5 text-text-muted" />
              </div>

              <h1 className="text-base sm:text-lg font-bold text-text-primary mb-1.5">
                Request Access to ISTRAC FMS
              </h1>

              <p className="text-xs text-text-muted leading-relaxed">
                Submit your details to request access to satellite operations
                reports, mission files and department resources.
              </p>
            </div>

            {/* =================================================
                SERVER ERROR
                ================================================= */}

            {serverError && (
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
              className="space-y-3"
            >
              {/* Full Name */}
              <Input
                id="name"
                label="Full Name"
                autoComplete="name"
                error={errors.name?.message}
                {...register("name")}
              />

              {/* Email */}
              <Input
                id="email"
                label="Email Address"
                type="email"
                autoComplete="username"
                error={errors.email?.message}
                {...register("email")}
              />

              {/* Employee ID */}
              <Input
                id="employeeId"
                label="Employee ID"
                error={errors.employeeId?.message}
                {...register("employeeId")}
              />

              {/* Department */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="departmentPreference"
                  className="
                    block
                    text-[11px]
                    font-medium
                    text-text-muted
                    mb-0.5
                  "
                >
                  Department
                </label>

                <select
                  id="departmentPreference"
                  className={`
                    w-full
                    px-3.5
                    py-2.5
                    rounded-lg
                    bg-surface
                    border
                    border-border-default
                    font-sans
                    text-sm
                    text-text-primary
                    outline-none
                    transition-all
                    duration-150
                    focus:border-accent
                    focus:ring-2
                    focus:ring-accent/20
                    disabled:opacity-50
                  `}
                  {...register("departmentPreference")}
                >
                  <option value="">Select a department</option>

                  {DEPARTMENTS.map((department) => (
                    <option key={department} value={department}>
                      {department}
                    </option>
                  ))}
                </select>

                {errors.departmentPreference && (
                  <span className="text-xs text-critical">
                    {errors.departmentPreference.message}
                  </span>
                )}
              </div>

              {/* Reason */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="reasonForAccess"
                  className="
                    block
                    text-[11px]
                    font-medium
                    text-text-muted
                    mb-0.5
                  "
                >
                  Reason for Access
                </label>

                <textarea
                  id="reasonForAccess"
                  rows={3}
                  placeholder="Briefly explain why you need access..."
                  className={`
                    w-full
                    px-3.5
                    py-2.5
                    rounded-lg
                    bg-surface
                    border
                    border-border-default
                    font-sans
                    text-sm
                    text-text-primary
                    outline-none
                    transition-all
                    duration-150
                    placeholder:text-text-muted/50
                    focus:border-accent
                    focus:ring-2
                    focus:ring-accent/20
                    resize-none
                  `}
                  {...register("reasonForAccess")}
                />

                {errors.reasonForAccess && (
                  <span className="text-xs text-critical">
                    {errors.reasonForAccess.message}
                  </span>
                )}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                variant="primary"
                className="w-full py-2.5 mt-1"
                disabled={isSubmitting}
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
                    Submitting...
                  </span>
                ) : (
                  "Submit Request"
                )}
              </Button>

              {/* Login */}
              <p className="text-center text-xs text-text-muted pt-1">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="
                    text-accent-light
                    hover:text-text-primary
                    hover:underline
                    transition-colors
                  "
                >
                  Sign In
                </Link>
              </p>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
