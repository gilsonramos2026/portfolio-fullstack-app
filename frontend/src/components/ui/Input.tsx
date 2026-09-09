import { clsx } from "clsx";
import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, id, className, ...rest }, ref) => {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={inputId} className="text-sm font-medium text-(--t2)">
          {label}
        </label>
        <input
          id={inputId}
          ref={ref}
          className={clsx("input", error && "border-red-500/60", className)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...rest}
        />
        {hint && !error && <span className="text-xs text-(--t4)">{hint}</span>}
        {error && (
          <span id={`${inputId}-error`} className="text-xs text-red-400">
            {error}
          </span>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
