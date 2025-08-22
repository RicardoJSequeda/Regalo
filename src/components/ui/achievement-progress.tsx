'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Trophy,
  Star,
  Heart,
  Sparkles,
  Zap,
  Crown,
  Target,
  Award,
  Check,
  Lock
} from 'lucide-react'
import { SurpriseAchievement } from '@/types'

interface AchievementProgressProps {
  achievements: SurpriseAchievement[]
  unlockedAchievements: SurpriseAchievement[]
  onToggleAchievements: () => void
  showAchievements: boolean
}

export function AchievementProgress({
  achievements,
  unlockedAchievements,
  onToggleAchievements,
  showAchievements
}: AchievementProgressProps) {
  const totalAchievements = achievements.length
  const unlockedCount = unlockedAchievements.length
  const progressPercentage = totalAchievements > 0 ? (unlockedCount / totalAchievements) * 100 : 0

  const progressVariants = {
    initial: { width: 0 },
    animate: { 
      width: `${progressPercentage}%`,
      transition: {
        duration: 1,
        ease: "easeOut"
      }
    }
  }

  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  }

  const achievementVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    unlocked: {
      scale: [1, 1.1, 1],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }

  const getAchievementIcon = (achievement: SurpriseAchievement) => {
    const icons = {
      'first_unlock': <Star className="h-5 w-5" />,
      'collector': <Trophy className="h-5 w-5" />,
      'master': <Crown className="h-5 w-5" />,
      'key_master': <Zap className="h-5 w-5" />,
      'patient': <Target className="h-5 w-5" />,
      'sequential': <Award className="h-5 w-5" />
    }
    return icons[achievement.id as keyof typeof icons] || <Heart className="h-5 w-5" />
  }

  const getAchievementColor = (achievement: SurpriseAchievement) => {
    const colors = {
      'first_unlock': 'bg-blue-100 text-blue-800 border-blue-200',
      'collector': 'bg-green-100 text-green-800 border-green-200',
      'master': 'bg-purple-100 text-purple-800 border-purple-200',
      'key_master': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'patient': 'bg-orange-100 text-orange-800 border-orange-200',
      'sequential': 'bg-pink-100 text-pink-800 border-pink-200'
    }
    return colors[achievement.id as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white rounded-lg p-6 shadow-lg border border-gray-200 mb-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
          >
            <Trophy className="h-6 w-6 text-yellow-500" />
          </motion.div>
          <div>
            <h3 className="font-bold text-lg text-gray-900">Logros</h3>
            <p className="text-sm text-gray-600">
              {unlockedCount} de {totalAchievements} desbloqueados
            </p>
          </div>
        </div>
        
        <Button
          onClick={onToggleAchievements}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <motion.div
            animate={{ rotate: showAchievements ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <Sparkles className="h-4 w-4" />
          </motion.div>
          {showAchievements ? 'Ocultar' : 'Ver'} Logros
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progreso</span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
        <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            variants={progressVariants}
            initial="initial"
            animate="animate"
            className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full relative"
          >
            {/* Animated particles */}
            <AnimatePresence>
              {progressPercentage > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  style={{
                    animation: 'shimmer 2s infinite'
                  }}
                />
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Achievements List */}
      <AnimatePresence>
        {showAchievements && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
          >
            {achievements.map((achievement) => {
              const isUnlocked = unlockedAchievements.some(a => a.id === achievement.id)
              
              return (
                <motion.div
                  key={achievement.id}
                  variants={achievementVariants}
                  animate={isUnlocked ? "unlocked" : "visible"}
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all duration-300 ${
                    isUnlocked 
                      ? `${getAchievementColor(achievement)} shadow-md` 
                      : 'bg-gray-50 border-gray-200 opacity-60'
                  }`}
                >
                  <motion.div
                    animate={isUnlocked ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.5, repeat: isUnlocked ? Infinity : 0, repeatDelay: 2 }}
                    className={`p-2 rounded-full ${
                      isUnlocked ? 'bg-white/50' : 'bg-gray-200'
                    }`}
                  >
                    {getAchievementIcon(achievement)}
                  </motion.div>
                  
                  <div className="flex-1">
                    <h4 className={`font-semibold ${
                      isUnlocked ? 'text-current' : 'text-gray-500'
                    }`}>
                      {achievement.title}
                    </h4>
                    <p className={`text-sm ${
                      isUnlocked ? 'text-current/80' : 'text-gray-400'
                    }`}>
                      {achievement.description}
                    </p>
                  </div>
                  
                  <AnimatePresence mode="wait">
                    {isUnlocked ? (
                      <motion.div
                        key="unlocked"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        className="text-green-500"
                      >
                        <Check className="h-5 w-5" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="locked"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="text-gray-400"
                      >
                        <Lock className="h-5 w-5" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
