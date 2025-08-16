'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { 
  Gift, 
  Heart, 
  Star, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  Calendar, 
  DollarSign, 
  ShoppingCart, 
  Package, 
  Smile, 
  Camera,
  X,
  Save,
  Image as ImageIcon
} from 'lucide-react'
import { useLocalStorage } from '@/hooks/useLocalStorage'

interface Gift {
  id: string
  name: string
  description: string
  category: 'romantico' | 'practico' | 'tecnologico' | 'moda' | 'hogar' | 'experiencia' | 'otro'
  type: 'deseo' | 'recibido' | 'regalado'
  price: number
  priority: 'alta' | 'media' | 'baja'
  date: string
  occasion: string
  image?: string
  rating?: number
  notes?: string
  isFavorite: boolean
  purchased: boolean
  recipient: 'yo' | 'pareja' | 'ambos'
}

const categories = [
  { value: 'romantico', label: 'Romántico', icon: '💕' },
  { value: 'practico', label: 'Práctico', icon: '🛠️' },
  { value: 'tecnologico', label: 'Tecnológico', icon: '📱' },
  { value: 'moda', label: 'Moda', icon: '👗' },
  { value: 'hogar', label: 'Hogar', icon: '🏠' },
  { value: 'experiencia', label: 'Experiencia', icon: '🎯' },
  { value: 'otro', label: 'Otro', icon: '🎁' }
]

const occasions = [
  'Cumpleaños',
  'Aniversario',
  'San Valentín',
  'Navidad',
  'Día de la Madre',
  'Día del Padre',
  'Graduación',
  'Promoción',
  'Sin ocasión especial',
  'Sorpresa'
]

export function RegalosSection() {
  const { value: gifts, setValue: setGifts } = useLocalStorage<Gift[]>('gifts', [
    {
      id: '1',
      name: 'Anillo de Compromiso',
      description: 'Un anillo especial para el momento perfecto',
      category: 'romantico',
      type: 'deseo',
      price: 2500,
      priority: 'alta',
      date: '2024-12-25',
      occasion: 'Navidad',
      rating: 5,
      notes: 'Diamante de 1 quilate, oro blanco',
      isFavorite: true,
      purchased: false,
      recipient: 'pareja'
    },
    {
      id: '2',
      name: 'Reloj Inteligente',
      description: 'Para monitorear su salud y estar conectados',
      category: 'tecnologico',
      type: 'recibido',
      price: 350,
      priority: 'media',
      date: '2024-02-14',
      occasion: 'San Valentín',
      rating: 4,
      notes: 'Apple Watch Series 9',
      isFavorite: false,
      purchased: true,
      recipient: 'yo'
    },
    {
      id: '3',
      name: 'Cena Romántica',
      description: 'Una cena especial en su restaurante favorito',
      category: 'experiencia',
      type: 'regalado',
      price: 120,
      priority: 'alta',
      date: '2024-01-15',
      occasion: 'Aniversario',
      rating: 5,
      notes: 'Restaurante La Casa del Amor',
      isFavorite: true,
      purchased: true,
      recipient: 'ambos'
    }
  ])

  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('Todos')
  const [selectedCategory, setSelectedCategory] = useState('Todas')
  const [selectedType, setSelectedType] = useState('Todos')

  const [giftForm, setGiftForm] = useState({
    name: '',
    description: '',
    category: 'romantico' as Gift['category'],
    type: 'deseo' as Gift['type'],
    price: 0,
    priority: 'media' as Gift['priority'],
    date: '',
    occasion: '',
    notes: '',
    recipient: 'pareja' as Gift['recipient'],
    image: null as File | null
  })

  // Estadísticas
  const stats = {
    totalGifts: gifts.length,
    totalWishlist: gifts.filter(g => g.type === 'deseo').length,
    totalReceived: gifts.filter(g => g.type === 'recibido').length,
    totalGiven: gifts.filter(g => g.type === 'regalado').length,
    totalSpent: gifts.filter(g => g.purchased).reduce((sum, g) => sum + g.price, 0),
    averageRating: gifts.filter(g => g.rating).reduce((sum, g) => sum + (g.rating || 0), 0) / gifts.filter(g => g.rating).length || 0,
    favoriteGifts: gifts.filter(g => g.isFavorite).length
  }

  // Filtrar regalos
  const filteredGifts = gifts.filter(gift => {
    const matchesSearch = gift.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         gift.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = selectedFilter === 'Todos' || 
                         (selectedFilter === 'Deseos' && gift.type === 'deseo') ||
                         (selectedFilter === 'Recibidos' && gift.type === 'recibido') ||
                         (selectedFilter === 'Regalados' && gift.type === 'regalado')
    const matchesCategory = selectedCategory === 'Todas' || gift.category === selectedCategory.toLowerCase()
    const matchesType = selectedType === 'Todos' || gift.type === selectedType.toLowerCase()
    
    return matchesSearch && matchesFilter && matchesCategory && matchesType
  })

  const openAddModal = () => {
    setGiftForm({
      name: '',
      description: '',
      category: 'romantico',
      type: 'deseo',
      price: 0,
      priority: 'media',
      date: '',
      occasion: '',
      notes: '',
      recipient: 'pareja',
      image: null
    })
    setShowAddModal(true)
  }

  const openEditModal = (gift: Gift) => {
    setSelectedGift(gift)
    setGiftForm({
      name: gift.name,
      description: gift.description,
      category: gift.category,
      type: gift.type,
      price: gift.price,
      priority: gift.priority,
      date: gift.date,
      occasion: gift.occasion,
      notes: gift.notes || '',
      recipient: gift.recipient,
      image: null
    })
    setShowEditModal(true)
  }

  const openDeleteModal = (gift: Gift) => {
    setSelectedGift(gift)
    setShowDeleteModal(true)
  }

  const handleSaveGift = () => {
    if (!giftForm.name || !giftForm.description) return

    let imageUrl = undefined
    if (giftForm.image) {
      imageUrl = URL.createObjectURL(giftForm.image)
    }

    if (showEditModal && selectedGift) {
      // Editar regalo existente
      setGifts(prev => prev.map(g => 
        g.id === selectedGift.id 
          ? { ...g, ...giftForm, image: imageUrl || g.image }
          : g
      ))
      setShowEditModal(false)
    } else {
      // Agregar nuevo regalo
      const newGift: Gift = {
        id: Date.now().toString(),
        name: giftForm.name,
        description: giftForm.description,
        category: giftForm.category,
        type: giftForm.type,
        price: giftForm.price,
        priority: giftForm.priority,
        date: giftForm.date,
        occasion: giftForm.occasion,
        notes: giftForm.notes,
        recipient: giftForm.recipient,
        image: imageUrl,
        rating: undefined,
        isFavorite: false,
        purchased: giftForm.type === 'regalado' || giftForm.type === 'recibido'
      }
      setGifts(prev => [newGift, ...prev])
      setShowAddModal(false)
    }

    // Limpiar formulario
    setGiftForm({
      name: '',
      description: '',
      category: 'romantico',
      type: 'deseo',
      price: 0,
      priority: 'media',
      date: '',
      occasion: '',
      notes: '',
      recipient: 'pareja',
      image: null
    })
  }

  const handleDeleteGift = () => {
    if (selectedGift) {
      setGifts(prev => prev.filter(g => g.id !== selectedGift.id))
      setShowDeleteModal(false)
      setSelectedGift(null)
    }
  }

  const toggleFavorite = (giftId: string) => {
    setGifts(prev => prev.map(g => 
      g.id === giftId ? { ...g, isFavorite: !g.isFavorite } : g
    ))
  }

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setGiftForm(prev => ({ ...prev, image: file }))
    }
  }

  const getCategoryIcon = (category: string) => {
    return categories.find(c => c.value === category)?.icon || '🎁'
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta': return 'bg-red-100 text-red-800 border-red-200'
      case 'media': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'baja': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'deseo': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'recibido': return 'bg-green-100 text-green-800 border-green-200'
      case 'regalado': return 'bg-purple-100 text-purple-800 border-purple-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-gray-800 flex items-center justify-center gap-3">
          <Gift className="h-10 w-10 text-pink-500" />
          Regalos y Sorpresas
        </h1>
        <p className="text-gray-600 text-lg">
          Gestiona tus regalos, deseos y sorpresas especiales
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-pink-600 font-medium">Total Regalos</p>
                <p className="text-2xl font-bold text-pink-700">{stats.totalGifts}</p>
              </div>
              <Gift className="h-8 w-8 text-pink-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Lista de Deseos</p>
                <p className="text-2xl font-bold text-blue-700">{stats.totalWishlist}</p>
              </div>
              <Heart className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Total Gastado</p>
                <p className="text-2xl font-bold text-green-700">${stats.totalSpent}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 font-medium">Favoritos</p>
                <p className="text-2xl font-bold text-yellow-700">{stats.favoriteGifts}</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
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
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar regalos..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todos">Todos</SelectItem>
                  <SelectItem value="Deseos">Deseos</SelectItem>
                  <SelectItem value="Recibidos">Recibidos</SelectItem>
                  <SelectItem value="Regalados">Regalados</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todas">Todas las categorías</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category.value} value={category.label}>
                      {category.icon} {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={openAddModal}
              className="bg-pink-500 hover:bg-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar Regalo
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Regalos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGifts.map((gift) => (
          <motion.div
            key={gift.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className={`hover:shadow-lg transition-all duration-200 cursor-pointer ${
              gift.isFavorite ? 'ring-2 ring-pink-200 bg-pink-50' : ''
            }`}>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Imagen */}
                  <div className="relative">
                    {gift.image ? (
                      <AspectRatio ratio={16/9} className="rounded-lg overflow-hidden">
                        <img 
                          src={gift.image} 
                          alt={gift.name}
                          className="w-full h-full object-cover"
                        />
                      </AspectRatio>
                    ) : (
                      <div className="w-full h-32 bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg flex items-center justify-center">
                        <Gift className="h-12 w-12 text-pink-400" />
                      </div>
                    )}
                    
                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      <Badge className={`text-xs ${getTypeColor(gift.type)}`}>
                        {gift.type === 'deseo' ? 'Deseo' : gift.type === 'recibido' ? 'Recibido' : 'Regalado'}
                      </Badge>
                      <Badge className={`text-xs ${getPriorityColor(gift.priority)}`}>
                        {gift.priority}
                      </Badge>
                    </div>

                    {/* Botones de acción */}
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 bg-white/80 hover:bg-white"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleFavorite(gift.id)
                        }}
                      >
                        <Heart className={`h-4 w-4 ${gift.isFavorite ? 'fill-current text-red-500' : 'text-gray-400'}`} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 bg-white/80 hover:bg-white"
                        onClick={(e) => {
                          e.stopPropagation()
                          openEditModal(gift)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 bg-white/80 hover:bg-white"
                        onClick={(e) => {
                          e.stopPropagation()
                          openDeleteModal(gift)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Información */}
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-gray-800 line-clamp-2">{gift.name}</h3>
                      <span className="text-lg font-bold text-pink-600">${gift.price}</span>
                    </div>
                    
                    <p className="text-sm text-gray-600 line-clamp-2">{gift.description}</p>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{getCategoryIcon(gift.category)}</span>
                      <span>{categories.find(c => c.value === gift.category)?.label}</span>
                      <span>•</span>
                      <span>{gift.occasion}</span>
                    </div>

                    {gift.rating && (
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-3 w-3 ${i < gift.rating! ? 'fill-current text-yellow-400' : 'text-gray-300'}`} 
                          />
                        ))}
                        <span className="text-xs text-gray-500 ml-1">({gift.rating})</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Modal para Agregar/Editar Regalo */}
      <Dialog open={showAddModal || showEditModal} onOpenChange={() => {
        setShowAddModal(false)
        setShowEditModal(false)
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-pink-500" />
              {showEditModal ? 'Editar Regalo' : 'Agregar Nuevo Regalo'}
            </DialogTitle>
            <DialogDescription>
              Completa la información del regalo
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Información básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Regalo *
                </label>
                <Input
                  value={giftForm.name}
                  onChange={(e) => setGiftForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ej: Anillo de compromiso"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Precio
                </label>
                <Input
                  type="number"
                  value={giftForm.price}
                  onChange={(e) => setGiftForm(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción *
              </label>
              <textarea
                value={giftForm.description}
                onChange={(e) => setGiftForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe el regalo..."
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-md resize-none focus:border-pink-500 focus:ring-pink-500"
              />
            </div>

            {/* Categorías y tipo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría
                </label>
                <Select value={giftForm.category} onValueChange={(value: Gift['category']) => setGiftForm(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.icon} {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo
                </label>
                <Select value={giftForm.type} onValueChange={(value: Gift['type']) => setGiftForm(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="deseo">Deseo</SelectItem>
                    <SelectItem value="recibido">Recibido</SelectItem>
                    <SelectItem value="regalado">Regalado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prioridad
                </label>
                <Select value={giftForm.priority} onValueChange={(value: Gift['priority']) => setGiftForm(prev => ({ ...prev, priority: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alta">Alta</SelectItem>
                    <SelectItem value="media">Media</SelectItem>
                    <SelectItem value="baja">Baja</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Fecha y ocasión */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha
                </label>
                <Input
                  type="date"
                  value={giftForm.date}
                  onChange={(e) => setGiftForm(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ocasión
                </label>
                <Select value={giftForm.occasion} onValueChange={(value) => setGiftForm(prev => ({ ...prev, occasion: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar ocasión" />
                  </SelectTrigger>
                  <SelectContent>
                    {occasions.map(occasion => (
                      <SelectItem key={occasion} value={occasion}>
                        {occasion}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Destinatario y notas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Para
                </label>
                <Select value={giftForm.recipient} onValueChange={(value: Gift['recipient']) => setGiftForm(prev => ({ ...prev, recipient: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yo">Para mí</SelectItem>
                    <SelectItem value="pareja">Para mi pareja</SelectItem>
                    <SelectItem value="ambos">Para ambos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Imagen (Opcional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-pink-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    id="gift-image"
                  />
                  <label htmlFor="gift-image" className="cursor-pointer">
                    {giftForm.image ? (
                      <div className="space-y-2">
                        <img 
                          src={URL.createObjectURL(giftForm.image)} 
                          alt="Vista previa"
                          className="w-20 h-20 mx-auto rounded-lg object-cover"
                        />
                        <p className="text-sm text-gray-600">{giftForm.image.name}</p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault()
                            setGiftForm(prev => ({ ...prev, image: null }))
                          }}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Remover
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <ImageIcon className="h-8 w-8 text-gray-400 mx-auto" />
                        <p className="text-sm text-gray-600">Haz clic para agregar imagen</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notas adicionales
              </label>
              <textarea
                value={giftForm.notes}
                onChange={(e) => setGiftForm(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Notas, detalles, enlaces..."
                rows={2}
                className="w-full p-3 border border-gray-300 rounded-md resize-none focus:border-pink-500 focus:ring-pink-500"
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
              onClick={handleSaveGift}
              disabled={!giftForm.name || !giftForm.description}
              className="bg-pink-500 hover:bg-pink-600"
            >
              <Save className="h-4 w-4 mr-2" />
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Confirmación de Eliminación */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-500" />
              Eliminar Regalo
            </DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres eliminar "{selectedGift?.name}"? Esta acción no se puede deshacer.
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
              onClick={handleDeleteGift}
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
