import { motion } from 'framer-motion'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  glass?: boolean
  onClick?: () => void
}

export function Card({ children, className = '', hover = true, glass = false, onClick }: CardProps) {
  const baseStyles = glass 
    ? 'glass-card premium-glow' 
    : 'bg-card border border-border rounded-2xl shadow-sm hover:shadow-md dark:shadow-black/20 transition-all duration-300'
  
  return (
    <motion.div
      className={`${baseStyles} p-6 ${className} ${onClick ? 'cursor-pointer' : ''}`}
      whileHover={hover ? { y: -3, scale: 1.01 } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}

export function CardHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`flex items-center justify-between mb-4 pb-2 border-b border-border/40 ${className}`}>{children}</div>
}

export function CardTitle({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <h3 className={`text-lg font-semibold tracking-tight text-foreground ${className}`}>{children}</h3>
}

export function CardDescription({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <p className={`text-sm text-muted-foreground/80 ${className}`}>{children}</p>
}

export function CardContent({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>
}
