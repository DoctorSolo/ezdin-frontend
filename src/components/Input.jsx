import { forwardRef } from "react";

const Input = forwardRef(
  (
    { label, error, type = "text", placeholder = "", className = "", ...props },
    ref
  ) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          className={`
          w-full px-4 py-3
          bg-white border border-gray-300
          text-gray-900 placeholder-gray-500
          rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          transition-all duration-200
          ${
            error
              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
              : ""
          }
          ${className}
        `}
          {...props}
        />
        <p
          className={`mt-2 text-sm min-h-[20px] transition-opacity duration-200 ${
            error ? "text-red-500 opacity-100" : "opacity-0"
          }`}
          aria-live="polite"
        >
          {error || ""}
        </p>
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
