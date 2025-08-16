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
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { 
  Play, 
  Heart, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Star,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  Film,
  ExternalLink,
  Image as ImageIcon,
  MoreVertical,
  Clock,
  Calendar,
  Users,
  Award,
  TrendingUp,
  Bookmark,
  Filter,
  Grid,
  List,
  Zap,
  Sparkles,
  Camera,
  Video,
  Tv,
  Monitor,
  Smartphone,
  Globe,
  Languages,
  Subtitles,
  Volume2,
  VolumeX,
  Settings,
  Hash,
  MessageCircle,
  Check
} from 'lucide-react'
import { useLocalStorage } from '@/hooks/useLocalStorage'

interface Movie {
  id: string
  title: string
  originalTitle?: string
  description: string
  type: 'pelicula' | 'serie' | 'documental' | 'anime' | 'corto' | 'miniserie'
  genre: 'romantico' | 'accion' | 'comedia' | 'drama' | 'terror' | 'ciencia_ficcion' | 'fantasia' | 'thriller' | 'animacion' | 'documental' | 'biografico' | 'historico' | 'musical' | 'western' | 'policial' | 'misterio' | 'aventura' | 'otro'
  year: number
  duration: number // en minutos
  rating: number // 1-10
  director?: string
  cast?: string[]
  language: string
  subtitles?: string[]
  status: 'visto' | 'viendo' | 'pendiente' | 'abandonado' | 'recomendado'
  isFavorite: boolean
  isWatched: boolean
  watchDate?: string
  watchCount: number
  notes?: string
  poster?: string
  trailer?: string
  image?: string // URL de la imagen/poster
  watchLink?: string // Link para ver la película/serie
  tags: string[]
  mood: 'romantico' | 'divertido' | 'emocionante' | 'relajante' | 'inspirador' | 'nostalgico' | 'misterioso' | 'tenso' | 'triste' | 'otro'
  
  // Información de series
  season?: number
  episode?: number
  totalSeasons?: number
  totalEpisodes?: number
  episodeDuration?: number // duración por episodio
  watchedEpisodes?: number[] // episodios vistos
  watchedSeasons?: number[] // temporadas completas vistas
  
  // Información de continuaciones (para películas)
  isPartOfSeries?: boolean
  seriesName?: string
  partNumber?: number // número de la película en la saga
  totalParts?: number // total de películas en la saga
  watchedParts?: number[] // partes vistas de la saga
  
  awards?: string[] // premios ganados
  budget?: number // presupuesto en millones
  boxOffice?: number // taquilla en millones
  imdbRating?: number // rating de IMDB
  rottenTomatoes?: number // rating de Rotten Tomatoes
  ageRating?: 'G' | 'PG' | 'PG-13' | 'R' | 'NC-17' | 'TV-Y' | 'TV-Y7' | 'TV-G' | 'TV-PG' | 'TV-14' | 'TV-MA'
  country?: string // país de origen
  studio?: string // estudio productor
  releaseDate?: string // fecha de estreno
  createdAt: string
  updatedAt: string
}

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



const moods = [
  { value: 'romantico', label: 'Romántico', icon: '💕' },
  { value: 'divertido', label: 'Divertido', icon: '😄' },
  { value: 'emocionante', label: 'Emocionante', icon: '⚡' },
  { value: 'relajante', label: 'Relajante', icon: '😌' },
  { value: 'inspirador', label: 'Inspirador', icon: '✨' },
  { value: 'nostalgico', label: 'Nostálgico', icon: '🥺' },
  { value: 'misterioso', label: 'Misterioso', icon: '🔮' },
  { value: 'tenso', label: 'Tenso', icon: '😰' },
  { value: 'triste', label: 'Triste', icon: '😢' },
  { value: 'otro', label: 'Otro', icon: '🎭' }
]

const predefinedTags = [
  'Favorito', 'Clásico', 'Oscar', 'Culto', 'Independiente', 'Blockbuster', 'Arte', 'Experimental',
  'Basado en libro', 'Biografía', 'Histórico', 'Musical', 'Western', 'Guerra', 'Policial', 'Misterio',
  'Netflix Original', 'Disney+ Original', 'HBO Original', 'Amazon Original', 'Crítica Favorita',
  'Película de la Infancia', 'Serie de Culto', 'Documental Impactante', 'Anime Clásico', 'Comedia Romántica',
  'Thriller Psicológico', 'Ciencia Ficción', 'Fantasía Épica', 'Drama Familiar', 'Acción Aventura',
  'Terror Clásico', 'Suspenso', 'Animación', 'Live Action', 'Remake', 'Secuela', 'Prequela', 'Spin-off'
]

export function PeliculasSection() {
  const { value: movies, setValue: setMovies } = useLocalStorage<Movie[]>('movies', [
    {
      id: '1',
      title: 'La La Land',
      originalTitle: 'La La Land',
      description: 'Una historia de amor entre una aspirante a actriz y un músico de jazz en Los Ángeles.',
      type: 'pelicula',
      genre: 'romantico',
      year: 2016,
      duration: 128,
      rating: 8.5,
      director: 'Damien Chazelle',
      cast: ['Emma Stone', 'Ryan Gosling'],
      language: 'Inglés',
      subtitles: ['Español', 'Inglés'],
      status: 'visto',
      isFavorite: true,
      isWatched: true,
      watchDate: '2024-01-15',
      watchCount: 3,
      notes: 'Una de nuestras películas favoritas para ver juntos',
      image: 'https://images.unsplash.com/photo-1489599835382-957593cb2371?w=400&h=600&fit=crop',
      watchLink: 'https://www.netflix.com/title/80095314',
      tags: ['Favorito', 'Oscar', 'Musical'],
      mood: 'romantico',
      awards: ['Oscar a Mejor Director', 'Oscar a Mejor Actriz'],
      imdbRating: 8.0,
      rottenTomatoes: 91,
      ageRating: 'PG-13',
      country: 'Estados Unidos',
      studio: 'Lionsgate',
      releaseDate: '2016-12-09',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      title: 'Stranger Things',
      originalTitle: 'Stranger Things',
      description: 'Un grupo de niños descubre fenómenos sobrenaturales en su pequeño pueblo.',
      type: 'serie',
      genre: 'ciencia_ficcion',
      year: 2016,
      duration: 50,
      rating: 8.7,
      director: 'The Duffer Brothers',
      cast: ['Millie Bobby Brown', 'Finn Wolfhard'],
      language: 'Inglés',
      subtitles: ['Español', 'Inglés'],
      status: 'viendo',
      isFavorite: true,
      isWatched: false,
      watchCount: 0,
      season: 4,
      episode: 8,
      totalSeasons: 4,
      totalEpisodes: 34,
      episodeDuration: 50,
      image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop',
      watchLink: 'https://www.netflix.com/title/80057281',
      tags: ['Favorito', 'Culto', 'Netflix Original'],
      mood: 'emocionante',
      imdbRating: 8.7,
      rottenTomatoes: 96,
      ageRating: 'TV-14',
      country: 'Estados Unidos',
      studio: 'Netflix',
      releaseDate: '2016-07-15',
      createdAt: '2024-01-10T15:30:00Z',
      updatedAt: '2024-01-10T15:30:00Z'
    },
    {
      id: '3',
      title: 'El Rey León',
      originalTitle: 'The Lion King',
      description: 'La historia de Simba, un joven león que debe enfrentar su destino.',
      type: 'pelicula',
      genre: 'animacion',
      year: 1994,
      duration: 88,
      rating: 8.5,
      director: 'Roger Allers, Rob Minkoff',
      cast: ['Matthew Broderick', 'James Earl Jones'],
      language: 'Inglés',
      subtitles: ['Español', 'Inglés'],
      status: 'visto',
      isFavorite: false,
      isWatched: true,
      watchDate: '2024-01-08',
      watchCount: 1,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop',
      watchLink: 'https://www.disneyplus.com/movies/the-lion-king/1HqwiFnkVctS',
      tags: ['Clásico', 'Animación', 'Película de la Infancia'],
      mood: 'inspirador',
      awards: ['Oscar a Mejor Banda Sonora', 'Oscar a Mejor Canción Original'],
      imdbRating: 8.5,
      rottenTomatoes: 93,
      ageRating: 'G',
      country: 'Estados Unidos',
      studio: 'Walt Disney Pictures',
      releaseDate: '1994-06-24',
      createdAt: '2024-01-08T19:00:00Z',
      updatedAt: '2024-01-08T19:00:00Z'
    },
    {
      id: '4',
      title: 'The Crown',
      originalTitle: 'The Crown',
      description: 'La historia de la reina Isabel II y los eventos que ayudaron a dar forma a la segunda mitad del siglo XX.',
      type: 'serie',
      genre: 'drama',
      year: 2016,
      duration: 60,
      rating: 8.6,
      director: 'Peter Morgan',
      cast: ['Olivia Colman', 'Emma Corrin'],
      language: 'Inglés',
      subtitles: ['Español', 'Inglés'],
      status: 'pendiente',
      isFavorite: false,
      isWatched: false,
      watchCount: 0,
      season: 1,
      episode: 1,
      totalSeasons: 6,
      totalEpisodes: 60,
      episodeDuration: 60,
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop',
      watchLink: 'https://www.netflix.com/title/80025678',
      tags: ['Drama Familiar', 'Histórico', 'Netflix Original'],
      mood: 'relajante',
      imdbRating: 8.6,
      rottenTomatoes: 89,
      ageRating: 'TV-MA',
      country: 'Reino Unido',
      studio: 'Netflix',
      releaseDate: '2016-11-04',
      createdAt: '2024-01-05T12:00:00Z',
      updatedAt: '2024-01-05T12:00:00Z'
    },
    {
      id: '5',
      title: 'Inception',
      originalTitle: 'Inception',
      description: 'Un ladrón que roba información corporativa a través del uso de la tecnología de compartir sueños.',
      type: 'pelicula',
      genre: 'ciencia_ficcion',
      year: 2010,
      duration: 148,
      rating: 8.8,
      director: 'Christopher Nolan',
      cast: ['Leonardo DiCaprio', 'Ellen Page'],
      language: 'Inglés',
      subtitles: ['Español', 'Inglés'],
      status: 'visto',
      isFavorite: true,
      isWatched: true,
      watchDate: '2024-01-20',
      watchCount: 2,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
      watchLink: 'https://play.hbomax.com/feature/urn:hbo:feature:GVU2cgg0zRJuAuwEAAABj',
      tags: ['Favorito', 'Ciencia Ficción', 'Thriller Psicológico'],
      mood: 'misterioso',
      awards: ['Oscar a Mejor Fotografía', 'Oscar a Mejor Efectos Visuales'],
      imdbRating: 8.8,
      rottenTomatoes: 87,
      ageRating: 'PG-13',
      country: 'Estados Unidos',
      studio: 'Warner Bros.',
      releaseDate: '2010-07-16',
      createdAt: '2024-01-20T14:30:00Z',
      updatedAt: '2024-01-20T14:30:00Z'
    },
    {
      id: '6',
      title: 'Friends',
      originalTitle: 'Friends',
      description: 'Las aventuras de seis amigos que viven en Manhattan y comparten sus vidas, amores y risas.',
      type: 'serie',
      genre: 'comedia',
      year: 1994,
      duration: 22,
      rating: 8.9,
      director: 'David Crane, Marta Kauffman',
      cast: ['Jennifer Aniston', 'Courteney Cox', 'Lisa Kudrow', 'Matt LeBlanc', 'Matthew Perry', 'David Schwimmer'],
      language: 'Inglés',
      subtitles: ['Español', 'Inglés'],
      status: 'visto',
      isFavorite: true,
      isWatched: true,
      watchDate: '2024-02-10',
      watchCount: 5,
      season: 10,
      episode: 236,
      totalSeasons: 10,
      totalEpisodes: 236,
      episodeDuration: 22,
      image: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=400&h=600&fit=crop',
      watchLink: 'https://www.hbomax.com/series/urn:hbo:series:GXdbR_gOXWJuAuwEAABJ9',
      tags: ['Favorito', 'Clásico', 'Comedia Romántica'],
      mood: 'divertido',
      imdbRating: 8.9,
      rottenTomatoes: 78,
      ageRating: 'TV-14',
      country: 'Estados Unidos',
      studio: 'Warner Bros. Television',
      releaseDate: '1994-09-22',
      createdAt: '2024-02-10T16:00:00Z',
      updatedAt: '2024-02-10T16:00:00Z'
    },
    {
      id: '7',
      title: 'El Padrino',
      originalTitle: 'The Godfather',
      description: 'La historia de la familia Corleone, una de las cinco familias criminales más poderosas de Nueva York.',
      type: 'pelicula',
      genre: 'drama',
      year: 1972,
      duration: 175,
      rating: 9.2,
      director: 'Francis Ford Coppola',
      cast: ['Marlon Brando', 'Al Pacino', 'James Caan'],
      language: 'Inglés',
      subtitles: ['Español', 'Inglés'],
      status: 'visto',
      isFavorite: true,
      isWatched: true,
      watchDate: '2024-01-25',
      watchCount: 1,
      image: 'https://images.unsplash.com/photo-1560109947-543149eceb16?w=400&h=600&fit=crop',
      watchLink: 'https://www.paramountplus.com/movies/the-godfather/',
      tags: ['Favorito', 'Clásico', 'Culto'],
      mood: 'tenso',
      awards: ['Oscar a Mejor Película', 'Oscar a Mejor Actor', 'Oscar a Mejor Guión Adaptado'],
      imdbRating: 9.2,
      rottenTomatoes: 97,
      ageRating: 'R',
      country: 'Estados Unidos',
      studio: 'Paramount Pictures',
      releaseDate: '1972-03-24',
      createdAt: '2024-01-25T20:30:00Z',
      updatedAt: '2024-01-25T20:30:00Z'
    },
    {
      id: '8',
      title: 'Breaking Bad',
      originalTitle: 'Breaking Bad',
      description: 'Un profesor de química de secundaria recurre a una vida de crimen, produciendo y vendiendo metanfetaminas.',
      type: 'serie',
      genre: 'drama',
      year: 2008,
      duration: 47,
      rating: 9.5,
      director: 'Vince Gilligan',
      cast: ['Bryan Cranston', 'Aaron Paul', 'Anna Gunn'],
      language: 'Inglés',
      subtitles: ['Español', 'Inglés'],
      status: 'viendo',
      isFavorite: true,
      isWatched: false,
      watchCount: 0,
      season: 3,
      episode: 13,
      totalSeasons: 5,
      totalEpisodes: 62,
      episodeDuration: 47,
      image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop',
      watchLink: 'https://www.netflix.com/title/70143836',
      tags: ['Favorito', 'Culto', 'Thriller Psicológico'],
      mood: 'tenso',
      imdbRating: 9.5,
      rottenTomatoes: 96,
      ageRating: 'TV-MA',
      country: 'Estados Unidos',
      studio: 'AMC',
      releaseDate: '2008-01-20',
      createdAt: '2024-02-15T11:00:00Z',
      updatedAt: '2024-02-15T11:00:00Z'
    },
    {
      id: '9',
      title: 'Titanic',
      originalTitle: 'Titanic',
      description: 'Una historia de amor entre dos jóvenes de diferentes clases sociales a bordo del famoso barco.',
      type: 'pelicula',
      genre: 'romantico',
      year: 1997,
      duration: 194,
      rating: 7.9,
      director: 'James Cameron',
      cast: ['Leonardo DiCaprio', 'Kate Winslet', 'Billy Zane'],
      language: 'Inglés',
      subtitles: ['Español', 'Inglés'],
      status: 'visto',
      isFavorite: false,
      isWatched: true,
      watchDate: '2024-02-14',
      watchCount: 1,
      image: 'https://images.unsplash.com/photo-1542206395-9feb3edaa68d?w=400&h=600&fit=crop',
      watchLink: 'https://www.disneyplus.com/movies/titanic/1HqwiFnkVctS',
      tags: ['Clásico', 'Romántico', 'Drama Familiar'],
      mood: 'triste',
      awards: ['Oscar a Mejor Película', 'Oscar a Mejor Director', 'Oscar a Mejor Canción Original'],
      imdbRating: 7.9,
      rottenTomatoes: 89,
      ageRating: 'PG-13',
      country: 'Estados Unidos',
      studio: 'Paramount Pictures',
      releaseDate: '1997-12-19',
      createdAt: '2024-02-14T18:00:00Z',
      updatedAt: '2024-02-14T18:00:00Z'
    },
    {
      id: '10',
      title: 'The Office',
      originalTitle: 'The Office',
      description: 'Un documental falso sobre la vida cotidiana de los empleados de una empresa de papel.',
      type: 'serie',
      genre: 'comedia',
      year: 2005,
      duration: 22,
      rating: 8.9,
      director: 'Greg Daniels',
      cast: ['Steve Carell', 'Rainn Wilson', 'John Krasinski'],
      language: 'Inglés',
      subtitles: ['Español', 'Inglés'],
      status: 'pendiente',
      isFavorite: false,
      isWatched: false,
      watchCount: 0,
      season: 1,
      episode: 1,
      totalSeasons: 9,
      totalEpisodes: 201,
      episodeDuration: 22,
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=600&fit=crop',
      watchLink: 'https://www.peacocktv.com/stream-tv/the-office',
      tags: ['Comedia', 'Culto', 'Netflix Original'],
      mood: 'divertido',
      imdbRating: 8.9,
      rottenTomatoes: 81,
      ageRating: 'TV-14',
      country: 'Estados Unidos',
      studio: 'NBC',
      releaseDate: '2005-03-24',
      createdAt: '2024-02-20T09:30:00Z',
      updatedAt: '2024-02-20T09:30:00Z'
    }
  ])



  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('Todos')
  const [selectedStatus, setSelectedStatus] = useState('Todos')

  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'carousel'>('carousel')
  const [currentCarousel, setCurrentCarousel] = useState(0)

  const [movieForm, setMovieForm] = useState({
    title: '',
    originalTitle: '',
    description: '',
    type: 'pelicula' as Movie['type'],
    genre: 'romantico' as Movie['genre'],
    year: new Date().getFullYear(),
    duration: 120,
    rating: 7,
    director: '',
    cast: [] as string[],
    language: 'Español',
    subtitles: [] as string[],

    status: 'pendiente' as Movie['status'],
    notes: '',
    image: '',
    watchLink: '',
    tags: [] as string[],
    mood: 'romantico' as Movie['mood'],
    season: undefined as number | undefined,
    episode: undefined as number | undefined,
    totalSeasons: undefined as number | undefined,
    totalEpisodes: undefined as number | undefined,
    episodeDuration: undefined as number | undefined,
    awards: [] as string[],
    budget: undefined as number | undefined,
    boxOffice: undefined as number | undefined,
    imdbRating: undefined as number | undefined,
    rottenTomatoes: undefined as number | undefined,
    ageRating: undefined as Movie['ageRating'],
    country: '',
    studio: '',
    releaseDate: ''
  })

  // Estadísticas
  const stats = {
    totalMovies: movies.length,
    totalWatched: movies.filter(m => m.isWatched).length,
    totalFavorites: movies.filter(m => m.isFavorite).length,
    totalWatchTime: movies.filter(m => m.isWatched).reduce((sum, m) => sum + m.duration, 0),
    mostWatchedGenre: getMostWatchedGenre(),
    currentWatching: movies.filter(m => m.status === 'viendo').length
  }

  function getMostWatchedGenre() {
    const genreCounts = movies.filter(m => m.isWatched).reduce((acc, movie) => {
      acc[movie.genre] = (acc[movie.genre] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    return Object.entries(genreCounts).reduce((a, b) => genreCounts[a[0]] > genreCounts[b[0]] ? a : b)[0]
  }

  // Filtrar películas
  const filteredMovies = movies.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movie.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movie.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesGenre = selectedGenre === 'Todos' || movie.genre === selectedGenre.toLowerCase()
    const matchesStatus = selectedStatus === 'Todos' || movie.status === selectedStatus.toLowerCase()
    return matchesSearch && matchesGenre && matchesStatus
  })

  // Agrupar por categorías para carruseles
  const watchedMovies = filteredMovies.filter(m => m.isWatched)
  const watchingMovies = filteredMovies.filter(m => m.status === 'viendo')
  const pendingMovies = filteredMovies.filter(m => m.status === 'pendiente')
  const favoriteMovies = filteredMovies.filter(m => m.isFavorite)

  const openAddModal = () => {
    setMovieForm({
      title: '',
      originalTitle: '',
      description: '',
      type: 'pelicula',
      genre: 'romantico',
      year: new Date().getFullYear(),
      duration: 120,
      rating: 7,
      director: '',
      cast: [],
      language: 'Español',
      subtitles: [],
      status: 'pendiente',
      notes: '',
      image: '',
      watchLink: '',
      tags: [],
      mood: 'romantico',
      season: undefined,
      episode: undefined,
      totalSeasons: undefined,
      totalEpisodes: undefined,
      episodeDuration: undefined,
      awards: [],
      budget: undefined,
      boxOffice: undefined,
      imdbRating: undefined,
      rottenTomatoes: undefined,
      ageRating: undefined,
      country: '',
      studio: '',
      releaseDate: ''
    })
    setShowAddModal(true)
  }

  const openViewModal = (movie: Movie) => {
    setSelectedMovie(movie)
    setShowViewModal(true)
  }

  const openEditModal = (movie: Movie) => {
    setSelectedMovie(movie)
    setMovieForm({
      title: movie.title,
      originalTitle: movie.originalTitle || '',
      description: movie.description,
      type: movie.type,
      genre: movie.genre,
      year: movie.year,
      duration: movie.duration,
      rating: movie.rating,
      director: movie.director || '',
      cast: movie.cast || [],
      language: movie.language,
      subtitles: movie.subtitles || [],
  
      status: movie.status,
      notes: movie.notes || '',
      image: movie.image || '',
      watchLink: movie.watchLink || '',
      tags: [...movie.tags],
      mood: movie.mood,
      season: movie.season,
      episode: movie.episode,
      totalSeasons: movie.totalSeasons,
      totalEpisodes: movie.totalEpisodes,
      episodeDuration: movie.episodeDuration,
      awards: movie.awards || [],
      budget: movie.budget,
      boxOffice: movie.boxOffice,
      imdbRating: movie.imdbRating,
      rottenTomatoes: movie.rottenTomatoes,
      ageRating: movie.ageRating,
      country: movie.country || '',
      studio: movie.studio || '',
      releaseDate: movie.releaseDate || ''
    })
    setShowEditModal(true)
  }

  const openDeleteModal = (movie: Movie) => {
    setSelectedMovie(movie)
    setShowDeleteModal(true)
  }



  const handleSaveMovie = () => {
    if (!movieForm.title || !movieForm.description) return

    const now = new Date().toISOString()

    if (showEditModal && selectedMovie) {
      setMovies(prev => prev.map(m => 
        m.id === selectedMovie.id 
          ? { ...m, ...movieForm, updatedAt: now }
          : m
      ))
      setShowEditModal(false)
    } else {
      const newMovie: Movie = {
        id: Date.now().toString(),
        title: movieForm.title,
        originalTitle: movieForm.originalTitle,
        description: movieForm.description,
        type: movieForm.type,
        genre: movieForm.genre,
        year: movieForm.year,
        duration: movieForm.duration,
        rating: movieForm.rating,
        director: movieForm.director,
        cast: movieForm.cast,
        language: movieForm.language,
        subtitles: movieForm.subtitles,
    
        status: movieForm.status,
        isFavorite: false,
        isWatched: movieForm.status === 'visto',
        watchCount: movieForm.status === 'visto' ? 1 : 0,
        notes: movieForm.notes,
        image: movieForm.image,
        watchLink: movieForm.watchLink,
        tags: movieForm.tags,
        mood: movieForm.mood,
        season: movieForm.season,
        episode: movieForm.episode,
        totalSeasons: movieForm.totalSeasons,
        totalEpisodes: movieForm.totalEpisodes,
        episodeDuration: movieForm.episodeDuration,
        awards: movieForm.awards,
        budget: movieForm.budget,
        boxOffice: movieForm.boxOffice,
        imdbRating: movieForm.imdbRating,
        rottenTomatoes: movieForm.rottenTomatoes,
        ageRating: movieForm.ageRating,
        country: movieForm.country,
        studio: movieForm.studio,
        releaseDate: movieForm.releaseDate,
        createdAt: now,
        updatedAt: now
      }
      setMovies(prev => [newMovie, ...prev])
      setShowAddModal(false)
    }
  }

  const handleDeleteMovie = () => {
    if (selectedMovie) {
      setMovies(prev => prev.filter(m => m.id !== selectedMovie.id))
      setShowDeleteModal(false)
      setSelectedMovie(null)
    }
  }

  const toggleFavorite = (movieId: string) => {
    setMovies(prev => prev.map(m => 
      m.id === movieId ? { ...m, isFavorite: !m.isFavorite } : m
    ))
  }

  const toggleWatched = (movieId: string) => {
    setMovies(prev => prev.map(m => 
      m.id === movieId ? { 
        ...m, 
        isWatched: !m.isWatched,
        watchCount: m.isWatched ? m.watchCount - 1 : m.watchCount + 1,
        watchDate: !m.isWatched ? new Date().toISOString().split('T')[0] : undefined
      } : m
    ))
  }

  const handleTagToggle = (tag: string) => {
    setMovieForm(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }))
  }



  // Funciones para manejar episodios y continuaciones
  const markEpisodeAsWatched = (movieId: string, episodeNumber: number) => {
    setMovies(prev => prev.map(m => {
      if (m.id === movieId && m.type === 'serie') {
        const watchedEpisodes = m.watchedEpisodes || []
        const newWatchedEpisodes = watchedEpisodes.includes(episodeNumber) 
          ? watchedEpisodes.filter(ep => ep !== episodeNumber)
          : [...watchedEpisodes, episodeNumber].sort((a, b) => a - b)
        
        return {
          ...m,
          watchedEpisodes: newWatchedEpisodes,
          episode: newWatchedEpisodes.length > 0 ? Math.max(...newWatchedEpisodes) + 1 : 1
        }
      }
      return m
    }))
  }

  const markSeasonAsWatched = (movieId: string, seasonNumber: number) => {
    setMovies(prev => prev.map(m => {
      if (m.id === movieId && m.type === 'serie') {
        const watchedSeasons = m.watchedSeasons || []
        const newWatchedSeasons = watchedSeasons.includes(seasonNumber)
          ? watchedSeasons.filter(s => s !== seasonNumber)
          : [...watchedSeasons, seasonNumber].sort((a, b) => a - b)
        
        return {
          ...m,
          watchedSeasons: newWatchedSeasons,
          season: newWatchedSeasons.length > 0 ? Math.max(...newWatchedSeasons) + 1 : 1,
          episode: 1
        }
      }
      return m
    }))
  }

  const markMoviePartAsWatched = (movieId: string, partNumber: number) => {
    setMovies(prev => prev.map(m => {
      if (m.id === movieId && m.type === 'pelicula' && m.isPartOfSeries) {
        const watchedParts = m.watchedParts || []
        const newWatchedParts = watchedParts.includes(partNumber)
          ? watchedParts.filter(p => p !== partNumber)
          : [...watchedParts, partNumber].sort((a, b) => a - b)
        
        return {
          ...m,
          watchedParts: newWatchedParts
        }
      }
      return m
    }))
  }

  const getProgressPercentage = (movie: Movie) => {
    if (movie.type === 'serie' && movie.totalEpisodes && movie.watchedEpisodes) {
      return (movie.watchedEpisodes.length / movie.totalEpisodes) * 100
    }
    if (movie.type === 'pelicula' && movie.isPartOfSeries && movie.totalParts && movie.watchedParts) {
      return (movie.watchedParts.length / movie.totalParts) * 100
    }
    return 0
  }

  const getGenreIcon = (genre: string) => {
    return genres.find(g => g.value === genre)?.icon || '🎬'
  }

  const getGenreColor = (genre: string) => {
    return genres.find(g => g.value === genre)?.color || 'bg-gray-100 text-gray-800'
  }



  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const MovieCard = ({ movie, variant = 'default' }: { movie: Movie, variant?: 'default' | 'featured' | 'compact' }) => (
    <div 
      className="relative group cursor-pointer"
      onClick={() => openViewModal(movie)}
    >
      <Card className={`movie-card overflow-hidden ${
        variant === 'featured' ? 'h-96' : variant === 'compact' ? 'h-64' : 'h-80'
      } ${movie.isFavorite ? 'ring-2 ring-primary' : ''} hover:shadow-lg transition-all duration-300`}>
        <CardContent className="p-0 h-full">
          {/* Main Container */}
          <div className="movie-card-content relative h-full">
            {/* Background Image */}
            {movie.image && (
              <div className="absolute inset-0">
                <img 
                  src={movie.image} 
                  alt={movie.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              </div>
            )}
            
            {/* Top Section - Status and Actions */}
            <div className="absolute top-0 left-0 right-0 p-3 flex items-start justify-between z-20">
              {/* Status Badges */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Type */}
                <Badge variant="secondary" className="text-xs">
                  {movie.type === 'pelicula' ? '🎬 Película' : 
                   movie.type === 'serie' ? '📺 Serie' : 
                   movie.type === 'documental' ? '📚 Documental' : 
                   movie.type === 'anime' ? '🎌 Anime' :
                   movie.type === 'corto' ? '⏱️ Corto' : '📺 Miniserie'}
                </Badge>
                
                {/* Status */}
                <Badge className={`text-xs ${
                  movie.status === 'visto' ? 'bg-green-100 text-green-800 border-green-200' :
                  movie.status === 'viendo' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                  movie.status === 'pendiente' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : 'bg-red-100 text-red-800 border-red-200'
                }`}>
                  {movie.status === 'visto' ? '✅ Visto' :
                   movie.status === 'viendo' ? '▶️ Viendo' :
                   movie.status === 'pendiente' ? '⏳ Pendiente' : '❌ Abandonado'}
                </Badge>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-1">
                {/* Favorite */}
                  <Button 
                    size="sm" 
                    variant="ghost" 
                  className="h-8 w-8 p-0 text-white rounded-full hover:bg-white/20"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleFavorite(movie.id)
                  }}
                >
                  <Heart className={`h-4 w-4 ${movie.isFavorite ? 'fill-current text-primary' : ''}`} />
                  </Button>
                
                {/* Watched */}
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-8 w-8 p-0 text-white rounded-full hover:bg-white/20"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleWatched(movie.id)
                  }}
                >
                  {movie.isWatched ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Center Section - Progress */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="text-center">
                {/* Series Progress */}
                {movie.type === 'serie' && movie.season && movie.episode && (
                  <div className="text-white text-sm px-4 py-2 rounded-full bg-black/60 backdrop-blur-sm">
                    <div className="font-bold">S{movie.season} E{movie.episode}</div>
                    {movie.totalSeasons && (
                      <div className="text-xs text-gray-300">{movie.totalSeasons} temporadas</div>
                )}
              </div>
                )}
                
                {/* Movie Series Progress */}
                {movie.type === 'pelicula' && movie.isPartOfSeries && movie.partNumber && (
                  <div className="text-white text-sm px-4 py-2 rounded-full bg-black/60 backdrop-blur-sm">
                    <div className="font-bold">Parte {movie.partNumber}</div>
                    {movie.totalParts && (
                      <div className="text-xs text-gray-300">de {movie.totalParts} películas</div>
                    )}
                    </div>
                  )}
                </div>
              </div>

            {/* Bottom Section - Content Info */}
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-20">
              {/* Title and Year */}
              <div className="mb-2">
                <h3 className={`movie-title ${variant === 'featured' ? 'text-xl' : 'text-lg'} font-bold line-clamp-2 mb-1`}>
                  {movie.title}
                </h3>
                {movie.originalTitle && movie.originalTitle !== movie.title && (
                  <p className="movie-original-title text-sm text-gray-300 line-clamp-1 italic">{movie.originalTitle}</p>
                    )}
                  </div>
              
              {/* Meta Info */}
              <div className="flex items-center gap-2 text-xs text-gray-300 mb-2">
                <span className="px-2 py-1 rounded-full bg-white/20">{movie.year}</span>
                <span className="px-2 py-1 rounded-full bg-white/20">{formatDuration(movie.duration)}</span>
                <Badge className={`text-xs ${getGenreColor(movie.genre)}`}>
                  {getGenreIcon(movie.genre)} {genres.find(g => g.value === movie.genre)?.label}
                </Badge>
                </div>

              {/* Description */}
              <p className="movie-description text-sm text-gray-300 line-clamp-2 mb-3 leading-relaxed">
                  {movie.description}
                </p>

              {/* Action Bar */}
              <div className="flex items-center justify-between">
                {/* Left Actions */}
                <div className="flex items-center gap-2">
                {movie.watchLink && (
                  <Button 
                    size="sm" 
                      className="bg-primary hover:bg-primary/90 text-white"
                    onClick={(e) => {
                      e.stopPropagation()
                      window.open(movie.watchLink, '_blank')
                    }}
                  >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Ver
                  </Button>
                )}
                </div>
                
                {/* Right Actions */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                      className="h-8 w-8 p-0 text-white rounded-full hover:bg-white/20"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="h-4 w-4" />
                  </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => openEditModal(movie)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => openDeleteModal(movie)}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* View indicator */}
            <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
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
                <p className="text-sm text-primary font-medium">Vistas</p>
                <p className="text-2xl font-bold text-primary">{stats.totalWatched}</p>
                <p className="text-xs text-muted-foreground">Horas de entretenimiento</p>
              </div>
              <Eye className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-primary font-medium">Favoritas</p>
                <p className="text-2xl font-bold text-primary">{stats.totalFavorites}</p>
                <p className="text-xs text-muted-foreground">Contenido especial</p>
              </div>
              <Heart className="h-8 w-8 text-primary" />
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
                  placeholder="Buscar películas, series, actores..."
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

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todos">Todos los estados</SelectItem>
                  <SelectItem value="visto">Visto</SelectItem>
                  <SelectItem value="viendo">Viendo</SelectItem>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="abandonado">Abandonado</SelectItem>
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
      <Tabs defaultValue="discover" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="discover">
            <Sparkles className="h-4 w-4 mr-2" />
            Descubrir
          </TabsTrigger>
          <TabsTrigger value="watching">
            <Play className="h-4 w-4 mr-2" />
            Viendo
          </TabsTrigger>
          <TabsTrigger value="favorites">
            <Heart className="h-4 w-4 mr-2" />
            Favoritas
          </TabsTrigger>
          <TabsTrigger value="watched">
            <Eye className="h-4 w-4 mr-2" />
            Vistas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="discover" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} variant="default" />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="watching" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {watchingMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} variant="default" />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="favorites" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoriteMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} variant="default" />
            ))}
      </div>
        </TabsContent>

        <TabsContent value="watched" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {watchedMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} variant="default" />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal para Agregar/Editar Película */}
      <Dialog open={showAddModal || showEditModal} onOpenChange={() => {
        setShowAddModal(false)
        setShowEditModal(false)
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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
                  Título Original
                </label>
                <Input
                  value={movieForm.originalTitle}
                  onChange={(e) => setMovieForm(prev => ({ ...prev, originalTitle: e.target.value }))}
                  placeholder="Ej: La La Land"
                />
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

            {/* Tipo y género */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo
                </label>
                <Select value={movieForm.type} onValueChange={(value: Movie['type']) => setMovieForm(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pelicula">Película</SelectItem>
                    <SelectItem value="serie">Serie</SelectItem>
                    <SelectItem value="documental">Documental</SelectItem>
                    <SelectItem value="anime">Anime</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Género
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
                  Estado
                </label>
                <Select value={movieForm.status} onValueChange={(value: Movie['status']) => setMovieForm(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendiente">Pendiente</SelectItem>
                    <SelectItem value="viendo">Viendo</SelectItem>
                    <SelectItem value="visto">Visto</SelectItem>
                    <SelectItem value="abandonado">Abandonado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Detalles técnicos */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Año
                </label>
                <Input
                  type="number"
                  value={movieForm.year}
                  onChange={(e) => setMovieForm(prev => ({ ...prev, year: parseInt(e.target.value) || new Date().getFullYear() }))}
                  min="1900"
                  max={new Date().getFullYear() + 1}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duración (min)
                </label>
                <Input
                  type="number"
                  value={movieForm.duration}
                  onChange={(e) => setMovieForm(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Calificación (1-10)
                </label>
                <Input
                  type="number"
                  value={movieForm.rating}
                  onChange={(e) => setMovieForm(prev => ({ ...prev, rating: Math.min(10, Math.max(1, parseInt(e.target.value) || 7)) }))}
                  min="1"
                  max="10"
                />
              </div>


            </div>

            {/* Información adicional */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Director
                </label>
                <Input
                  value={movieForm.director}
                  onChange={(e) => setMovieForm(prev => ({ ...prev, director: e.target.value }))}
                  placeholder="Ej: Christopher Nolan"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Idioma
                </label>
                <Input
                  value={movieForm.language}
                  onChange={(e) => setMovieForm(prev => ({ ...prev, language: e.target.value }))}
                  placeholder="Ej: Inglés"
                />
              </div>
            </div>

            {/* Imagen y Link */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <ImageIcon className="inline h-4 w-4 mr-1" />
                  URL de la Imagen
                </label>
                <Input
                  value={movieForm.image}
                  onChange={(e) => setMovieForm(prev => ({ ...prev, image: e.target.value }))}
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
                <p className="text-xs text-gray-500 mt-1">
                  URL de la imagen o poster de la película/serie
                </p>
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

            {/* Información de series */}
            {movieForm.type === 'serie' && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Temporada Actual
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
                    Episodio Actual
                  </label>
                  <Input
                    type="number"
                    value={movieForm.episode || ''}
                    onChange={(e) => setMovieForm(prev => ({ ...prev, episode: parseInt(e.target.value) || undefined }))}
                    min="1"
                    placeholder="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Temporadas
                  </label>
                  <Input
                    type="number"
                    value={movieForm.totalSeasons || ''}
                    onChange={(e) => setMovieForm(prev => ({ ...prev, totalSeasons: parseInt(e.target.value) || undefined }))}
                    min="1"
                    placeholder="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Episodios
                  </label>
                  <Input
                    type="number"
                    value={movieForm.totalEpisodes || ''}
                    onChange={(e) => setMovieForm(prev => ({ ...prev, totalEpisodes: parseInt(e.target.value) || undefined }))}
                    min="1"
                    placeholder="10"
                  />
                </div>
              </div>
            )}

            {/* Mood y tags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado de ánimo
                </label>
                <Select value={movieForm.mood} onValueChange={(value: Movie['mood']) => setMovieForm(prev => ({ ...prev, mood: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {moods.map(mood => (
                      <SelectItem key={mood.value} value={mood.value}>
                        {mood.icon} {mood.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Etiquetas
                </label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {predefinedTags.map(tag => (
                    <Badge
                      key={tag}
                      variant={movieForm.tags.includes(tag) ? "default" : "outline"}
                      className={`cursor-pointer ${movieForm.tags.includes(tag) ? 'bg-purple-100 text-purple-800 border-purple-200' : ''}`}
                      onClick={() => handleTagToggle(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notas (Opcional)
              </label>
              <textarea
                value={movieForm.notes}
                onChange={(e) => setMovieForm(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Comparte tus pensamientos sobre esta película o serie..."
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-md resize-none focus:border-purple-500 focus:ring-purple-500"
              />
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
              disabled={!movieForm.title || !movieForm.description}
              className="bg-purple-500 hover:bg-purple-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Visualización de Película/Serie */}
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
                  {/* Título y año */}
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-1">
                      {selectedMovie.title}
                    </h2>
                    {selectedMovie.originalTitle && selectedMovie.originalTitle !== selectedMovie.title && (
                      <p className="text-muted-foreground italic">
                        {selectedMovie.originalTitle}
                      </p>
                    )}
                    <p className="text-lg text-muted-foreground">
                      {selectedMovie.year} • {formatDuration(selectedMovie.duration)}
                    </p>
                  </div>

                  {/* Rating y estado */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 fill-current text-yellow-400" />
                      <span className="font-bold text-lg">{selectedMovie.rating}/10</span>
                  </div>
                    <Badge className={`${
                      selectedMovie.status === 'visto' ? 'bg-green-100 text-green-800 border-green-200' :
                      selectedMovie.status === 'viendo' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                      selectedMovie.status === 'pendiente' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : 'bg-red-100 text-red-800 border-red-200'
                    }`}>
                      {selectedMovie.status === 'visto' ? '✅ Visto' :
                       selectedMovie.status === 'viendo' ? '▶️ Viendo' :
                       selectedMovie.status === 'pendiente' ? '⏳ Pendiente' : '❌ Abandonado'}
                    </Badge>
                    {selectedMovie.isFavorite && (
                      <Badge className="bg-pink-100 text-pink-800 border-pink-200">
                        <Heart className="h-3 w-3 mr-1 fill-current" />
                        Favorita
                      </Badge>
                    )}
                  </div>

                  {/* Género y tipo */}
                  <div className="flex items-center gap-2">
                    <Badge className={getGenreColor(selectedMovie.genre)}>
                      {getGenreIcon(selectedMovie.genre)} {genres.find(g => g.value === selectedMovie.genre)?.label}
                    </Badge>
                    <Badge variant="secondary">
                      {selectedMovie.type === 'pelicula' ? '🎬 Película' : 
                       selectedMovie.type === 'serie' ? '📺 Serie' : 
                       selectedMovie.type === 'documental' ? '📚 Documental' : 
                       selectedMovie.type === 'anime' ? '🎌 Anime' :
                       selectedMovie.type === 'corto' ? '⏱️ Corto' : '📺 Miniserie'}
                    </Badge>
                  </div>



                  {/* Descripción */}
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Sinopsis</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {selectedMovie.description}
                    </p>
                  </div>
                  </div>
                </div>

              <Separator />

              {/* Información técnica */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Información de producción */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <Camera className="h-4 w-4" />
                    Información de Producción
                  </h3>
                  
                  <div className="space-y-3">
                    {selectedMovie.director && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Director:</span>
                        <span className="text-sm font-medium">{selectedMovie.director}</span>
                        </div>
                      )}
                      
                    {selectedMovie.cast && selectedMovie.cast.length > 0 && (
                      <div>
                        <span className="text-sm text-muted-foreground">Reparto:</span>
                        <p className="text-sm font-medium mt-1">{selectedMovie.cast.join(', ')}</p>
                        </div>
                    )}
                    
                    {selectedMovie.studio && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Estudio:</span>
                        <span className="text-sm font-medium">{selectedMovie.studio}</span>
                      </div>
                    )}
                    
                    {selectedMovie.country && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">País:</span>
                        <span className="text-sm font-medium">{selectedMovie.country}</span>
                    </div>
                    )}
                    
                    {selectedMovie.releaseDate && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Fecha de estreno:</span>
                        <span className="text-sm font-medium">{new Date(selectedMovie.releaseDate).toLocaleDateString()}</span>
                      </div>
                    )}
                      </div>
                </div>

                {/* Información técnica */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Información Técnica
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Idioma:</span>
                      <span className="text-sm font-medium">{selectedMovie.language}</span>
                    </div>
                    
                    {selectedMovie.subtitles && selectedMovie.subtitles.length > 0 && (
                      <div>
                        <span className="text-sm text-muted-foreground">Subtítulos:</span>
                        <p className="text-sm font-medium mt-1">{selectedMovie.subtitles.join(', ')}</p>
                        </div>
                      )}
                    
                    {selectedMovie.ageRating && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Clasificación:</span>
                        <span className="text-sm font-medium">{selectedMovie.ageRating}</span>
                    </div>
                    )}
                    
                    {selectedMovie.budget && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Presupuesto:</span>
                        <span className="text-sm font-medium">${selectedMovie.budget}M</span>
                      </div>
                    )}
                    
                    {selectedMovie.boxOffice && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Taquilla:</span>
                        <span className="text-sm font-medium">${selectedMovie.boxOffice}M</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Información de series */}
              {selectedMovie.type === 'serie' && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                      <Tv className="h-4 w-4" />
                      Progreso de la Serie
                    </h3>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {selectedMovie.season && (
                        <div className="text-center p-3 bg-primary/5 rounded-lg">
                          <div className="text-2xl font-bold text-primary">{selectedMovie.season}</div>
                          <div className="text-sm text-muted-foreground">Temporada Actual</div>
                        </div>
                      )}
                      
                      {selectedMovie.episode && (
                        <div className="text-center p-3 bg-primary/5 rounded-lg">
                          <div className="text-2xl font-bold text-primary">{selectedMovie.episode}</div>
                          <div className="text-sm text-muted-foreground">Episodio Actual</div>
                        </div>
                      )}
                      
                      {selectedMovie.totalSeasons && (
                        <div className="text-center p-3 bg-primary/5 rounded-lg">
                          <div className="text-2xl font-bold text-primary">{selectedMovie.totalSeasons}</div>
                          <div className="text-sm text-muted-foreground">Total Temporadas</div>
                        </div>
                      )}
                      
                      {selectedMovie.totalEpisodes && (
                        <div className="text-center p-3 bg-primary/5 rounded-lg">
                          <div className="text-2xl font-bold text-primary">{selectedMovie.totalEpisodes}</div>
                          <div className="text-sm text-muted-foreground">Total Episodios</div>
                        </div>
                      )}
                    </div>

                    {/* Barra de progreso */}
                    {selectedMovie.totalEpisodes && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Progreso general</span>
                          <span className="font-medium">{Math.round(getProgressPercentage(selectedMovie))}%</span>
                        </div>
                        <Progress value={getProgressPercentage(selectedMovie)} className="h-2" />
                      </div>
                    )}

                    {/* Temporadas */}
                    {selectedMovie.totalSeasons && (
                    <div className="space-y-3">
                        <h4 className="font-medium text-foreground">Temporadas</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                          {Array.from({ length: selectedMovie.totalSeasons }, (_, i) => i + 1).map(seasonNum => (
                        <Button 
                              key={seasonNum}
                              variant={selectedMovie.watchedSeasons?.includes(seasonNum) ? "default" : "outline"}
                              size="sm"
                              onClick={() => markSeasonAsWatched(selectedMovie.id, seasonNum)}
                              className="justify-start"
                            >
                              <Check className={`h-3 w-3 mr-2 ${selectedMovie.watchedSeasons?.includes(seasonNum) ? 'opacity-100' : 'opacity-0'}`} />
                              Temporada {seasonNum}
                        </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Episodios de la temporada actual */}
                    {selectedMovie.season && selectedMovie.totalEpisodes && (
                      <div className="space-y-3">
                        <h4 className="font-medium text-foreground">Episodios - Temporada {selectedMovie.season}</h4>
                        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-1">
                          {Array.from({ length: Math.min(20, selectedMovie.totalEpisodes) }, (_, i) => i + 1).map(episodeNum => (
                        <Button 
                              key={episodeNum}
                              variant={selectedMovie.watchedEpisodes?.includes(episodeNum) ? "default" : "outline"}
                              size="sm"
                              onClick={() => markEpisodeAsWatched(selectedMovie.id, episodeNum)}
                              className="h-8 w-8 p-0"
                            >
                              {episodeNum}
                        </Button>
                          ))}
                      </div>
                    </div>
                    )}
                  </div>
                </>
              )}

              {/* Información de continuaciones de películas */}
              {selectedMovie.type === 'pelicula' && selectedMovie.isPartOfSeries && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                      <Film className="h-4 w-4" />
                      Saga: {selectedMovie.seriesName}
                    </h3>
                    
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {selectedMovie.partNumber && (
                        <div className="text-center p-3 bg-primary/5 rounded-lg">
                          <div className="text-2xl font-bold text-primary">{selectedMovie.partNumber}</div>
                          <div className="text-sm text-muted-foreground">Parte Actual</div>
                            </div>
                          )}
                      
                      {selectedMovie.totalParts && (
                        <div className="text-center p-3 bg-primary/5 rounded-lg">
                          <div className="text-2xl font-bold text-primary">{selectedMovie.totalParts}</div>
                          <div className="text-sm text-muted-foreground">Total Partes</div>
                            </div>
                          )}
                    </div>

                    {/* Partes de la saga */}
                    {selectedMovie.totalParts && (
                      <div className="space-y-3">
                        <h4 className="font-medium text-foreground">Partes de la Saga</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                          {Array.from({ length: selectedMovie.totalParts }, (_, i) => i + 1).map(partNum => (
                            <Button
                              key={partNum}
                              variant={selectedMovie.watchedParts?.includes(partNum) ? "default" : "outline"}
                              size="sm"
                              onClick={() => markMoviePartAsWatched(selectedMovie.id, partNum)}
                              className="justify-start"
                            >
                              <Check className={`h-3 w-3 mr-2 ${selectedMovie.watchedParts?.includes(partNum) ? 'opacity-100' : 'opacity-0'}`} />
                              Parte {partNum}
                            </Button>
                          ))}
                        </div>
                            </div>
                          )}
                            </div>
                </>
              )}

              {/* Ratings externos */}
              {(selectedMovie.imdbRating || selectedMovie.rottenTomatoes) && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      Calificaciones Externas
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedMovie.imdbRating && (
                        <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-yellow-600">IMDB</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-current text-yellow-400" />
                            <span className="font-bold">{selectedMovie.imdbRating}/10</span>
                        </div>
                      </div>
                    )}

                      {selectedMovie.rottenTomatoes && (
                        <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-red-600">Rotten Tomatoes</span>
                          </div>
                          <span className="font-bold">{selectedMovie.rottenTomatoes}%</span>
                            </div>
                          )}
                            </div>
                  </div>
                </>
              )}

              {/* Premios */}
              {selectedMovie.awards && selectedMovie.awards.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      Premios
                    </h3>
                    
                    <div className="flex flex-wrap gap-2">
                      {selectedMovie.awards.map((award, index) => (
                        <Badge key={index} variant="outline" className="bg-yellow-50 border-yellow-200 text-yellow-800">
                          🏆 {award}
                        </Badge>
                      ))}
                        </div>
                      </div>
                </>
              )}

              {/* Etiquetas */}
              {selectedMovie.tags && selectedMovie.tags.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                      <Hash className="h-4 w-4" />
                      Etiquetas
                    </h3>
                    
                        <div className="flex flex-wrap gap-2">
                      {selectedMovie.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                              {tag}
                        </Badge>
                          ))}
                        </div>
                      </div>
                </>
              )}

              {/* Notas */}
              {selectedMovie.notes && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                      <MessageCircle className="h-4 w-4" />
                      Notas Personales
                    </h3>
                    
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-muted-foreground leading-relaxed">
                        {selectedMovie.notes}
                      </p>
                      </div>
                  </div>
                </>
              )}

              {/* Acciones */}
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {selectedMovie.watchLink && (
                    <Button 
                      className="bg-primary hover:bg-primary/90"
                      onClick={() => window.open(selectedMovie.watchLink, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
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
              className="bg-red-500 hover:bg-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}


