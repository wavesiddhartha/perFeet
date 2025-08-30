'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  className?: string
  variant?: 'default' | 'compact' | 'detailed'
  animated?: boolean
}

export function FeatureCard({ 
  icon: Icon, 
  title, 
  description, 
  className,
  variant = 'default',
  animated = true
}: FeatureCardProps) {
  const CardComponent = animated ? motion.div : 'div'
  const motionProps = animated ? {
    whileHover: { 
      y: -4,
      transition: { duration: 0.2 }
    },
    transition: { duration: 0.3 }
  } : {}

  const variants = {
    default: "p-8 text-center",
    compact: "p-6 text-left",
    detailed: "p-8 text-left"
  }

  const iconSizes = {
    default: "h-12 w-12",
    compact: "h-8 w-8", 
    detailed: "h-16 w-16"
  }

  return (
    <CardComponent
      {...motionProps}
      className={cn(
        "card-interactive group relative overflow-hidden bg-white",
        variants[variant],
        className
      )}
    >
      {/* Background Gradient on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      <div className="relative z-10">
        {/* Icon */}
        <div className={cn(
          "flex items-center justify-center rounded-2xl bg-gray-900 text-white transition-all duration-300 group-hover:bg-black group-hover:scale-105",
          variant === 'default' && "mx-auto mb-6",
          variant === 'compact' && "mb-4",
          variant === 'detailed' && "mb-6"
        )}>
          <div className={cn(
            "flex items-center justify-center",
            iconSizes[variant],
            variant === 'default' && "m-4",
            variant === 'compact' && "m-3",
            variant === 'detailed' && "m-5"
          )}>
            <Icon className={iconSizes[variant]} />
          </div>
        </div>

        {/* Content */}
        <div>
          <h3 className={cn(
            "font-semibold text-gray-900 transition-colors duration-200 group-hover:text-black",
            variant === 'default' && "text-xl mb-3",
            variant === 'compact' && "text-lg mb-2",
            variant === 'detailed' && "text-2xl mb-4"
          )}>
            {title}
          </h3>
          
          <p className={cn(
            "text-gray-600 leading-relaxed",
            variant === 'default' && "text-base",
            variant === 'compact' && "text-sm",
            variant === 'detailed' && "text-lg"
          )}>
            {description}
          </p>
        </div>
      </div>

      {/* Subtle Border Animation */}
      <div className="absolute inset-0 rounded-2xl border border-transparent bg-gradient-to-r from-transparent via-gray-200/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </CardComponent>
  )
}

// Specialized variants
export function StatsCard({
  title,
  value,
  description,
  trend,
  className
}: {
  title: string
  value: string | number
  description: string
  trend?: 'up' | 'down' | 'neutral'
  className?: string
}) {
  const trendColors = {
    up: 'text-success-600',
    down: 'text-error-600', 
    neutral: 'text-gray-600'
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={cn("card bg-white p-6", className)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
          <p className={cn(
            "mt-1 text-sm",
            trend ? trendColors[trend] : "text-gray-600"
          )}>
            {description}
          </p>
        </div>
        
        {trend && (
          <div className={cn(
            "flex items-center justify-center w-8 h-8 rounded-full",
            trend === 'up' && "bg-success-100",
            trend === 'down' && "bg-error-100",
            trend === 'neutral' && "bg-gray-100"
          )}>
            <div className={cn(
              "w-0 h-0 border-l-[4px] border-r-[4px] border-transparent",
              trend === 'up' && "border-b-[6px] border-b-success-600",
              trend === 'down' && "border-t-[6px] border-t-error-600 rotate-180",
              trend === 'neutral' && "w-2 h-2 rounded-full bg-gray-600 border-0"
            )} />
          </div>
        )}
      </div>
    </motion.div>
  )
}

export function ProcessCard({
  step,
  title,
  description,
  isActive = false,
  isCompleted = false,
  className
}: {
  step: number
  title: string
  description: string
  isActive?: boolean
  isCompleted?: boolean
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        "card relative p-6 transition-all duration-300",
        isActive && "border-black shadow-medium",
        isCompleted && "bg-success-50 border-success-200",
        className
      )}
    >
      {/* Step Number */}
      <div className={cn(
        "absolute -left-4 -top-4 flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-semibold",
        isCompleted && "bg-success-600 border-success-600 text-white",
        isActive && "bg-black border-black text-white",
        !isActive && !isCompleted && "bg-white border-gray-300 text-gray-600"
      )}>
        {isCompleted ? '✓' : step}
      </div>

      {/* Content */}
      <div className="ml-4">
        <h4 className="font-semibold text-gray-900 text-lg mb-2">{title}</h4>
        <p className="text-gray-600">{description}</p>
      </div>

      {/* Progress Indicator */}
      {isActive && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gray-900 via-gray-600 to-gray-900 opacity-50" />
      )}
    </motion.div>
  )
}