import React from "react";

interface ButtonProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isLoading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  className?: string;
  variant?: "primary" | "secondary" | "dark";
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  isLoading = false,
  disabled = false,
  children,
  type = "button",
  className = "",
  variant = "primary",
}) => {
  const baseClasses =
    "min-w-48 rounded-3xl font-bold flex items-center justify-center transition-colors duration-200";
  const variantClasses = {
    primary: "min-h-12 border border-zinc-600 text-white hover:text-primary",
    secondary: "min-h-10 bg-black text-white text-sm hover:bg-primary-dark",
    dark: "min-h-12 bg-black text-white hover:text-primary border border-zinc-600",
  };
  const disabledClasses =
    "min-h-12 text-zinc-600 border border-zinc-600 cursor-not-allowed";

  const buttonClasses = `${baseClasses} ${
    disabled ? disabledClasses : variantClasses[variant]
  } ${className}`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={buttonClasses}
      aria-disabled={disabled || isLoading}
    >
      {isLoading ? (
        <svg
          className="h-5 w-5 animate-spin text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          role="status"
          aria-label="Loading"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4l4-4-4-4v4a8 8 0 100 16 8 8 0 01-8-8z"
          />
        </svg>
      ) : (
        <span className="flex items-center justify-center gap-2">
          {children}
        </span>
      )}
    </button>
  );
};

export default Button;
