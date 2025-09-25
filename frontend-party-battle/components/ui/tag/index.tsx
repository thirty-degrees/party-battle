import React from 'react'
import { View, ViewProps } from 'react-native'
import { Text } from '../text'

interface TagProps extends ViewProps {
  children: React.ReactNode
  variant?: 'default' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const Tag = React.forwardRef<React.ComponentRef<typeof View>, TagProps>(function Tag(
  { children, variant = 'default', size = 'md', className = '', ...props },
  ref
) {
  const baseClasses = 'rounded-full px-3 py-1 flex-row items-center justify-center'

  const variantClasses = {
    default: 'bg-blue-100 dark:bg-blue-900 border border-blue-200 dark:border-blue-800',
    outline: 'bg-transparent dark:bg-transparent border border-gray-300 dark:border-gray-700',
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5',
    md: 'px-3 py-1',
    lg: 'px-4 py-2',
  }

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }

  return (
    <View
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
      ref={ref}
    >
      <Text className={`font-medium text-gray-700 dark:text-gray-300 ${textSizeClasses[size]}`}>
        {children}
      </Text>
    </View>
  )
})

Tag.displayName = 'Tag'

export { Tag }
