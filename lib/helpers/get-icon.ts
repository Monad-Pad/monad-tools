import * as LucideIcons from 'lucide-react';

/**
 * Retrieves a Lucide icon component based on the provided icon name.
 * 
 * @param {string} iconName - The name of the icon to retrieve.
 * @returns {React.ElementType | null} The icon component if found, or null if not found.
 * 
 * @example
 * const Icon = getIcon('ArrowRight');
 * if (Icon) {
 *   return <Icon />;
 * }
 */
export function getIcon(iconName: string): React.ElementType | null {
  const IconComponent = (LucideIcons as any)[iconName];
  
  if (IconComponent) {
    return IconComponent;
  }
  
  // Return a default icon or null if the icon name is not found
  return null;
}