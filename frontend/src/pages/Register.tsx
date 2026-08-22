import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

import { api } from "../lib/axios";
import {
  Alert,
  AuthCard,
  AuthFrame,
  Button,
  Input,
  Select,
  Textarea,
} from "../components";
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
      <AuthFrame
        actions={
          <Button variant="outline" size="sm" onClick={() => navigate("/login")}>
            Log in
          </Button>
        }
      >
        <AuthCard
          eyebrow="Submitted"
          status="PENDING REVIEW"
          tone="nominal"
          title="Your request has been submitted"
          description="An administrator will review it. You'll get an email once a decision is made."
        >
          {/* What happens next, so the wait is not a mystery. */}
          <ol className="space-y-3 border-y border-border-subtle py-5">
            {[
              "An administrator reviews your details",
              "Your department access is assigned",
              "You receive an email with sign-in instructions",
            ].map((stage, index) => (
              <li
                key={stage}
                className="flex items-start gap-3 text-[13px] leading-6 text-text-secondary"
              >
                <span className="num mt-px shrink-0 text-[10px] text-text-dim">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {stage}
              </li>
            ))}
          </ol>

          <Link to="/login" className="mt-6 block">
            <Button variant="primary" size="lg" className="w-full">
              Back to log in
            </Button>
          </Link>
        </AuthCard>
      </AuthFrame>
    );
  }

  /* =========================================================
     REGISTER PAGE
     ========================================================= */

  return (
    <AuthFrame
      width="md"
      actions={
        <>
          <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
            Home
          </Button>

          <Link to="/login">
            <Button variant="outline" size="sm">
              Log in
            </Button>
          </Link>
        </>
      }
    >
      <AuthCard
        eyebrow="Access request"
        status="NEW ACCOUNT"
        tone="accent"
        title="Request access to ISTRAC-FMS"
        description="Submit your details to request access to satellite operations reports, mission files and department resources."
      >
        {serverError && (
          <Alert variant="critical" title="Request failed" className="mb-5">
            {serverError}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <Input
            id="name"
            label="Full name"
            autoComplete="name"
            error={errors.name?.message}
            {...register("name")}
          />

          <Input
            id="email"
            label="Email address"
            type="email"
            autoComplete="username"
            error={errors.email?.message}
            {...register("email")}
          />

          <Input
            id="employeeId"
            label="Employee ID"
            error={errors.employeeId?.message}
            {...register("employeeId")}
          />

          <Select
            id="departmentPreference"
            label="Department"
            error={errors.departmentPreference?.message}
            {...register("departmentPreference")}
          >
            <option value="">Select a department</option>

            {DEPARTMENTS.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </Select>

          <Textarea
            id="reasonForAccess"
            label="Reason for access"
            rows={3}
            placeholder="Briefly explain why you need access…"
            error={errors.reasonForAccess?.message}
            {...register("reasonForAccess")}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span
                  aria-hidden="true"
                  className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"
                />
                Submitting…
              </>
            ) : (
              "Submit request"
            )}
          </Button>
        </form>

        <p className="mt-6 border-t border-border-subtle pt-5 text-center text-xs text-text-muted">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-accent-light underline decoration-accent/30 underline-offset-2 transition-colors duration-150 hover:text-text-primary hover:decoration-accent"
          >
            Log in
          </Link>
        </p>
      </AuthCard>
    </AuthFrame>
  );
}