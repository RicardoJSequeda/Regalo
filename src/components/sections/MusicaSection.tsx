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
  MoreHorizontal,
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
  Image
} from 'lucide-react'
import { useLocalStorage } from '@/hooks/useLocalStorage'

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

export function MusicaSection() {
  const { value: playlist, setValue: setPlaylist } = useLocalStorage<Song[]>('playlist', initialPlaylist)
  const [currentSong, setCurrentSong] = useState<Song>(playlist[0])
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
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

  // Simular progreso de reproducción
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1
          if (newTime >= duration) {
            if (repeat) {
              return 0
            } else if (shuffle) {
              const randomIndex = Math.floor(Math.random() * playlist.length)
              setCurrentSong(playlist[randomIndex])
              return 0
            } else {
              nextSong()
              return 0
            }
          }
          return newTime
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying, duration, repeat, shuffle])

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
    setCurrentSong(playlist[nextIndex])
    setCurrentTime(0)
    setIsPlaying(true)
  }

  // Canción anterior
  const prevSong = () => {
    const currentIndex = playlist.findIndex(song => song.id === currentSong.id)
    const prevIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1
    setCurrentSong(playlist[prevIndex])
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
  }

  // Manejar volumen
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value)
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  // Toggle favorito
  const toggleFavorite = (songId: string) => {
    const updatedPlaylist = playlist.map(song => 
      song.id === songId ? { ...song, isFavorite: !song.isFavorite } : song
    )
    // Aquí actualizarías el estado global de la playlist
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
      setSelectedFile(file)
      
      // Extraer información del nombre del archivo
      const { artist, title } = extractInfoFromFileName(file.name)
      
      // Actualizar el formulario con la información extraída
      setSongForm(prev => ({
        ...prev,
        title: title || prev.title,
        artist: artist || prev.artist
      }))
    }
  }

  // Simular carga de archivo
  const handleUpload = async () => {
    if (!selectedFile) return
    
    setIsUploading(true)
    
    // Simular proceso de carga
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Generar URL de imagen de portada
    let coverUrl = '/api/placeholder/200/200'
    if (songForm.coverImage) {
      coverUrl = URL.createObjectURL(songForm.coverImage)
    }
    
    // Crear nueva canción
    const newSong: Song = {
      id: Date.now().toString(),
      title: songForm.title,
      artist: songForm.artist,
      album: songForm.album,
      duration: '3:45', // Simulado
      cover: coverUrl,
      dedication: songForm.dedication,
      isFavorite: false,
      genre: songForm.genre,
      year: songForm.year,
      plays: 0,
      fileName: selectedFile.name
    }
    
    // Agregar a la playlist (en un caso real, esto se haría con estado global)
    playlist.unshift(newSong)
    
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
    
    // Mostrar mensaje de éxito
    alert('¡Canción agregada exitosamente!')
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
    if (file && file.type.startsWith('image/')) {
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
      <Card className="music-player">
        {/* Floating Music Notes Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 text-white opacity-20 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}>
            <Music className="h-8 w-8" />
          </div>
          <div className="absolute top-20 right-20 text-white opacity-15 animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}>
            <Music className="h-6 w-6" />
          </div>
          <div className="absolute bottom-20 left-20 text-white opacity-25 animate-bounce" style={{ animationDelay: '2s', animationDuration: '3.5s' }}>
            <Music className="h-10 w-10" />
          </div>
          <div className="absolute bottom-10 right-10 text-white opacity-20 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '4.5s' }}>
            <Music className="h-7 w-7" />
          </div>
        </div>
        <CardContent className="p-6 relative z-10">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Álbum y Información */}
            <div className="flex-shrink-0">
              <div className={`album-cover w-48 h-48 rounded-lg shadow-lg relative group overflow-hidden ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '20s' }}>
                {currentSong.cover && currentSong.cover !== '/api/placeholder/200/200' ? (
                  <img 
                    src={currentSong.cover} 
                    alt={`Portada de ${currentSong.title}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                    {currentSong.album || 'Sin álbum'}
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-lg flex items-center justify-center">
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
              <div className="mt-4 text-center">
                <h3 className={`font-semibold text-lg ${isPlaying ? 'text-white animate-pulse' : 'text-gray-800'}`} style={isPlaying ? { textShadow: '0 0 10px rgba(255,255,255,0.5)' } : {}}>
                  {currentSong.title}
                </h3>
                <p className="text-gray-600">{currentSong.artist}</p>
                <div className="flex items-center justify-center gap-2 mt-2 text-sm text-gray-500">
                  <span>{currentSong.genre}</span>
                  <span>•</span>
                  <span>{currentSong.year}</span>
                  <span>•</span>
                  <span>{currentSong.plays} reproducciones</span>
                </div>
                <div className="flex items-center justify-center gap-2 mt-3">
                  <Button
                    onClick={() => setShowDedication(!showDedication)}
                    className="bg-pink-500 hover:bg-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Ver dedicatoria
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={shareSong}
                    className="border-pink-200 text-pink-600 hover:bg-pink-50"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Controles de Reproducción */}
            <div className="flex-1 space-y-6">
              {/* Barra de Progreso Mejorada */}
              <div className="space-y-3">
                {/* Audio Visualizer */}
                {isPlaying && (
                  <div className="flex items-end justify-center gap-1 h-8 mb-2">
                    {Array.from({ length: 20 }, (_, i) => (
                      <div
                        key={i}
                        className="w-1 bg-white rounded-full opacity-60"
                        style={{
                          height: `${Math.random() * 20 + 5}px`,
                          animation: `musicBar${(i % 5) + 1} 0.8s ease-in-out infinite`,
                          animationDelay: `${i * 0.05}s`
                        }}
                      />
                    ))}
                  </div>
                )}
                
                {/* Music Equalizer Bars */}
                {isPlaying && (
                  <div className="flex items-end justify-center gap-0.5 h-6 mb-2">
                    {Array.from({ length: 8 }, (_, i) => (
                      <div
                        key={i}
                        className="w-0.5 bg-gradient-to-t from-pink-400 to-purple-500 rounded-full"
                        style={{
                          height: `${Math.random() * 15 + 3}px`,
                          animation: `musicBar${(i % 5) + 1} 1.2s ease-in-out infinite`,
                          animationDelay: `${i * 0.1}s`
                        }}
                      />
                    ))}
                  </div>
                )}
                <div 
                  ref={progressRef}
                  className="w-full bg-gray-200 rounded-full h-3 cursor-pointer relative group"
                  onClick={handleProgressClick}
                >
                  <div 
                    className="progress-bar h-3 rounded-full transition-all duration-300 relative"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  >
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </div>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{formatTime(currentTime)}</span>
                  <span>{currentSong.duration}</span>
                </div>
              </div>

              {/* Controles Principales Mejorados */}
              <div className="flex items-center justify-center gap-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShuffle(!shuffle)}
                  className={`control-button p-3 ${shuffle ? 'active' : ''}`}
                >
                  <Shuffle className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={prevSong}
                  className="control-button p-3"
                >
                  <SkipBack className="h-7 w-7" />
                </Button>
                <Button
                  onClick={togglePlay}
                  className={`play-button w-20 h-20 text-white rounded-full shadow-lg ${isPlaying ? 'animate-pulse' : ''}`}
                >
                  {isPlaying ? <Pause className="h-10 w-10" /> : <Play className="h-10 w-10 ml-1" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={nextSong}
                  className="control-button p-3"
                >
                  <SkipForward className="h-7 w-7" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setRepeat(!repeat)}
                  className={`control-button p-3 ${repeat ? 'active' : ''}`}
                >
                  <Repeat className="h-6 w-6" />
                </Button>
              </div>

              {/* Controles Secundarios */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFavorite(currentSong.id)}
                    className={`p-2 transition-all duration-200 ${currentSong.isFavorite ? 'text-red-500' : 'text-gray-400'}`}
                  >
                    <Heart className={`h-5 w-5 ${currentSong.isFavorite ? 'fill-current animate-pulse' : ''}`} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-2 text-gray-400"
                  >
                    <Download className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPlaylist(!showPlaylist)}
                    className="p-2 text-gray-400"
                  >
                    <List className="h-5 w-5" />
                  </Button>
                </div>

                {/* Control de Volumen Mejorado */}
                <div className="flex items-center gap-3 relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleMute}
                    className="control-button p-2"
                    onMouseEnter={() => setShowVolumeSlider(true)}
                    onMouseLeave={() => setShowVolumeSlider(false)}
                  >
                    {isMuted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
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
                      className="volume-slider w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

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
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Music className="h-4 w-4" />
                <span>{playlist.length} canciones</span>
                <span>•</span>
                <Clock className="h-4 w-4" />
                <span>18:47 total</span>
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
                  className={`playlist-item flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                    currentSong.id === song.id ? 'playing bg-pink-50 border border-pink-200' : ''
                  }`}
                  onClick={() => selectSong(song)}
                >
                                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm relative flex-shrink-0 overflow-hidden">
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
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    </div>
                  )}
                </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-800 truncate">{song.title}</h4>
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
                      <Heart className={`h-4 w-4 ${song.isFavorite ? 'fill-current' : ''}`} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1.5 text-gray-400"
                    >
                      <MoreHorizontal className="h-4 w-4" />
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
    </div>
  )
}
