import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "destructive";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: "sm" | "md";
  fullWidth?: boolean;
  iconLeft?: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "primary",
    size = "md",
    fullWidth,
    iconLeft,
    className,
    children,
    ...rest
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      className={`btn btn--${variant} btn--${size}${fullWidth ? " btn--full" : ""}${className ? ` ${className}` : ""}`}
      {...rest}
    >
      {iconLeft && <span className="btn__icon">{iconLeft}</span>}
      {children}
    </button>
  );
});

export default Button;
