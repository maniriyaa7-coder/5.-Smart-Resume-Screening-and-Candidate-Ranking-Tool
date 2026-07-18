import { motion } from 'framer-motion'
import React, { useState } from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

export function Input({
  label,
  error,
  icon,
  className = '',
  ...props
}: InputProps) {
  const [focused, setFocused] = useState(false)

  return (
    <div className="w-full">
      {label && (
        <motion.label
          className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {label}
        </motion.label>
      )}
      <motion.div
        className="relative"
        animate={{ scale: focused ? 1.005 : 1 }}
        transition={{ duration: 0.15 }}
      >
        {icon && <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60">{icon}</div>}
        <input
          className={`w-full px-4 py-2.5 ${icon ? 'pl-11' : ''} rounded-xl border border-border bg-card/60 text-foreground placeholder-muted-foreground/50 transition-all focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 dark:bg-zinc-900/40 ${className}`}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
      </motion.div>
      {error && (
        <motion.p
          className="text-xs text-red-500 mt-1.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {error}
        </motion.p>
      )}
    </div>
  )
}
