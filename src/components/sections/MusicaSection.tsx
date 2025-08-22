'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Shuffle, 
  Repeat, 
  Volume2, 
  VolumeX,
  Heart,
  MessageCircle,
  Clock,
  Music,
  Star,
  Share2,
  Download,
  List,
  Plus,
  Upload,
  X,
  FileAudio,
  Image,
  Edit,
  Trash2
} from 'lucide-react'
import { getBrowserClient } from '@/lib/supabase/browser-client'
import { uploadPublicFile, BUCKET_AUDIO, BUCKET_COVERS } from '@/lib/supabase/storage'

// Función para formatear duración de segundos a MM:SS
const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// Función para convertir duración MM:SS a segundos
const durationToSeconds = (duration: string): number => {
  const [mins, secs] = duration.split(':').map(Number)
  return (mins * 60) + (secs || 0)
}

// Función para calcular duración total de la playlist
const calculateTotalDuration = (songs: Song[]): string => {
  const totalSeconds = songs.reduce((total, song) => {
    return total + durationToSeconds(song.duration)
  }, 0)
  return formatDuration(totalSeconds)
}

interface Song {
  id: string
  title: string
  artist: string
  album: string
  duration: string
  cover: string
  dedication?: string
  isFavorite: boolean
  genre?: string
  year?: string
  plays?: number
  fileName?: string
  audioUrl?: string
}

const initialPlaylist: Song[] = [
  {
    id: '1',
    title: 'Por Eso Te Amo',
    artist: 'Río Roma',
    album: 'RÍO ROMA',
    duration: '3:22',
    cover: '/api/placeholder/200/200',
    dedication: 'Esta canción nos recuerda el momento en que nos dimos cuenta de que estábamos enamorados. Cada vez que la escuchamos, revivimos esa magia.',
    isFavorite: true,
    genre: 'Pop Romántico',
    year: '2018',
    plays: 156
  },
  {
    id: '2',
    title: 'Por Ti Seré',
    artist: 'Luister La Voz',
    album: 'Por Ti Seré',
    duration: '3:45',
    cover: '/api/placeholder/200/200',
    dedication: 'Una promesa de amor eterno que hacemos cada día.',
    isFavorite: false,
    genre: 'Pop',
    year: '2020',
    plays: 89
  },
  {
    id: '3',
    title: 'Te Cuidaré',
    artist: 'Luister La Voz',
    album: 'Te Cuidaré',
    duration: '4:12',
    cover: '/api/placeholder/200/200',
    dedication: 'Mi compromiso de protegerte y cuidarte siempre.',
    isFavorite: true,
    genre: 'Pop Romántico',
    year: '2021',
    plays: 203
  },
  {
    id: '4',
    title: 'Ejemplo de Amor',
    artist: 'Luister La Voz',
    album: 'Ejemplo de Amor',
    duration: '3:58',
    cover: '/api/placeholder/200/200',
    dedication: 'Queremos ser un ejemplo de amor verdadero para todos.',
    isFavorite: false,
    genre: 'Pop',
    year: '2022',
    plays: 67
  },
  {
    id: '5',
    title: 'Único',
    artist: 'Joey Montana',
    album: 'Único',
    duration: '3:30',
    cover: '/api/placeholder/200/200',
    dedication: 'Eres único para mí, no hay nadie como tú.',
    isFavorite: true,
    genre: 'Reggaeton',
    year: '2019',
    plays: 134
  }
]

const genres = [
  'Pop',
  'Pop Romántico',
  'Reggaeton',
  'Rock',
  'Jazz',
  'Clásica',
  'Electrónica',
  'Folk',
  'Country',
  'Hip Hop',
  'R&B',
  'Salsa',
  'Bachata',
  'Otro'
]

const currentYear = new Date().getFullYear()
const years = Array.from({ length: 30 }, (_, i) => (currentYear - i).toString())

// Validaciones de archivos
const MAX_AUDIO_MB = 50
const MAX_IMAGE_MB = 5
const MAX_AUDIO_BYTES = MAX_AUDIO_MB * 1024 * 1024
const MAX_IMAGE_BYTES = MAX_IMAGE_MB * 1024 * 1024
const ALLOWED_AUDIO_TYPES = new Set([
  'audio/mpeg', // mp3
  'audio/mp3',
  'audio/wav',
  'audio/x-wav',
  'audio/flac',
  'audio/x-flac',
  'audio/mp4',
  'audio/aac',
  'audio/x-m4a',
  'audio/m4a'
])
const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp'
])

const defaultSong: Song = {
  id: 'placeholder',
  title: 'Sin canción',
  artist: 'Desconocido',
  album: '',
  duration: '0:00',
  cover: '/api/placeholder/200/200',
  dedication: '',
  isFavorite: false,
  genre: '',
  year: currentYear.toString(),
  plays: 0,
  fileName: ''
}

export function MusicaSection() {
  const supabase = getBrowserClient()
  const [playlist, setPlaylist] = useState<Song[]>([])
  const [currentSong, setCurrentSong] = useState<Song>(defaultSong)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(202) // 3:22 en segundos
  const [volume, setVolume] = useState(80)
  const [isMuted, setIsMuted] = useState(false)
  const [showDedication, setShowDedication] = useState(false)
  const [shuffle, setShuffle] = useState(false)
  const [repeat, setRepeat] = useState(false)
  const [showPlaylist, setShowPlaylist] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)
  const [showAddSongModal, setShowAddSongModal] = useState(false)
  const [showEditSongModal, setShowEditSongModal] = useState<{ open: boolean; song: Song | null }>({ open: false, song: null })
  const [showDeleteModal, setShowDeleteModal] = useState<{ open: boolean; song: Song | null }>({ open: false, song: null })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null)
  const [uploadStatus, setUploadStatus] = useState<{ step: string; message: string } | null>(null)
  const [showSuccessModal, setShowSuccessModal] = useState<{ title: string } | null>(null)
  const [editForm, setEditForm] = useState({
    title: '',
    artist: '',
    album: '',
    genre: 'Pop',
    year: currentYear.toString(),
    dedication: '',
    coverImage: null as File | null,
    coverUrl: ''
  })
  const [editCoverPreviewUrl, setEditCoverPreviewUrl] = useState<string | null>(null)
  const [isSavingEdit, setIsSavingEdit] = useState(false)
  const [editAudioFile, setEditAudioFile] = useState<File | null>(null)
  const [editAudioPreviewUrl, setEditAudioPreviewUrl] = useState<string | null>(null)
  const [editAudioDuration, setEditAudioDuration] = useState<string>('')
  const [songForm, setSongForm] = useState({
    title: '',
    artist: '',
    album: '',
    genre: 'Pop',
    year: currentYear.toString(),
    dedication: '',
    coverImage: null as File | null
  })
  const [isUploading, setIsUploading] = useState(false)
  
  const audioRef = useRef<HTMLAudioElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const volumeSliderRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const coverImageInputRef = useRef<HTMLInputElement>(null)
  const [isDraggingProgress, setIsDraggingProgress] = useState(false)

  // Obtener duración real del archivo de audio
  const getAudioDuration = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      try {
        const audio = new Audio()
        const url = URL.createObjectURL(file)
        const cleanup = () => {
          URL.revokeObjectURL(url)
        }
        audio.preload = 'metadata'
        audio.src = url
        audio.onloadedmetadata = () => {
          const dur = Math.max(0, Math.floor(audio.duration || 0))
          cleanup()
          resolve(dur)
        }
        audio.onerror = () => {
          cleanup()
          resolve(0)
        }
      } catch (err) {
        resolve(0)
      }
    })
  }

  // Cargar canciones desde Supabase y suscribirse a cambios
  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('songs')
        .select('id,title,artist,album,duration,cover,dedication,is_favorite,genre,year,plays,file_name,audio_url,created_at')
        .order('created_at', { ascending: false })
      if (!error && data) {
        const mapped = data.map((r: any): Song => ({
          id: r.id,
          title: r.title,
          artist: r.artist,
          album: r.album ?? '',
          duration: r.duration ?? '3:00',
          cover: r.cover ?? '/api/placeholder/200/200',
          dedication: r.dedication ?? '',
          isFavorite: !!r.is_favorite,
          genre: r.genre ?? '',
          year: r.year ?? currentYear.toString(),
          plays: r.plays ?? 0,
          fileName: r.file_name ?? '',
          audioUrl: r.audio_url ?? ''
        }))
        setPlaylist(mapped)
        if (mapped.length > 0) setCurrentSong(mapped[0])
      }
    }
    load()
    const channel = supabase
      .channel('songs-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'songs' }, load)
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Sincronizar estado de reproducción con el elemento audio
  useEffect(() => {
    const audio = audioRef.current
    if (audio) {
      if (isPlaying) {
        audio.play().catch(() => {})
      } else {
        audio.pause()
      }
    }
  }, [isPlaying])

  // Actualizar duración cuando cambia la canción
  useEffect(() => {
    const audio = audioRef.current
    if (audio) {
      audio.src = currentSong.audioUrl || (currentSong as any).audio_url || ''
      audio.currentTime = 0
      setCurrentTime(0)
    }
  }, [currentSong.id])

  // Formatear tiempo
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = time % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  // Manejar reproducción/pausa
  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  // Siguiente canción
  const nextSong = () => {
    const currentIndex = playlist.findIndex(song => song.id === currentSong.id)
    const nextIndex = (currentIndex + 1) % playlist.length
    const nextSong = playlist[nextIndex]
    setCurrentSong(nextSong)
    setCurrentTime(0)
    setIsPlaying(true)
  }

  // Canción anterior
  const prevSong = () => {
    const currentIndex = playlist.findIndex(song => song.id === currentSong.id)
    const prevIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1
    const prevSong = playlist[prevIndex]
    setCurrentSong(prevSong)
    setCurrentTime(0)
    setIsPlaying(true)
  }

  // Manejar progreso
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current) return
    
    const rect = progressRef.current.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const width = rect.width
    const percentage = clickX / width
    const newTime = Math.floor(percentage * duration)
    
    setCurrentTime(newTime)
    const audio = audioRef.current
    if (audio) {
      audio.currentTime = newTime
    }
  }

  const handleProgressMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingProgress || !progressRef.current) return
    const rect = progressRef.current.getBoundingClientRect()
    const posX = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
    const pct = posX / rect.width
    const newTime = Math.floor(pct * duration)
    setCurrentTime(newTime)
    const audio = audioRef.current
    if (audio) audio.currentTime = newTime
  }

  // Manejar volumen
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value)
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
    const audio = audioRef.current
    if (audio) {
      audio.volume = Math.max(0, Math.min(1, newVolume / 100))
      if (newVolume === 0) audio.muted = true
      else audio.muted = false
    }
  }

  // Toggle mute
  const toggleMute = () => {
    const next = !isMuted
    setIsMuted(next)
    const audio = audioRef.current
    if (audio) audio.muted = next
  }

  // Toggle favorito
  const toggleFavorite = async (songId: string) => {
    const current = playlist.find(s => s.id === songId)
    if (!current) return
    setPlaylist(prev => prev.map(s => s.id === songId ? { ...s, isFavorite: !s.isFavorite } : s))
    await supabase.from('songs').update({ is_favorite: !current.isFavorite }).eq('id', songId)
  }

  // Seleccionar canción
  const selectSong = (song: Song) => {
    setCurrentSong(song)
    setCurrentTime(0)
    setIsPlaying(true)
  }

  // Compartir canción
  const shareSong = () => {
    if (navigator.share) {
      navigator.share({
        title: currentSong.title,
        text: `Escuchando "${currentSong.title}" de ${currentSong.artist}`,
        url: window.location.href
      })
    } else {
      // Fallback para navegadores que no soportan Web Share API
      navigator.clipboard.writeText(`Escuchando "${currentSong.title}" de ${currentSong.artist}`)
      alert('¡Enlace copiado al portapapeles!')
    }
  }

  // Extraer información del nombre del archivo
  const extractInfoFromFileName = (fileName: string) => {
    // Remover extensión
    const nameWithoutExt = fileName.replace(/\.(mp3|wav|flac|m4a|aac)$/i, '')
    
    // Patrones comunes para extraer artista y título
    const patterns = [
      /^(.+?)\s*[-–—]\s*(.+)$/, // "Artista - Título"
      /^(.+?)\s*_\s*(.+)$/,     // "Artista_Título"
      /^(.+?)\s*\.\s*(.+)$/,    // "Artista.Título"
    ]
    
    for (const pattern of patterns) {
      const match = nameWithoutExt.match(pattern)
      if (match) {
        return {
          artist: match[1].trim(),
          title: match[2].trim()
        }
      }
    }
    
    // Si no coincide ningún patrón, usar el nombre completo como título
    return {
      artist: '',
      title: nameWithoutExt.trim()
    }
  }

  // Manejar selección de archivo
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (!ALLOWED_AUDIO_TYPES.has(file.type)) {
        alert('Formato de audio no permitido. Usa MP3, WAV, FLAC, M4A o AAC.')
        return
      }
      if (file.size > MAX_AUDIO_BYTES) {
        alert(`El archivo de audio supera ${MAX_AUDIO_MB}MB.`)
        return
      }
      setSelectedFile(file)
      
      // Extraer información del nombre del archivo
      const { artist, title } = extractInfoFromFileName(file.name)
      
      // Actualizar el formulario con la información extraída
      setSongForm(prev => ({
        ...prev,
        title: title || prev.title,
        artist: artist || prev.artist
      }))

      // Previsualización de audio
      try {
        if (audioPreviewUrl) URL.revokeObjectURL(audioPreviewUrl)
        const url = URL.createObjectURL(file)
        setAudioPreviewUrl(url)
      } catch {}
    }
  }

  // Simular carga de archivo
  const handleUpload = async () => {
    if (!selectedFile) return
    
    setIsUploading(true)
    setUploadStatus({ step: 'validating', message: 'Validando archivos…' })
    
    // Calcular duración real del audio
    setUploadStatus({ step: 'duration', message: 'Calculando duración…' })
    const realDurationSec = await getAudioDuration(selectedFile)
    const realDuration = `${Math.floor(realDurationSec / 60)}:${(realDurationSec % 60)
      .toString()
      .padStart(2, '0')}`

    // Subir archivos a Storage
    let coverUrl: string | null = null
    if (songForm.coverImage) {
      setUploadStatus({ step: 'uploading_cover', message: 'Subiendo portada…' })
      const cover = await uploadPublicFile(BUCKET_COVERS, songForm.coverImage, 'covers/')
      coverUrl = cover.url
    }
    setUploadStatus({ step: 'uploading_audio', message: 'Subiendo audio…' })
    const audio = await uploadPublicFile(BUCKET_AUDIO, selectedFile, 'audio/')

    // Persistir metadata en Supabase
    const payload = {
      title: songForm.title,
      artist: songForm.artist,
      album: songForm.album,
      duration: realDuration || '0:00',
      cover: coverUrl,
      dedication: songForm.dedication,
      is_favorite: false,
      genre: songForm.genre,
      year: songForm.year,
      plays: 0,
      file_name: selectedFile.name,
      audio_url: audio.url
    }
    setUploadStatus({ step: 'saving_db', message: 'Guardando en la base de datos…' })
    const { data, error } = await supabase.from('songs').insert(payload).select('*').single()
    if (!error && data) {
      const mapped: Song = {
        id: data.id,
        title: data.title,
        artist: data.artist,
        album: data.album ?? '',
        duration: data.duration ?? '3:45',
        cover: data.cover ?? '/api/placeholder/200/200',
        dedication: data.dedication ?? '',
        isFavorite: !!data.is_favorite,
        genre: data.genre ?? '',
        year: data.year ?? currentYear.toString(),
        plays: data.plays ?? 0,
        fileName: data.file_name ?? '',
        audioUrl: data.audio_url ?? ''
      }
      setPlaylist(prev => [mapped, ...prev])
      setShowSuccessModal({ title: data.title })
    }
    
    // Limpiar formulario
    setSongForm({
      title: '',
      artist: '',
      album: '',
      genre: 'Pop',
      year: currentYear.toString(),
      dedication: '',
      coverImage: null
    })
    setSelectedFile(null)
    setShowAddSongModal(false)
    setIsUploading(false)
    
    // Mensaje simple
    // alert('¡Canción agregada exitosamente!')
  }

  // Abrir modal de agregar canción
  const openAddSongModal = () => {
    setShowAddSongModal(true)
    setSongForm({
      title: '',
      artist: '',
      album: '',
      genre: 'Pop',
      year: currentYear.toString(),
      dedication: '',
      coverImage: null
    })
    setSelectedFile(null)
  }

  // Cerrar modal
  const closeAddSongModal = () => {
    setShowAddSongModal(false)
    setSelectedFile(null)
    if (audioPreviewUrl) { try { URL.revokeObjectURL(audioPreviewUrl) } catch {} }
    setAudioPreviewUrl(null)
    setUploadStatus(null)
    setSongForm({
      title: '',
      artist: '',
      album: '',
      genre: 'Pop',
      year: currentYear.toString(),
      dedication: '',
      coverImage: null
    })
  }

  // Manejar selección de imagen de portada
  const handleCoverImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
        alert('Formato de imagen no permitido. Usa JPG, PNG, GIF o WEBP.')
        return
      }
      if (file.size > MAX_IMAGE_BYTES) {
        alert(`La imagen supera ${MAX_IMAGE_MB}MB.`)
        return
      }
      setSongForm(prev => ({ ...prev, coverImage: file }))
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-gray-800">Nuestras Canciones</h1>
        <p className="text-gray-600 text-lg">
          La banda sonora de nuestro amor, cada melodía un recuerdo especial
        </p>
      </div>

      {/* Reproductor de Música Mejorado */}
      <Card className="music-player bg-gradient-to-br from-purple-600 via-pink-500 to-blue-600 border-0 shadow-2xl">
        {/* Efectos de luz decorativos */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-8 left-8 w-4 h-4 bg-white rounded-full opacity-30 animate-pulse" />
          <div className="absolute top-16 right-16 w-3 h-3 bg-white rounded-full opacity-25 animate-pulse delay-1000" />
          <div className="absolute bottom-12 left-20 w-3.5 h-3.5 bg-white rounded-full opacity-30 animate-pulse delay-500" />
          <div className="absolute bottom-16 right-12 w-2 h-2 bg-white rounded-full opacity-25 animate-pulse delay-1500" />
          <div className="absolute top-1/2 left-1/3 w-1.5 h-1.5 bg-white rounded-full opacity-20 animate-pulse delay-2000" />
        </div>
        
        <CardContent className="p-8 relative z-10">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Álbum y Información */}
            <div className="flex-shrink-0">
              <div className={`album-cover w-56 h-56 rounded-2xl shadow-2xl relative group overflow-hidden ring-4 ring-white/20 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '20s', animationPlayState: isPlaying ? 'running' : 'paused' }}>
                {currentSong.cover && currentSong.cover !== '/api/placeholder/200/200' ? (
                  <img 
                    src={currentSong.cover} 
                    alt={`Portada de ${currentSong.title}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white">
                    <Music className="h-12 w-12" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-2xl flex items-center justify-center">
                  {isPlaying && (
                    <div className="playing-animation">
                      <div className="music-bar"></div>
                      <div className="music-bar"></div>
                      <div className="music-bar"></div>
                      <div className="music-bar"></div>
                      <div className="music-bar"></div>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-6 text-center">
                <h3 className={`font-bold text-2xl mb-2 ${isPlaying ? 'text-white animate-pulse' : 'text-white'}`} style={isPlaying ? { textShadow: '0 0 15px rgba(255,255,255,0.7)', animationPlayState: 'running' } : { animationPlayState: 'paused' }}>
                  {currentSong.title}
                </h3>
                <p className="text-xl text-purple-100 mb-3 flex items-center justify-center gap-2">
                  <Music className="h-5 w-5" />
                  {currentSong.artist}
                </p>
                <div className="flex items-center justify-center gap-3 mb-4 text-sm">
                  <span className="bg-white/20 px-3 py-1 rounded-full text-white">{currentSong.genre}</span>
                  <span className="text-purple-200">•</span>
                  <span className="text-purple-200">{currentSong.year}</span>
                  <span className="text-purple-200">•</span>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-white">{currentSong.plays} reproducciones</span>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <Button
                    onClick={() => setShowDedication(!showDedication)}
                    className="bg-white/20 hover:bg-white/30 text-white border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Ver dedicatoria
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={shareSong}
                    className="border-white/30 text-white hover:bg-white/20"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Controles de Reproducción */}
            <div className="flex-1 space-y-8">
              {/* Barra de Progreso Mejorada */}
              <div className="space-y-4">
                {/* Audio Visualizer Mejorado */}
                {isPlaying && (
                  <div className="flex items-end justify-center gap-1 h-12 mb-4">
                    {Array.from({ length: 24 }, (_, i) => (
                      <div
                        key={i}
                        className="w-1.5 bg-white rounded-full opacity-80"
                        style={{
                          height: `${Math.random() * 30 + 8}px`,
                          animation: `musicBar${(i % 5) + 1} 0.8s ease-in-out infinite`,
                          animationDelay: `${i * 0.04}s`,
                          animationPlayState: isPlaying ? 'running' : 'paused'
                        }}
                      />
                    ))}
                  </div>
                )}
                
                {/* Barra de progreso mejorada */}
                <div 
                  ref={progressRef}
                  className="w-full bg-white/20 rounded-full h-4 cursor-pointer relative group"
                  onMouseDown={(e) => { setIsDraggingProgress(true); handleProgressClick(e) }}
                  onMouseMove={handleProgressMove}
                  onMouseUp={() => setIsDraggingProgress(false)}
                  onMouseLeave={() => setIsDraggingProgress(false)}
                >
                  <div 
                    className="bg-gradient-to-r from-pink-400 to-purple-500 h-4 rounded-full transition-all duration-300 relative shadow-lg"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  >
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 ring-2 ring-purple-300" />
                  </div>
                </div>
                <div className="flex justify-between text-sm text-white font-medium">
                  <span>{formatTime(currentTime)}</span>
                  <span>{currentSong.duration}</span>
                </div>
                {/* Audio element for playback */}
                <audio
                  ref={audioRef}
                  onLoadedMetadata={(e) => setDuration(Math.floor((e.target as HTMLAudioElement).duration || 0))}
                  onTimeUpdate={(e) => setCurrentTime(Math.floor((e.target as HTMLAudioElement).currentTime || 0))}
                  onEnded={() => {
                    if (repeat) {
                      const audio = audioRef.current
                      if (audio) { 
                        audio.currentTime = 0
                        setIsPlaying(true)
                      }
                    } else if (shuffle) {
                      const randomIndex = Math.floor(Math.random() * playlist.length)
                      const randomSong = playlist[randomIndex]
                      setCurrentSong(randomSong)
                      setCurrentTime(0)
                      setIsPlaying(true)
                    } else {
                      nextSong()
                    }
                  }}
                />
              </div>

              {/* Controles Principales Mejorados */}
              <div className="flex items-center justify-center gap-8">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShuffle(!shuffle)}
                  className={`p-4 text-white hover:bg-white/20 rounded-full transition-all duration-300 ${shuffle ? 'bg-white/30 text-purple-200' : ''}`}
                >
                  <Shuffle className="h-7 w-7" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={prevSong}
                  className="p-4 text-white hover:bg-white/20 rounded-full transition-all duration-300"
                >
                  <SkipBack className="h-8 w-8" />
                </Button>
                <Button
                  onClick={togglePlay}
                  className={`w-24 h-24 text-white rounded-full shadow-2xl transition-all duration-300 ${isPlaying ? 'bg-white/20 animate-pulse' : 'bg-white/30 hover:bg-white/40'}`}
                  style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}
                >
                  {isPlaying ? <Pause className="h-12 w-12" /> : <Play className="h-12 w-12 ml-1" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={nextSong}
                  className="p-4 text-white hover:bg-white/20 rounded-full transition-all duration-300"
                >
                  <SkipForward className="h-8 w-8" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setRepeat(!repeat)}
                  className={`p-4 text-white hover:bg-white/20 rounded-full transition-all duration-300 ${repeat ? 'bg-white/30 text-purple-200' : ''}`}
                >
                  <Repeat className="h-7 w-7" />
                </Button>
              </div>

              {/* Controles Secundarios */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFavorite(currentSong.id)}
                    className={`p-3 text-white hover:bg-white/20 rounded-full transition-all duration-300 ${currentSong.isFavorite ? 'text-red-400 bg-white/20' : ''}`}
                  >
                    <Heart className={`h-6 w-6 ${currentSong.isFavorite ? 'fill-current animate-pulse' : ''}`} style={{ animationPlayState: currentSong.isFavorite ? 'running' : 'paused' }} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-3 text-white hover:bg-white/20 rounded-full transition-all duration-300"
                    onClick={() => {
                      const src = currentSong.audioUrl || (currentSong as any).audio_url
                      if (src) window.open(src, '_blank')
                    }}
                  >
                    <Download className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPlaylist(!showPlaylist)}
                    className="p-3 text-white hover:bg-white/20 rounded-full transition-all duration-300"
                  >
                    <List className="h-6 w-6" />
                  </Button>
                </div>

                {/* Control de Volumen Mejorado */}
                <div className="flex items-center gap-4 relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleMute}
                    className="p-3 text-white hover:bg-white/20 rounded-full transition-all duration-300"
                    onMouseEnter={() => setShowVolumeSlider(true)}
                    onMouseLeave={() => setShowVolumeSlider(false)}
                  >
                    {isMuted || volume === 0 ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
                  </Button>
                  <div 
                    ref={volumeSliderRef}
                    className={`transition-all duration-300 ${showVolumeSlider ? 'w-24 opacity-100' : 'w-0 opacity-0'} overflow-hidden`}
                    onMouseEnter={() => setShowVolumeSlider(true)}
                    onMouseLeave={() => setShowVolumeSlider(false)}
                  >
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="volume-slider w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modal de éxito */}
          {showSuccessModal && (
            <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-2xl text-center">
                <h4 className="text-lg font-semibold text-gray-800">Canción guardada</h4>
                <p className="text-sm text-gray-600 mt-2">"{showSuccessModal.title}" se guardó correctamente.</p>
                <div className="mt-4 flex gap-3 justify-center">
                  <Button onClick={() => setShowSuccessModal(null)} className="bg-pink-500 hover:bg-pink-600 text-white">Aceptar</Button>
                </div>
              </div>
            </div>
          )}

          {/* Dedicatoria Mejorada */}
          {showDedication && currentSong.dedication && (
            <div className="dedication-card mt-6 p-6 rounded-lg relative overflow-hidden">
              {/* Wave Effect */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-pink-400 to-purple-500 transform -skew-y-12 translate-y-8"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-500 to-pink-400 transform skew-y-12 -translate-y-8"></div>
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-pink-800 mb-2 flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Dedicatoria Especial
                  </h4>
                  <p className="text-pink-700 italic text-lg leading-relaxed">"{currentSong.dedication}"</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDedication(false)}
                  className="text-pink-600 hover:text-pink-700"
                >
                  ×
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Playlist Mejorada */}
      <Card className="bg-white shadow-lg border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Nuestra Playlist</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-pink-50 to-purple-50 text-pink-700 border border-pink-200">
                  <Music className="h-4 w-4" />
                  {playlist.length} canciones
                </span>
                <span className="text-gray-300">•</span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-purple-50 to-blue-50 text-purple-700 border border-purple-200">
                  <Clock className="h-4 w-4" />
                  {calculateTotalDuration(playlist)} total
                </span>
              </div>
              <Button
                onClick={openAddSongModal}
                className="bg-pink-500 hover:bg-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Canción
              </Button>
            </div>
          </div>
          <div className="h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-pink-300 scrollbar-track-gray-100 hover:scrollbar-thumb-pink-400">
            <div className="space-y-2 pr-2">
              {playlist.map((song, index) => (
                <div
                  key={song.id}
                  className={`group flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all duration-300 bg-white/70 backdrop-blur border border-transparent hover:border-pink-200 hover:bg-white shadow-sm hover:shadow-md ${
                    currentSong.id === song.id ? 'ring-2 ring-pink-300 bg-pink-50' : ''
                  }`}
                  onClick={() => selectSong(song)}
                >
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-sm relative flex-shrink-0 overflow-hidden ring-1 ring-black/5">
                    {song.cover && song.cover !== '/api/placeholder/200/200' ? (
                      <img 
                        src={song.cover} 
                        alt={`Portada de ${song.title}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center">
                        {index + 1}
                      </div>
                    )}
                                      {currentSong.id === song.id && isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationPlayState: isPlaying ? 'running' : 'paused' }} />
                    </div>
                  )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-800 truncate group-hover:text-pink-700 transition-colors">{song.title}</h4>
                    <p className="text-sm text-gray-600 truncate">{song.artist}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                      <span className="truncate">{song.genre}</span>
                      <span>•</span>
                      <span>{song.year}</span>
                      <span>•</span>
                      <span>{song.plays} reproducciones</span>
                      {song.fileName && (
                        <>
                          <span>•</span>
                          <span className="text-blue-600 truncate">{song.fileName}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-sm text-gray-500">{song.duration}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFavorite(song.id)
                      }}
                      className={`p-1.5 transition-all duration-200 ${song.isFavorite ? 'text-red-500' : 'text-gray-400'}`}
                    >
                                             <Heart className={`h-4 w-4 ${song.isFavorite ? 'fill-current animate-pulse' : ''}`} style={{ animationPlayState: song.isFavorite ? 'running' : 'paused' }} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowEditSongModal({ open: true, song })
                        setEditForm({
                          title: song.title,
                          artist: song.artist,
                          album: song.album,
                          genre: song.genre || 'Pop',
                          year: song.year || currentYear.toString(),
                          dedication: song.dedication || '',
                          coverImage: null,
                          coverUrl: song.cover
                        })
                        setEditCoverPreviewUrl(song.cover || null)
                        setEditAudioFile(null)
                        setEditAudioPreviewUrl(null)
                        setEditAudioDuration('')
                      }}
                      className="p-1.5 text-blue-500"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => { e.stopPropagation(); setShowDeleteModal({ open: true, song }) }}
                      className="p-1.5 text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Texto Descriptivo */}
      <Card className="bg-white shadow-lg border-0">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            El Poder de la Música en Nuestra Historia
          </h3>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              La música tiene el poder mágico de transportarnos a través del tiempo, 
              reviviendo momentos especiales y despertando emociones que creíamos olvidadas. 
              Cada melodía en nuestra playlist representa un capítulo único en nuestra historia de amor.
            </p>
            <p>
              Hay canciones que nos recuerdan nuestros primeros momentos juntos, otras que 
              marcaron nuestras celebraciones más importantes, y algunas que simplemente se 
              convirtieron en "nuestras" a través de las horas de escucha compartida.
            </p>
            <p>
              Esta colección musical es un tesoro que crece con el tiempo, donde cada canción 
              es una dedicatoria, un mensaje o una promesa eterna de amor. La música es el 
              hilo invisible que conecta todos los momentos especiales de nuestra relación.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Modal para Agregar Canción */}
      {showAddSongModal && (
        <div className="fixed inset-0 modal-overlay flex items-center justify-center z-50">
          <div className="modal-content bg-white rounded-lg p-6 w-full max-w-2xl mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                <Plus className="h-6 w-6 text-pink-500" />
                Agregar Nueva Canción
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeAddSongModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="space-y-6">
              {/* Subir Archivo */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Seleccionar Archivo de Audio
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-pink-400 transition-colors">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".mp3,.wav,.flac,.m4a,.aac"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <div className="space-y-3">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-lg font-medium text-gray-700">
                        {selectedFile ? selectedFile.name : 'Haz clic para seleccionar un archivo'}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        MP3, WAV, FLAC, M4A, AAC (máx. 50MB)
                      </p>
                    </div>
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                      className="border-pink-200 text-pink-600 hover:bg-pink-50"
                    >
                      <FileAudio className="h-4 w-4 mr-2" />
                      Seleccionar Archivo
                    </Button>
                  </div>
                  {audioPreviewUrl && (
                    <div className="mt-3 bg-gray-50 p-3 rounded-md text-left">
                      <p className="text-sm text-gray-600 mb-2">Previsualización:</p>
                      <audio controls src={audioPreviewUrl} className="w-full" />
                    </div>
                  )}
                  {uploadStatus && (
                    <div className="mt-3 text-sm text-gray-600">
                      <span className="font-medium">{uploadStatus.message}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Subir Imagen de Portada */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Imagen de Portada (Opcional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-pink-400 transition-colors">
                  <input
                    ref={coverImageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImageSelect}
                    className="hidden"
                  />
                  <div className="space-y-3">
                    {songForm.coverImage ? (
                      <div className="space-y-3">
                        <img 
                          src={URL.createObjectURL(songForm.coverImage)} 
                          alt="Vista previa de portada"
                          className="w-32 h-32 mx-auto rounded-lg object-cover border-2 border-pink-200"
                        />
                        <p className="text-sm text-gray-600">
                          {songForm.coverImage.name}
                        </p>
                        <Button
                          onClick={() => setSongForm(prev => ({ ...prev, coverImage: null }))}
                          variant="outline"
                          size="sm"
                          className="border-red-200 text-red-600 hover:bg-red-50"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Remover imagen
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                        <div>
                          <p className="text-lg font-medium text-gray-700">
                            Haz clic para seleccionar una imagen de portada
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            JPG, PNG, GIF (máx. 5MB)
                          </p>
                        </div>
                        <Button
                          onClick={() => coverImageInputRef.current?.click()}
                          variant="outline"
                          className="border-pink-200 text-pink-600 hover:bg-pink-50"
                        >
                          <Image className="h-4 w-4 mr-2" />
                          Seleccionar Imagen
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Formulario de Información */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Título *
                  </label>
                  <Input
                    value={songForm.title}
                    onChange={(e) => setSongForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Nombre de la canción"
                    className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Artista *
                  </label>
                  <Input
                    value={songForm.artist}
                    onChange={(e) => setSongForm(prev => ({ ...prev, artist: e.target.value }))}
                    placeholder="Nombre del artista"
                    className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Álbum
                  </label>
                  <Input
                    value={songForm.album}
                    onChange={(e) => setSongForm(prev => ({ ...prev, album: e.target.value }))}
                    placeholder="Nombre del álbum"
                    className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Género
                  </label>
                  <select
                    value={songForm.genre}
                    onChange={(e) => setSongForm(prev => ({ ...prev, genre: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md focus:border-pink-500 focus:ring-pink-500"
                  >
                    {genres.map(genre => (
                      <option key={genre} value={genre}>
                        {genre}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Año
                  </label>
                  <select
                    value={songForm.year}
                    onChange={(e) => setSongForm(prev => ({ ...prev, year: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md focus:border-pink-500 focus:ring-pink-500"
                  >
                    {years.map(year => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dedicatoria */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dedicatoria Especial
                </label>
                <textarea
                  value={songForm.dedication}
                  onChange={(e) => setSongForm(prev => ({ ...prev, dedication: e.target.value }))}
                  placeholder="Escribe una dedicatoria especial para esta canción..."
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-md resize-none focus:border-pink-500 focus:ring-pink-500"
                />
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={closeAddSongModal}
                  variant="outline"
                  className="flex-1 border-gray-300 hover:bg-gray-50"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={!selectedFile || !songForm.title || !songForm.artist || isUploading}
                  className="flex-1 bg-pink-500 hover:bg-pink-600 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Subiendo...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Agregar Canción
                    </>
                  )}
                </Button>
              </div>
                            </div>
              </div>
              <div className="relative z-10">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-pink-800 mb-2 flex items-center gap-2">
                      <MessageCircle className="h-5 w-5" />
                      Dedicatoria Especial
                    </h4>
                    <p className="text-pink-700 italic text-lg leading-relaxed">"{currentSong.dedication}"</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDedication(false)}
                    className="text-pink-600 hover:text-pink-700"
                  >
                    ×
                  </Button>
                </div>
              </div>
            </div>
          )}

      {/* Modal Editar Canción */}
      {showEditSongModal.open && showEditSongModal.song && (
        <div className="fixed inset-0 modal-overlay flex items-center justify-center z-50">
          <div className="modal-content bg-white rounded-lg p-6 w-full max-w-2xl mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold text-gray-800">Editar Canción</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setShowEditSongModal({ open: false, song: null }); setEditCoverPreviewUrl(null) }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
                <Input value={editForm.title} onChange={(e) => setEditForm(f => ({ ...f, title: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Artista *</label>
                <Input value={editForm.artist} onChange={(e) => setEditForm(f => ({ ...f, artist: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Álbum</label>
                <Input value={editForm.album} onChange={(e) => setEditForm(f => ({ ...f, album: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Género</label>
                <select value={editForm.genre} onChange={(e) => setEditForm(f => ({ ...f, genre: e.target.value }))} className="w-full p-2 border border-gray-300 rounded-md">
                  {genres.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Año</label>
                <select value={editForm.year} onChange={(e) => setEditForm(f => ({ ...f, year: e.target.value }))} className="w-full p-2 border border-gray-300 rounded-md">
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Dedicatoria</label>
                <textarea value={editForm.dedication} onChange={(e) => setEditForm(f => ({ ...f, dedication: e.target.value }))} rows={3} className="w-full p-3 border border-gray-300 rounded-md" />
              </div>

              {/* Archivo de Audio */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Archivo de Audio (Opcional)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-pink-400 transition-colors">
                  <input
                    type="file"
                    accept=".mp3,.wav,.flac,.m4a,.aac"
                    className="hidden"
                    id="edit-audio-input"
                    onChange={async (e) => {
                      const f = e.target.files?.[0]
                      if (!f) return
                      if (!ALLOWED_AUDIO_TYPES.has(f.type) || f.size > MAX_AUDIO_BYTES) return
                      setEditAudioFile(f)
                      const url = URL.createObjectURL(f)
                      setEditAudioPreviewUrl(url)
                      const dur = await getAudioDuration(f)
                      setEditAudioDuration(formatDuration(dur))
                    }}
                  />
                  <div className="space-y-3">
                    {editAudioFile ? (
                      <div className="space-y-3">
                        <FileAudio className="h-8 w-8 text-pink-500 mx-auto" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">{editAudioFile.name}</p>
                          <p className="text-xs text-gray-500">Duración: {editAudioDuration}</p>
                        </div>
                        <audio controls src={editAudioPreviewUrl!} className="w-full" />
                        <Button
                          onClick={() => {
                            setEditAudioFile(null)
                            setEditAudioPreviewUrl(null)
                            setEditAudioDuration('')
                          }}
                          variant="outline"
                          size="sm"
                          className="border-red-200 text-red-600 hover:bg-red-50"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Remover audio
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Haz clic para cambiar el archivo de audio</p>
                          <p className="text-xs text-gray-500">MP3, WAV, FLAC, M4A, AAC (máx. 50MB)</p>
                        </div>
                        <Button
                          onClick={() => document.getElementById('edit-audio-input')?.click()}
                          variant="outline"
                          size="sm"
                          className="border-pink-200 text-pink-600 hover:bg-pink-50"
                        >
                          <FileAudio className="h-4 w-4 mr-2" />
                          Cambiar audio
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Portada */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Portada</label>
                <div className="flex items-center gap-4">
                  {editCoverPreviewUrl ? (
                    <img src={editCoverPreviewUrl} alt="Portada" className="w-24 h-24 rounded object-cover border" />
                  ) : (
                    <div className="w-24 h-24 rounded bg-gray-100 flex items-center justify-center text-gray-500">Sin imagen</div>
                  )}
                  <input type="file" accept="image/*" className="hidden" id="edit-cover-input" onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (!f) return
                    if (!ALLOWED_IMAGE_TYPES.has(f.type) || f.size > MAX_IMAGE_BYTES) return
                    setEditForm(prev => ({ ...prev, coverImage: f }))
                    const url = URL.createObjectURL(f)
                    setEditCoverPreviewUrl(url)
                  }} />
                  <Button variant="outline" onClick={() => document.getElementById('edit-cover-input')?.click()}>Cambiar portada</Button>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6 justify-end">
              <Button variant="outline" onClick={() => { 
                setShowEditSongModal({ open: false, song: null }); 
                setEditCoverPreviewUrl(null);
                setEditAudioFile(null);
                setEditAudioPreviewUrl(null);
                setEditAudioDuration('');
              }}>Cancelar</Button>
              <Button disabled={isSavingEdit} onClick={async () => {
                if (!showEditSongModal.song) return
                setIsSavingEdit(true)
                let coverUrl = editForm.coverUrl
                let audioUrl = showEditSongModal.song.audioUrl
                let duration = showEditSongModal.song.duration
                let fileName = showEditSongModal.song.fileName
                
                // Subir nueva portada si se seleccionó
                if (editForm.coverImage) {
                  const up = await uploadPublicFile(BUCKET_COVERS, editForm.coverImage, 'covers/')
                  coverUrl = up.url
                }
                
                // Subir nuevo audio si se seleccionó
                if (editAudioFile) {
                  const up = await uploadPublicFile(BUCKET_AUDIO, editAudioFile, 'audio/')
                  audioUrl = up.url
                  duration = editAudioDuration
                  fileName = editAudioFile.name
                }
                
                const update = {
                  title: editForm.title,
                  artist: editForm.artist,
                  album: editForm.album,
                  genre: editForm.genre,
                  year: editForm.year,
                  dedication: editForm.dedication,
                  cover: coverUrl,
                  audio_url: audioUrl,
                  duration: duration,
                  file_name: fileName
                }
                const { error } = await supabase.from('songs').update(update).eq('id', showEditSongModal.song.id)
                if (!error) {
                  setPlaylist(prev => prev.map(s => s.id === showEditSongModal.song!.id ? { 
                    ...s, 
                    ...update,
                    audioUrl: audioUrl,
                    fileName: fileName
                  } : s))
                  setShowEditSongModal({ open: false, song: null })
                  setEditCoverPreviewUrl(null)
                  setEditAudioFile(null)
                  setEditAudioPreviewUrl(null)
                  setEditAudioDuration('')
                }
                setIsSavingEdit(false)
              }} className="bg-pink-500 hover:bg-pink-600 text-white">Guardar cambios</Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Eliminar Canción */}
      {showDeleteModal.open && showDeleteModal.song && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-2xl text-center">
            <h4 className="text-lg font-semibold text-gray-800">Eliminar canción</h4>
            <p className="text-sm text-gray-600 mt-2">¿Seguro que deseas eliminar "{showDeleteModal.song.title}"?</p>
            <div className="mt-4 flex gap-3 justify-center">
              <Button variant="outline" onClick={() => setShowDeleteModal({ open: false, song: null })}>Cancelar</Button>
              <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={async () => {
                const song = showDeleteModal.song!
                await supabase.from('songs').delete().eq('id', song.id)
                setPlaylist(prev => prev.filter(s => s.id !== song.id))
                if (currentSong.id === song.id) {
                  const next = playlist.find(s => s.id !== song.id)
                  if (next) selectSong(next)
                }
                setShowDeleteModal({ open: false, song: null })
              }}>Eliminar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
