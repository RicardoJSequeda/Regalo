'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { FreeMap } from '@/components/ui/free-map'
import { Heart, Calendar, MapPin, Image, Clock, Star, Map, Camera, Plane, Search, Edit, Trash2, ChevronRight, AlertCircle, X, Save, Plus } from 'lucide-react'
import { MapPlace } from '@/types'
import { useLocalStorage } from '@/hooks/useLocalStorage'

interface Milestone {
  id: number
  title: string
  date: string
  description: string
  image: string
  type: string
}

export function RecuerdosSection() {
  const [currentCuriosityIndex, setCurrentCuriosityIndex] = useState(0)
  const [selectedFilter, setSelectedFilter] = useState('Todos')
  const [selectedPlaceFilter, setSelectedPlaceFilter] = useState('Todos')
  const [searchTerm, setSearchTerm] = useState('')
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deletingMilestone, setDeletingMilestone] = useState<Milestone | null>(null)
  const [isEditPlaceModalOpen, setIsEditPlaceModalOpen] = useState(false)
  const [editingPlace, setEditingPlace] = useState<{
    id: number
    name: string
    date: string
    address: string
    status: string
  } | null>(null)
  const [isDeletePlaceModalOpen, setIsDeletePlaceModalOpen] = useState(false)
  const [deletingPlace, setDeletingPlace] = useState<{
    id: number
    name: string
    date: string
    address: string
    status: string
  } | null>(null)
  const { value: mapPlaces, setValue: setMapPlaces } = useLocalStorage<MapPlace[]>('mapPlaces', [
    {
      id: 1,
      name: "Parque Central",
      address: "Calle Principal 123, Ciudad",
      lat: 19.4326,
      lng: -99.1332,
      type: "Parque",
      visited: true
    },
    {
      id: 2,
      name: "Restaurante El Amor",
      address: "Av. Romántica 456, Ciudad",
      lat: 19.4426,
      lng: -99.1432,
      type: "Restaurante",
      visited: true
    },
    {
      id: 3,
      name: "Playa del Amor",
      address: "Costa del Pacífico, México",
      lat: 19.4226,
      lng: -99.1232,
      type: "Playa",
      visited: true
    },
    {
      id: 4,
      name: "París",
      address: "Francia",
      lat: 48.8566,
      lng: 2.3522,
      type: "Ciudad",
      visited: false
    },
    {
      id: 5,
      name: "Venecia",
      address: "Italia",
      lat: 45.4408,
      lng: 12.3155,
      type: "Ciudad",
      visited: false
    }
  ])

  // Datos de curiosidades
  const curiosities = [
    "Nuestra canción especial es la que sonaba en la radio la primera vez que nos dijimos 'Te amo!'",
    "El primer regalo que te di fue un libro que hablaba sobre el amor eterno",
    "Nuestro color favorito juntos es el rosa porque representa nuestro amor dulce",
    "La primera vez que cocinamos juntos fue un desastre pero nos reímos mucho"
  ]

  // Datos de hitos por defecto
  const defaultMilestones: Milestone[] = [
    {
      id: 1,
      title: "Nuestra Primera Cita",
      date: "2023-02-14",
      description: "Una cena romántica que marcó el comienzo",
      image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=300&h=533&fit=crop&crop=center",
      type: "aniversario"
    },
    {
      id: 2,
      title: "Viaje a la Playa",
      date: "2023-06-15",
      description: "Nuestro primer viaje juntos",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&h=533&fit=crop&crop=center",
      type: "viajes"
    },
    {
      id: 3,
      title: "Celebración de Cumpleaños",
      date: "2023-08-20",
      description: "Una sorpresa especial para tu cumpleaños",
      image: "https://images.unsplash.com/photo-1464349153735-7db50ed83c84?w=300&h=533&fit=crop&crop=center",
      type: "eventos"
    },
    {
      id: 4,
      title: "Noche de Estrellas",
      date: "2023-09-15",
      description: "Contemplamos las estrellas juntos, un momento mágico",
      image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=300&h=533&fit=crop&crop=center",
      type: "eventos"
    },
    {
      id: 5,
      title: "Concierto Romántico",
      date: "2023-10-10",
      description: "Nuestro primer concierto juntos, fue inolvidable",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=533&fit=crop&crop=center",
      type: "eventos"
    },
    {
      id: 6,
      title: "Picnic en el Parque",
      date: "2023-11-05",
      description: "Un día perfecto con comida casera y mucha risa",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=533&fit=crop&crop=center",
      type: "eventos"
    },
    {
      id: 7,
      title: "Aniversario de 6 Meses",
      date: "2023-12-14",
      description: "Celebramos medio año juntos con una cena especial",
      image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=300&h=533&fit=crop&crop=center",
      type: "aniversario"
    },
    {
      id: 8,
      title: "Viaje a la Montaña",
      date: "2024-01-20",
      description: "Nuestra primera aventura en la montaña, vistas increíbles",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=533&fit=crop&crop=center",
      type: "viajes"
    },
    {
      id: 9,
      title: "Cena de San Valentín",
      date: "2024-02-14",
      description: "Una velada romántica en nuestro restaurante favorito",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300&h=533&fit=crop&crop=center",
      type: "aniversario"
    },
    {
      id: 10,
      title: "Paseo por la Ciudad",
      date: "2024-03-10",
      description: "Exploramos juntos los rincones más bonitos de la ciudad",
      image: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=300&h=533&fit=crop&crop=center",
      type: "viajes"
    }
  ];

  // Datos de hitos (10 en total) - usando useState para asegurar que se muestren
  const [milestones, setMilestones] = useState<Milestone[]>(defaultMilestones);

  // Datos de lugares para la lista - ahora con estado
  const [places, setPlaces] = useState([
    {
      id: 1,
      name: "Parque Central",
      date: "15 de marzo de 2020",
      address: "Calle Principal 123, Ciudad",
      status: "visitado"
    },
    {
      id: 2,
      name: "Restaurante El Amor",
      date: "14 de febrero de 2020",
      address: "Av. Romántica 456, Ciudad",
      status: "visitado"
    },
    {
      id: 3,
      name: "Playa del Amor",
      date: "15 de marzo de 2020",
      address: "Costa del Pacífico, México",
      status: "visitado"
    },
    {
      id: 4,
      name: "París",
      date: "Próximamente",
      address: "Francia",
      status: "pendiente"
    }
  ])

  // Filtrar hitos según el filtro seleccionado
  const filteredMilestones = selectedFilter === 'Todos' 
    ? milestones 
    : milestones.filter(milestone => milestone.type === selectedFilter.toLowerCase())

  // Filtrar lugares según el filtro seleccionado
  const filteredPlaces = places.filter(place => {
    const matchesSearch = place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         place.address.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = selectedPlaceFilter === 'Todos' ||
                         (selectedPlaceFilter === 'Visitados' && place.status === 'visitado') ||
                         (selectedPlaceFilter === 'Pendientes' && place.status === 'pendiente')
    return matchesSearch && matchesFilter
  })

  const showNextCuriosity = () => {
    setCurrentCuriosityIndex((prev) => (prev + 1) % curiosities.length)
  }

  // Función para agregar lugar desde el mapa
  const handleAddPlaceFromMap = (newPlace: Omit<MapPlace, 'id'>) => {
    const newId = Math.max(...mapPlaces.map(p => p.id)) + 1
    setMapPlaces(prev => [...prev, { ...newPlace, id: newId }])
    
    // También agregar a la lista de lugares guardados
    const newPlaceId = Math.max(...places.map(p => p.id)) + 1
    const newPlaceForList = {
      id: newPlaceId,
      name: newPlace.name,
      date: new Date().toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      address: newPlace.address,
      status: "pendiente"
    }
    setPlaces(prev => [...prev, newPlaceForList])
  }

  // Funciones para editar hitos
  const handleEditMilestone = (milestone: Milestone) => {
    setEditingMilestone(milestone)
    setIsEditModalOpen(true)
  }

  const handleSaveMilestone = () => {
    if (editingMilestone) {
      setMilestones(prev => 
        prev.map(m => m.id === editingMilestone.id ? editingMilestone : m)
      )
      setIsEditModalOpen(false)
      setEditingMilestone(null)
    }
  }

  const handleCancelEdit = () => {
    setIsEditModalOpen(false)
    setEditingMilestone(null)
  }

  // Funciones para eliminar hitos
  const handleDeleteMilestone = (milestone: Milestone) => {
    setDeletingMilestone(milestone)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = () => {
    if (deletingMilestone) {
      setMilestones(prev => prev.filter(m => m.id !== deletingMilestone.id))
      setIsDeleteModalOpen(false)
      setDeletingMilestone(null)
    }
  }

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false)
    setDeletingMilestone(null)
  }

  // Funciones para editar lugares
  const handleEditPlace = (place: {
    id: number
    name: string
    date: string
    address: string
    status: string
  }) => {
    setEditingPlace(place)
    setIsEditPlaceModalOpen(true)
  }

  const handleSavePlace = () => {
    if (editingPlace) {
      setPlaces((prev: any) => 
        prev.map((p: any) => p.id === editingPlace.id ? editingPlace : p)
      )
      setIsEditPlaceModalOpen(false)
      setEditingPlace(null)
    }
  }

  const handleCancelEditPlace = () => {
    setIsEditPlaceModalOpen(false)
    setEditingPlace(null)
  }

  // Funciones para eliminar lugares
  const handleDeletePlace = (place: {
    id: number
    name: string
    date: string
    address: string
    status: string
  }) => {
    setDeletingPlace(place)
    setIsDeletePlaceModalOpen(true)
  }

  const handleConfirmDeletePlace = () => {
    if (deletingPlace) {
      setPlaces((prev: any) => prev.filter((p: any) => p.id !== deletingPlace.id))
      setIsDeletePlaceModalOpen(false)
      setDeletingPlace(null)
    }
  }

  const handleCancelDeletePlace = () => {
    setIsDeletePlaceModalOpen(false)
    setDeletingPlace(null)
  }

  // Animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const
      }
    }
  }

  const timelineVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut" as const
      }
    }
  }

  return (
    <>
      <motion.div 
        className="space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div className="space-y-2" variants={itemVariants}>
          <h1 className="text-3xl font-bold tracking-tight">Recuerdos</h1>
        </motion.div>

        {/* Sección "¿Sabías que...?" */}
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="text-4xl text-pink-500 font-bold">?</div>
                <div className="flex-1 space-y-3">
                  <h3 className="text-xl font-bold text-pink-700">¿Sabías que...?</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {curiosities[currentCuriosityIndex]}
                  </p>
                  <Button 
                    onClick={showNextCuriosity}
                    className="bg-pink-500 hover:bg-pink-600 text-white"
                  >
                    Mostrar siguiente curiosidad
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sección "Hitos de Nuestro Amor" */}
        <motion.div className="space-y-4" variants={itemVariants}>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-pink-700">Hitos de Nuestro Amor</h2>
            <div className="flex gap-2">
              {["Todos", "Aniversario", "Viajes", "Eventos", "Otros"].map((filter) => (
                <Button
                  key={filter}
                  variant={selectedFilter === filter ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter(filter)}
                  className={selectedFilter === filter ? "bg-pink-500 hover:bg-pink-600" : "border-pink-300 text-pink-600 hover:bg-pink-50"}
                >
                  {filter}
                </Button>
              ))}
            </div>
          </div>

          {/* Timeline Mejorado con Animaciones */}
          <motion.div 
            className="relative"
            variants={timelineVariants}
          >
            {/* Línea central */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-pink-300 transform -translate-x-1/2"></div>
            
            <div className="space-y-8">
              {filteredMilestones.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No hay hitos para mostrar con el filtro seleccionado.</p>
                  <p className="text-gray-400 text-sm">Total de hitos disponibles: {milestones.length}</p>
                </div>
              ) : (
                filteredMilestones.map((milestone, index) => (
                  <motion.div 
                  key={milestone.id} 
                  className={`relative flex ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                >
                  {/* Punto de la línea de tiempo */}
                  <motion.div 
                    className="absolute left-1/2 transform -translate-x-1/2 z-10"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                  </motion.div>

                  {/* Card del evento */}
                  <motion.div
                    className={`w-5/12 ${index % 2 === 0 ? 'mr-auto' : 'ml-auto'}`}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card>
                      <div className="relative">
                        <div className="w-full h-80 overflow-hidden rounded-t-lg">
                          <img
                            src={milestone.image}
                            alt={milestone.title}
                            className="w-full h-full object-cover"
                            style={{ aspectRatio: '9/16' }}
                          />
                        </div>
                        <div className="absolute top-2 right-2 flex gap-1">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-8 w-8 p-0 bg-white/80 hover:bg-white"
                            onClick={() => handleEditMilestone(milestone)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-8 w-8 p-0 bg-white/80 hover:bg-white"
                            onClick={() => handleDeleteMilestone(milestone)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-bold text-lg mb-2">{milestone.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{milestone.date}</p>
                        <p className="text-gray-700 mb-3">{milestone.description}</p>
                        <Button variant="link" className="p-0 h-auto text-pink-600 hover:text-pink-700">
                          Ver más
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* Sección "Mapa de Lugares Especiales" */}
        <motion.div className="space-y-4" variants={itemVariants}>
          <h2 className="text-2xl font-bold text-pink-700">Mapa de Lugares Especiales</h2>
          <FreeMap 
            places={mapPlaces} 
            className="h-96 w-full" 
            onAddPlace={handleAddPlaceFromMap}
          />
        </motion.div>

        {/* Sección "Lista de Lugares Guardados" */}
        <motion.div className="space-y-4" variants={itemVariants}>
          <h2 className="text-2xl font-bold text-pink-700">Lista de Lugares Guardados</h2>
          
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar lugar..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              {["Todos", "Visitados", "Pendientes", "Eventos"].map((filter) => (
                <Button
                  key={filter}
                  variant={selectedPlaceFilter === filter ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedPlaceFilter(filter)}
                  className={selectedPlaceFilter === filter ? "bg-pink-500 hover:bg-pink-600" : "border-pink-300 text-pink-600 hover:bg-pink-50"}
                >
                  {filter}
                </Button>
              ))}
            </div>
          </div>

          {/* Lista de lugares */}
          <motion.div 
            className="space-y-3"
            variants={containerVariants}
          >
            {filteredPlaces.map((place, index) => (
              <motion.div
                key={place.id}
                variants={itemVariants}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">{place.name}</h3>
                        <p className="text-sm text-gray-600">{place.date}</p>
                        <p className="text-sm text-gray-500">{place.address}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge 
                          variant="secondary" 
                          className={place.status === 'visitado' 
                            ? "bg-green-100 text-green-800 border-green-200" 
                            : "bg-yellow-100 text-yellow-800 border-yellow-200"
                          }
                        >
                          {place.status === 'visitado' ? 'Visitado' : 'Pendiente'}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-8 w-8 p-0 hover:bg-gray-100"
                            onClick={() => handleEditPlace(place)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                            onClick={() => handleDeletePlace(place)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Modal de Edición */}
      {isEditModalOpen && editingMilestone && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div 
            className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Editar Hito</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancelEdit}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título
                </label>
                <Input
                  value={editingMilestone.title}
                  onChange={(e) => setEditingMilestone(prev => prev ? {...prev, title: e.target.value} : null)}
                  placeholder="Título del hito"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha
                </label>
                <Input
                  value={editingMilestone.date}
                  onChange={(e) => setEditingMilestone(prev => prev ? {...prev, date: e.target.value} : null)}
                  placeholder="Fecha del evento"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  value={editingMilestone.description}
                  onChange={(e) => setEditingMilestone(prev => prev ? {...prev, description: e.target.value} : null)}
                  placeholder="Descripción del evento"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL de la imagen
                </label>
                <Input
                  value={editingMilestone.image}
                  onChange={(e) => setEditingMilestone(prev => prev ? {...prev, image: e.target.value} : null)}
                  placeholder="URL de la imagen"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo
                </label>
                <select
                  value={editingMilestone.type}
                  onChange={(e) => setEditingMilestone(prev => prev ? {...prev, type: e.target.value} : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="eventos">Eventos</option>
                  <option value="viajes">Viajes</option>
                  <option value="aniversario">Aniversario</option>
                  <option value="otros">Otros</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                onClick={handleCancelEdit}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSaveMilestone}
                className="flex-1 bg-pink-500 hover:bg-pink-600"
              >
                <Save className="h-4 w-4 mr-2" />
                Guardar
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal de Confirmación de Eliminación */}
      {isDeleteModalOpen && deletingMilestone && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div 
            className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Eliminar Hito</h3>
                <p className="text-sm text-gray-600">Esta acción no se puede deshacer</p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-6">
              ¿Estás seguro de que quieres eliminar el hito <strong>"{deletingMilestone.title}"</strong>?
            </p>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleCancelDelete}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleConfirmDelete}
                className="flex-1 bg-red-500 hover:bg-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal de Edición de Lugar */}
      {isEditPlaceModalOpen && editingPlace && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div 
            className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Editar Lugar</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancelEditPlace}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Lugar
                </label>
                <Input
                  value={editingPlace.name}
                  onChange={(e) => setEditingPlace(prev => prev ? {...prev, name: e.target.value} : null)}
                  placeholder="Nombre del lugar"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha
                </label>
                <Input
                  value={editingPlace.date}
                  onChange={(e) => setEditingPlace(prev => prev ? {...prev, date: e.target.value} : null)}
                  placeholder="Fecha de visita o planificación"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección
                </label>
                <Input
                  value={editingPlace.address}
                  onChange={(e) => setEditingPlace(prev => prev ? {...prev, address: e.target.value} : null)}
                  placeholder="Dirección del lugar"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <select
                  value={editingPlace.status}
                  onChange={(e) => setEditingPlace(prev => prev ? {...prev, status: e.target.value} : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="visitado">Visitado</option>
                  <option value="pendiente">Pendiente</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                onClick={handleCancelEditPlace}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSavePlace}
                className="flex-1 bg-pink-500 hover:bg-pink-600"
              >
                <Save className="h-4 w-4 mr-2" />
                Guardar
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal de Confirmación de Eliminación de Lugar */}
      {isDeletePlaceModalOpen && deletingPlace && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div 
            className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Eliminar Lugar</h3>
                <p className="text-sm text-gray-600">Esta acción no se puede deshacer</p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-6">
              ¿Estás seguro de que quieres eliminar el lugar <strong>"{deletingPlace.name}"</strong>?
            </p>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleCancelDeletePlace}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleConfirmDeletePlace}
                className="flex-1 bg-red-500 hover:bg-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  )
}
