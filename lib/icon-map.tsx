/**
 * Icon Map for Dynamic Lucide Icon Rendering
 *
 * Maps icon name strings (from database) to Lucide React components
 * Used for categories, conditions, and other dynamic icon rendering
 */

import {
  Smartphone,
  Tablet,
  Laptop,
  Watch,
  Gamepad2,
  Headphones,
  Speaker,
  Tv,
  Camera,
  Sparkles,
  Check,
  AlertCircle,
  XCircle,
  Wrench,
  Package,
  Search,
  Scale,
  DollarSign,
  Truck,
  Star,
  type LucideIcon,
} from 'lucide-react'

/**
 * Map of icon names to Lucide components
 */
export const ICON_MAP: Record<string, LucideIcon> = {
  // Categories
  Smartphone,
  Tablet,
  Laptop,
  Watch,
  Gamepad2,
  Headphones,
  Speaker,
  Tv,
  Camera,

  // Conditions
  Sparkles,
  Check,
  AlertCircle,
  XCircle,
  Wrench,

  // UI Elements
  Package,
  Search,
  Scale,
  DollarSign,
  Truck,
  Star,
}

/**
 * Get a Lucide icon component by name
 * @param name - Icon name (e.g., 'Smartphone', 'Tablet')
 * @returns Lucide icon component or Package as fallback
 */
export function getIcon(name: string | null | undefined): LucideIcon {
  if (!name) return Package
  return ICON_MAP[name] ?? Package
}

/**
 * Render a Lucide icon dynamically by name
 * @param name - Icon name
 * @param className - Optional CSS classes
 * @returns JSX element with icon or null
 */
export function renderIcon(name: string | null | undefined, className?: string) {
  const Icon = getIcon(name)
  return <Icon className={className} />
}
