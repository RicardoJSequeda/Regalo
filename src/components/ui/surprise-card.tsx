'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Eye,
  Lock,
  Unlock,
  Check,
  Gift,
  Star,
  Heart,
  Sparkles,
  Key,
  Clock,
  ChevronRight,
  Music,
  Camera,
  MessageCircle,
  MapPin,
  Video
} from 'lucide-react'
import { SurpriseBox } from '@/types'

interface SurpriseCardProps {
  surprise: SurpriseBox
  onView: (surprise: SurpriseBox) => void
  onUnlock: (surprise: SurpriseBox) => void
  getCategoryColor: (category: string) => string
  getCategoryIcon: (category: string) => React.ReactNode
  getTimeUntilUnlock: (surprise: SurpriseBox) => string
  isGridView?: boolean
}

export function SurpriseCard({
  surprise,
  onView,
  onUnlock,
  getCategoryColor,
  getCategoryIcon,
  getTimeUntilUnlock,
  isGridView = true
}: SurpriseCardProps) {
  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    hover: {
      y: -5,
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  }

  const lockVariants = {
    locked: { 
      rotate: [0, -10, 10, -10, 0],
      transition: { duration: 0.5 }
    },
    unlocked: { 
      rotate: 0,
      scale: [1, 1.2, 1],
      transition: { duration: 0.3 }
    }
  }

  const glowVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { 
      opacity: [0, 0.5, 0],
      scale: [0.8, 1.2, 1.5],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  if (isGridView) {
    return (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        className="relative"
      >
        <Card className={`relative overflow-hidden transition-all duration-300 ${
          surprise.isUnlocked 
            ? 'ring-2 ring-green-200 bg-gradient-to-br from-green-50 to-white shadow-lg' 
            : 'ring-2 ring-purple-200 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 shadow-md hover:shadow-xl'
        }`}>
          {/* Glow effect for locked surprises */}
          {!surprise.isUnlocked && (
            <motion.div
              variants={glowVariants}
              initial="initial"
              animate="animate"
              className="absolute inset-0 bg-gradient-to-r from-pink-400/20 via-purple-400/20 to-indigo-400/20 rounded-lg pointer-events-none"
            />
          )}

          <CardContent className="p-6 relative z-10">
            {/* Status Badge */}
            <div className="absolute top-4 right-4 z-20">
              <AnimatePresence mode="wait">
                {surprise.isUnlocked ? (
                  <motion.div
                    key="unlocked"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    className="bg-gradient-to-r from-green-400 to-green-600 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-lg"
                  >
                    <Check className="h-3 w-3" />
                    ¡Desbloqueada!
                  </motion.div>
                ) : (
                  <motion.div
                    key="locked"
                    variants={lockVariants}
                    animate="locked"
                    className="bg-gradient-to-r from-purple-400 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-lg"
                  >
                    <Lock className="h-3 w-3" />
                    Misteriosa
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Category Badge */}
            <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium shadow-md ${getCategoryColor(surprise.category)}`}>
              {getCategoryIcon(surprise.category)}
              {surprise.category}
            </div>

            {/* Cover Image */}
            {surprise.coverImage && (
              <div className="mt-4 relative group">
                <motion.img
                  src={surprise.coverImage}
                  alt={surprise.title}
                  className="w-full h-32 object-cover rounded-lg"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                />
                {!surprise.isUnlocked && (
                  <motion.div 
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center rounded-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      variants={lockVariants}
                      animate="locked"
                      className="text-white"
                    >
                      <Lock className="h-12 w-12 mx-auto mb-2" />
                      <p className="text-sm font-medium">Contenido Bloqueado</p>
                    </motion.div>
                  </motion.div>
                )}
              </div>
            )}

            {/* Content */}
            <div className="mt-4">
              <motion.h3 
                className="font-bold text-lg mb-2 text-gray-900"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {surprise.isUnlocked ? surprise.title : '🎁 Sorpresa Misteriosa'}
              </motion.h3>
              
              <motion.p 
                className="text-sm text-gray-600 mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {surprise.isUnlocked ? surprise.description : '¡Algo mágico te espera aquí!'}
              </motion.p>

              {/* Unlock Info for locked surprises */}
              {!surprise.isUnlocked && (
                <motion.div 
                  className="space-y-2 mb-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-3">
                    {surprise.unlockType === 'key' && (
                      <div className="flex items-center justify-center gap-2 text-sm text-purple-700">
                        <motion.div animate={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 1, repeat: Infinity }}>
                          <Key className="h-4 w-4" />
                        </motion.div>
                        <span className="font-medium">¡Necesitas la llave mágica!</span>
                      </div>
                    )}
                    {surprise.unlockType === 'date' && surprise.unlockDate && (
                      <div className="flex items-center justify-center gap-2 text-sm text-purple-700">
                        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                          <Clock className="h-4 w-4" />
                        </motion.div>
                        <span className="font-medium">{getTimeUntilUnlock(surprise)}</span>
                      </div>
                    )}
                    {surprise.unlockType === 'sequential' && (
                      <div className="flex items-center justify-center gap-2 text-sm text-purple-700">
                        <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 1, repeat: Infinity }}>
                          <ChevronRight className="h-4 w-4" />
                        </motion.div>
                        <span className="font-medium">¡Desbloquea la anterior primero!</span>
                      </div>
                    )}
                    {surprise.unlockType === 'free' && (
                      <div className="flex items-center justify-center gap-2 text-sm text-green-700">
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }}>
                          <Sparkles className="h-4 w-4" />
                        </motion.div>
                        <span className="font-medium">¡Lista para abrir!</span>
                      </div>
                    )}
                  </div>

                  {surprise.previewMessage && (
                    <motion.p 
                      className="text-xs text-purple-600 italic bg-white/50 rounded-lg p-2 text-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      "{surprise.previewMessage}"
                    </motion.p>
                  )}
                </motion.div>
              )}

              {/* Actions */}
              <motion.div 
                className="flex gap-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Button
                  onClick={() => onView(surprise)}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  {surprise.isUnlocked ? 'Ver' : 'Espiar'}
                </Button>
                
                {!surprise.isUnlocked && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={() => onUnlock(surprise)}
                      size="sm"
                      className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-lg"
                    >
                      <Unlock className="h-4 w-4 mr-1" />
                      ¡Desbloquear!
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  // List view
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      <Card className={`overflow-hidden transition-all duration-300 ${
        surprise.isUnlocked 
          ? 'ring-2 ring-green-200 bg-gradient-to-r from-green-50 to-white' 
          : 'ring-2 ring-purple-200 bg-gradient-to-r from-purple-50 via-pink-50 to-indigo-50'
      }`}>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            {/* Cover Image */}
            {surprise.coverImage && (
              <div className="relative flex-shrink-0">
                <motion.img
                  src={surprise.coverImage}
                  alt={surprise.title}
                  className="w-20 h-20 object-cover rounded-lg"
                  whileHover={{ scale: 1.05 }}
                />
                {!surprise.isUnlocked && (
                  <motion.div 
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center rounded-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <Lock className="h-6 w-6 text-white" />
                  </motion.div>
                )}
              </div>
            )}

            {/* Content */}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(surprise.category)}`}>
                      {getCategoryIcon(surprise.category)}
                      {surprise.category}
                    </div>
                    <AnimatePresence mode="wait">
                      {surprise.isUnlocked ? (
                        <motion.div
                          key="unlocked"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1"
                        >
                          <Check className="h-3 w-3" />
                          Desbloqueada
                        </motion.div>
                      ) : (
                        <motion.div
                          key="locked"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1"
                        >
                          <Lock className="h-3 w-3" />
                          Bloqueada
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-1">{surprise.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{surprise.description}</p>

                  {/* Unlock Info */}
                  {!surprise.isUnlocked && (
                    <div className="space-y-1">
                      {surprise.unlockType === 'date' && surprise.unlockDate && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4" />
                          <span>{getTimeUntilUnlock(surprise)}</span>
                        </div>
                      )}
                      
                      {surprise.unlockType === 'sequential' && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <ChevronRight className="h-4 w-4" />
                          <span>Secuencial</span>
                        </div>
                      )}
                      
                      {surprise.unlockType === 'key' && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Key className="h-4 w-4" />
                          <span>Requiere llave</span>
                        </div>
                      )}

                      {surprise.previewMessage && (
                        <p className="text-xs text-gray-500 italic">{surprise.previewMessage}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    onClick={() => onView(surprise)}
                    variant="outline"
                    size="sm"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Ver
                  </Button>
                  
                  {!surprise.isUnlocked && (
                    <Button
                      onClick={() => onUnlock(surprise)}
                      size="sm"
                      className="bg-pink-500 hover:bg-pink-600"
                    >
                      <Unlock className="h-4 w-4 mr-1" />
                      Desbloquear
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
