'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Search, 
  Edit3, 
  Heart, 
  Star, 
  Briefcase, 
  Hash, 
  Sparkles,
  MessageCircle,
  Calendar,
  User,
  Edit,
  Trash2
} from 'lucide-react'
import { useLocalStorage } from '@/hooks/useLocalStorage'

interface Message {
  id: string
  title: string
  content: string
  date: string
  category: string
  isRead: boolean
  isFavorite: boolean
}

const categories = [
  { name: 'Amor', icon: Heart, color: 'bg-red-100 text-red-800 border-red-200' },
  { name: 'Motivación', icon: Star, color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  { name: 'Recuerdos', icon: Briefcase, color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { name: 'Futuro', icon: Hash, color: 'bg-green-100 text-green-800 border-green-200' },
  { name: 'Especiales', icon: Sparkles, color: 'bg-purple-100 text-purple-800 border-purple-200' },
]

const initialMessages: Message[] = [
  {
    id: '1',
    title: 'Para mi amor eterno',
    content: 'Mi querido amor, Cada día que pasa a tu lado es un regalo que atesoro con todo mi corazón. Desde el momento en que nuestros ojos se encontraron, supe que mi vida cambiaría para siempre. Tu sonrisa ilumina mis días más oscuros y tu amor me da la fuerza para enfrentar cualquier desafío. Eres mi compañero perfecto, mi mejor amigo y el amor de mi vida. Te amo más de lo que las palabras pueden expresar.',
    date: '2024-01-15',
    category: 'Amor',
    isRead: true,
    isFavorite: true
  },
  {
    id: '2',
    title: 'Nuestros sueños por cumplir',
    content: 'Mi amor, tengo tantos sueños que quiero cumplir contigo... Quiero viajar por el mundo tomados de la mano, descubrir nuevos lugares juntos, crear recuerdos inolvidables en cada rincón del planeta. Quiero construir una familia contigo, ver crecer a nuestros hijos y envejecer juntos. Quiero despertar cada mañana viendo tu rostro y dormir cada noche sintiendo tu amor. Juntos podemos lograr todo lo que nos propongamos.',
    date: '2024-03-10',
    category: 'Futuro',
    isRead: true,
    isFavorite: false
  },
  {
    id: '3',
    title: 'Recordando nuestro primer beso',
    content: '¿Recuerdas ese momento mágico bajo las estrellas? Era una noche perfecta, la brisa suave acariciaba nuestros rostros mientras contemplábamos el cielo estrellado. El momento era tan perfecto que parecía que el tiempo se había detenido. Cuando nuestros labios se encontraron por primera vez, sentí que el universo entero se alineaba. Fue el beso más dulce y perfecto que he experimentado. Ese momento quedó grabado en mi corazón para siempre.',
    date: '2024-02-14',
    category: 'Recuerdos',
    isRead: false,
    isFavorite: false
  },
  {
    id: '4',
    title: 'Gracias por ser mi motivación',
    content: 'Querido amor, quiero que sepas que eres mi mayor motivación en la vida. Cada vez que me siento desanimado o que las cosas no salen como esperaba, solo necesito pensar en ti y en tu amor para encontrar la fuerza que necesito. Tu confianza en mí me hace creer que puedo lograr cualquier cosa. Gracias por ser mi roca, mi apoyo incondicional y por nunca dudar de mí. Contigo a mi lado, me siento invencible.',
    date: '2024-02-20',
    category: 'Motivación',
    isRead: true,
    isFavorite: true
  },
  {
    id: '5',
    title: 'Nuestra primera cita',
    content: 'Ese día que nos conocimos en el café del centro, mi corazón latía tan fuerte que pensé que todos podrían escucharlo. Estabas tan hermosa con ese vestido azul y esa sonrisa tímida. Recuerdo cada detalle: el aroma del café, la música suave de fondo, la forma en que tus ojos brillaban cuando hablabas de tus sueños. Fue el comienzo de nuestra hermosa historia de amor, y cada día desde entonces ha sido mejor que el anterior.',
    date: '2024-01-25',
    category: 'Recuerdos',
    isRead: true,
    isFavorite: true
  },
  {
    id: '6',
    title: 'Mi promesa para el futuro',
    content: 'Mi amor, quiero hacerte una promesa: prometo amarte cada día más que el anterior, prometo ser tu compañero fiel en las buenas y en las malas, prometo escucharte cuando necesites hablar, abrazarte cuando necesites consuelo, y celebrar contigo cada logro. Prometo construir un futuro lleno de amor, risas y momentos inolvidables. Prometo ser la persona que mereces y hacerte feliz todos los días de mi vida.',
    date: '2024-03-05',
    category: 'Futuro',
    isRead: false,
    isFavorite: false
  },
  {
    id: '7',
    title: 'Eres mi inspiración diaria',
    content: 'Cada mañana cuando me despierto y veo tu rostro, siento que puedo conquistar el mundo. Tu determinación, tu bondad y tu fuerza me inspiran a ser una mejor persona. La forma en que enfrentas los desafíos con valentía, cómo cuidas de los demás con tanto amor, y cómo persigues tus sueños sin miedo, me hace querer ser mejor cada día. Eres mi ejemplo a seguir y mi mayor inspiración.',
    date: '2024-02-28',
    category: 'Motivación',
    isRead: true,
    isFavorite: false
  },
  {
    id: '8',
    title: 'Nuestro viaje juntos',
    content: 'Mi amor, nuestro viaje juntos ha sido la aventura más hermosa de mi vida. Hemos reído, llorado, soñado y crecido juntos. Cada paso que hemos dado, cada decisión que hemos tomado, nos ha llevado a donde estamos hoy. Y aunque el camino no siempre ha sido fácil, lo hemos recorrido juntos, tomados de la mano. Estoy emocionado por todos los caminos que aún tenemos por explorar juntos.',
    date: '2024-03-15',
    category: 'Especiales',
    isRead: false,
    isFavorite: true
  },
  {
    id: '9',
    title: 'Mi agradecimiento infinito',
    content: 'Quiero agradecerte por cada momento que has compartido conmigo, por cada sonrisa que me has regalado, por cada abrazo que me has dado cuando más lo necesitaba. Gracias por ser mi confidente, mi mejor amigo y mi amor verdadero. Gracias por aceptarme tal como soy, con mis virtudes y mis defectos. Gracias por hacer que cada día sea especial solo con tu presencia. Te amo más de lo que las palabras pueden expresar.',
    date: '2024-02-10',
    category: 'Amor',
    isRead: true,
    isFavorite: false
  },
  {
    id: '10',
    title: 'Nuestro amor es mágico',
    content: 'Hay algo mágico en nuestro amor que no puedo explicar con palabras. Es como si el universo hubiera conspirado para que nos encontráramos. Cada vez que te miro, siento mariposas en el estómago como si fuera la primera vez. Tu amor me hace sentir que todo es posible, que los sueños se pueden hacer realidad. Eres mi felicidad, mi paz y mi hogar. Contigo, he encontrado el amor verdadero que siempre soñé.',
    date: '2024-03-20',
    category: 'Especiales',
    isRead: false,
    isFavorite: true
  }
]

export function MensajesSection() {
  const { value: messages, setValue: setMessages } = useLocalStorage<Message[]>('messages', initialMessages)
  
  // Initialize messages if localStorage is empty
  useEffect(() => {
    const savedMessages = localStorage.getItem('messages')
    if (!savedMessages || JSON.parse(savedMessages).length === 0) {
      console.log('Cargando mensajes de ejemplo...')
      setMessages(initialMessages)
    } else {
      console.log('Mensajes encontrados en localStorage:', JSON.parse(savedMessages).length)
    }
  }, [setMessages])

  // Debug: verificar que los mensajes se están cargando
  useEffect(() => {
    console.log('Mensajes cargados:', messages.length)
    console.log('Mensajes:', messages)
  }, [messages])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingMessage, setEditingMessage] = useState<Message | null>(null)
  const [newMessage, setNewMessage] = useState({ title: '', content: '', category: 'Amor' })

  // Estadísticas
  const totalMessages = messages.length
  const unreadMessages = messages.filter(m => !m.isRead).length
  const readMessages = messages.filter(m => m.isRead).length
  const favoriteMessages = messages.filter(m => m.isFavorite).length

  // Filtrar mensajes
  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         message.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || message.category === selectedCategory
    return matchesSearch && matchesCategory
  })



  // Toggle favorito
  const toggleFavorite = (messageId: string) => {
    setMessages(prev => prev.map(m => 
      m.id === messageId ? { ...m, isFavorite: !m.isFavorite } : m
    ))
  }

  // Marcar como leído
  const markAsRead = (messageId: string) => {
    setMessages(prev => prev.map(m => 
      m.id === messageId ? { ...m, isRead: true } : m
    ))
  }



  // Eliminar mensaje
  const deleteMessage = (messageId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este mensaje?')) {
      setMessages(prev => prev.filter(m => m.id !== messageId))
    }
  }

  // Abrir modal de edición
  const openEditModal = (message: Message) => {
    setEditingMessage(message)
    setNewMessage({
      title: message.title,
      content: message.content,
      category: message.category
    })
    setIsEditModalOpen(true)
  }

  // Guardar mensaje editado
  const saveEditedMessage = () => {
    if (!editingMessage || !newMessage.title || !newMessage.content) return

    const updatedMessage: Message = {
      ...editingMessage,
      title: newMessage.title,
      content: newMessage.content,
      category: newMessage.category,
      date: new Date().toISOString().split('T')[0] // Actualizar fecha
    }

    setMessages(prev => prev.map(m => 
      m.id === editingMessage.id ? updatedMessage : m
    ))
    
    setIsEditModalOpen(false)
    setEditingMessage(null)
    setNewMessage({ title: '', content: '', category: 'Amor' })
  }

  // Agregar nuevo mensaje
  const addNewMessage = () => {
    if (newMessage.title && newMessage.content) {
      const message: Message = {
        id: Date.now().toString(),
        title: newMessage.title,
        content: newMessage.content,
        date: new Date().toISOString().split('T')[0],
        category: newMessage.category,
        isRead: false,
        isFavorite: false
      }
      setMessages(prev => [message, ...prev])
      setNewMessage({ title: '', content: '', category: 'Amor' })
      setIsWriteModalOpen(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-gray-800">Mensajes</h1>
        <p className="text-gray-600 text-lg">
          Comparte tus pensamientos, deseos y sentimientos más profundos.
        </p>
      </div>

      {/* Estadísticas y Acciones */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-4">
          <div className="stats-card rounded-lg p-4">
            <div className="text-2xl font-bold text-pink-600">{totalMessages}</div>
            <div className="text-sm text-gray-600">Mensajes totales</div>
          </div>
          <div className="stats-card rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600">{unreadMessages}</div>
            <div className="text-sm text-gray-600">Sin leer</div>
          </div>
          <div className="stats-card rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">{readMessages}</div>
            <div className="text-sm text-gray-600">Leídos</div>
          </div>
          <div className="stats-card rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-600">{favoriteMessages}</div>
            <div className="text-sm text-gray-600">Favoritos</div>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button 
            onClick={() => setIsWriteModalOpen(true)}
            className="bg-pink-500 hover:bg-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Edit3 className="h-4 w-4 mr-2" />
            Escribir Mensaje
          </Button>
        </div>
      </div>

      {/* Búsqueda y Filtros */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar en mensajes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-gray-300 focus:border-pink-500 focus:ring-pink-500"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={selectedCategory === '' ? 'default' : 'secondary'}
            className="category-badge hover:bg-pink-100"
            onClick={() => setSelectedCategory('')}
          >
            Todos
          </Badge>
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Badge
                key={category.name}
                variant={selectedCategory === category.name ? 'default' : 'secondary'}
                className={`category-badge ${category.color}`}
                onClick={() => setSelectedCategory(category.name)}
              >
                <Icon className="h-3 w-3 mr-1" />
                {category.name}
              </Badge>
            )
          })}
        </div>
      </div>

      {/* Mensajes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMessages.map((message, index) => {
          const category = categories.find(c => c.name === message.category)
          const Icon = category?.icon || Heart
          const rotationClass = index === 0 ? 'rotate-1' : index === 1 ? 'rotate-2' : 'rotate-3'
          
          return (
            <Card 
              key={message.id}
              className={`message-card ${rotationClass} ${
                !message.isRead ? 'ring-2 ring-pink-200' : ''
              }`}
              onClick={() => markAsRead(message.id)}
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-800 mb-1">
                      {message.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="h-3 w-3" />
                      {message.date}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFavorite(message.id)
                      }}
                      className={`p-1 h-auto transition-all duration-200 ${
                        message.isFavorite ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-red-500'
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${message.isFavorite ? 'fill-current' : ''}`} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        openEditModal(message)
                      }}
                      className="p-1 h-auto text-blue-500 hover:text-blue-600 transition-all duration-200"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteMessage(message.id)
                      }}
                      className="p-1 h-auto text-red-500 hover:text-red-600 transition-all duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm line-clamp-4 mb-3 leading-relaxed">
                  {message.content}
                </p>
                
                <div className="flex items-center justify-between">
                  <Badge className={`${category?.color} transition-all duration-200 hover:scale-105`}>
                    <Icon className="h-3 w-3 mr-1" />
                    {message.category}
                  </Badge>
                  {!message.isRead && (
                    <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Modal para escribir mensaje */}
      {isWriteModalOpen && (
        <div className="fixed inset-0 modal-overlay flex items-center justify-center z-50">
          <div className="modal-content bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-2xl">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Escribir Nuevo Mensaje</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título
                </label>
                <Input
                  value={newMessage.title}
                  onChange={(e) => setNewMessage(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Título del mensaje"
                  className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría
                </label>
                <select
                  value={newMessage.category}
                  onChange={(e) => setNewMessage(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:border-pink-500 focus:ring-pink-500"
                >
                  {categories.map(category => (
                    <option key={category.name} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mensaje
                </label>
                <textarea
                  value={newMessage.content}
                  onChange={(e) => setNewMessage(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Escribe tu mensaje aquí..."
                  rows={4}
                  className="w-full p-2 border border-gray-300 rounded-md resize-none focus:border-pink-500 focus:ring-pink-500"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => setIsWriteModalOpen(false)}
                variant="outline"
                className="flex-1 border-gray-300 hover:bg-gray-50"
              >
                Cancelar
              </Button>
              <Button
                onClick={addNewMessage}
                className="flex-1 bg-pink-500 hover:bg-pink-600 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Guardar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para editar mensaje */}
      {isEditModalOpen && (
        <div className="fixed inset-0 modal-overlay flex items-center justify-center z-50">
          <div className="modal-content bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-2xl">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Editar Mensaje</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título
                </label>
                <Input
                  value={newMessage.title}
                  onChange={(e) => setNewMessage(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Título del mensaje"
                  className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría
                </label>
                <select
                  value={newMessage.category}
                  onChange={(e) => setNewMessage(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:border-pink-500 focus:ring-pink-500"
                >
                  {categories.map(category => (
                    <option key={category.name} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mensaje
                </label>
                <textarea
                  value={newMessage.content}
                  onChange={(e) => setNewMessage(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Escribe tu mensaje aquí..."
                  rows={4}
                  className="w-full p-2 border border-gray-300 rounded-md resize-none focus:border-pink-500 focus:ring-pink-500"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => {
                  setIsEditModalOpen(false)
                  setEditingMessage(null)
                  setNewMessage({ title: '', content: '', category: 'Amor' })
                }}
                variant="outline"
                className="flex-1 border-gray-300 hover:bg-gray-50"
              >
                Cancelar
              </Button>
              <Button
                onClick={saveEditedMessage}
                className="flex-1 bg-pink-500 hover:bg-pink-600 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Guardar Cambios
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
