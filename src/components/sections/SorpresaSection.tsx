'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { ImageUpload } from '@/components/ui/file-upload'
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
import { useLocalStorage } from '@/hooks/useLocalStorage'

interface SurpriseContent {
  type: 'text' | 'image' | 'video' | 'invitation' | 'event' | 'mixed'
  title: string
  description: string
  content: string
  imageUrl?: string
  videoUrl?: string
  eventDate?: string
  eventLocation?: string
  eventMapLink?: string
  blocks?: Array<{
    type: 'text' | 'image' | 'video'
    content: string
    order: number
  }>
}

interface SurpriseBox {
  id: string
  title: string
  description: string
  coverImage?: string
  category: 'foto' | 'texto' | 'invitacion' | 'evento' | 'mixto'
  isUnlocked: boolean
  unlockType: 'key' | 'date' | 'sequential' | 'free'
  unlockDate?: string
  unlockTime?: string
  requiredKey?: string
  dependsOn?: string
  sequentialOrder?: number
  content: SurpriseContent
  createdAt: string
  unlockedAt?: string
  order: number
  effects?: {
    confetti?: boolean
    sound?: string
    animation?: string
  }
  previewMessage?: string
  achievements?: string[]
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt?: string
  requirement: number
}

const defaultSurprises: SurpriseBox[] = [
  {
    id: '1',
    title: 'Mensaje Secreto',
    description: 'Un mensaje especial lleno de amor y cariño',
    category: 'texto',
    isUnlocked: true,
    unlockType: 'free',
    content: {
      type: 'text',
      title: 'Mi Amor Eterno',
      description: 'Un mensaje que viene desde lo más profundo de mi corazón',
      content: 'Mi querido amor, cada día que pasa a tu lado es un regalo que atesoro con todo mi corazón. Desde el momento en que nuestros ojos se encontraron, supe que mi vida cambiaría para siempre. Tu sonrisa ilumina mis días más oscuros y tu amor me da la fuerza para enfrentar cualquier desafío. Eres mi compañero perfecto, mi mejor amigo y el amor de mi vida. Te amo más de lo que las palabras pueden expresar.'
    },
    createdAt: '2024-01-01',
    unlockedAt: '2024-01-01',
    order: 1,
    effects: {
      confetti: true,
      sound: 'magic-chime.mp3'
    }
  },
  {
    id: '2',
    title: 'Video Recopilatorio',
    description: 'Nuestros momentos más especiales en video',
    category: 'mixto',
    isUnlocked: false,
    unlockType: 'date',
    unlockDate: '2024-12-25',
    unlockTime: '00:00',
    content: {
      type: 'mixed',
      title: 'Nuestros Momentos Especiales',
      description: 'Una recopilación de todos nuestros momentos más hermosos juntos',
      content: 'Video especial de nuestros recuerdos',
      videoUrl: 'https://example.com/video-special.mp4',
      blocks: [
        {
          type: 'text',
          content: 'Este video contiene todos nuestros momentos más especiales juntos...',
          order: 1
        },
        {
          type: 'video',
          content: 'https://example.com/video-special.mp4',
          order: 2
        }
      ]
    },
    createdAt: '2024-01-01',
    order: 2,
    previewMessage: '¡Faltan solo 30 días para descubrir este video especial!',
    effects: {
      confetti: true,
      animation: 'slide-up'
    }
  },
  {
    id: '3',
    title: 'Nuestro Álbum de Recuerdos',
    description: 'Fotos de nuestros momentos más especiales',
    category: 'foto',
    isUnlocked: false,
    unlockType: 'sequential',
    dependsOn: '1',
    sequentialOrder: 2,
    content: {
      type: 'image',
      title: 'Álbum de Amor',
      description: 'Una colección de fotos que cuentan nuestra historia',
      content: 'Colección de fotos especiales',
      imageUrl: '/api/placeholder/400/300'
    },
    createdAt: '2024-01-01',
    order: 3,
    effects: {
      confetti: true
    }
  },
  {
    id: '4',
    title: 'Cena Romántica',
    description: 'Una invitación para una cena especial',
    category: 'invitacion',
    isUnlocked: false,
    unlockType: 'key',
    requiredKey: 'AMOR2024',
    content: {
      type: 'invitation',
      title: 'Cena Romántica',
      description: 'Te invito a una cena especial solo para nosotros',
      content: 'Reserva confirmada en el restaurante más romántico de la ciudad',
      eventDate: '2024-02-14',
      eventLocation: 'Restaurante El Amor',
      eventMapLink: 'https://maps.google.com/?q=restaurante+romantico'
    },
    createdAt: '2024-01-01',
    order: 4,
    previewMessage: '¡Ingresa la llave especial para descubrir esta sorpresa!',
    effects: {
      confetti: true,
      sound: 'romantic-chime.mp3'
    }
  },
  {
    id: '5',
    title: 'Viaje Sorpresa',
    description: 'Un viaje inolvidable para los dos',
    category: 'evento',
    isUnlocked: false,
    unlockType: 'date',
    unlockDate: '2024-06-15',
    unlockTime: '09:00',
    content: {
      type: 'event',
      title: 'Viaje a la Playa',
      description: 'Un fin de semana romántico en la playa',
      content: 'Reserva confirmada en el hotel más hermoso frente al mar',
      eventDate: '2024-06-15',
      eventLocation: 'Playa del Amor, Cancún',
      eventMapLink: 'https://maps.google.com/?q=cancun+beach+hotel'
    },
    createdAt: '2024-01-01',
    order: 5,
    previewMessage: '¡Faltan solo 165 días para este viaje sorpresa!',
    effects: {
      confetti: true,
      animation: 'zoom-in'
    }
  },
  {
    id: '6',
    title: 'Poema Personalizado',
    description: 'Un poema escrito especialmente para ti',
    category: 'texto',
    isUnlocked: false,
    unlockType: 'sequential',
    dependsOn: '3',
    sequentialOrder: 3,
    content: {
      type: 'text',
      title: 'Poema de Amor',
      description: 'Versos que nacieron de mi corazón para ti',
      content: 'En cada amanecer veo tu sonrisa,\nEn cada atardecer siento tu amor,\nEres mi inspiración, mi alegría,\nMi compañero, mi tesoro, mi flor.\n\nCada día a tu lado es un regalo,\nCada momento contigo es especial,\nTu amor me hace sentir completo,\nEres mi presente y mi futuro ideal.'
    },
    createdAt: '2024-01-01',
    order: 6,
    effects: {
      confetti: true
    }
  },
  {
    id: '7',
    title: 'Regalo Especial',
    description: 'Un regalo que te hará sonreír',
    category: 'mixto',
    isUnlocked: false,
    unlockType: 'key',
    requiredKey: 'FELICIDAD',
    content: {
      type: 'mixed',
      title: 'Regalo del Corazón',
      description: 'Un regalo que elegí especialmente para ti',
      content: 'Te he preparado un regalo muy especial que sé que te encantará.',
      blocks: [
        {
          type: 'text',
          content: 'Te he preparado un regalo muy especial que sé que te encantará. Es algo que has estado deseando y que representa todo mi amor por ti.',
          order: 1
        },
        {
          type: 'image',
          content: '/api/placeholder/300/200',
          order: 2
        }
      ]
    },
    createdAt: '2024-01-01',
    order: 7,
    previewMessage: '¡Encuentra la llave de la felicidad!',
    effects: {
      confetti: true,
      sound: 'gift-open.mp3'
    }
  },
  {
    id: '8',
    title: 'Canción Dedicada',
    description: 'Una canción compuesta especialmente para ti',
    category: 'mixto',
    isUnlocked: false,
    unlockType: 'date',
    unlockDate: '2024-08-20',
    unlockTime: '20:00',
    content: {
      type: 'mixed',
      title: 'Canción de Amor',
      description: 'Una canción que compuse pensando en ti',
      content: 'Dedicada especialmente para ti',
      videoUrl: 'https://example.com/song-dedicated.mp4',
      blocks: [
        {
          type: 'text',
          content: 'Esta canción la compuse pensando en ti, en nuestro amor...',
          order: 1
        },
        {
          type: 'video',
          content: 'https://example.com/song-dedicated.mp4',
          order: 2
        }
      ]
    },
    createdAt: '2024-01-01',
    order: 8,
    previewMessage: '¡Faltan solo 240 días para escuchar tu canción!',
    effects: {
      confetti: true,
      sound: 'music-note.mp3',
      animation: 'fade-in'
    }
  },
  {
    id: '9',
    title: 'Sorpresa Final',
    description: 'La sorpresa más especial de todas',
    category: 'evento',
    isUnlocked: false,
    unlockType: 'sequential',
    dependsOn: '8',
    sequentialOrder: 4,
    content: {
      type: 'event',
      title: 'Propuesta de Matrimonio',
      description: 'El momento más especial de nuestras vidas',
      content: 'Te propongo pasar el resto de nuestras vidas juntos, amándonos cada día más.',
      eventDate: '2024-12-31',
      eventLocation: 'Lugar más especial para nosotros',
      eventMapLink: 'https://maps.google.com/?q=special+place'
    },
    createdAt: '2024-01-01',
    order: 9,
    effects: {
      confetti: true,
      sound: 'wedding-bells.mp3',
      animation: 'explosion'
    }
  }
]

const achievements: Achievement[] = [
  {
    id: 'first-unlock',
    title: 'Primera Sorpresa',
    description: 'Desbloqueaste tu primera sorpresa',
    icon: '🎉',
    requirement: 1
  },
  {
    id: 'explorer',
    title: 'Explorador',
    description: 'Desbloqueaste 3 sorpresas',
    icon: '🔍',
    requirement: 3
  },
  {
    id: 'collector',
    title: 'Coleccionista',
    description: 'Desbloqueaste 5 sorpresas',
    icon: '📦',
    requirement: 5
  },
  {
    id: 'master',
    title: 'Maestro del Amor',
    description: 'Desbloqueaste todas las sorpresas',
    icon: '👑',
    requirement: 9
  }
]

export function SorpresaSection() {
  const { value: surprises, setValue: setSurprises } = useLocalStorage<SurpriseBox[]>('surprises', defaultSurprises)
  const { value: unlockedAchievements, setValue: setUnlockedAchievements } = useLocalStorage<Achievement[]>('unlockedAchievements', [])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(6)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showUnlockModal, setShowUnlockModal] = useState(false)
  const [showContentModal, setShowContentModal] = useState(false)
  const [showAchievementsModal, setShowAchievementsModal] = useState(false)
  const [selectedSurprise, setSelectedSurprise] = useState<SurpriseBox | null>(null)
  const [unlockKey, setUnlockKey] = useState('')
  const [audioRef] = useState(useRef<HTMLAudioElement | null>(null))
  const [confettiActive, setConfettiActive] = useState(false)
  const [newSurprise, setNewSurprise] = useState({
    title: '',
    description: '',
    coverImage: '',
    category: 'texto' as const,
    unlockType: 'free' as const,
    unlockDate: '',
    unlockTime: '00:00',
    requiredKey: '',
    dependsOn: '',
    contentType: 'text' as const,
    contentTitle: '',
    contentDescription: '',
    contentText: '',
    eventDate: '',
    eventLocation: '',
    eventMapLink: '',
    previewMessage: '',
    effects: {
      confetti: true,
      sound: '',
      animation: 'fade-in'
    },
    blocks: [] as Array<{type: 'text' | 'image' | 'video', content: string, order: number}>
  })
  const [uploadedFiles, setUploadedFiles] = useState<{[key: string]: File}>({})
  const [isUploading, setIsUploading] = useState(false)

  // Persistir datos en localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('surprises', JSON.stringify(surprises))
    }
  }, [surprises])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('unlockedAchievements', JSON.stringify(unlockedAchievements))
    }
  }, [unlockedAchievements])

  // Calcular estadísticas
  const unlockedCount = surprises.filter(s => s.isUnlocked).length
  const totalCount = surprises.length
  const progressPercentage = Math.round((unlockedCount / totalCount) * 100)

  // Paginación
  const totalPages = Math.ceil(surprises.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentSurprises = surprises.slice(startIndex, endIndex)

  // Verificar logros
  useEffect(() => {
    const newAchievements = achievements.filter(achievement => {
      const isUnlocked = unlockedCount >= achievement.requirement
      const alreadyUnlocked = unlockedAchievements.some(a => a.id === achievement.id)
      return isUnlocked && !alreadyUnlocked
    })

    if (newAchievements.length > 0) {
      setUnlockedAchievements(prev => [...prev, ...newAchievements])
      setShowAchievementsModal(true)
    }
  }, [unlockedCount, unlockedAchievements])

  // Verificar desbloqueos por fecha
  useEffect(() => {
    const checkDateUnlocks = () => {
      const now = new Date()
      setSurprises(prev => prev.map(surprise => {
        if (!surprise.isUnlocked && surprise.unlockType === 'date' && surprise.unlockDate) {
          const unlockDateTime = new Date(`${surprise.unlockDate}T${surprise.unlockTime || '00:00'}`)
          if (now >= unlockDateTime) {
            return { ...surprise, isUnlocked: true, unlockedAt: now.toISOString() }
          }
        }
        return surprise
      }))
    }

    checkDateUnlocks()
    const interval = setInterval(checkDateUnlocks, 60000) // Verificar cada minuto
    return () => clearInterval(interval)
  }, [])

  // Verificar si una sorpresa puede ser desbloqueada
  const canUnlock = (surprise: SurpriseBox) => {
    if (surprise.isUnlocked) return false
    
    switch (surprise.unlockType) {
      case 'date':
        if (!surprise.unlockDate) return false
        const unlockDateTime = new Date(`${surprise.unlockDate}T${surprise.unlockTime || '00:00'}`)
        return new Date() >= unlockDateTime
      case 'sequential':
        const dependency = surprises.find(s => s.id === surprise.dependsOn)
        return dependency?.isUnlocked || false
      case 'key':
      case 'free':
        return true
      default:
        return false
    }
  }

  // Calcular tiempo restante para sorpresas con fecha
  const getTimeRemaining = (surprise: SurpriseBox) => {
    if (surprise.unlockType !== 'date' || !surprise.unlockDate) return null
    
    const unlockDateTime = new Date(`${surprise.unlockDate}T${surprise.unlockTime || '00:00'}`)
    const now = new Date()
    const diff = unlockDateTime.getTime() - now.getTime()
    
    if (diff <= 0) return null
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    return { days, hours, minutes }
  }

  // Reproducir efectos de sonido reales
  const playEffects = (surprise: SurpriseBox) => {
    if (surprise.effects?.sound) {
      // Usar generador de audio sintético
      const soundName = surprise.effects.sound.replace('.mp3', '')
      if (typeof window !== 'undefined' && (window as any).playSound) {
        (window as any).playSound(soundName)
      } else {
        // Fallback: intentar cargar archivo de audio
        const audio = new Audio(`/sounds/${surprise.effects.sound}`)
        audio.volume = 0.5
        audio.play().catch(e => console.log('Error playing sound:', e))
      }
    }
    
    if (surprise.effects?.confetti) {
      setConfettiActive(true)
      setTimeout(() => setConfettiActive(false), 3000)
    }
  }



  // Crear nueva sorpresa
  const createSurprise = () => {
    if (!newSurprise.title || !newSurprise.contentTitle) return

    const newSurpriseBox: SurpriseBox = {
      id: Date.now().toString(),
      title: newSurprise.title,
      description: newSurprise.description,
      coverImage: newSurprise.coverImage,
      category: newSurprise.category,
      isUnlocked: false,
      unlockType: newSurprise.unlockType,
      unlockDate: newSurprise.unlockDate,
      unlockTime: newSurprise.unlockTime,
      requiredKey: newSurprise.requiredKey,
      dependsOn: newSurprise.dependsOn,
      content: {
        type: newSurprise.contentType,
        title: newSurprise.contentTitle,
        description: newSurprise.contentDescription,
        content: newSurprise.contentText,
        eventDate: newSurprise.eventDate,
        eventLocation: newSurprise.eventLocation,
        eventMapLink: newSurprise.eventMapLink,
        blocks: newSurprise.blocks
      },
      createdAt: new Date().toISOString(),
      order: surprises.length + 1,
      effects: newSurprise.effects,
      previewMessage: newSurprise.previewMessage
    }

    setSurprises(prev => [...prev, newSurpriseBox])
    setShowCreateModal(false)
    resetForm()
  }

  // Resetear formulario
  const resetForm = () => {
    setNewSurprise({
      title: '',
      description: '',
      coverImage: '',
      category: 'texto',
      unlockType: 'free',
      unlockDate: '',
      unlockTime: '00:00',
      requiredKey: '',
      dependsOn: '',
      contentType: 'text',
      contentTitle: '',
      contentDescription: '',
      contentText: '',
      eventDate: '',
      eventLocation: '',
      eventMapLink: '',
      previewMessage: '',
      effects: {
        confetti: true,
        sound: '',
        animation: 'fade-in'
      },
      blocks: []
    })
    setUploadedFiles({})
  }

  // Desbloquear sorpresa
  const unlockSurprise = (surprise: SurpriseBox) => {
    if (surprise.unlockType === 'key' && unlockKey !== surprise.requiredKey) {
      alert('¡Llave incorrecta! Intenta de nuevo.')
      return
    }

    setSurprises(prev => prev.map(s => 
      s.id === surprise.id 
        ? { ...s, isUnlocked: true, unlockedAt: new Date().toISOString() }
        : s
    ))
    setShowUnlockModal(false)
    setUnlockKey('')
    setSelectedSurprise(null)
    
    // Reproducir efectos
    playEffects(surprise)
    
    // Mostrar contenido después de desbloquear
    setTimeout(() => {
      setSelectedSurprise(surprise)
      setShowContentModal(true)
    }, 500)
  }

  // Abrir modal de desbloqueo
  const openUnlockModal = (surprise: SurpriseBox) => {
    setSelectedSurprise(surprise)
    setShowUnlockModal(true)
  }

  // Abrir contenido de sorpresa
  const openSurpriseContent = (surprise: SurpriseBox) => {
    setSelectedSurprise(surprise)
    setShowContentModal(true)
    playEffects(surprise)
  }

  // Obtener icono de categoría
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'foto': return <Camera className="h-4 w-4" />
      case 'texto': return <FileText className="h-4 w-4" />
      case 'invitacion': return <Calendar className="h-4 w-4" />
      case 'evento': return <MapPin className="h-4 w-4" />
      case 'mixto': return <Star className="h-4 w-4" />
      default: return <Gift className="h-4 w-4" />
    }
  }

  // Obtener color de categoría
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'foto': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'texto': return 'bg-green-100 text-green-800 border-green-200'
      case 'invitacion': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'evento': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'mixto': return 'bg-pink-100 text-pink-800 border-pink-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-gray-800">Nuestras Sorpresas</h1>
        <p className="text-gray-600 text-lg">
          Pequeños gestos de amor que te harán sonreír y recordar lo especial que eres para mí
        </p>
      </div>

      {/* Estadísticas */}
      <Card className="surprise-stats">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{unlockedCount}</div>
                <div className="text-sm text-gray-600">Desbloqueadas</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">{totalCount - unlockedCount}</div>
                <div className="text-sm text-gray-600">Por descubrir</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-600">{totalCount}</div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Trophy className="h-6 w-6 text-pink-500" />
              <span className="text-lg font-semibold text-gray-700">{progressPercentage}% completado</span>
            </div>
          </div>
          <div className="mt-4">
            <Progress value={progressPercentage} className="surprise-progress h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Grid de Sorpresas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentSurprises.map((surprise) => {
          const timeRemaining = getTimeRemaining(surprise)
          const canUnlockSurprise = canUnlock(surprise)
          
          return (
            <Card 
              key={surprise.id}
              className={`surprise-card transition-all duration-300 ${
                surprise.isUnlocked 
                  ? 'unlocked' 
                  : canUnlockSurprise
                  ? 'hover:scale-105 cursor-pointer'
                  : 'opacity-60'
              }`}
            >
              <CardContent className="p-6 relative">
                {/* Iconos superiores */}
                <div className="flex justify-between items-start mb-4">
                  <Sparkles className="surprise-icon h-6 w-6 text-yellow-500" />
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(surprise.category)}
                    {!surprise.isUnlocked && (
                      <Lock className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                </div>

                {/* Imagen de portada */}
                {surprise.coverImage && (
                  <div className="mb-4 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Image className="h-8 w-8 text-gray-400" />
                  </div>
                )}

                {/* Contenido */}
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-gray-800">{surprise.title}</h3>
                  <p className="text-gray-600 text-sm">{surprise.description}</p>
                  
                  {/* Categoría */}
                  <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(surprise.category)}`}>
                    {surprise.category.charAt(0).toUpperCase() + surprise.category.slice(1)}
                  </div>
                  
                  {/* Estado de desbloqueo */}
                  <div className="text-xs text-gray-500">
                    {surprise.isUnlocked ? (
                      <span className="text-green-600 flex items-center gap-1">
                        <Check className="h-3 w-3" />
                        Desbloqueada: Disponible ahora
                      </span>
                    ) : (
                      <span className="text-orange-600 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {surprise.unlockType === 'date' && timeRemaining && (
                          `${timeRemaining.days}d ${timeRemaining.hours}h ${timeRemaining.minutes}m`
                        )}
                        {surprise.unlockType === 'key' && 'Requiere llave especial'}
                        {surprise.unlockType === 'sequential' && 'Requiere desbloquear otra sorpresa'}
                        {surprise.unlockType === 'free' && 'Disponible manualmente'}
                      </span>
                    )}
                  </div>

                  {/* Mensaje previo */}
                  {!surprise.isUnlocked && surprise.previewMessage && (
                    <div className="text-xs text-pink-600 bg-pink-50 p-2 rounded">
                      {surprise.previewMessage}
                    </div>
                  )}

                  {/* Botón de acción */}
                  <Button
                    onClick={() => {
                      if (surprise.isUnlocked) {
                        openSurpriseContent(surprise)
                      } else if (canUnlockSurprise) {
                        openUnlockModal(surprise)
                      }
                    }}
                    disabled={!surprise.isUnlocked && !canUnlockSurprise}
                    className={`w-full ${
                      surprise.isUnlocked 
                        ? 'bg-pink-500 hover:bg-pink-600' 
                        : canUnlockSurprise
                        ? 'bg-orange-500 hover:bg-orange-600'
                        : 'bg-gray-300 cursor-not-allowed'
                    } text-white transition-all duration-200`}
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    <Sparkles className="h-4 w-4 mr-2" />
                    {surprise.isUnlocked ? 'Abrir Sorpresa' : 'Desbloquear'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            variant="outline"
            size="sm"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <span className="text-sm text-gray-600">
            Página {currentPage} de {totalPages}
          </span>
          
          <Button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            variant="outline"
            size="sm"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Botones de acción */}
      <div className="flex justify-center gap-4">
        <Button
          onClick={() => setShowCreateModal(true)}
          className="create-surprise-button"
        >
          <Plus className="h-4 w-4 mr-2" />
          Crear Nueva Sorpresa
        </Button>
        
        <Button
          onClick={() => setShowAchievementsModal(true)}
          variant="outline"
          className="border-pink-200 text-pink-600 hover:bg-pink-50"
        >
          <Trophy className="h-4 w-4 mr-2" />
          Ver Logros ({unlockedAchievements.length})
        </Button>
      </div>

      {/* Confeti */}
      {confettiActive && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`
              }}
            >
              {['🎉', '🎊', '✨', '💖', '🎁', '⭐'][Math.floor(Math.random() * 6)]}
            </div>
          ))}
        </div>
      )}

      {/* Modal de Desbloqueo */}
      {showUnlockModal && selectedSurprise && (
        <div className="fixed inset-0 modal-overlay flex items-center justify-center z-50">
          <div className="unlock-modal rounded-lg p-6 w-full max-w-md mx-4 shadow-2xl">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-3 bg-pink-100 rounded-full">
                  <Key className="h-8 w-8 text-pink-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Desbloquear Sorpresa</h3>
              <p className="text-gray-600">{selectedSurprise.title}</p>
              
              {selectedSurprise.unlockType === 'key' && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-500">Ingresa la llave especial:</p>
                  <Input
                    type="password"
                    value={unlockKey}
                    onChange={(e) => setUnlockKey(e.target.value)}
                    placeholder="Ingresa la llave..."
                    className="text-center text-lg font-mono"
                  />
                </div>
              )}
              
              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setShowUnlockModal(false)
                    setUnlockKey('')
                    setSelectedSurprise(null)
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() => unlockSurprise(selectedSurprise)}
                  className="flex-1 bg-pink-500 hover:bg-pink-600"
                >
                  <Unlock className="h-4 w-4 mr-2" />
                  Desbloquear
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Logros */}
      {showAchievementsModal && (
        <div className="fixed inset-0 modal-overlay flex items-center justify-center z-50">
          <div className="modal-content bg-white rounded-lg p-6 w-full max-w-2xl mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                <Trophy className="h-6 w-6 text-yellow-500" />
                Logros Desbloqueados
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAchievementsModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement) => {
                const isUnlocked = unlockedAchievements.some(a => a.id === achievement.id)
                return (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      isUnlocked
                        ? 'border-yellow-300 bg-yellow-50'
                        : 'border-gray-200 bg-gray-50 opacity-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{achievement.title}</h4>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Requiere {achievement.requirement} sorpresa{achievement.requirement > 1 ? 's' : ''}
                        </p>
                      </div>
                      {isUnlocked && (
                        <Check className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Contenido */}
      {showContentModal && selectedSurprise && (
        <div className="fixed inset-0 modal-overlay flex items-center justify-center z-50">
          <div className="modal-content bg-white rounded-lg p-6 w-full max-w-4xl mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                <Gift className="h-6 w-6 text-pink-500" />
                {selectedSurprise.content.title}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowContentModal(false)
                  setSelectedSurprise(null)
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-gray-600 text-lg">{selectedSurprise.content.description}</p>
              </div>
              
              {/* Contenido según el tipo */}
              {selectedSurprise.content.type === 'text' && (
                <div className="surprise-content">
                  <p className="text-gray-800 whitespace-pre-line leading-relaxed">
                    {selectedSurprise.content.content}
                  </p>
                </div>
              )}
              
              {selectedSurprise.content.type === 'image' && (
                <div className="text-center">
                  <div className="bg-gray-200 rounded-lg p-8">
                    <Image className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Imagen: {selectedSurprise.content.content}</p>
                  </div>
                </div>
              )}
              
              {selectedSurprise.content.type === 'video' && (
                <div className="text-center">
                  <div className="bg-gray-200 rounded-lg p-8">
                    <Video className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Video: {selectedSurprise.content.content}</p>
                  </div>
                </div>
              )}
              
              {selectedSurprise.content.type === 'mixed' && (
                <div className="space-y-4">
                  {selectedSurprise.content.blocks?.map((block, index) => (
                    <div key={index} className="surprise-content">
                      {block.type === 'text' && (
                        <p className="text-gray-800 whitespace-pre-line leading-relaxed">
                          {block.content}
                        </p>
                      )}
                      {block.type === 'image' && (
                        <div className="text-center">
                          <div className="bg-gray-200 rounded-lg p-8">
                            <Image className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">Imagen: {block.content}</p>
                          </div>
                        </div>
                      )}
                      {block.type === 'video' && (
                        <div className="text-center">
                          <div className="bg-gray-200 rounded-lg p-8">
                            <Video className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">Video: {block.content}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {(selectedSurprise.content.type === 'invitation' || selectedSurprise.content.type === 'event') && (
                <div className="surprise-content space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-blue-800">
                      {selectedSurprise.content.eventDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-blue-800">
                      {selectedSurprise.content.eventLocation}
                    </span>
                  </div>
                  {selectedSurprise.content.eventMapLink && (
                    <div className="flex items-center gap-3">
                      <ExternalLink className="h-5 w-5 text-blue-600" />
                      <a 
                        href={selectedSurprise.content.eventMapLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        Ver en Google Maps
                      </a>
                    </div>
                  )}
                  <div className="bg-white p-4 rounded border">
                    <p className="text-gray-800">{selectedSurprise.content.content}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal para Crear Sorpresa */}
      {showCreateModal && (
        <div className="fixed inset-0 modal-overlay flex items-center justify-center z-50">
          <div className="modal-content bg-white rounded-lg p-6 w-full max-w-6xl mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                <Plus className="h-6 w-6 text-pink-500" />
                Crear Nueva Sorpresa
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowCreateModal(false)
                  resetForm()
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Información básica */}
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">Información Básica</h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Título de la Sorpresa *
                  </label>
                  <Input
                    value={newSurprise.title}
                    onChange={(e) => setNewSurprise(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Ej: Mensaje Secreto"
                    className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <Input
                    value={newSurprise.description}
                    onChange={(e) => setNewSurprise(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe brevemente la sorpresa"
                    className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoría
                  </label>
                  <select
                    value={newSurprise.category}
                    onChange={(e) => setNewSurprise(prev => ({ ...prev, category: e.target.value as any }))}
                    className="w-full p-2 border border-gray-300 rounded-md focus:border-pink-500 focus:ring-pink-500"
                  >
                    <option value="texto">Texto</option>
                    <option value="foto">Foto</option>
                    <option value="invitacion">Invitación</option>
                    <option value="evento">Evento</option>
                    <option value="mixto">Mixto</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Imagen de Portada (Opcional)
                  </label>
                  <ImageUpload
                    currentImage={newSurprise.coverImage}
                    onFileSelect={(file, dataUrl) => setNewSurprise(prev => ({ ...prev, coverImage: dataUrl }))}
                    onRemove={() => setNewSurprise(prev => ({ ...prev, coverImage: '' }))}
                    maxSize={2}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Desbloqueo
                  </label>
                  <select
                    value={newSurprise.unlockType}
                    onChange={(e) => setNewSurprise(prev => ({ ...prev, unlockType: e.target.value as any }))}
                    className="w-full p-2 border border-gray-300 rounded-md focus:border-pink-500 focus:ring-pink-500"
                  >
                    <option value="free">Libre (inmediato)</option>
                    <option value="date">Por fecha</option>
                    <option value="key">Por llave</option>
                    <option value="sequential">Secuencial</option>
                  </select>
                </div>
                
                {(newSurprise.unlockType as string) === 'date' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha de Desbloqueo
                      </label>
                      <Input
                        type="date"
                        value={newSurprise.unlockDate}
                        onChange={(e) => setNewSurprise(prev => ({ ...prev, unlockDate: e.target.value }))}
                        className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hora de Desbloqueo
                      </label>
                      <Input
                        type="time"
                        value={newSurprise.unlockTime}
                        onChange={(e) => setNewSurprise(prev => ({ ...prev, unlockTime: e.target.value }))}
                        className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                      />
                    </div>
                  </div>
                )}
                
                {(newSurprise.unlockType as string) === 'key' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Llave de Desbloqueo
                    </label>
                    <Input
                      value={newSurprise.requiredKey}
                      onChange={(e) => setNewSurprise(prev => ({ ...prev, requiredKey: e.target.value }))}
                      placeholder="Ej: AMOR2024"
                      className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                    />
                  </div>
                )}
                
                {(newSurprise.unlockType as string) === 'sequential' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Depende de la Sorpresa
                    </label>
                    <select
                      value={newSurprise.dependsOn}
                      onChange={(e) => setNewSurprise(prev => ({ ...prev, dependsOn: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-md focus:border-pink-500 focus:ring-pink-500"
                    >
                      <option value="">Selecciona una sorpresa</option>
                      {surprises.map(surprise => (
                        <option key={surprise.id} value={surprise.id}>
                          {surprise.title}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mensaje Previo (Opcional)
                  </label>
                  <Input
                    value={newSurprise.previewMessage}
                    onChange={(e) => setNewSurprise(prev => ({ ...prev, previewMessage: e.target.value }))}
                    placeholder="Ej: ¡Faltan solo 30 días para descubrir esta sorpresa!"
                    className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                  />
                </div>
              </div>
              
              {/* Contenido de la sorpresa */}
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">Contenido de la Sorpresa</h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Contenido
                  </label>
                  <select
                    value={newSurprise.contentType}
                    onChange={(e) => setNewSurprise(prev => ({ ...prev, contentType: e.target.value as any }))}
                    className="w-full p-2 border border-gray-300 rounded-md focus:border-pink-500 focus:ring-pink-500"
                  >
                    <option value="text">Texto/Mensaje</option>
                    <option value="image">Imagen</option>
                    <option value="video">Video</option>
                    <option value="invitation">Invitación</option>
                    <option value="event">Evento</option>
                    <option value="mixed">Mixto</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Título del Contenido *
                  </label>
                  <Input
                    value={newSurprise.contentTitle}
                    onChange={(e) => setNewSurprise(prev => ({ ...prev, contentTitle: e.target.value }))}
                    placeholder="Título que aparecerá al abrir la sorpresa"
                    className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción del Contenido
                  </label>
                  <Input
                    value={newSurprise.contentDescription}
                    onChange={(e) => setNewSurprise(prev => ({ ...prev, contentDescription: e.target.value }))}
                    placeholder="Descripción breve del contenido"
                    className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                  />
                </div>

                {/* Contenido específico según tipo */}
                {newSurprise.contentType === 'text' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mensaje
                    </label>
                    <textarea
                      value={newSurprise.contentText}
                      onChange={(e) => setNewSurprise(prev => ({ ...prev, contentText: e.target.value }))}
                      placeholder="Escribe tu mensaje especial..."
                      rows={6}
                      className="w-full p-3 border border-gray-300 rounded-md resize-none focus:border-pink-500 focus:ring-pink-500"
                    />
                  </div>
                )}

                {(newSurprise.contentType as string) === 'image' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subir Imagen
                    </label>
                    <ImageUpload
                      currentImage={newSurprise.contentText}
                      onFileSelect={(file, dataUrl) => setNewSurprise(prev => ({ ...prev, contentText: dataUrl }))}
                      onRemove={() => setNewSurprise(prev => ({ ...prev, contentText: '' }))}
                      maxSize={5}
                    />
                  </div>
                )}

                {(newSurprise.contentType as string) === 'video' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      URL del Video
                    </label>
                    <Input
                      value={newSurprise.contentText}
                      onChange={(e) => setNewSurprise(prev => ({ ...prev, contentText: e.target.value }))}
                      placeholder="https://example.com/video.mp4"
                      className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                    />
                  </div>
                )}

                {((newSurprise.contentType as string) === 'invitation' || (newSurprise.contentType as string) === 'event') && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha del Evento
                      </label>
                      <Input
                        type="date"
                        value={newSurprise.eventDate}
                        onChange={(e) => setNewSurprise(prev => ({ ...prev, eventDate: e.target.value }))}
                        className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ubicación del Evento
                      </label>
                      <Input
                        value={newSurprise.eventLocation}
                        onChange={(e) => setNewSurprise(prev => ({ ...prev, eventLocation: e.target.value }))}
                        placeholder="Lugar del evento"
                        className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Link de Google Maps (Opcional)
                      </label>
                      <Input
                        value={newSurprise.eventMapLink}
                        onChange={(e) => setNewSurprise(prev => ({ ...prev, eventMapLink: e.target.value }))}
                        placeholder="https://maps.google.com/?q=..."
                        className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Detalles del Evento
                      </label>
                      <textarea
                        value={newSurprise.contentText}
                        onChange={(e) => setNewSurprise(prev => ({ ...prev, contentText: e.target.value }))}
                        placeholder="Describe los detalles del evento..."
                        rows={4}
                        className="w-full p-3 border border-gray-300 rounded-md resize-none focus:border-pink-500 focus:ring-pink-500"
                      />
                    </div>
                  </div>
                )}

                {/* Efectos */}
                <div className="space-y-4">
                  <h5 className="text-md font-semibold text-gray-800">Efectos Visuales</h5>
                  
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="confetti"
                      checked={newSurprise.effects.confetti}
                      onChange={(e) => setNewSurprise(prev => ({
                        ...prev,
                        effects: { ...prev.effects, confetti: e.target.checked }
                      }))}
                      className="rounded border-gray-300 text-pink-500 focus:ring-pink-500"
                    />
                    <label htmlFor="confetti" className="text-sm text-gray-700">
                      Mostrar confeti al abrir
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Efecto de Sonido (Opcional)
                    </label>
                    <select
                      value={newSurprise.effects.sound}
                      onChange={(e) => setNewSurprise(prev => ({
                        ...prev,
                        effects: { ...prev.effects, sound: e.target.value }
                      }))}
                      className="w-full p-2 border border-gray-300 rounded-md focus:border-pink-500 focus:ring-pink-500"
                    >
                      <option value="">Sin sonido</option>
                      <option value="magic-chime.mp3">Campanilla mágica</option>
                      <option value="romantic-chime.mp3">Campanilla romántica</option>
                      <option value="gift-open.mp3">Abrir regalo</option>
                      <option value="music-note.mp3">Nota musical</option>
                      <option value="wedding-bells.mp3">Campanas de boda</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Animación
                    </label>
                    <select
                      value={newSurprise.effects.animation}
                      onChange={(e) => setNewSurprise(prev => ({
                        ...prev,
                        effects: { ...prev.effects, animation: e.target.value }
                      }))}
                      className="w-full p-2 border border-gray-300 rounded-md focus:border-pink-500 focus:ring-pink-500"
                    >
                      <option value="fade-in">Aparecer suavemente</option>
                      <option value="slide-up">Deslizar hacia arriba</option>
                      <option value="zoom-in">Acercar</option>
                      <option value="explosion">Explosión</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-8">
              <Button
                onClick={() => {
                  setShowCreateModal(false)
                  resetForm()
                }}
                variant="outline"
                className="flex-1 border-gray-300 hover:bg-gray-50"
              >
                Cancelar
              </Button>
              <Button
                onClick={createSurprise}
                disabled={!newSurprise.title || !newSurprise.contentTitle}
                className="flex-1 bg-pink-500 hover:bg-pink-600 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="h-4 w-4 mr-2" />
                Crear Sorpresa
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
