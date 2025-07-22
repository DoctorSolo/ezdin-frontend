import { forwardRef } from "react";

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
    ref,
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
  },
);

Button.displayName = "Button";

export default Button;
