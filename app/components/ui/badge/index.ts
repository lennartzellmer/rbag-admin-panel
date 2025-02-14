import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export { default as Badge } from './Badge.vue'

export const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground',
        green: 'bg-green-100 border-green-500 text-green-800',
        red: 'bg-red-100 border-red-500 text-red-800',
        yellow: 'bg-yellow-100 border-yellow-500 text-yellow-800',
        blue: 'bg-blue-100 border-blue-500 text-blue-800',
        purple: 'bg-purple-100 border-purple-500 text-purple-800',
        pink: 'bg-pink-100 border-pink-500 text-pink-800',
        gray: 'bg-gray-100 border-gray-500 text-gray-800'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)

export type BadgeVariants = VariantProps<typeof badgeVariants>
