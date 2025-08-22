export interface Gift {
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
  created_at?: string
  updated_at?: string
}

export interface GiftForm {
  name: string
  description: string
  category: Gift['category']
  type: Gift['type']
  price: number
  priority: Gift['priority']
  date: string
  occasion: string
  notes: string
  recipient: Gift['recipient']
  image: File | null
}
