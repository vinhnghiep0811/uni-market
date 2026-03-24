import type { ReactNode } from "react";

type FormFieldProps = {
  label: string;
  htmlFor: string;
  children: ReactNode;
  helperText?: string;
  helperId?: string;
  error?: string;
  errorId?: string;
  required?: boolean;
  counter?: string;
};

export default function FormField({
  label,
  htmlFor,
  children,
  helperText,
  helperId,
  error,
  errorId,
  required,
  counter,
}: FormFieldProps) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={htmlFor} className="text-sm font-semibold text-slate-900">
          {label}
        </label>
        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
            required
              ? "bg-blue-50 text-blue-900"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {required ? "Required" : "Optional"}
        </span>
      </div>

      {children}

      {(helperText || error || counter) && (
        <div className="flex items-start justify-between gap-3 text-xs">
          <div className="min-h-4">
            {error ? (
              <p id={errorId} className="text-rose-600">
                {error}
              </p>
            ) : helperText ? (
              <p id={helperId} className="text-slate-500">
                {helperText}
              </p>
            ) : null}
          </div>
          {counter ? (
            <span className="shrink-0 text-slate-400">{counter}</span>
          ) : null}
        </div>
      )}
    </div>
  );
}
