'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { ImageUpload } from '@/components/ui/file-upload'
import { SurpriseCard } from '@/components/ui/surprise-card'
import { FilterChips } from '@/components/ui/filter-chips'
import { AchievementProgress } from '@/components/ui/achievement-progress'
import { 
  Gift, 
  Sparkles, 
  Heart, 
  Lock, 
  Unlock, 
  Plus, 
  Calendar, 
  Key, 
  Image, 
  FileText, 
  Video, 
  MapPin, 
  Clock, 
  Star,
  X,
  Check,
  Settings,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  Trophy,
  Zap,
  Music,
  Camera,
  MessageCircle,
  ExternalLink,
  Download,
  Share2,
  Edit3,
  Trash2,
  RotateCcw,
  Play,
  Pause,
  Volume2,
  VolumeX
} from 'lucide-react'
import { getBrowserClient } from '@/lib/supabase/browser-client'
import { SurpriseBox, SurpriseAchievement, UnlockProgress } from '@/types'
import confetti from 'canvas-confetti'

export default function SorpresaSection() {
  const [surprises, setSurprises] = useState<SurpriseBox[]>([])
  const [achievements, setAchievements] = useState<SurpriseAchievement[]>([])
  const [unlockedAchievements, setUnlockedAchievements] = useState<SurpriseAchievement[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSurprise, setSelectedSurprise] = useState<SurpriseBox | null>(null)
  const [showUnlockModal, setShowUnlockModal] = useState(false)
  const [unlockKey, setUnlockKey] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingSurprise, setEditingSurprise] = useState<SurpriseBox | null>(null)
  const [currentView, setCurrentView] = useState<'grid' | 'list'>('grid')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)
  const [showAchievements, setShowAchievements] = useState(false)
  const [unlockProgress, setUnlockProgress] = useState<UnlockProgress[]>([])
  
  const supabase = getBrowserClient()

  // Función simple para mostrar notificaciones
  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    if (type === 'error') {
      alert(`Error: ${message}`)
    } else {
      alert(message)
    }
  }

  // Calcular conteos de categorías
  const getCategoryCounts = () => {
    const counts: Record<string, number> = {
      all: surprises.length,
      texto: surprises.filter(s => s.category === 'texto').length,
      foto: surprises.filter(s => s.category === 'foto').length,
      invitacion: surprises.filter(s => s.category === 'invitacion').length,
      evento: surprises.filter(s => s.category === 'evento').length,
      mixto: surprises.filter(s => s.category === 'mixto').length
    }
    return counts
  }

  // Cargar datos desde Supabase
  useEffect(() => {
    loadSurprises()
    loadAchievements()
    loadUnlockProgress()
  }, [])

  // Suscripción en tiempo real para sorpresas
  useEffect(() => {
    const channel = supabase
      .channel('surprises_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'surprises'
        },
        (payload) => {
          console.log('Cambio en sorpresas:', payload)
          loadSurprises()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  // Suscripción en tiempo real para achievements
  useEffect(() => {
    const channel = supabase
      .channel('achievements_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'achievements'
        },
        (payload) => {
          console.log('Cambio en achievements:', payload)
          loadAchievements()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  const loadSurprises = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('surprises')
        .select('*')
        .order('order', { ascending: true })

      if (error) {
        console.error('Error loading surprises:', error)
        alert('Error al cargar las sorpresas')
        return
      }

      setSurprises(data || [])
    } catch (error) {
      console.error('Error loading surprises:', error)
      showNotification('Error al cargar las sorpresas', 'error')
    } finally {
      setLoading(false)
    }
  }

  const loadAchievements = async () => {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .order('requirement', { ascending: true })

      if (error) {
        console.error('Error loading achievements:', error)
        return
      }

      setAchievements(data || [])
      
      // Filtrar achievements desbloqueados
      const unlocked = data?.filter(achievement => achievement.unlockedAt) || []
      setUnlockedAchievements(unlocked)
    } catch (error) {
      console.error('Error loading achievements:', error)
    }
  }

  const loadUnlockProgress = async () => {
    try {
      const { data, error } = await supabase
        .from('unlock_progress')
        .select('*')
        .order('attemptedAt', { ascending: false })

      if (error) {
        console.error('Error loading unlock progress:', error)
        return
      }

      setUnlockProgress(data || [])
    } catch (error) {
      console.error('Error loading unlock progress:', error)
    }
  }

  const createSurprise = async (surpriseData: Omit<SurpriseBox, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const { data, error } = await supabase
        .from('surprises')
        .insert([surpriseData])
        .select()
        .single()

      if (error) {
        console.error('Error creating surprise:', error)
        showNotification('Error al crear la sorpresa', 'error')
        return null
      }

      showNotification('Sorpresa creada exitosamente', 'success')
      return data
    } catch (error) {
      console.error('Error creating surprise:', error)
      showNotification('Error al crear la sorpresa', 'error')
      return null
    }
  }

  const updateSurprise = async (id: string, updates: Partial<SurpriseBox>) => {
    try {
      const { data, error } = await supabase
        .from('surprises')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating surprise:', error)
        showNotification('Error al actualizar la sorpresa', 'error')
        return null
      }

      showNotification('Sorpresa actualizada exitosamente', 'success')
      return data
    } catch (error) {
      console.error('Error updating surprise:', error)
      showNotification('Error al actualizar la sorpresa', 'error')
      return null
    }
  }

  const deleteSurprise = async (id: string) => {
    try {
      const { error } = await supabase
        .from('surprises')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting surprise:', error)
        showNotification('Error al eliminar la sorpresa', 'error')
        return false
      }

      showNotification('Sorpresa eliminada exitosamente', 'success')
      return true
    } catch (error) {
      console.error('Error deleting surprise:', error)
      showNotification('Error al eliminar la sorpresa', 'error')
      return false
    }
  }

  const unlockSurprise = async (surprise: SurpriseBox, unlockMethod: 'key' | 'date' | 'sequential' | 'free') => {
    try {
      // Registrar intento de desbloqueo
      await supabase
        .from('unlock_progress')
        .insert([{
          surpriseId: surprise.id,
          attemptType: unlockMethod,
          wasSuccessful: true,
          attemptedKey: unlockMethod === 'key' ? unlockKey : undefined
        }])

      // Actualizar sorpresa como desbloqueada
      const updatedSurprise = await updateSurprise(surprise.id, {
        isUnlocked: true,
        unlockedAt: new Date().toISOString()
      })

      if (updatedSurprise) {
        // Reproducir efectos
        if (updatedSurprise.effects?.confetti) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          })
        }

        if (updatedSurprise.effects?.sound) {
          // Aquí podrías reproducir un sonido
          console.log('Reproduciendo sonido:', updatedSurprise.effects.sound)
        }

        showNotification('¡Sorpresa desbloqueada!', 'success')
        setShowUnlockModal(false)
        setUnlockKey('')
        setSelectedSurprise(null)
      }
    } catch (error) {
      console.error('Error unlocking surprise:', error)
      showNotification('Error al desbloquear la sorpresa', 'error')
    }
  }

  const checkUnlockConditions = (surprise: SurpriseBox): { canUnlock: boolean; reason?: string } => {
    if (surprise.isUnlocked) {
      return { canUnlock: false, reason: 'Ya está desbloqueada' }
    }
    
    switch (surprise.unlockType) {
      case 'free':
        return { canUnlock: true }
      
      case 'date':
        if (!surprise.unlockDate) {
          return { canUnlock: false, reason: 'Fecha de desbloqueo no definida' }
        }
        const unlockDate = new Date(surprise.unlockDate)
        const now = new Date()
        return {
          canUnlock: now >= unlockDate,
          reason: now < unlockDate ? `Disponible el ${unlockDate.toLocaleDateString()}` : undefined
        }
      
      case 'sequential':
        if (!surprise.dependsOn) {
          return { canUnlock: true }
        }
        const dependsOnSurprise = surprises.find(s => s.id === surprise.dependsOn)
        return {
          canUnlock: dependsOnSurprise?.isUnlocked || false,
          reason: !dependsOnSurprise?.isUnlocked ? 'Debes desbloquear la sorpresa anterior' : undefined
        }
      
      case 'key':
        return { canUnlock: true, reason: 'Ingresa la llave correcta' }
      
      default:
        return { canUnlock: false, reason: 'Tipo de desbloqueo no válido' }
    }
  }

  const getTimeUntilUnlock = (surprise: SurpriseBox): string => {
    if (!surprise.unlockDate) return ''
    
    const unlockDate = new Date(surprise.unlockDate)
    const now = new Date()
    const diff = unlockDate.getTime() - now.getTime()
    
    if (diff <= 0) return '¡Disponible ahora!'
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (days > 0) return `${days} días, ${hours} horas`
    if (hours > 0) return `${hours} horas, ${minutes} minutos`
    return `${minutes} minutos`
  }

  const getUnlockProgress = (): number => {
    if (surprises.length === 0) return 0
    const unlockedCount = surprises.filter(s => s.isUnlocked).length
    return (unlockedCount / surprises.length) * 100
  }

  const filteredSurprises = surprises.filter(surprise => {
    const matchesCategory = filterCategory === 'all' || surprise.category === filterCategory
    const matchesSearch = searchQuery === '' || 
      surprise.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      surprise.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleUnlockAttempt = async () => {
    if (!selectedSurprise) return

    const unlockConditions = checkUnlockConditions(selectedSurprise)
    
    if (selectedSurprise.unlockType === 'key') {
      if (unlockKey === selectedSurprise.requiredKey) {
        await unlockSurprise(selectedSurprise, 'key')
      } else {
        // Registrar intento fallido
        await supabase
          .from('unlock_progress')
          .insert([{
            surpriseId: selectedSurprise.id,
            attemptType: 'key',
            wasSuccessful: false,
            attemptedKey: unlockKey
          }])
        
        showNotification('Llave incorrecta', 'error')
        setUnlockKey('')
      }
    } else if (unlockConditions.canUnlock) {
      await unlockSurprise(selectedSurprise, selectedSurprise.unlockType)
    } else {
      showNotification(unlockConditions.reason || 'No se puede desbloquear', 'error')
    }
  }

  const handleDateUnlock = async (surprise: SurpriseBox) => {
    const unlockConditions = checkUnlockConditions(surprise)
    if (unlockConditions.canUnlock) {
      await unlockSurprise(surprise, 'date')
    } else {
      showNotification(unlockConditions.reason || 'No se puede desbloquear', 'error')
    }
  }

  const handleSequentialUnlock = async (surprise: SurpriseBox) => {
    const unlockConditions = checkUnlockConditions(surprise)
    if (unlockConditions.canUnlock) {
      await unlockSurprise(surprise, 'sequential')
    } else {
      showNotification(unlockConditions.reason || 'No se puede desbloquear', 'error')
    }
  }

  const renderSurpriseContent = (surprise: SurpriseBox) => {
    const content = surprise.content

    switch (content.type) {
      case 'text':
  return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900">{content.title}</h3>
            <p className="text-gray-600">{content.description}</p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap text-gray-800 font-medium">{content.content}</pre>
      </div>
          </div>
        )

      case 'image':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900">{content.title}</h3>
            <p className="text-gray-600">{content.description}</p>
            {content.imageUrl && (
              <div className="relative">
                <img 
                  src={content.imageUrl} 
                  alt={content.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            )}
              </div>
        )

      case 'video':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900">{content.title}</h3>
            <p className="text-gray-600">{content.description}</p>
            {content.videoUrl && (
              <div className="relative">
                <video 
                  src={content.videoUrl}
                  controls
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            )}
            </div>
        )

      case 'invitation':
          return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900">{content.title}</h3>
            <p className="text-gray-600">{content.description}</p>
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-lg border border-pink-200">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="h-6 w-6 text-pink-500" />
                <span className="font-semibold text-gray-900">
                  {content.eventDate ? new Date(content.eventDate).toLocaleDateString() : 'Fecha por confirmar'}
                </span>
              </div>
              {content.eventLocation && (
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="h-5 w-5 text-pink-500" />
                  <span className="text-gray-700">{content.eventLocation}</span>
                </div>
              )}
              {content.eventMapLink && (
                <Button 
                  onClick={() => window.open(content.eventMapLink, '_blank')}
                  className="bg-pink-500 hover:bg-pink-600"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Ver en mapa
                </Button>
                    )}
                  </div>
                </div>
        )

      case 'event':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900">{content.title}</h3>
            <p className="text-gray-600">{content.description}</p>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="h-6 w-6 text-blue-500" />
                <span className="font-semibold text-gray-900">
                  {content.eventDate ? new Date(content.eventDate).toLocaleDateString() : 'Fecha por confirmar'}
                </span>
              </div>
              {content.eventLocation && (
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="h-5 w-5 text-blue-500" />
                  <span className="text-gray-700">{content.eventLocation}</span>
                  </div>
                )}
              {content.eventMapLink && (
                <Button 
                  onClick={() => window.open(content.eventMapLink, '_blank')}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Ver en mapa
                </Button>
              )}
                  </div>
          </div>
        )

      case 'mixed':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900">{content.title}</h3>
            <p className="text-gray-600">{content.description}</p>
            {content.blocks && (
              <div className="space-y-4">
                {content.blocks.sort((a, b) => a.order - b.order).map((block, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    {block.type === 'text' && (
                      <p className="text-gray-800">{block.content}</p>
                    )}
                    {block.type === 'image' && (
                      <img 
                        src={block.content} 
                        alt={`Imagen ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    )}
                    {block.type === 'video' && (
                      <video 
                        src={block.content}
                        controls
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    )}
                  </div>
                ))}
                    </div>
                  )}
          </div>
        )

      default:
        return <p className="text-gray-600">Contenido no disponible</p>
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'foto': return <Camera className="h-5 w-5" />
      case 'texto': return <FileText className="h-5 w-5" />
      case 'invitacion': return <Calendar className="h-5 w-5" />
      case 'evento': return <MapPin className="h-5 w-5" />
      case 'mixto': return <Sparkles className="h-5 w-5" />
      default: return <Gift className="h-5 w-5" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'foto': return 'bg-blue-100 text-blue-800'
      case 'texto': return 'bg-green-100 text-green-800'
      case 'invitacion': return 'bg-purple-100 text-purple-800'
      case 'evento': return 'bg-orange-100 text-orange-800'
      case 'mixto': return 'bg-pink-100 text-pink-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
                </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Gift className="h-8 w-8 text-pink-500" />
            Sorpresas Especiales
          </h1>
          <p className="text-gray-600 mt-2">
            Descubre sorpresas llenas de amor y momentos especiales
          </p>
      </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowAchievements(!showAchievements)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Trophy className="h-4 w-4" />
            Logros ({unlockedAchievements.length}/{achievements.length})
          </Button>
          
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-pink-500 hover:bg-pink-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nueva Sorpresa
          </Button>
        </div>
      </div>

      {/* Achievement Progress */}
      <AchievementProgress
        achievements={achievements}
        unlockedAchievements={unlockedAchievements}
        onToggleAchievements={() => setShowAchievements(!showAchievements)}
        showAchievements={showAchievements}
      />
          
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <FilterChips
          selectedCategory={filterCategory}
          onCategoryChange={setFilterCategory}
          counts={getCategoryCounts()}
        />
        
        <div className="flex-1">
          <Input
            placeholder="Buscar sorpresas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>
              
        <div className="flex gap-2">
          <Button
            variant={currentView === 'grid' ? 'default' : 'outline'}
            onClick={() => setCurrentView('grid')}
            size="sm"
          >
            <div className="grid grid-cols-2 gap-1">
              <div className="w-2 h-2 bg-current rounded"></div>
              <div className="w-2 h-2 bg-current rounded"></div>
              <div className="w-2 h-2 bg-current rounded"></div>
              <div className="w-2 h-2 bg-current rounded"></div>
            </div>
          </Button>
          <Button
            variant={currentView === 'list' ? 'default' : 'outline'}
            onClick={() => setCurrentView('list')}
            size="sm"
          >
            <div className="space-y-1">
              <div className="w-4 h-2 bg-current rounded"></div>
              <div className="w-4 h-2 bg-current rounded"></div>
              <div className="w-4 h-2 bg-current rounded"></div>
            </div>
          </Button>
        </div>
      </div>

      {/* Achievements Panel */}
      {showAchievements && (
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
                Logros Desbloqueados
              </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                className={`p-4 rounded-lg border ${
                  achievement.unlockedAt 
                    ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200' 
                    : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                  <span className="text-2xl">{achievement.icon}</span>
                      <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                    {achievement.unlockedAt && (
                        <p className="text-xs text-gray-500 mt-1">
                        Desbloqueado: {new Date(achievement.unlockedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
            </div>
            ))}
          </div>
        </div>
      )}

      {/* Surprises Grid/List */}
      {currentView === 'grid' ? (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          initial="hidden"
          animate="visible"
        >
          {filteredSurprises.map((surprise) => (
            <SurpriseCard
              key={surprise.id}
              surprise={surprise}
              onView={setSelectedSurprise}
              onUnlock={(surprise) => {
                setSelectedSurprise(surprise)
                setShowUnlockModal(true)
              }}
              getCategoryColor={getCategoryColor}
              getCategoryIcon={getCategoryIcon}
              getTimeUntilUnlock={getTimeUntilUnlock}
              isGridView={true}
            />
          ))}
        </motion.div>
                      >
                        <Unlock className="h-4 w-4 mr-1" />
                        Desbloquear
                      </Button>
                    )}
                          </div>
                        </div>
              </CardContent>
            </Card>
          ))}
                          </div>
      ) : (
        <div className="space-y-4">
          {filteredSurprises.map((surprise) => (
            <Card key={surprise.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {/* Cover Image */}
                  {surprise.coverImage && (
                    <div className="relative flex-shrink-0">
                      <img
                        src={surprise.coverImage}
                        alt={surprise.title}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      {!surprise.isUnlocked && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                          <Lock className="h-6 w-6 text-white" />
                        </div>
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
                          {surprise.isUnlocked ? (
                            <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                              <Check className="h-3 w-3" />
                              Desbloqueada
                  </div>
                          ) : (
                            <div className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                              <Lock className="h-3 w-3" />
                              Bloqueada
                    </div>
                  )}
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
                          onClick={() => setSelectedSurprise(surprise)}
                          variant="outline"
                size="sm"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Button>
                        
                        {!surprise.isUnlocked && (
                          <Button
                onClick={() => {
                              setSelectedSurprise(surprise)
                              setShowUnlockModal(true)
                }}
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
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredSurprises.length === 0 && (
        <div className="text-center py-12">
          <Gift className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay sorpresas</h3>
          <p className="text-gray-600 mb-4">
            {searchQuery || filterCategory !== 'all' 
              ? 'No se encontraron sorpresas con los filtros aplicados'
              : 'Aún no se han creado sorpresas'
            }
          </p>
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-pink-500 hover:bg-pink-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Crear Primera Sorpresa
          </Button>
                </div>
      )}

      {/* Surprise Detail Modal */}
      {selectedSurprise && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{selectedSurprise.title}</h2>
                <Button
                  onClick={() => setSelectedSurprise(null)}
                  variant="ghost"
                  size="sm"
                >
                  <X className="h-5 w-5" />
                </Button>
                </div>
                
              {selectedSurprise.isUnlocked ? (
                <div className="space-y-4">
                  {renderSurpriseContent(selectedSurprise)}
                  
                  {selectedSurprise.effects && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Efectos Especiales</h4>
                      <div className="flex gap-2">
                        {selectedSurprise.effects.confetti && (
                          <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded text-xs">
                            🎉 Confeti
                          </span>
                        )}
                        {selectedSurprise.effects.sound && (
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                            🔊 Sonido
                          </span>
                        )}
                        {selectedSurprise.effects.animation && (
                          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                            ✨ Animación
                          </span>
                        )}
                    </div>
                    </div>
                  )}
                  </div>
              ) : (
                <div className="text-center py-8">
                  <Lock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Sorpresa Bloqueada</h3>
                  <p className="text-gray-600 mb-4">{selectedSurprise.description}</p>
                  
                  <div className="space-y-2">
                    {selectedSurprise.unlockType === 'date' && selectedSurprise.unlockDate && (
                      <p className="text-sm text-gray-600">
                        Disponible el {new Date(selectedSurprise.unlockDate).toLocaleDateString()}
                      </p>
                    )}
                    
                    {selectedSurprise.unlockType === 'sequential' && (
                      <p className="text-sm text-gray-600">
                        Desbloquea la sorpresa anterior primero
                      </p>
                    )}
                    
                    {selectedSurprise.unlockType === 'key' && (
                      <p className="text-sm text-gray-600">
                        Ingresa la llave correcta para desbloquear
                      </p>
                    )}

                    {selectedSurprise.previewMessage && (
                      <p className="text-sm text-gray-500 italic">{selectedSurprise.previewMessage}</p>
                    )}
                </div>
              </div>
              )}
                </div>
                </div>
                  </div>
                )}

      {/* Unlock Modal */}
      {showUnlockModal && selectedSurprise && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Desbloquear Sorpresa</h2>
                <Button
                  onClick={() => {
                    setShowUnlockModal(false)
                    setUnlockKey('')
                  }}
                  variant="ghost"
                  size="sm"
                >
                  <X className="h-5 w-5" />
                </Button>
                  </div>

                  <div className="space-y-4">
                    <div>
                  <h3 className="font-medium text-gray-900 mb-2">{selectedSurprise.title}</h3>
                  <p className="text-sm text-gray-600">{selectedSurprise.description}</p>
                    </div>
                    
                {selectedSurprise.unlockType === 'key' && (
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ingresa la llave
                      </label>
                      <Input
                      type="password"
                      value={unlockKey}
                      onChange={(e) => setUnlockKey(e.target.value)}
                      placeholder="Escribe la llave..."
                      className="w-full"
                      />
                    </div>
                )}

                {selectedSurprise.unlockType === 'date' && (
                  <div className="text-center">
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      Esta sorpresa se desbloqueará automáticamente en la fecha programada
                    </p>
                    </div>
                )}

                {selectedSurprise.unlockType === 'sequential' && (
                  <div className="text-center">
                    <ChevronRight className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      Desbloquea la sorpresa anterior para acceder a esta
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
              <Button
                onClick={() => {
                      setShowUnlockModal(false)
                      setUnlockKey('')
                }}
                variant="outline"
                    className="flex-1"
              >
                Cancelar
              </Button>
                  
              <Button
                    onClick={handleUnlockAttempt}
                    className="flex-1 bg-pink-500 hover:bg-pink-600"
              >
                    <Unlock className="h-4 w-4 mr-2" />
                    Desbloquear
              </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
