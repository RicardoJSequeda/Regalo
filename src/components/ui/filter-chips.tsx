'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Gift,
  Star,
  Heart,
  Sparkles,
  Music,
  Camera,
  MessageCircle,
  MapPin,
  Video,
  Filter
} from 'lucide-react'

interface FilterChipsProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
  counts: Record<string, number>
}

const categories = [
  { id: 'all', label: 'Todas', icon: <Filter className="h-4 w-4" />, color: 'bg-gray-100 text-gray-800 hover:bg-gray-200' },
  { id: 'texto', label: 'Textos', icon: <MessageCircle className="h-4 w-4" />, color: 'bg-blue-100 text-blue-800 hover:bg-blue-200' },
  { id: 'foto', label: 'Fotos', icon: <Camera className="h-4 w-4" />, color: 'bg-green-100 text-green-800 hover:bg-green-200' },
  { id: 'invitacion', label: 'Invitaciones', icon: <MapPin className="h-4 w-4" />, color: 'bg-orange-100 text-orange-800 hover:bg-orange-200' },
  { id: 'evento', label: 'Eventos', icon: <Star className="h-4 w-4" />, color: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' },
  { id: 'mixto', label: 'Mixtos', icon: <Sparkles className="h-4 w-4" />, color: 'bg-pink-100 text-pink-800 hover:bg-pink-200' }
]

export function FilterChips({ selectedCategory, onCategoryChange, counts }: FilterChipsProps) {
  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1
      }
    }
  }

  const chipVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 10 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.05,
      y: -2,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    tap: {
      scale: 0.95,
      transition: {
        duration: 0.1
      }
    }
  }

  const selectedVariants = {
    selected: {
      scale: 1.1,
      boxShadow: "0 10px 25px rgba(236, 72, 153, 0.3)",
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-wrap gap-2 mb-6"
    >
      <AnimatePresence mode="wait">
        {categories.map((category) => {
          const isSelected = selectedCategory === category.id
          const count = counts[category.id] || 0
          
          return (
            <motion.div
              key={category.id}
              variants={chipVariants}
              whileHover="hover"
              whileTap="tap"
              animate={isSelected ? "selected" : "visible"}
              layout
            >
              <Button
                onClick={() => onCategoryChange(category.id)}
                variant="ghost"
                size="sm"
                className={`relative px-4 py-2 rounded-full border-2 transition-all duration-300 ${
                  isSelected 
                    ? 'border-pink-500 bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg' 
                    : `border-gray-200 ${category.color}`
                }`}
              >
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={isSelected ? { rotate: 360 } : { rotate: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {category.icon}
                  </motion.div>
                  <span className="font-medium">{category.label}</span>
                  
                  {/* Count badge */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                      isSelected 
                        ? 'bg-white/20 text-white' 
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {count}
                  </motion.div>
                </div>
                
                {/* Selection indicator */}
                {isSelected && (
                  <motion.div
                    layoutId="selectionIndicator"
                    className="absolute inset-0 rounded-full border-2 border-pink-300"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </Button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </motion.div>
  )
}
