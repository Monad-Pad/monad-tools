import * as React from "react"
import Link from "next/link"
import { cva, type VariantProps } from "class-variance-authority"
import { ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"

const linkCardVariants = cva(
  "relative -mx-4 md:-mx-0 p-4 border rounded-xl group outline outline-1 outline-offset-2 outline-transparent transition-colors",
  {
    variants: {
      variant: {
        default: "hover:bg-accent hover:outline-foreground/5 hover:border-foreground/10",
        // Add more variants as needed
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface LinkCardProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof linkCardVariants> {
  icon?: React.ReactNode
  title: string
  description: string
  href: string
  showArrow?: boolean
}

const LinkCard = React.forwardRef<HTMLAnchorElement, LinkCardProps>(
  ({ className, variant, icon, title, description, href, showArrow = true, ...props }, ref) => {
    return (
      <Link
        className={cn(linkCardVariants({ variant, className }))}
        ref={ref}
        href={href}
        {...props}
      >
        {icon && <div className="text-foreground mb-3">{icon}</div>}
        <h3 className="text-lg font-bold text-foreground">{title}</h3>
        <p className="text-base md:text-sm font-medium text-muted-foreground">{description}</p>
        {showArrow && (
          <ArrowUpRight className="absolute top-4 right-4 text-muted-foreground group-hover:text-primary transition-colors" size={16} />
        )}
      </Link>
    )
  }
)
LinkCard.displayName = "LinkCard"

export { LinkCard, linkCardVariants }
