'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { 
  Play, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Film,
  ExternalLink,
  Image as ImageIcon,
  MoreVertical,
  Tv,
  Upload,
  X,
  Heart,
  Check,
  Clock,
  Eye
} from 'lucide-react'
import { getBrowserClient } from '@/lib/supabase/browser-client'
import { uploadPublicFile } from '@/lib/supabase/storage'
import { Movie, MovieForm } from '@/features/movies/types'

const genres = [
  { value: 'romantico', label: 'Romántico', icon: '💕', color: 'bg-pink-100 text-pink-800' },
  { value: 'accion', label: 'Acción', icon: '💥', color: 'bg-red-100 text-red-800' },
  { value: 'comedia', label: 'Comedia', icon: '😂', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'drama', label: 'Drama', icon: '🎭', color: 'bg-purple-100 text-purple-800' },
  { value: 'terror', label: 'Terror', icon: '👻', color: 'bg-gray-100 text-gray-800' },
  { value: 'ciencia_ficcion', label: 'Ciencia Ficción', icon: '🚀', color: 'bg-blue-100 text-blue-800' },
  { value: 'fantasia', label: 'Fantasía', icon: '🧙‍♀️', color: 'bg-indigo-100 text-indigo-800' },
  { value: 'thriller', label: 'Thriller', icon: '😱', color: 'bg-orange-100 text-orange-800' },
  { value: 'animacion', label: 'Animación', icon: '🎨', color: 'bg-green-100 text-green-800' },
  { value: 'documental', label: 'Documental', icon: '📚', color: 'bg-teal-100 text-teal-800' },
  { value: 'biografico', label: 'Biográfico', icon: '👤', color: 'bg-cyan-100 text-cyan-800' },
  { value: 'historico', label: 'Histórico', icon: '🏛️', color: 'bg-amber-100 text-amber-800' },
  { value: 'musical', label: 'Musical', icon: '🎵', color: 'bg-emerald-100 text-emerald-800' },
  { value: 'western', label: 'Western', icon: '🤠', color: 'bg-orange-100 text-orange-800' },
  { value: 'policial', label: 'Policial', icon: '🚔', color: 'bg-blue-100 text-blue-800' },
  { value: 'misterio', label: 'Misterio', icon: '🔍', color: 'bg-gray-100 text-gray-800' },
  { value: 'aventura', label: 'Aventura', icon: '🗺️', color: 'bg-green-100 text-green-800' },
  { value: 'otro', label: 'Otro', icon: '🎬', color: 'bg-slate-100 text-slate-800' }
]

export function PeliculasSection() {
  const supabase = getBrowserClient()
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Estados para modales
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)

  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('Todos')
  const [selectedType, setSelectedType] = useState('Todos')

  // Estado del formulario
  const [movieForm, setMovieForm] = useState<MovieForm>({
    title: '',
    description: '',
    type: 'pelicula',
    genre: 'romantico',
    image: '',
    watchLink: '',
    season: undefined,
    episode: undefined,
    status: 'pendiente',
    isFavorite: false
  })

  // Estados para carga de imágenes
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')

  // Cargar películas desde Supabase
  useEffect(() => {
    loadMovies()
  }, [])

  const loadMovies = async () => {
    try {
      setLoading(true)
      console.log('🔄 Cargando películas desde Supabase...')
      
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Error loading movies:', error)
        alert(`Error al cargar películas: ${error.message}`)
        return
      }

      console.log('✅ Películas cargadas:', data?.length || 0, 'registros')
      console.log('📊 Datos:', data)
      
      setMovies(data || [])
    } catch (error) {
      console.error('❌ Error loading movies:', error)
      alert(`Error inesperado: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  // Suscripción en tiempo real
  useEffect(() => {
    const channel = supabase
      .channel('movies_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'movies' }, 
        () => {
          loadMovies()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  // Estadísticas
  const stats = {
    totalMovies: movies.length,
    totalPeliculas: movies.filter(m => m.type === 'pelicula').length,
    totalSeries: movies.filter(m => m.type === 'serie').length,
    mostPopularGenre: getMostPopularGenre()
  }

  function getMostPopularGenre() {
    const genreCounts = movies.reduce((acc, movie) => {
      acc[movie.genre] = (acc[movie.genre] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    if (Object.keys(genreCounts).length === 0) return 'N/A'
    
    return Object.entries(genreCounts).reduce((a, b) => 
      genreCounts[a[0]] > genreCounts[b[0]] ? a : b
    )[0]
  }

  // Filtrar películas
  const filteredMovies = movies.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movie.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesGenre = selectedGenre === 'Todos' || movie.genre === selectedGenre.toLowerCase()
    const matchesType = selectedType === 'Todos' || movie.type === selectedType.toLowerCase()
    return matchesSearch && matchesGenre && matchesType
  })

  // Agrupar por estado
  const peliculasVistas = filteredMovies.filter(m => m.status === 'visto')
  const peliculasPendientes = filteredMovies.filter(m => m.status === 'pendiente')
  const peliculasEnProgreso = filteredMovies.filter(m => m.status === 'en_progreso')
  const peliculasFavoritas = filteredMovies.filter(m => m.isFavorite)

  // Agrupar por tipo
  const peliculas = filteredMovies.filter(m => m.type === 'pelicula')
  const series = filteredMovies.filter(m => m.type === 'serie')

  // Funciones para manejar imágenes
  const handleImageUpload = (file: File) => {
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview('')
    setMovieForm(prev => ({ ...prev, image: '' }))
  }

  // Funciones para modales
  const openAddModal = () => {
    setMovieForm({
      title: '',
      description: '',
      type: 'pelicula',
      genre: 'romantico',
      image: '',
      watchLink: '',
      season: undefined,
      episode: undefined,
      status: 'pendiente',
      isFavorite: false
    })
    setImageFile(null)
    setImagePreview('')
    setShowAddModal(true)
  }

  const openEditModal = (movie: Movie) => {
    setSelectedMovie(movie)
    setMovieForm({
      title: movie.title,
      description: movie.description,
      type: movie.type,
      genre: movie.genre,
      image: movie.image || '',
      watchLink: movie.watchLink || '',
      season: movie.season,
      episode: movie.episode,
      status: movie.status,
      isFavorite: movie.isFavorite
    })
    setImagePreview(movie.image || '')
    setImageFile(null)
    setShowEditModal(true)
  }

  const openDeleteModal = (movie: Movie) => {
    setSelectedMovie(movie)
    setShowDeleteModal(true)
  }

  const openViewModal = (movie: Movie) => {
    setSelectedMovie(movie)
    setShowViewModal(true)
  }

  // Funciones CRUD
  const handleSaveMovie = async () => {
    if (!movieForm.title || !movieForm.description) return

    try {
      setSaving(true)
      let imageUrl = movieForm.image

      // Subir imagen si hay un archivo nuevo
      if (imageFile) {
        const uploadResult = await uploadPublicFile('movie-images', imageFile)
        if (uploadResult && uploadResult.url) {
          imageUrl = uploadResult.url
        }
      }

      const movieData = {
        ...movieForm,
        image: imageUrl
      }

      if (showEditModal && selectedMovie) {
        // Actualizar película existente
        const response = await fetch(`/api/movies/${selectedMovie.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(movieData)
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Error al actualizar la película')
        }

        setShowEditModal(false)
      } else {
        // Crear nueva película
        const response = await fetch('/api/movies', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(movieData)
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Error al crear la película')
        }

        setShowAddModal(false)
      }

      // Recargar datos para actualizar la UI
      await loadMovies()

      // Limpiar formulario
      setMovieForm({
        title: '',
        description: '',
        type: 'pelicula',
        genre: 'romantico',
        image: '',
        watchLink: '',
        season: undefined,
        episode: undefined,
        status: 'pendiente',
        isFavorite: false
      })
      setImageFile(null)
      setImagePreview('')
    } catch (error) {
      console.error('Error saving movie:', error)
      alert(error instanceof Error ? error.message : 'Error al guardar la película')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteMovie = async () => {
    if (!selectedMovie) return

    try {
      setSaving(true)
      const response = await fetch(`/api/movies/${selectedMovie.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al eliminar la película')
      }

      setShowDeleteModal(false)
      setSelectedMovie(null)
      
      // Recargar datos para actualizar la UI
      await loadMovies()
    } catch (error) {
      console.error('Error deleting movie:', error)
      alert(error instanceof Error ? error.message : 'Error al eliminar la película')
    } finally {
      setSaving(false)
    }
  }

  const getGenreIcon = (genre: string) => {
    return genres.find(g => g.value === genre)?.icon || '🎬'
  }

  const getGenreColor = (genre: string) => {
    return genres.find(g => g.value === genre)?.color || 'bg-gray-100 text-gray-800'
  }

  // Funciones para cambiar estado
  const toggleFavorite = async (movieId: string) => {
    try {
      const movie = movies.find(m => m.id === movieId)
      if (!movie) return

      const response = await fetch(`/api/movies/${movieId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFavorite: !movie.isFavorite })
      })

      if (!response.ok) {
        throw new Error('Error al actualizar favorito')
      }

      // Recargar datos para actualizar la UI
      await loadMovies()
    } catch (error) {
      console.error('Error toggling favorite:', error)
      alert('Error al actualizar favorito')
    }
  }

  const changeStatus = async (movieId: string, newStatus: Movie['status']) => {
    try {
      const response = await fetch(`/api/movies/${movieId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (!response.ok) {
        throw new Error('Error al cambiar estado')
      }

      // Recargar datos para actualizar la UI
      await loadMovies()
    } catch (error) {
      console.error('Error changing status:', error)
      alert('Error al cambiar el estado')
    }
  }

  const MovieCard = ({ movie }: { movie: Movie }) => (
    <div className="relative group cursor-pointer" onClick={() => openViewModal(movie)}>
      <Card className="movie-card overflow-hidden h-96 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
        <CardContent className="p-0 h-full">
          <div className="movie-card-content relative h-full">
            {/* Background Image */}
            {movie.image && (
              <div className="absolute inset-0">
                <img 
                  src={movie.image} 
                  alt={movie.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />
              </div>
            )}
            
            {/* Top Section - Status and Actions */}
            <div className="absolute top-4 left-4 right-4 z-20 flex items-start justify-between">
              {/* Status Badge */}
                <Badge className={`text-xs ${
                movie.status === 'visto' ? 'bg-green-500 text-white' :
                movie.status === 'en_progreso' ? 'bg-blue-500 text-white' :
                movie.status === 'pendiente' ? 'bg-yellow-500 text-white' : 'bg-purple-500 text-white'
                }`}>
                  {movie.status === 'visto' ? '✅ Visto' :
                 movie.status === 'en_progreso' ? '▶️ En Progreso' :
                 movie.status === 'pendiente' ? '⏳ Pendiente' : '⭐ Favorito'}
                </Badge>

              {/* Favorite Button */}
                  <Button 
                    size="sm" 
                    variant="ghost" 
                  className="h-8 w-8 p-0 text-white rounded-full hover:bg-white/20"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleFavorite(movie.id)
                  }}
                >
                <Heart className={`h-4 w-4 ${movie.isFavorite ? 'fill-current text-red-500' : ''}`} />
                </Button>
            </div>

            {/* Center Section - Series Progress */}
            {movie.type === 'serie' && movie.season && movie.episode && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="text-center">
                  <div className="text-white text-sm px-4 py-2 rounded-full bg-black/70 backdrop-blur-sm border border-white/20">
                    <div className="font-bold">S{movie.season} E{movie.episode}</div>
              </div>
                    </div>
                </div>
            )}

            {/* Bottom Section - Content Info */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-20">
              {/* Title */}
              <div className="mb-3">
                <h3 className="movie-title text-xl font-bold line-clamp-2 mb-2">
                  {movie.title}
                </h3>
                  </div>
              
              {/* Genre and Type */}
              <div className="flex items-center gap-2 text-xs text-gray-300 mb-3">
                <Badge className={`text-xs ${getGenreColor(movie.genre)}`}>
                  {getGenreIcon(movie.genre)} {genres.find(g => g.value === movie.genre)?.label}
                </Badge>
                <Badge variant="outline" className="text-xs text-white border-white/30">
                  {movie.type === 'pelicula' ? '🎬 Película' : '📺 Serie'}
                </Badge>
                </div>

              {/* Description */}
              <p className="movie-description text-sm text-gray-300 line-clamp-2 mb-4 leading-relaxed">
                  {movie.description}
                </p>

              {/* Action Bar */}
              <div className="flex items-center justify-between">
                {/* Left Actions */}
                <div className="flex items-center gap-2">
                    {/* Watch Button */}
                {movie.watchLink && (
                  <Button 
                    size="sm" 
                        className="bg-red-600 hover:bg-red-700 text-white"
                    onClick={(e) => {
                      e.stopPropagation()
                      window.open(movie.watchLink, '_blank')
                    }}
                  >
                        <Play className="h-4 w-4 mr-2" />
                        Ver Ahora
                      </Button>
                    )}

                    {/* Status Change Button - Dynamic based on current status */}
                    {movie.status === 'pendiente' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-white/30 text-white hover:bg-white/20"
                        onClick={(e) => {
                          e.stopPropagation()
                          changeStatus(movie.id, movie.type === 'serie' ? 'en_progreso' : 'visto')
                        }}
                      >
                        {movie.type === 'serie' ? (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            En Progreso
                          </>
                        ) : (
                          <>
                            <Check className="h-4 w-4 mr-2" />
                            Marcar Visto
                          </>
                        )}
                      </Button>
                    )}

                    {movie.status === 'en_progreso' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-white/30 text-white hover:bg-white/20"
                        onClick={(e) => {
                          e.stopPropagation()
                          changeStatus(movie.id, 'visto')
                        }}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Marcar Visto
                      </Button>
                    )}

                    {movie.status === 'visto' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-white/30 text-white hover:bg-white/20"
                        onClick={(e) => {
                          e.stopPropagation()
                          changeStatus(movie.id, 'pendiente')
                        }}
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        Marcar Pendiente
                  </Button>
                )}
                </div>
                
                {/* Right Actions */}
                  <div className="flex items-center gap-2">
                    {/* Edit Button */}
                  <Button 
                    size="sm" 
                    variant="ghost" 
                      className="h-8 w-8 p-0 text-white rounded-full hover:bg-white/20"
                      onClick={(e) => {
                        e.stopPropagation()
                        openEditModal(movie)
                      }}
                    >
                      <Edit className="h-4 w-4" />
                  </Button>

                    {/* Delete Button */}
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-8 w-8 p-0 text-white rounded-full hover:bg-white/20 hover:text-red-400"
                      onClick={(e) => {
                        e.stopPropagation()
                        openDeleteModal(movie)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
              </div>
            </div>

            {/* Hover Indicator */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 bg-black/50">
                <Eye className="h-3 w-3" />
                Clic para ver detalles
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Film className="h-8 w-8 text-primary" />
            Nuestro Cine de Amor
          </h1>
          <p className="text-muted-foreground">
            Descubre, comparte y disfruta juntos las mejores películas y series
          </p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando películas...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Film className="h-8 w-8 text-primary" />
          Nuestro Cine de Amor
        </h1>
        <p className="text-muted-foreground">
          Descubre, comparte y disfruta juntos las mejores películas y series
        </p>
      </div>

      <Separator />

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-primary font-medium">Total</p>
                <p className="text-2xl font-bold text-primary">{stats.totalMovies}</p>
                <p className="text-xs text-muted-foreground">Películas y Series</p>
              </div>
              <Film className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-primary font-medium">Películas</p>
                <p className="text-2xl font-bold text-primary">{stats.totalPeliculas}</p>
                <p className="text-xs text-muted-foreground">Películas</p>
              </div>
              <Film className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-primary font-medium">Series</p>
                <p className="text-2xl font-bold text-primary">{stats.totalSeries}</p>
                <p className="text-xs text-muted-foreground">Series</p>
              </div>
              <Tv className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-primary font-medium">Género Favorito</p>
                <p className="text-2xl font-bold text-primary">{genres.find(g => g.value === stats.mostPopularGenre)?.label || 'N/A'}</p>
                <p className="text-xs text-muted-foreground">Más popular</p>
              </div>
              <span className="text-2xl">{genres.find(g => g.value === stats.mostPopularGenre)?.icon || '🎬'}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controles */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex-1 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar películas y series..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todos">Todos los géneros</SelectItem>
                  {genres.map(genre => (
                    <SelectItem key={genre.value} value={genre.label}>
                      {genre.icon} {genre.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todos">Todos los tipos</SelectItem>
                  <SelectItem value="pelicula">🎬 Películas</SelectItem>
                  <SelectItem value="serie">📺 Series</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
            <Button
              onClick={openAddModal}
                className="bg-primary hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contenido Principal */}
      <Tabs defaultValue="pendientes" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="vistas">
            <Check className="h-4 w-4 mr-2" />
            Vistas ({peliculasVistas.length})
          </TabsTrigger>
          <TabsTrigger value="en_progreso">
            <Play className="h-4 w-4 mr-2" />
            En Progreso ({peliculasEnProgreso.length})
          </TabsTrigger>
          <TabsTrigger value="pendientes">
            <Clock className="h-4 w-4 mr-2" />
            Pendientes ({peliculasPendientes.length})
          </TabsTrigger>
          <TabsTrigger value="favoritas">
            <Heart className="h-4 w-4 mr-2" />
            Favoritas ({peliculasFavoritas.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="vistas" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {peliculasVistas.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="en_progreso" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {peliculasEnProgreso.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pendientes" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {peliculasPendientes.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
      </div>
        </TabsContent>

        <TabsContent value="favoritas" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {peliculasFavoritas.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal para Agregar/Editar Película */}
      <Dialog open={showAddModal || showEditModal} onOpenChange={() => {
        setShowAddModal(false)
        setShowEditModal(false)
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Film className="h-5 w-5 text-primary" />
              {showEditModal ? 'Editar Película/Serie' : 'Agregar Nueva Película/Serie'}
            </DialogTitle>
            <DialogDescription>
              Comparte tu próxima película o serie favorita
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Información básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título *
                </label>
                <Input
                  value={movieForm.title}
                  onChange={(e) => setMovieForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Ej: La La Land"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo *
                </label>
                <Select value={movieForm.type} onValueChange={(value: 'pelicula' | 'serie') => setMovieForm(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pelicula">🎬 Película</SelectItem>
                    <SelectItem value="serie">📺 Serie</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción *
              </label>
              <textarea
                value={movieForm.description}
                onChange={(e) => setMovieForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe la película o serie..."
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-md resize-none focus:border-primary focus:ring-primary"
              />
            </div>

            {/* Género y Estado */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Género *
                </label>
                <Select value={movieForm.genre} onValueChange={(value: Movie['genre']) => setMovieForm(prev => ({ ...prev, genre: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {genres.map(genre => (
                      <SelectItem key={genre.value} value={genre.value}>
                        {genre.icon} {genre.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado *
                </label>
                <Select value={movieForm.status} onValueChange={(value: Movie['status']) => setMovieForm(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendiente">⏳ Pendiente</SelectItem>
                    <SelectItem value="en_progreso">▶️ En Progreso</SelectItem>
                    <SelectItem value="visto">✅ Visto</SelectItem>
                    <SelectItem value="favorito">⭐ Favorito</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Información de series */}
            {movieForm.type === 'serie' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Temporada
                </label>
                <Input
                  type="number"
                    value={movieForm.season || ''}
                    onChange={(e) => setMovieForm(prev => ({ ...prev, season: parseInt(e.target.value) || undefined }))}
                  min="1"
                    placeholder="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Episodio
                </label>
                <Input
                  type="number"
                    value={movieForm.episode || ''}
                    onChange={(e) => setMovieForm(prev => ({ ...prev, episode: parseInt(e.target.value) || undefined }))}
                  min="1"
                    placeholder="1"
                />
              </div>
            </div>
            )}

            {/* Favorito */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isFavorite"
                checked={movieForm.isFavorite}
                onChange={(e) => setMovieForm(prev => ({ ...prev, isFavorite: e.target.checked }))}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="isFavorite" className="text-sm font-medium text-gray-700">
                <Heart className="inline h-4 w-4 mr-1" />
                Marcar como favorito
                </label>
            </div>

            {/* Imagen y Link */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <ImageIcon className="inline h-4 w-4 mr-1" />
                  Imagen de Portada
                </label>
                <div className="space-y-2">
                <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleImageUpload(file)
                    }}
                    className="cursor-pointer"
                  />
                  {imagePreview && (
                    <div className="relative">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-32 object-cover rounded-md"
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        className="absolute top-2 right-2 h-6 w-6 p-0"
                        onClick={removeImage}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <ExternalLink className="inline h-4 w-4 mr-1" />
                  Link para Ver
                </label>
                <Input
                  value={movieForm.watchLink}
                  onChange={(e) => setMovieForm(prev => ({ ...prev, watchLink: e.target.value }))}
                  placeholder="https://netflix.com/title/..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Link directo para ver la película/serie
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowAddModal(false)
                setShowEditModal(false)
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSaveMovie}
              disabled={!movieForm.title || !movieForm.description || saving}
              className="bg-primary hover:bg-primary/90"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Guardando...
                </>
              ) : (
                <>
              <Plus className="h-4 w-4 mr-2" />
              Guardar
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Vista Detallada */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Film className="h-5 w-5 text-primary" />
              {selectedMovie?.title}
            </DialogTitle>
            <DialogDescription>
              Información detallada de la película o serie
            </DialogDescription>
          </DialogHeader>

          {selectedMovie && (
            <div className="space-y-6">
              {/* Header con imagen y información básica */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Imagen */}
                <div className="md:col-span-1">
                  {selectedMovie.image ? (
                    <img 
                      src={selectedMovie.image} 
                      alt={selectedMovie.title}
                      className="w-full h-80 object-cover rounded-lg shadow-lg"
                    />
                  ) : (
                    <div className="w-full h-80 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
                      <Film className="h-16 w-16 text-primary/50" />
                </div>
              )}
                </div>

                {/* Información básica */}
                <div className="md:col-span-2 space-y-4">
                  {/* Título */}
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-1">
                      {selectedMovie.title}
                    </h2>
                    <p className="text-lg text-muted-foreground">
                      {selectedMovie.type === 'pelicula' ? '🎬 Película' : '📺 Serie'}
                    </p>
                  </div>

                  {/* Estado y favorito */}
                  <div className="flex items-center gap-4">
                    <Badge className={`${
                      selectedMovie.status === 'visto' ? 'bg-green-500 text-white' :
                      selectedMovie.status === 'en_progreso' ? 'bg-blue-500 text-white' :
                      selectedMovie.status === 'pendiente' ? 'bg-yellow-500 text-white' : 'bg-purple-500 text-white'
                    }`}>
                      {selectedMovie.status === 'visto' ? '✅ Visto' :
                       selectedMovie.status === 'en_progreso' ? '▶️ En Progreso' :
                       selectedMovie.status === 'pendiente' ? '⏳ Pendiente' : '⭐ Favorito'}
                    </Badge>
                    {selectedMovie.isFavorite && (
                      <Badge className="bg-red-500 text-white">
                        <Heart className="h-3 w-3 mr-1 fill-current" />
                        Favorita
                      </Badge>
                    )}
                  </div>

                  {/* Género */}
                  <div className="flex items-center gap-2">
                    <Badge className={getGenreColor(selectedMovie.genre)}>
                      {getGenreIcon(selectedMovie.genre)} {genres.find(g => g.value === selectedMovie.genre)?.label}
                    </Badge>
                  </div>

                  {/* Descripción */}
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Sinopsis</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {selectedMovie.description}
                    </p>
              </div>

              {/* Información de series */}
                  {selectedMovie.type === 'serie' && selectedMovie.season && selectedMovie.episode && (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-primary/5 rounded-lg">
                          <div className="text-2xl font-bold text-primary">{selectedMovie.season}</div>
                        <div className="text-sm text-muted-foreground">Temporada</div>
                        </div>
                        <div className="text-center p-3 bg-primary/5 rounded-lg">
                          <div className="text-2xl font-bold text-primary">{selectedMovie.episode}</div>
                        <div className="text-sm text-muted-foreground">Episodio</div>
                        </div>
                        </div>
                      )}
                        </div>
                    </div>

                  <Separator />

              {/* Acciones */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {selectedMovie.watchLink && (
                    <Button 
                      className="bg-red-600 hover:bg-red-700"
                      onClick={() => window.open(selectedMovie.watchLink, '_blank')}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Ver Ahora
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowViewModal(false)
                      openEditModal(selectedMovie)
                    }}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  </div>
                
                <Button
                  variant="outline"
                  onClick={() => setShowViewModal(false)}
                >
                  Cerrar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Confirmación de Eliminación */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-500" />
              Eliminar Película/Serie
            </DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres eliminar "{selectedMovie?.title}"? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleDeleteMovie}
              disabled={saving}
              className="bg-red-500 hover:bg-red-600"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Eliminando...
                </>
              ) : (
                <>
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}


