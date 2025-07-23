import { forwardRef } from "react";
import React from "react";

const Button = forwardRef(
  (
    {
      children,
      variant = "primary",
      size = "md",
      loading = false,
      disabled = false,
      className = "",
      type = "button",
      ...props
    },
    ref
  ) => {
    const baseClasses = `
    font-medium rounded-lg transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white
    disabled:opacity-50 disabled:cursor-not-allowed
    flex items-center justify-center gap-2
  `;

    const variants = {
      primary: `
      bg-blue-600 text-white hover:bg-blue-700
      focus:ring-blue-500
    `,
      secondary: `
      bg-gray-200 text-gray-900 hover:bg-gray-300
      focus:ring-gray-500
    `,
      danger: `
      bg-red-600 text-white hover:bg-red-700
      focus:ring-red-500
    `,
      green: `
      bg-green-600 text-white hover:bg-green-700
      focus:ring-green-500
    `,
      outline: `
      border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white
      focus:ring-blue-500
    `,
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-3 text-base",
      lg: "px-6 py-4 text-lg",
    };

    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={`
        ${baseClasses}
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
        {...props}
      >
        {loading && (
          <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full opacity-75" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;

export const GoogleLoginButton = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-md shadow-sm py-2 px-4 text-gray-700 font-medium text-base hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
    aria-label="Login com Google"
    tabIndex={0}
  >
    <svg
      className="w-5 h-5"
      viewBox="0 0 48 48"
      aria-hidden="true"
      focusable="false"
    >
      <g>
        <path
          fill="#4285F4"
          d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C35.64 2.09 30.18 0 24 0 14.82 0 6.73 5.48 2.69 13.44l7.98 6.2C12.13 13.13 17.57 9.5 24 9.5z"
        />
        <path
          fill="#34A853"
          d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.01l7.19 5.59C43.98 37.13 46.1 31.36 46.1 24.55z"
        />
        <path
          fill="#FBBC05"
          d="M10.67 28.65c-1.13-3.36-1.13-6.94 0-10.3l-7.98-6.2C.99 16.09 0 19.91 0 24c0 4.09.99 7.91 2.69 11.55l7.98-6.2z"
        />
        <path
          fill="#EA4335"
          d="M24 48c6.18 0 11.36-2.05 15.15-5.59l-7.19-5.59c-2.01 1.35-4.59 2.15-7.96 2.15-6.43 0-11.87-3.63-14.33-8.89l-7.98 6.2C6.73 42.52 14.82 48 24 48z"
        />
        <path fill="none" d="M0 0h48v48H0z" />
      </g>
    </svg>
    <span className="ml-1">Login com Google</span>
  </button>
);
