import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Note on `accent`: in this token system `--accent` is the cobalt signal
 * colour, NOT a neutral hover tint. shadcn's stock variants hover to
 * `bg-accent`, which would flash ghost/outline buttons bright blue — so those
 * hovers are remapped to `surface-sunken`, and cobalt gets its own explicit
 * variant used sparingly (at most twice per screen).
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary-800",
        secondary:
          "border border-border bg-surface text-foreground hover:bg-surface-sunken",
        accent: "bg-accent text-accent-foreground shadow-xs hover:bg-accent/90",
        ghost: "text-foreground hover:bg-surface-sunken",
        link: "text-primary underline-offset-4 hover:underline",
        destructive:
          "bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90",
      },
      size: {
        sm: "h-8 px-3 text-body-sm [&_svg]:size-4",
        default: "h-10 px-4 text-body [&_svg]:size-[18px]",
        lg: "h-11 px-5 text-body [&_svg]:size-[18px]",
        icon: "size-10 [&_svg]:size-[18px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
