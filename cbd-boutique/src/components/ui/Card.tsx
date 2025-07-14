'use client';

import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  children: React.ReactNode;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverable = true, children, ...props }, ref) => {
    const baseStyles = "bg-white rounded-xl shadow-lg overflow-hidden";
    
    return (
      <motion.div
        whileHover={hoverable ? { scale: 1.02, y: -5 } : undefined}
        transition={{ duration: 0.2 }}
      >
        <div
          ref={ref}
          className={cn(baseStyles, className)}
          {...props}
        >
          {children}
        </div>
      </motion.div>
    );
  }
);

Card.displayName = 'Card';

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("px-6 py-4", className)}
      {...props}
    />
  )
);

CardHeader.displayName = 'CardHeader';

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("px-6 pb-4", className)}
      {...props}
    />
  )
);

CardContent.displayName = 'CardContent';

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("px-6 py-4 bg-gray-50 border-t", className)}
      {...props}
    />
  )
);

CardFooter.displayName = 'CardFooter';

const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-lg font-semibold text-gray-900", className)}
      {...props}
    />
  )
);

CardTitle.displayName = 'CardTitle';

const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-gray-600 mt-1", className)}
      {...props}
    />
  )
);

CardDescription.displayName = 'CardDescription';

export { 
  Card, 
  CardHeader, 
  CardContent, 
  CardFooter, 
  CardTitle, 
  CardDescription 
};
export type { CardProps };