import * as React from "react"
import { Check, Minus } from "lucide-react"

export interface CheckboxProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  checked?: boolean | "indeterminate"
  onCheckedChange?: (checked: boolean) => void
}

const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ className, checked = false, onCheckedChange, ...props }, ref) => {
    // We determine the ARIA state for accessibility
    const ariaChecked = checked === "indeterminate" ? "mixed" : checked

    // Base styles are static
    const baseStyles =
      "peer h-4 w-4 shrink-0 rounded-sm border ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:ring-offset-slate-900"

    const stateStyles =
      checked === true || checked === "indeterminate"
        ? "border-blue-600 bg-blue-600 text-white"
        : "border-slate-400"

    return (
      <button
        type="button"
        role="checkbox"
        aria-checked={ariaChecked}
        ref={ref}
        className={`${baseStyles} ${stateStyles} ${className || ""}`.trim()}
        onClick={() => onCheckedChange?.(!checked)}
        {...props}
      >
        {/* Container for the icon */}
        <div className="flex h-full w-full items-center justify-center">
          {checked === true && <Check className="h-3 w-3" strokeWidth={3} />}
          {checked === "indeterminate" && <Minus className="h-3 w-3" strokeWidth={3} />}
        </div>
      </button>
    )
  }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }