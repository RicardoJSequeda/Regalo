'use client'

import React, { useState, useEffect } from 'react'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog'

import { Skeleton } from '@/components/ui/skeleton'
import { AspectRatio } from '@/components/ui/aspect-ratio'

import { Photo } from '@/types'
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Download, 
  Calendar, 
  Tag,
  Image as ImageIcon,
  Video,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { useLocalStorage } from '@/hooks/useLocalStorage'

// Predefined tag options
const predefinedTags = [
  'romántico', 'especial', 'cita', 'viaje', 'playa', 'montaña', 'restaurante', 
  'cena', 'desayuno', 'naturaleza', 'ciudad', 'familia', 'amigos', 'mascota',
  'deportes', 'música', 'arte', 'cultura', 'historia', 'aventura', 'relax',
  'celebración', 'aniversario', 'cumpleaños', 'navidad', 'halloween', 'verano',
  'invierno', 'primavera', 'otoño', 'noche', 'amanecer', 'atardecer', 'lluvia',
  'nieve', 'sol', 'luna', 'estrellas', 'flores', 'árboles', 'mar', 'río',
  'cascada', 'desierto', 'bosque', 'parque', 'museo', 'teatro', 'cine',
  'shopping', 'café', 'bar', 'club', 'gimnasio', 'yoga', 'meditación'
]

// Initial dummy data
const defaultPhotos: Photo[] = [
  {
    id: 1,
    title: 'Nuestra Primera Cita',
    date: '2024-01-15',
    description: 'El día que todo comenzó. Un momento mágico que nunca olvidaremos.',
    image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=300&fit=crop',
    tags: ['cita', 'romántico', 'especial'],
    type: 'photo',
    size: 2048576,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 2,
    title: 'Viaje a la Playa',
    date: '2024-02-20',
    description: 'Arena, mar y mucho amor. Un día perfecto juntos.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop',
    tags: ['playa', 'viaje', 'naturaleza'],
    type: 'photo',
    size: 3145728,
    createdAt: '2024-02-20T14:30:00Z',
    updatedAt: '2024-02-20T14:30:00Z'
  },
  {
    id: 3,
    title: 'Cena Romántica',
    date: '2024-03-10',
    description: 'Una velada inolvidable con la mejor compañía.',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop',
    tags: ['cena', 'romántico', 'restaurante'],
    type: 'photo',
    size: 1572864,
    createdAt: '2024-03-10T20:00:00Z',
    updatedAt: '2024-03-10T20:00:00Z'
  },
  {
    id: 4,
    title: 'Video del Aniversario',
    date: '2024-04-05',
    description: 'Celebrando nuestro amor con risas y alegría.',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
    tags: ['aniversario', 'video', 'celebración'],
    type: 'video',
    size: 52428800,
    createdAt: '2024-04-05T18:00:00Z',
    updatedAt: '2024-04-05T18:00:00Z'
  }
]

export default function FotosSection() {
  const { value: photos, setValue: setPhotos } = useLocalStorage<Photo[]>('photos', defaultPhotos)
  const [filteredPhotos, setFilteredPhotos] = useState<Photo[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'type'>('date')
  const [filterType, setFilterType] = useState<'all' | 'photo' | 'video'>('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<{
    show: boolean
    title: string
    description: string
    variant?: 'default' | 'destructive'
  }>({ show: false, title: '', description: '' })

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ show: false, title: '', description: '' })
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [toast.show])

  // Form state
  const [photoForm, setPhotoForm] = useState({
    title: '',
    date: '',
    description: '',
    tags: [] as string[],
    type: 'photo' as 'photo' | 'video',
    image: null as File | null
  })

  // Load photos from localStorage
  useEffect(() => {
    setLoading(false)
  }, [])

  // Filter and sort photos
  useEffect(() => {
    let filtered = photos.filter(photo => {
      const matchesSearch = photo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           photo.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           photo.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesType = filterType === 'all' || photo.type === filterType
      
      return matchesSearch && matchesType
    })

    // Sort photos
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        case 'title':
          return a.title.localeCompare(b.title)
        case 'type':
          return a.type.localeCompare(b.type)
        default:
          return 0
      }
    })

    setFilteredPhotos(filtered)
  }, [photos, searchTerm, sortBy, filterType])

  // Save photos to localStorage
  useEffect(() => {
    if (photos.length > 0) {
      localStorage.setItem('photos', JSON.stringify(photos))
    }
  }, [photos])

  const handleCreatePhoto = () => {
    if (!photoForm.title || !photoForm.date || !photoForm.image) {
      setToast({
        show: true,
        title: 'Error',
        description: 'Por favor completa todos los campos requeridos',
        variant: 'destructive'
      })
      return
    }

    const newPhoto: Photo = {
      id: Date.now(),
      title: photoForm.title,
      date: photoForm.date,
      description: photoForm.description,
      image: URL.createObjectURL(photoForm.image),
      tags: photoForm.tags,
      type: photoForm.type,
      size: photoForm.image.size,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    setPhotos(prev => [newPhoto, ...prev])
    setShowCreateModal(false)
    resetForm()
    setToast({
      show: true,
      title: 'Éxito',
      description: 'Foto agregada correctamente'
    })
  }

  const handleEditPhoto = (photo: Photo) => {
    setSelectedPhoto(photo)
    setPhotoForm({
      title: photo.title,
      date: photo.date,
      description: photo.description,
      tags: photo.tags,
      type: photo.type,
      image: null
    })
    setShowCreateModal(true)
  }

  const handleUpdatePhoto = () => {
    if (!selectedPhoto || !photoForm.title || !photoForm.date) {
      setToast({
        show: true,
        title: 'Error',
        description: 'Por favor completa todos los campos requeridos',
        variant: 'destructive'
      })
      return
    }

    const updatedPhoto: Photo = {
      ...selectedPhoto,
      title: photoForm.title,
      date: photoForm.date,
      description: photoForm.description,
      tags: photoForm.tags,
      type: photoForm.type,
      image: photoForm.image ? URL.createObjectURL(photoForm.image) : selectedPhoto.image,
      size: photoForm.image ? photoForm.image.size : selectedPhoto.size,
      updatedAt: new Date().toISOString()
    }

    setPhotos(prev => prev.map(p => p.id === selectedPhoto.id ? updatedPhoto : p))
    setShowCreateModal(false)
    setSelectedPhoto(null)
    resetForm()
    setToast({
      show: true,
      title: 'Éxito',
      description: 'Foto actualizada correctamente'
    })
  }

  const handleDeletePhoto = (photo: Photo) => {
    setPhotos(prev => prev.filter(p => p.id !== photo.id))
    setToast({
      show: true,
      title: 'Éxito',
      description: 'Foto eliminada correctamente'
    })
  }

  const handleViewPhoto = (photo: Photo) => {
    setSelectedPhoto(photo)
    setCurrentPhotoIndex(filteredPhotos.findIndex(p => p.id === photo.id))
    setShowDetailModal(true)
  }

  const handlePreviousPhoto = () => {
    if (currentPhotoIndex > 0) {
      setCurrentPhotoIndex(currentPhotoIndex - 1)
      setSelectedPhoto(filteredPhotos[currentPhotoIndex - 1])
    }
  }

  const handleNextPhoto = () => {
    if (currentPhotoIndex < filteredPhotos.length - 1) {
      setCurrentPhotoIndex(currentPhotoIndex + 1)
      setSelectedPhoto(filteredPhotos[currentPhotoIndex + 1])
    }
  }

  const handleDownload = (photo: Photo) => {
    const link = document.createElement('a')
    link.href = photo.image
    link.download = `${photo.title}.${photo.type === 'video' ? 'mp4' : 'jpg'}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    setToast({
      show: true,
      title: 'Descarga iniciada',
      description: 'El archivo se está descargando'
    })
  }

  const resetForm = () => {
    setPhotoForm({
      title: '',
      date: '',
      description: '',
      tags: [],
      type: 'photo',
      image: null
    })
  }

  const handleTagToggle = (tag: string) => {
    setPhotoForm(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }))
  }

  const handleAddCustomTag = (customTag: string) => {
    const trimmedTag = customTag.trim()
    if (trimmedTag && !photoForm.tags.includes(trimmedTag)) {
      setPhotoForm(prev => ({
        ...prev,
        tags: [...prev.tags, trimmedTag]
      }))
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setPhotoForm(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-48 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Nuestras Fotos
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {filteredPhotos.length} de {photos.length} fotos
            </p>
          </div>
          <Button onClick={() => setShowCreateModal(true)} className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Agregar Nueva Foto
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar fotos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterType} onValueChange={(value: 'all' | 'photo' | 'video') => setFilterType(value)}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filtrar por tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="photo">Fotos</SelectItem>
              <SelectItem value="video">Videos</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={(value: 'date' | 'title' | 'type') => setSortBy(value)}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Fecha</SelectItem>
              <SelectItem value="title">Título</SelectItem>
              <SelectItem value="type">Tipo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Photos Grid */}
        {filteredPhotos.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No se encontraron fotos
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm || filterType !== 'all' 
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'Agrega tu primera foto para comenzar'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPhotos.map((photo) => (
              <Card key={photo.id} className="group hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <div className="relative">
                    <AspectRatio ratio={4/3}>
                      <img
                        src={photo.image}
                        alt={photo.title}
                        className="object-cover w-full h-full rounded-t-lg"
                      />
                    </AspectRatio>
                    <div className="absolute top-2 right-2">
                      <Badge variant={photo.type === 'video' ? 'secondary' : 'default'}>
                        {photo.type === 'video' ? <Video className="w-3 h-3 mr-1" /> : <ImageIcon className="w-3 h-3 mr-1" />}
                        {photo.type === 'video' ? 'Video' : 'Foto'}
                      </Badge>
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleViewPhoto(photo)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleEditPhoto(photo)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Eliminar foto?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción no se puede deshacer. La foto se eliminará permanentemente.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeletePhoto(photo)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-lg mb-2 line-clamp-1">{photo.title}</CardTitle>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(photo.date)}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {photo.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {photo.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                    {photo.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{photo.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                  {photo.size && (
                    <p className="text-xs text-gray-500">
                      {formatFileSize(photo.size)}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Create/Edit Modal */}
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedPhoto ? 'Editar Foto' : 'Agregar Nueva Foto'}
              </DialogTitle>
              <DialogDescription>
                {selectedPhoto ? 'Modifica los detalles de la foto' : 'Sube una nueva foto o video y agrega los detalles'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Título *</label>
                  <Input
                    value={photoForm.title}
                    onChange={(e) => setPhotoForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Título de la foto"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Fecha *</label>
                  <Input
                    type="date"
                    value={photoForm.date}
                    onChange={(e) => setPhotoForm(prev => ({ ...prev, date: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Descripción</label>
                <Input
                  value={photoForm.description}
                  onChange={(e) => setPhotoForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe el momento..."
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Tipo</label>
                <Select
                  value={photoForm.type}
                  onValueChange={(value: 'photo' | 'video') => setPhotoForm(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="photo">Foto</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Etiquetas</label>
                <div className="space-y-3">
                  {/* Selected tags display */}
                  {photoForm.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {photoForm.tags.map((tag, index) => (
                        <Badge 
                          key={index} 
                          variant="default" 
                          className="cursor-pointer hover:bg-red-100 hover:text-red-800"
                          onClick={() => handleRemoveTag(tag)}
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                          <span className="ml-1 text-xs">×</span>
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  {/* Tags dropdown */}
                  <div className="relative">
                    <Select onValueChange={(value) => handleTagToggle(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar etiquetas..." />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        <div className="grid grid-cols-1 gap-1 p-2">
                          {predefinedTags.map((tag) => (
                            <SelectItem 
                              key={tag} 
                              value={tag}
                              className={`cursor-pointer ${
                                photoForm.tags.includes(tag) 
                                  ? 'bg-primary/10 text-primary' 
                                  : ''
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <Tag className="w-3 h-3" />
                                <span>{tag}</span>
                                {photoForm.tags.includes(tag) && (
                                  <span className="text-xs text-primary">✓</span>
                                )}
                              </div>
                            </SelectItem>
                          ))}
                        </div>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Custom tag input */}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Agregar etiqueta personalizada..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          const input = e.target as HTMLInputElement
                          handleAddCustomTag(input.value)
                          input.value = ''
                        }
                      }}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement
                        handleAddCustomTag(input.value)
                        input.value = ''
                      }}
                    >
                      Agregar
                    </Button>
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  {selectedPhoto ? 'Nueva imagen (opcional)' : 'Imagen/Video *'}
                </label>
                
                {/* File upload area */}
                {!photoForm.image ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
                    <input
                      type="file"
                      accept={photoForm.type === 'video' ? 'video/*' : 'image/*'}
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file && file.size <= 100 * 1024 * 1024) { // 100MB max
                          setPhotoForm(prev => ({ ...prev, image: file }))
                        } else if (file) {
                          alert('El archivo es demasiado grande. Máximo 100MB.')
                        }
                      }}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <div className="space-y-3">
                        {photoForm.type === 'video' ? (
                          <Video className="h-12 w-12 text-gray-400 mx-auto" />
                        ) : (
                          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto" />
                        )}
                        <div>
                          <p className="text-lg font-medium text-gray-700">
                            Haz clic para seleccionar un archivo
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {photoForm.type === 'video' ? 'MP4, AVI, MOV' : 'JPG, PNG, GIF'} (máx. 100MB)
                          </p>
                        </div>
                      </div>
                    </label>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* File preview */}
                    <div className="border-2 border-dashed border-green-200 bg-green-50 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {photoForm.type === 'video' ? (
                            <Video className="w-8 h-8 text-green-600" />
                          ) : (
                            <ImageIcon className="w-8 h-8 text-green-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-green-900 truncate">
                            {photoForm.image.name}
                          </p>
                          <p className="text-xs text-green-700">
                            {formatFileSize(photoForm.image.size)} • {photoForm.type === 'video' ? 'Video' : 'Imagen'}
                          </p>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => setPhotoForm(prev => ({ ...prev, image: null }))}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* File preview */}
                    <div className="relative">
                      <AspectRatio ratio={4/3} className="max-h-48">
                        {photoForm.type === 'video' ? (
                          <video
                            src={URL.createObjectURL(photoForm.image)}
                            controls
                            className="w-full h-full rounded-lg object-cover"
                          />
                        ) : (
                          <img
                            src={URL.createObjectURL(photoForm.image)}
                            alt="Preview"
                            className="w-full h-full rounded-lg object-cover"
                          />
                        )}
                      </AspectRatio>
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          ✓ Subido
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setShowCreateModal(false)
                setSelectedPhoto(null)
                resetForm()
              }}>
                Cancelar
              </Button>
              <Button onClick={selectedPhoto ? handleUpdatePhoto : handleCreatePhoto}>
                {selectedPhoto ? 'Actualizar' : 'Agregar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Detail Modal */}
        <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
          <DialogContent className="max-w-4xl">
            {selectedPhoto && (
              <div className="space-y-4">
                <div className="relative">
                  <AspectRatio ratio={16/9}>
                    {selectedPhoto.type === 'video' ? (
                      <video
                        src={selectedPhoto.image}
                        controls
                        className="w-full h-full rounded-lg"
                      />
                    ) : (
                      <img
                        src={selectedPhoto.image}
                        alt={selectedPhoto.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    )}
                  </AspectRatio>
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleDownload(selectedPhoto)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleEditPhoto(selectedPhoto)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                  {filteredPhotos.length > 1 && (
                    <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={handlePreviousPhoto}
                        disabled={currentPhotoIndex === 0}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                  {filteredPhotos.length > 1 && (
                    <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={handleNextPhoto}
                        disabled={currentPhotoIndex === filteredPhotos.length - 1}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedPhoto.title}</h2>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(selectedPhoto.date)}
                    </div>
                  </div>
                  {selectedPhoto.description && (
                    <p className="text-gray-600 dark:text-gray-400">
                      {selectedPhoto.description}
                    </p>
                  )}
                  {selectedPhoto.tags.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium mb-2">Etiquetas</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedPhoto.tags.map((tag, index) => (
                          <Badge key={index} variant="outline">
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedPhoto.size && (
                    <div className="text-sm text-gray-500">
                      Tamaño: {formatFileSize(selectedPhoto.size)}
                    </div>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Toast */}
        {toast.show && (
          <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 max-w-sm">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{toast.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{toast.description}</p>
              </div>
              <button
                onClick={() => setToast({ show: false, title: '', description: '' })}
                className="ml-4 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>
  )
}
