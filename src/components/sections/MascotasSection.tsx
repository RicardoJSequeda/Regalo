'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  Pet, 
  PetCareTask, 
  PetHealthRecord, 
  PetPhoto, 
  PetInventory,
  PetMedication,
  PetWeightRecord,
  PetBehaviorRecord,
  PetExpense,
  PetStats,
  PetReminder
} from '@/types'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useNotifications } from '@/hooks/useNotifications'
import { FormValidation, validators, validateForm } from '@/components/ui/form-validation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { ImageUpload } from '@/components/ui/image-upload'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { 
  Plus, 
  Calendar, 
  Clock, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Filter,
  Search,
  Heart,
  PawPrint,
  Stethoscope,
  DollarSign,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  CalendarDays,
  Bell,
  Trophy,
  Star,
  Target,
  Award,
  Dog,
  Cat,
  Bird,
  Fish,
  Mouse,
  Rabbit,
  Activity,
  Droplets,
  Pill,
  Syringe,
  Scissors,
  Bone,
  Shirt,
  ShoppingCart,
  Camera,
  Image,
  UserPlus,
  Settings,
  Info,
  X
} from 'lucide-react'

const initialPets: Pet[] = [
  {
    id: 1,
    name: 'Don Estrella',
    type: 'gato',
    breed: 'Siamés',
    birthDate: '2023-09-15',
    weight: 3.2,
    color: 'Crema con puntos marrones',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop&crop=center',
    notes: 'Muy elegante y curioso, le encanta explorar y dormir en lugares altos',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  }
]

const initialTasks: PetCareTask[] = [
  {
    id: 1,
    petId: 1,
    title: 'Alimentación de Don Estrella',
    description: 'Dar comida húmeda y seca para gatos',
    type: 'alimentacion',
    frequency: 'diario',
    lastCompleted: '2024-01-20T08:00:00Z',
    nextDue: '2024-01-21T08:00:00Z',
    priority: 'Alta',
    status: 'pendiente',
    reminder: {
      enabled: true,
      time: '1h',
      type: 'notification'
    },
    notes: 'Usar comida premium para gatitos',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 2,
    petId: 1,
    title: 'Juego con Don Estrella',
    description: 'Sesión de juego con juguetes',
    type: 'ejercicio',
    frequency: 'diario',
    lastCompleted: '2024-01-20T18:00:00Z',
    nextDue: '2024-01-21T18:00:00Z',
    priority: 'Alta',
    status: 'pendiente',
    reminder: {
      enabled: true,
      time: '30m',
      type: 'notification'
    },
    notes: 'Usar juguetes con plumas y ratones',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 3,
    petId: 1,
    title: 'Cepillado de Don Estrella',
    description: 'Cepillado del pelaje suave',
    type: 'limpieza',
    frequency: 'semanal',
    lastCompleted: '2024-01-18T10:00:00Z',
    nextDue: '2024-01-25T10:00:00Z',
    priority: 'Media',
    status: 'pendiente',
    reminder: {
      enabled: true,
      time: '2h',
      type: 'notification'
    },
    notes: 'Usar cepillo suave para gatos',
    createdAt: '2024-01-20T14:30:00Z',
    updatedAt: '2024-01-20T14:30:00Z'
  },
  {
    id: 4,
    petId: 1,
    title: 'Limpieza de arenero',
    description: 'Cambiar arena y limpiar arenero',
    type: 'limpieza',
    frequency: 'diario',
    lastCompleted: '2024-01-20T16:00:00Z',
    nextDue: '2024-01-21T16:00:00Z',
    priority: 'Alta',
    status: 'pendiente',
    reminder: {
      enabled: true,
      time: '1h',
      type: 'notification'
    },
    notes: 'Usar arena aglomerante',
    createdAt: '2024-02-01T09:15:00Z',
    updatedAt: '2024-02-01T09:15:00Z'
  },
  {
    id: 5,
    petId: 1,
    title: 'Revisión veterinaria',
    description: 'Chequeo de salud del gatito',
    type: 'veterinario',
    frequency: 'mensual',
    lastCompleted: '2024-01-17T17:00:00Z',
    nextDue: '2024-02-17T17:00:00Z',
    priority: 'Media',
    status: 'pendiente',
    reminder: {
      enabled: true,
      time: '1d',
      type: 'notification'
    },
    notes: 'Llevar cartilla de vacunación',
    createdAt: '2024-01-25T16:45:00Z',
    updatedAt: '2024-01-25T16:45:00Z'
  },
  {
    id: 6,
    petId: 1,
    title: 'Corte de uñas',
    description: 'Corte de uñas delanteras',
    type: 'limpieza',
    frequency: 'mensual',
    lastCompleted: '2024-01-19T09:00:00Z',
    nextDue: '2024-02-19T09:00:00Z',
    priority: 'Media',
    status: 'pendiente',
    reminder: {
      enabled: true,
      time: '1h',
      type: 'notification'
    },
    notes: 'Usar cortaúñas para gatos',
    createdAt: '2024-02-05T11:20:00Z',
    updatedAt: '2024-02-05T11:20:00Z'
  },
  {
    id: 7,
    petId: 1,
    title: 'Vacunación',
    description: 'Vacuna triple felina',
    type: 'veterinario',
    frequency: 'mensual',
    lastCompleted: '2024-01-15T11:00:00Z',
    nextDue: '2024-02-15T11:00:00Z',
    priority: 'Alta',
    status: 'pendiente',
    reminder: {
      enabled: true,
      time: '1d',
      type: 'notification'
    },
    notes: 'Llevar a veterinaria especializada',
    createdAt: '2024-02-10T14:00:00Z',
    updatedAt: '2024-02-10T14:00:00Z'
  },
  {
    id: 8,
    petId: 1,
    title: 'Desparasitación',
    description: 'Tratamiento antiparasitario',
    type: 'veterinario',
    frequency: 'mensual',
    lastCompleted: '2024-01-20T08:00:00Z',
    nextDue: '2024-02-20T08:00:00Z',
    priority: 'Alta',
    status: 'pendiente',
    reminder: {
      enabled: true,
      time: '1d',
      type: 'notification'
    },
    notes: 'Aplicar pipeta antiparasitaria',
    createdAt: '2024-02-15T10:30:00Z',
    updatedAt: '2024-02-15T10:30:00Z'
  },
  {
    id: 9,
    petId: 1,
    title: 'Limpieza de ojos',
    description: 'Limpieza de ojos y cara',
    type: 'limpieza',
    frequency: 'semanal',
    lastCompleted: '2024-01-17T17:00:00Z',
    nextDue: '2024-01-24T17:00:00Z',
    priority: 'Media',
    status: 'pendiente',
    reminder: {
      enabled: true,
      time: '1h',
      type: 'notification'
    },
    notes: 'Usar toallitas húmedas especiales',
    createdAt: '2024-01-30T13:20:00Z',
    updatedAt: '2024-01-30T13:20:00Z'
  },
  {
    id: 10,
    petId: 1,
    title: 'Ejercicio mental',
    description: 'Juegos de estimulación mental',
    type: 'ejercicio',
    frequency: 'diario',
    lastCompleted: '2024-01-15T11:00:00Z',
    nextDue: '2024-01-16T11:00:00Z',
    priority: 'Media',
    status: 'pendiente',
    reminder: {
      enabled: true,
      time: '1h',
      type: 'notification'
    },
    notes: 'Usar puzzles y juguetes interactivos',
    createdAt: '2024-02-08T15:45:00Z',
    updatedAt: '2024-02-08T15:45:00Z'
  }
]

const initialHealthRecords: PetHealthRecord[] = [
  {
    id: 1,
    petId: 1,
    date: '2024-01-15',
    type: 'vacuna',
    title: 'Vacuna Triple Felina',
    description: 'Vacuna contra panleucopenia, calicivirus y rinotraqueitis',
    veterinarian: 'Dr. García',
    clinic: 'Clínica Veterinaria Felina',
    cost: 45,
    nextDue: '2025-01-15',
    notes: 'Don Estrella se portó muy bien durante la vacunación',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 2,
    petId: 1,
    date: '2024-01-10',
    type: 'revision',
    title: 'Revisión General',
    description: 'Chequeo de salud general y peso del gatito',
    veterinarian: 'Dra. Martínez',
    clinic: 'Clínica Veterinaria Felina',
    cost: 35,
    notes: 'Don Estrella está en perfecto estado de salud',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-10T09:00:00Z'
  },
  {
    id: 3,
    petId: 1,
    date: '2024-02-01',
    type: 'vacuna',
    title: 'Vacuna contra la Leucemia',
    description: 'Vacuna contra leucemia felina',
    veterinarian: 'Dr. López',
    clinic: 'Clínica Veterinaria Moderna',
    cost: 30,
    nextDue: '2025-02-01',
    notes: 'Don Estrella fue muy valiente durante la vacunación',
    createdAt: '2024-02-01T09:15:00Z',
    updatedAt: '2024-02-01T09:15:00Z'
  },
  {
    id: 4,
    petId: 1,
    date: '2024-01-25',
    type: 'tratamiento',
    title: 'Desparasitación',
    description: 'Tratamiento antiparasitario interno y externo',
    veterinarian: 'Dra. Rodríguez',
    clinic: 'Centro Veterinario Especializado',
    cost: 25,
    notes: 'Don Estrella toleró bien el tratamiento',
    createdAt: '2024-01-25T16:45:00Z',
    updatedAt: '2024-01-25T16:45:00Z'
  },
  {
    id: 5,
    petId: 1,
    date: '2024-02-05',
    type: 'revision',
    title: 'Chequeo de Peso',
    description: 'Control de peso y crecimiento del gatito',
    veterinarian: 'Dr. García',
    clinic: 'Clínica Veterinaria Felina',
    cost: 25,
    notes: 'Don Estrella mantiene un peso saludable para su edad',
    createdAt: '2024-02-05T11:20:00Z',
    updatedAt: '2024-02-05T11:20:00Z'
  },
  {
    id: 6,
    petId: 1,
    date: '2024-02-10',
    type: 'revision',
    title: 'Revisión de Ojos',
    description: 'Chequeo de la vista y ojos del gatito',
    veterinarian: 'Dr. Oftalmólogo',
    clinic: 'Clínica Veterinaria Especializada',
    cost: 40,
    notes: 'Los ojos de Don Estrella están perfectos',
    createdAt: '2024-02-10T14:00:00Z',
    updatedAt: '2024-02-10T14:00:00Z'
  },
  {
    id: 7,
    petId: 1,
    date: '2024-02-15',
    type: 'vacuna',
    title: 'Vacuna contra la Rabia',
    description: 'Vacuna contra la rabia',
    veterinarian: 'Dra. García',
    clinic: 'Clínica Veterinaria Felina',
    cost: 35,
    nextDue: '2025-02-15',
    notes: 'Don Estrella se portó muy bien',
    createdAt: '2024-02-15T10:30:00Z',
    updatedAt: '2024-02-15T10:30:00Z'
  },
  {
    id: 8,
    petId: 1,
    date: '2024-01-30',
    type: 'revision',
    title: 'Chequeo de Corazón',
    description: 'Control cardíaco y pulso del gatito',
    veterinarian: 'Dr. Cardiólogo',
    clinic: 'Clínica Veterinaria Felina',
    cost: 50,
    notes: 'El corazón de Don Estrella funciona perfectamente',
    createdAt: '2024-01-30T13:20:00Z',
    updatedAt: '2024-01-30T13:20:00Z'
  },
  {
    id: 9,
    petId: 1,
    date: '2024-02-08',
    type: 'tratamiento',
    title: 'Esterilización',
    description: 'Procedimiento de esterilización',
    veterinarian: 'Dra. Martínez',
    clinic: 'Clínica Veterinaria Felina',
    cost: 120,
    notes: 'Don Estrella se recuperó muy bien',
    createdAt: '2024-02-08T15:45:00Z',
    updatedAt: '2024-02-08T15:45:00Z'
  },
  {
    id: 10,
    petId: 1,
    date: '2024-02-20',
    type: 'revision',
    title: 'Revisión de Piel',
    description: 'Chequeo de la piel y pelaje del gatito',
    veterinarian: 'Dr. Dermatólogo',
    clinic: 'Clínica Veterinaria Especializada',
    cost: 45,
    notes: 'La piel y pelaje de Don Estrella están saludables',
    createdAt: '2024-02-20T12:00:00Z',
    updatedAt: '2024-02-20T12:00:00Z'
  }
]



const initialPhotos: PetPhoto[] = [
  {
    id: 1,
    petId: 1,
    title: 'Don Estrella durmiendo',
    description: 'Descansando en su lugar favorito',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop&crop=center',
    date: '2024-01-15',
    tags: ['descanso', 'hogar'],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 2,
    petId: 1,
    title: 'Don Estrella jugando',
    description: 'Jugando con su juguete favorito',
    image: 'https://images.unsplash.com/photo-1546527868-ccb7ee7dfa6a?w=400&h=400&fit=crop&crop=center',
    date: '2024-01-16',
    tags: ['juego', 'actividad'],
    createdAt: '2024-01-16T14:00:00Z',
    updatedAt: '2024-01-16T14:00:00Z'
  },
  {
    id: 3,
    petId: 1,
    title: 'Don Estrella explorando',
    description: 'Investigando su nuevo territorio',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop&crop=center',
    date: '2024-01-17',
    tags: ['exploración', 'curiosidad'],
    createdAt: '2024-01-17T09:00:00Z',
    updatedAt: '2024-01-17T09:00:00Z'
  },
  {
    id: 4,
    petId: 1,
    title: 'Don Estrella en la ventana',
    description: 'Observando el mundo exterior',
    image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=400&h=400&fit=crop&crop=center',
    date: '2024-02-01',
    tags: ['ventana', 'observación'],
    createdAt: '2024-02-01T09:15:00Z',
    updatedAt: '2024-02-01T09:15:00Z'
  },
  {
    id: 5,
    petId: 1,
    title: 'Don Estrella comiendo',
    description: 'Disfrutando de su comida',
    image: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400&h=400&fit=crop&crop=center',
    date: '2024-01-25',
    tags: ['alimentación', 'comida'],
    createdAt: '2024-01-25T16:45:00Z',
    updatedAt: '2024-01-25T16:45:00Z'
  },
  {
    id: 6,
    petId: 1,
    title: 'Don Estrella feliz',
    description: 'Mostrando su alegría',
    image: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=400&h=400&fit=crop&crop=center',
    date: '2024-02-05',
    tags: ['felicidad', 'alegría'],
    createdAt: '2024-02-05T11:20:00Z',
    updatedAt: '2024-02-05T11:20:00Z'
  },
  {
    id: 7,
    petId: 1,
    title: 'Don Estrella cazando',
    description: 'Persiguiendo su presa',
    image: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=400&h=400&fit=crop&crop=center',
    date: '2024-02-10',
    tags: ['caza', 'instinto'],
    createdAt: '2024-02-10T14:00:00Z',
    updatedAt: '2024-02-10T14:00:00Z'
  },
  {
    id: 8,
    petId: 1,
    title: 'Don Estrella acicalándose',
    description: 'Limpiándose el pelaje',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop&crop=center',
    date: '2024-02-15',
    tags: ['limpieza', 'acicalamiento'],
    createdAt: '2024-02-15T10:30:00Z',
    updatedAt: '2024-02-15T10:30:00Z'
  },
  {
    id: 9,
    petId: 1,
    title: 'Don Estrella trepando',
    description: 'Escalando su árbol para gatos',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop&crop=center',
    date: '2024-01-30',
    tags: ['trepar', 'ejercicio'],
    createdAt: '2024-01-30T13:20:00Z',
    updatedAt: '2024-01-30T13:20:00Z'
  },
  {
    id: 10,
    petId: 1,
    title: 'Don Estrella descansando',
    description: 'Relajado en su cama',
    image: 'https://images.unsplash.com/photo-1546527868-ccb7ee7dfa6a?w=400&h=400&fit=crop&crop=center',
    date: '2024-02-08',
    tags: ['descanso', 'relajación'],
    createdAt: '2024-02-08T15:45:00Z',
    updatedAt: '2024-02-08T15:45:00Z'
  }
]

const initialInventory: PetInventory[] = [
  {
    id: 1,
    petId: 1,
    name: 'Comida Premium para Gatos',
    category: 'alimentacion',
    description: 'Bolsa de 2kg de comida premium para gatitos',
    quantity: 2,
    unit: 'bolsas',
    price: 18.50,
    purchaseDate: '2024-01-20',
    expiryDate: '2024-12-31',
    createdAt: '2024-01-20T15:00:00Z',
    updatedAt: '2024-01-20T15:00:00Z'
  },
  {
    id: 2,
    petId: 1,
    name: 'Juguete para Gatos',
    category: 'juguetes',
    description: 'Ratón de peluche con catnip',
    quantity: 1,
    unit: 'unidad',
    price: 8.99,
    purchaseDate: '2024-01-19',
    createdAt: '2024-01-19T16:30:00Z',
    updatedAt: '2024-01-19T16:30:00Z'
  },
  {
    id: 3,
    petId: 1,
    name: 'Collar con Placa',
    category: 'accesorios',
    description: 'Collar ajustable con placa de identificación',
    quantity: 1,
    unit: 'unidad',
    price: 12.99,
    purchaseDate: '2024-02-01',
    createdAt: '2024-02-01T09:15:00Z',
    updatedAt: '2024-02-01T09:15:00Z'
  },
  {
    id: 4,
    petId: 1,
    name: 'Cepillo para Gatos',
    category: 'limpieza',
    description: 'Cepillo suave para gatos',
    quantity: 1,
    unit: 'unidad',
    price: 10.50,
    purchaseDate: '2024-01-25',
    createdAt: '2024-01-25T16:45:00Z',
    updatedAt: '2024-01-25T16:45:00Z'
  },
  {
    id: 5,
    petId: 1,
    name: 'Premios para Gatos',
    category: 'alimentacion',
    description: 'Premios pequeños para gatos',
    quantity: 1,
    unit: 'paquete',
    price: 6.99,
    purchaseDate: '2024-02-05',
    expiryDate: '2024-08-05',
    createdAt: '2024-02-05T11:20:00Z',
    updatedAt: '2024-02-05T11:20:00Z'
  },
  {
    id: 6,
    petId: 1,
    name: 'Arena para Gatos',
    category: 'limpieza',
    description: 'Arena aglomerante para arenero',
    quantity: 1,
    unit: 'paquete',
    price: 15.00,
    purchaseDate: '2024-02-10',
    createdAt: '2024-02-10T14:00:00Z',
    updatedAt: '2024-02-10T14:00:00Z'
  },
  {
    id: 7,
    petId: 1,
    name: 'Cortaúñas para Gatos',
    category: 'limpieza',
    description: 'Cortaúñas especial para gatos',
    quantity: 1,
    unit: 'unidad',
    price: 8.99,
    purchaseDate: '2024-02-15',
    createdAt: '2024-02-15T10:30:00Z',
    updatedAt: '2024-02-15T10:30:00Z'
  },
  {
    id: 8,
    petId: 1,
    name: 'Rascador para Gatos',
    category: 'accesorios',
    description: 'Rascador de cartón con catnip',
    quantity: 1,
    unit: 'unidad',
    price: 14.99,
    purchaseDate: '2024-01-30',
    createdAt: '2024-01-30T13:20:00Z',
    updatedAt: '2024-01-30T13:20:00Z'
  },
  {
    id: 9,
    petId: 1,
    name: 'Árbol para Gatos',
    category: 'accesorios',
    description: 'Árbol para trepar y descansar',
    quantity: 1,
    unit: 'unidad',
    price: 45.50,
    purchaseDate: '2024-02-08',
    createdAt: '2024-02-08T15:45:00Z',
    updatedAt: '2024-02-08T15:45:00Z'
  },
  {
    id: 10,
    petId: 1,
    name: 'Cama para Gatos',
    category: 'accesorios',
    description: 'Cama cómoda para descanso',
    quantity: 1,
    unit: 'unidad',
    price: 25.99,
    purchaseDate: '2024-02-20',
    createdAt: '2024-02-20T12:00:00Z',
    updatedAt: '2024-02-20T12:00:00Z'
  }
]

const initialMedications: PetMedication[] = [
  {
    id: 1,
    petId: 1,
    name: 'Vitaminas para Gatos',
    description: 'Vitaminas para fortalecer el sistema inmunológico',
    dosage: '1 comprimido',
    frequency: 'diario',
    startDate: '2024-01-15',
    endDate: '2024-04-15',
    timesPerDay: 1,
    status: 'activo',
    veterinarian: 'Dr. García',
    notes: 'Administrar con la comida de la mañana',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 2,
    petId: 1,
    name: 'Antiparasitario Interno',
    description: 'Tratamiento mensual contra parásitos internos',
    dosage: '1 pastilla',
    frequency: 'una_vez',
    startDate: '2024-01-20',
    endDate: '2024-12-20',
    timesPerDay: 1,
    status: 'activo',
    veterinarian: 'Dra. Martínez',
    notes: 'Administrar con comida húmeda',
    createdAt: '2024-01-20T14:30:00Z',
    updatedAt: '2024-01-20T14:30:00Z'
  },
  {
    id: 3,
    petId: 1,
    name: 'Pipeta Antiparasitaria',
    description: 'Protección contra pulgas y garrapatas',
    dosage: '1 pipeta',
    frequency: 'una_vez',
    startDate: '2024-01-25',
    endDate: '2024-12-25',
    timesPerDay: 1,
    status: 'activo',
    veterinarian: 'Dr. López',
    notes: 'Aplicar en la nuca del gato',
    createdAt: '2024-01-25T16:45:00Z',
    updatedAt: '2024-01-25T16:45:00Z'
  },
  {
    id: 4,
    petId: 1,
    name: 'Probióticos Digestivos',
    description: 'Para mejorar la digestión y flora intestinal',
    dosage: '1 cucharadita',
    frequency: 'diario',
    startDate: '2024-02-01',
    endDate: '2024-03-01',
    timesPerDay: 1,
    status: 'activo',
    veterinarian: 'Dra. Rodríguez',
    notes: 'Mezclar con la comida',
    createdAt: '2024-02-01T09:15:00Z',
    updatedAt: '2024-02-01T09:15:00Z'
  },
  {
    id: 5,
    petId: 1,
    name: 'Suplemento de Omega 3',
    description: 'Para mejorar la salud del pelaje y la piel',
    dosage: '1 cápsula',
    frequency: 'diario',
    startDate: '2024-02-05',
    endDate: '2024-05-05',
    timesPerDay: 1,
    status: 'activo',
    veterinarian: 'Dr. García',
    notes: 'Abrir cápsula y mezclar con comida',
    createdAt: '2024-02-05T11:20:00Z',
    updatedAt: '2024-02-05T11:20:00Z'
  }
]

const initialWeightRecords: PetWeightRecord[] = [
  {
    id: 1,
    petId: 1,
    date: '2024-01-15',
    weight: 2.8,
    notes: 'Peso inicial al llegar a casa - Dr. García',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 2,
    petId: 1,
    date: '2024-01-22',
    weight: 2.9,
    notes: 'Ganancia de peso saludable - Dr. García',
    createdAt: '2024-01-22T14:30:00Z'
  },
  {
    id: 3,
    petId: 1,
    date: '2024-01-29',
    weight: 3.0,
    notes: 'Crecimiento normal para su edad - Dr. García',
    createdAt: '2024-01-29T16:45:00Z'
  },
  {
    id: 4,
    petId: 1,
    date: '2024-02-05',
    weight: 3.1,
    notes: 'Mantiene ritmo de crecimiento saludable - Dr. García',
    createdAt: '2024-02-05T09:15:00Z'
  },
  {
    id: 5,
    petId: 1,
    date: '2024-02-12',
    weight: 3.2,
    notes: 'Peso ideal para gato de 6 meses - Dr. García',
    createdAt: '2024-02-12T11:20:00Z'
  }
]

const initialBehaviorRecords: PetBehaviorRecord[] = [
  {
    id: 1,
    petId: 1,
    date: '2024-01-15',
    type: 'positivo',
    title: 'Primer día en casa',
    description: 'Don Estrella se adaptó muy bien a su nuevo hogar',
    severity: 'leve',
    notes: 'Exploró toda la casa y encontró su lugar favorito',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 2,
    petId: 1,
    date: '2024-01-20',
    type: 'positivo',
    title: 'Sesión de juego intensa',
    description: 'Jugó activamente con sus juguetes durante 30 minutos',
    severity: 'leve',
    notes: 'Le encanta perseguir el puntero láser',
    createdAt: '2024-01-20T14:30:00Z'
  },
  {
    id: 3,
    petId: 1,
    date: '2024-01-25',
    type: 'neutro',
    title: 'Día tranquilo',
    description: 'Pasó la mayor parte del día durmiendo',
    severity: 'leve',
    notes: 'Probablemente creciendo, necesita más descanso',
    createdAt: '2024-01-25T16:45:00Z'
  },
  {
    id: 4,
    petId: 1,
    date: '2024-02-01',
    type: 'positivo',
    title: 'Nueva aventura',
    description: 'Descubrió el balcón y pasó horas observando',
    severity: 'leve',
    notes: 'Le fascina ver pájaros desde la ventana',
    createdAt: '2024-02-01T09:15:00Z'
  },
  {
    id: 5,
    petId: 1,
    date: '2024-02-08',
    type: 'neutro',
    title: 'Visita al veterinario',
    description: 'Se portó muy bien durante la revisión',
    severity: 'leve',
    notes: 'Recuperó su apetito normal al día siguiente',
    createdAt: '2024-02-08T11:20:00Z'
  }
]

const initialExpenses: PetExpense[] = [
  {
    id: 1,
    petId: 1,
    date: '2024-01-15',
    category: 'otro',
    title: 'Adopción de Don Estrella',
    description: 'Costo de adopción y primeros suministros',
    amount: 150.00,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 2,
    petId: 1,
    date: '2024-01-20',
    category: 'veterinario',
    title: 'Primera visita veterinaria',
    description: 'Chequeo general y vacunas',
    amount: 85.00,
    createdAt: '2024-01-20T14:30:00Z',
    updatedAt: '2024-01-20T14:30:00Z'
  },
  {
    id: 3,
    petId: 1,
    date: '2024-01-25',
    category: 'alimentacion',
    title: 'Comida premium para gatitos',
    description: 'Bolsa de 2kg de comida premium',
    amount: 18.50,
    createdAt: '2024-01-25T16:45:00Z',
    updatedAt: '2024-01-25T16:45:00Z'
  },
  {
    id: 4,
    petId: 1,
    date: '2024-02-01',
    category: 'accesorios',
    title: 'Árbol para gatos',
    description: 'Árbol de 3 niveles con rascador',
    amount: 45.50,
    createdAt: '2024-02-01T09:15:00Z',
    updatedAt: '2024-02-01T09:15:00Z'
  },
  {
    id: 5,
    petId: 1,
    date: '2024-02-08',
    category: 'veterinario',
    title: 'Vacuna contra la rabia',
    description: 'Vacuna obligatoria anual',
    amount: 35.00,
    createdAt: '2024-02-08T11:20:00Z',
    updatedAt: '2024-02-08T11:20:00Z'
  },
  {
    id: 6,
    petId: 1,
    date: '2024-02-15',
    category: 'medicina',
    title: 'Vitaminas y suplementos',
    description: 'Vitaminas y omega 3 para el pelaje',
    amount: 55.00,
    createdAt: '2024-02-15T10:30:00Z',
    updatedAt: '2024-02-15T10:30:00Z'
  },
  {
    id: 7,
    petId: 1,
    date: '2024-02-20',
    category: 'juguetes',
    title: 'Juguetes interactivos',
    description: 'Set de juguetes con plumas y ratones',
    amount: 25.00,
    createdAt: '2024-02-20T12:00:00Z',
    updatedAt: '2024-02-20T12:00:00Z'
  },
  {
    id: 8,
    petId: 1,
    date: '2024-02-25',
    category: 'limpieza',
    title: 'Arena y productos de limpieza',
    description: 'Arena aglomerante y limpiador de arenero',
    amount: 22.00,
    createdAt: '2024-02-25T15:45:00Z',
    updatedAt: '2024-02-25T15:45:00Z'
  }
]

export function MascotasSection() {
  // Hooks para persistencia y notificaciones
  const { value: pets, setValue: setPets } = useLocalStorage<Pet[]>('pets', initialPets)
  const { value: tasks, setValue: setTasks } = useLocalStorage<PetCareTask[]>('petTasks', initialTasks)
  const { value: healthRecords, setValue: setHealthRecords } = useLocalStorage<PetHealthRecord[]>('petHealthRecords', initialHealthRecords)
  const { value: photos, setValue: setPhotos } = useLocalStorage<PetPhoto[]>('petPhotos', initialPhotos)
  const { value: inventory, setValue: setInventory } = useLocalStorage<PetInventory[]>('petInventory', initialInventory)
  const { value: medications, setValue: setMedications } = useLocalStorage<PetMedication[]>('petMedications', initialMedications)
  const { value: weightRecords, setValue: setWeightRecords } = useLocalStorage<PetWeightRecord[]>('petWeightRecords', initialWeightRecords)
  const { value: behaviorRecords, setValue: setBehaviorRecords } = useLocalStorage<PetBehaviorRecord[]>('petBehaviorRecords', initialBehaviorRecords)
  const { value: expenses, setValue: setExpenses } = useLocalStorage<PetExpense[]>('petExpenses', initialExpenses)
  const { value: reminders, setValue: setReminders } = useLocalStorage<PetReminder[]>('petReminders', [])

  // Asegurar que los datos se carguen correctamente
  useEffect(() => {
    // Forzar la carga de los nuevos datos de Don Estrella
    console.log('Cargando datos de Don Estrella...')
    
    // Limpiar localStorage y cargar nuevos datos
    localStorage.removeItem('pets')
    localStorage.removeItem('petTasks')
    localStorage.removeItem('petHealthRecords')
    localStorage.removeItem('petPhotos')
    localStorage.removeItem('petInventory')
    localStorage.removeItem('petMedications')
    localStorage.removeItem('petWeightRecords')
    localStorage.removeItem('petBehaviorRecords')
    localStorage.removeItem('petExpenses')
    
    // Cargar los nuevos datos
    setPets(initialPets)
    setTasks(initialTasks)
    setHealthRecords(initialHealthRecords)
    setPhotos(initialPhotos)
    setInventory(initialInventory)
    setMedications(initialMedications)
    setWeightRecords(initialWeightRecords)
    setBehaviorRecords(initialBehaviorRecords)
    setExpenses(initialExpenses)
    
    console.log('Datos de Don Estrella cargados:', {
      pets: initialPets.length,
      tasks: initialTasks.length,
      healthRecords: initialHealthRecords.length,
      photos: initialPhotos.length,
      inventory: initialInventory.length,
      medications: initialMedications.length,
      weightRecords: initialWeightRecords.length,
      behaviorRecords: initialBehaviorRecords.length,
      expenses: initialExpenses.length
    })
  }, [setPets, setTasks, setHealthRecords, setPhotos, setInventory, setMedications, setWeightRecords, setBehaviorRecords, setExpenses])

  // Hook de notificaciones
  const { requestPermission, sendNotification } = useNotifications()
  const [activeTab, setActiveTab] = useState('mascotas')
  const [showAddPetDialog, setShowAddPetDialog] = useState(false)
  const [showAddTaskDialog, setShowAddTaskDialog] = useState(false)
  const [showAddHealthDialog, setShowAddHealthDialog] = useState(false)
  const [showAddPhotoDialog, setShowAddPhotoDialog] = useState(false)
  const [showAddInventoryDialog, setShowAddInventoryDialog] = useState(false)
  const [showAddMedicationDialog, setShowAddMedicationDialog] = useState(false)
  const [showAddWeightDialog, setShowAddWeightDialog] = useState(false)
  const [showAddBehaviorDialog, setShowAddBehaviorDialog] = useState(false)
  const [showAddExpenseDialog, setShowAddExpenseDialog] = useState(false)
  const [isEditingTask, setIsEditingTask] = useState(false)
  const [isEditingInventory, setIsEditingInventory] = useState(false)
  const [isEditingMedication, setIsEditingMedication] = useState(false)
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('todos')
  const [validationErrors, setValidationErrors] = useState<any[]>([])

  // Estados para formularios
  const [newPet, setNewPet] = useState<Partial<Pet>>({})
  const [newTask, setNewTask] = useState<Partial<PetCareTask>>({})
  const [newHealthRecord, setNewHealthRecord] = useState<Partial<PetHealthRecord>>({})
  const [newPhoto, setNewPhoto] = useState<Partial<PetPhoto>>({})
  const [newInventory, setNewInventory] = useState<Partial<PetInventory>>({})
  const [newMedication, setNewMedication] = useState<Partial<PetMedication>>({})
  const [newWeightRecord, setNewWeightRecord] = useState<Partial<PetWeightRecord>>({})
  const [newBehaviorRecord, setNewBehaviorRecord] = useState<Partial<PetBehaviorRecord>>({})
  const [newExpense, setNewExpense] = useState<Partial<PetExpense>>({})

  const petTypeIcons = {
    perro: Dog,
    gato: Cat,
    pajaro: Bird,
    pez: Fish,
    hamster: Mouse,
    conejo: Rabbit,
    otro: PawPrint
  }

  const taskTypeIcons = {
    alimentacion: Bone,
    ejercicio: Activity,
    limpieza: Droplets,
    veterinario: Stethoscope,
    medicina: Pill,
    otro: PawPrint
  }

  const getPetTypeIcon = (type: string) => {
    const IconComponent = petTypeIcons[type as keyof typeof petTypeIcons] || PawPrint
    return <IconComponent className="h-4 w-4" />
  }

  const getTaskTypeIcon = (type: string) => {
    const IconComponent = taskTypeIcons[type as keyof typeof taskTypeIcons] || PawPrint
    return <IconComponent className="h-4 w-4" />
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Alta': return 'bg-red-100 text-red-800 border-red-200'
      case 'Media': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Baja': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completado': return 'bg-green-100 text-green-800 border-green-200'
      case 'pendiente': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'atrasado': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const filteredPets = pets.filter(pet => 
    pet.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterType === 'todos' || pet.type === filterType)
  )

  const filteredTasks = tasks.filter(task => {
    const pet = pets.find(p => p.id === task.petId)
    return pet && pet.name.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const getPetById = (id: number) => pets.find(pet => pet.id === id)

  // Función de validación para mascotas
  const validatePet = (pet: Partial<Pet>) => {
    const rules = {
      name: [validators.required],
      type: [validators.required]
    }
    return validateForm(pet, rules)
  }

  const addPet = () => {
    const errors = validatePet(newPet)
    if (errors.length > 0) {
      setValidationErrors(errors)
      return
    }

    if (newPet.name && newPet.type) {
      if (selectedPet) {
        // Editar mascota existente
        const updatedPet: Pet = {
          ...selectedPet,
          name: newPet.name,
          type: newPet.type as 'perro' | 'gato' | 'pajaro' | 'pez' | 'hamster' | 'conejo' | 'otro',
          breed: newPet.breed,
          birthDate: newPet.birthDate,
          weight: newPet.weight,
          color: newPet.color,
          image: newPet.image,
          notes: newPet.notes,
          updatedAt: new Date().toISOString()
        }
        setPets(pets.map(p => p.id === selectedPet.id ? updatedPet : p))
        
        // Enviar notificación
        sendNotification({
          title: 'Mascota actualizada',
          body: `Se ha actualizado la información de ${updatedPet.name}`
        })
      } else {
        // Agregar nueva mascota
      const pet: Pet = {
        id: Date.now(),
        name: newPet.name,
        type: newPet.type as 'perro' | 'gato' | 'pajaro' | 'pez' | 'hamster' | 'conejo' | 'otro',
        breed: newPet.breed,
        birthDate: newPet.birthDate,
        weight: newPet.weight,
        color: newPet.color,
        image: newPet.image,
        notes: newPet.notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setPets([...pets, pet])
        
        // Enviar notificación
        sendNotification({
          title: 'Nueva mascota agregada',
          body: `Se ha agregado ${pet.name} a tu familia de mascotas`
        })
      }
      
      setNewPet({})
      setSelectedPet(null)
      setShowAddPetDialog(false)
      setValidationErrors([])
    }
  }

  const addTask = () => {
    if (newTask.title && newTask.petId && newTask.type) {
      if (isEditingTask && newTask.id) {
        // Editar tarea existente
        setTasks(tasks.map(task => 
          task.id === newTask.id 
            ? {
                ...task,
                petId: newTask.petId as number,
                title: newTask.title || '',
                description: newTask.description || '',
                type: newTask.type as 'alimentacion' | 'ejercicio' | 'limpieza' | 'veterinario' | 'medicina' | 'otro',
                frequency: (newTask.frequency as 'diario' | 'semanal' | 'mensual' | 'personalizado') || 'diario',
                nextDue: newTask.nextDue || new Date().toISOString(),
                priority: (newTask.priority as 'Alta' | 'Media' | 'Baja') || 'Media',
                reminder: newTask.reminder,
                notes: newTask.notes,
                updatedAt: new Date().toISOString()
              }
            : task
        ))
      } else {
        // Agregar nueva tarea
        const task: PetCareTask = {
          id: Date.now(),
          petId: newTask.petId as number,
          title: newTask.title,
          description: newTask.description || '',
          type: newTask.type as 'alimentacion' | 'ejercicio' | 'limpieza' | 'veterinario' | 'medicina' | 'otro',
          frequency: (newTask.frequency as 'diario' | 'semanal' | 'mensual' | 'personalizado') || 'diario',
          nextDue: newTask.nextDue || new Date().toISOString(),
          priority: (newTask.priority as 'Alta' | 'Media' | 'Baja') || 'Media',
          status: 'pendiente',
          reminder: newTask.reminder,
          notes: newTask.notes,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        setTasks([...tasks, task])
      }
      setNewTask({})
      setShowAddTaskDialog(false)
      setIsEditingTask(false)
    }
  }

  const addHealthRecord = () => {
    if (newHealthRecord.title && newHealthRecord.petId && newHealthRecord.type) {
      const record: PetHealthRecord = {
        id: Date.now(),
        petId: newHealthRecord.petId as number,
        date: newHealthRecord.date || new Date().toISOString().split('T')[0],
        type: newHealthRecord.type as 'vacuna' | 'desparasitacion' | 'revision' | 'tratamiento' | 'otro',
        title: newHealthRecord.title,
        description: newHealthRecord.description || '',
        veterinarian: newHealthRecord.veterinarian,
        clinic: newHealthRecord.clinic,
        cost: newHealthRecord.cost,
        nextDue: newHealthRecord.nextDue,
        notes: newHealthRecord.notes,
        attachments: newHealthRecord.attachments,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setHealthRecords([...healthRecords, record])
      setNewHealthRecord({})
      setShowAddHealthDialog(false)
    }
  }



  const completeTask = (taskId: number) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: 'completado', lastCompleted: new Date().toISOString() }
        : task
    ))
  }

  const toggleTaskStatus = (taskId: number) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            status: task.status === 'completado' ? 'pendiente' : 'completado', 
            lastCompleted: task.status === 'pendiente' ? new Date().toISOString() : undefined,
            updatedAt: new Date().toISOString() 
          }
        : task
    ))
  }

  const deleteTask = (taskId: number) => {
    setTasks(tasks.filter(task => task.id !== taskId))
  }

  const editTask = (taskId: number) => {
    const task = tasks.find(t => t.id === taskId)
    if (task) {
      setNewTask({
        id: task.id,
        petId: task.petId,
        title: task.title,
        description: task.description,
        type: task.type,
        frequency: task.frequency,
        nextDue: task.nextDue,
        priority: task.priority,
        reminder: task.reminder,
        notes: task.notes
      })
      setIsEditingTask(true)
      setShowAddTaskDialog(true)
    }
  }

  const deleteInventoryItem = (itemId: number) => {
    setInventory(inventory.filter(item => item.id !== itemId))
  }

  const editInventoryItem = (itemId: number) => {
    const item = inventory.find(i => i.id === itemId)
    if (item) {
      setNewInventory({
        id: item.id,
        petId: item.petId,
        name: item.name,
        category: item.category,
        description: item.description,
        quantity: item.quantity,
        unit: item.unit,
        price: item.price,
        purchaseDate: item.purchaseDate,
        expiryDate: item.expiryDate,
        image: item.image,
        notes: item.notes
      })
      setIsEditingInventory(true)
      setShowAddInventoryDialog(true)
    }
  }

  const addPhoto = () => {
    if (newPhoto.image && newPhoto.petId) {
      const photo: PetPhoto = {
        id: Date.now(),
        petId: newPhoto.petId as number,
        title: newPhoto.description ? `Foto: ${newPhoto.description}` : 'Nueva Foto',
        description: newPhoto.description,
        image: newPhoto.image,
        date: new Date().toISOString().split('T')[0],
        tags: newPhoto.tags,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setPhotos([...photos, photo])
      setNewPhoto({})
      setShowAddPhotoDialog(false)
    }
  }

  const addInventory = () => {
    if (newInventory.name && newInventory.petId && newInventory.category) {
      if (isEditingInventory && newInventory.id) {
        // Editar item existente
        setInventory(inventory.map(item => 
          item.id === newInventory.id 
            ? {
                ...item,
                petId: newInventory.petId as number,
                name: newInventory.name || '',
                category: newInventory.category as 'alimentacion' | 'juguetes' | 'accesorios' | 'limpieza' | 'medicina' | 'otro',
                description: newInventory.description || '',
                quantity: newInventory.quantity || 1,
                unit: newInventory.unit,
                price: newInventory.price,
                purchaseDate: newInventory.purchaseDate,
                expiryDate: newInventory.expiryDate,
                image: newInventory.image,
                notes: newInventory.notes,
                updatedAt: new Date().toISOString()
              }
            : item
        ))
      } else {
        // Agregar nuevo item
        const item: PetInventory = {
          id: Date.now(),
          petId: newInventory.petId as number,
          name: newInventory.name,
          category: newInventory.category as 'alimentacion' | 'juguetes' | 'accesorios' | 'limpieza' | 'medicina' | 'otro',
          description: newInventory.description,
          quantity: newInventory.quantity || 1,
          unit: newInventory.unit,
          price: newInventory.price,
          purchaseDate: newInventory.purchaseDate,
          expiryDate: newInventory.expiryDate,
          image: newInventory.image,
          notes: newInventory.notes,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        setInventory([...inventory, item])
      }
      setNewInventory({})
      setShowAddInventoryDialog(false)
      setIsEditingInventory(false)
    }
  }

  const deletePet = (petId: number) => {
    setPets(pets.filter(pet => pet.id !== petId))
    setTasks(tasks.filter(task => task.petId !== petId))
    setHealthRecords(healthRecords.filter(record => record.petId !== petId))
    setPhotos(photos.filter(photo => photo.petId !== petId))
    setInventory(inventory.filter(item => item.petId !== petId))
    setMedications(medications.filter(med => med.petId !== petId))
    setWeightRecords(weightRecords.filter(weight => weight.petId !== petId))
    setBehaviorRecords(behaviorRecords.filter(behavior => behavior.petId !== petId))
    setExpenses(expenses.filter(expense => expense.petId !== petId))
    setReminders(reminders.filter(reminder => reminder.petId !== petId))
  }

  // Funciones para medicamentos
  const addMedication = () => {
    if (newMedication.name && newMedication.petId && newMedication.dosage) {
      const medication: PetMedication = {
        id: Date.now(),
        petId: newMedication.petId as number,
        name: newMedication.name,
        description: newMedication.description || '',
        dosage: newMedication.dosage,
        frequency: (newMedication.frequency as any) || 'diario',
        startDate: newMedication.startDate || new Date().toISOString().split('T')[0],
        endDate: newMedication.endDate,
        timesPerDay: newMedication.timesPerDay || 1,
        specificTimes: newMedication.specificTimes,
        status: 'activo',
        veterinarian: newMedication.veterinarian,
        notes: newMedication.notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setMedications([...medications, medication])
      setNewMedication({})
      setShowAddMedicationDialog(false)
      setIsEditingMedication(false)
    }
  }

  // Funciones para seguimiento de peso
  const addWeightRecord = () => {
    if (newWeightRecord.petId && newWeightRecord.weight) {
      const weightRecord: PetWeightRecord = {
        id: Date.now(),
        petId: newWeightRecord.petId as number,
        date: newWeightRecord.date || new Date().toISOString().split('T')[0],
        weight: newWeightRecord.weight,
        notes: newWeightRecord.notes,
        createdAt: new Date().toISOString()
      }
      setWeightRecords([...weightRecords, weightRecord])
      setNewWeightRecord({})
      setShowAddWeightDialog(false)
    }
  }

  // Funciones para comportamiento
  const addBehaviorRecord = () => {
    if (newBehaviorRecord.petId && newBehaviorRecord.title) {
      const behaviorRecord: PetBehaviorRecord = {
        id: Date.now(),
        petId: newBehaviorRecord.petId as number,
        date: newBehaviorRecord.date || new Date().toISOString().split('T')[0],
        type: (newBehaviorRecord.type as any) || 'neutro',
        title: newBehaviorRecord.title,
        description: newBehaviorRecord.description || '',
        severity: newBehaviorRecord.severity,
        notes: newBehaviorRecord.notes,
        createdAt: new Date().toISOString()
      }
      setBehaviorRecords([...behaviorRecords, behaviorRecord])
      setNewBehaviorRecord({})
      setShowAddBehaviorDialog(false)
    }
  }

  // Funciones para gastos
  const addExpense = () => {
    if (newExpense.petId && newExpense.title && newExpense.amount) {
      const expense: PetExpense = {
        id: Date.now(),
        petId: newExpense.petId as number,
        date: newExpense.date || new Date().toISOString().split('T')[0],
        category: (newExpense.category as any) || 'otro',
        title: newExpense.title,
        amount: newExpense.amount,
        description: newExpense.description,
        receipt: newExpense.receipt,
        recurring: newExpense.recurring,
        frequency: newExpense.frequency,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setExpenses([...expenses, expense])
      setNewExpense({})
      setShowAddExpenseDialog(false)
    }
  }

  // Cálculo de estadísticas
  const pendingTasks = tasks.filter(task => task.status === 'pendiente').length
  const completedTasks = tasks.filter(task => task.status === 'completado').length
  const totalPhotos = photos.length
  const totalInventory = inventory.length
  const activeMedications = medications.filter(med => med.status === 'activo').length
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const monthlyExpenses = expenses
    .filter(expense => {
      const expenseDate = new Date(expense.date)
      const now = new Date()
      return expenseDate.getMonth() === now.getMonth() && 
             expenseDate.getFullYear() === now.getFullYear()
    })
    .reduce((sum, expense) => sum + expense.amount, 0)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <PawPrint className="h-8 w-8 text-primary" />
          Cuidado de Mascotas
        </h1>
        <p className="text-muted-foreground">
          Gestiona el cuidado, salud e inventario de tus mascotas de manera organizada.
        </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={requestPermission}
            className="flex items-center gap-2"
          >
            <Bell className="h-4 w-4" />
            Activar Notificaciones
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4">
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Mascotas</p>
                <p className="text-2xl font-bold text-primary">{pets.length}</p>
              </div>
              <PawPrint className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tareas Pendientes</p>
                <p className="text-2xl font-bold text-blue-600">{pendingTasks}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tareas Completadas</p>
                <p className="text-2xl font-bold text-green-600">{completedTasks}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Fotos</p>
                <p className="text-2xl font-bold text-purple-600">{totalPhotos}</p>
              </div>
              <Camera className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Inventario</p>
                <p className="text-2xl font-bold text-orange-600">{totalInventory}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Medicamentos</p>
                <p className="text-2xl font-bold text-red-600">{activeMedications}</p>
              </div>
              <Pill className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Gastos Totales</p>
                <p className="text-2xl font-bold text-yellow-600">${totalExpenses.toFixed(0)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-indigo-50 to-indigo-100 border-indigo-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Gastos Mes</p>
                <p className="text-2xl font-bold text-indigo-600">${monthlyExpenses.toFixed(0)}</p>
              </div>
              <Calendar className="h-8 w-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="mascotas" className="flex items-center gap-2">
            <PawPrint className="h-4 w-4" />
            Mascotas
          </TabsTrigger>
          <TabsTrigger value="tareas" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Tareas
          </TabsTrigger>
          <TabsTrigger value="salud" className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4" />
            Salud
          </TabsTrigger>
          <TabsTrigger value="medicamentos" className="flex items-center gap-2">
            <Pill className="h-4 w-4" />
            Medicamentos
          </TabsTrigger>
          <TabsTrigger value="peso" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Peso
          </TabsTrigger>
          <TabsTrigger value="comportamiento" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Comportamiento
          </TabsTrigger>
          <TabsTrigger value="gastos" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Gastos
          </TabsTrigger>
          <TabsTrigger value="fotos" className="flex items-center gap-2">
            <Camera className="h-4 w-4" />
            Fotos
          </TabsTrigger>
          <TabsTrigger value="inventario" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Inventario
          </TabsTrigger>
        </TabsList>

        {/* Tab: Mascotas */}
        <TabsContent value="mascotas" className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Input
                placeholder="Buscar mascotas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="perro">Perros</SelectItem>
                  <SelectItem value="gato">Gatos</SelectItem>
                  <SelectItem value="pajaro">Aves</SelectItem>
                  <SelectItem value="pez">Peces</SelectItem>
                  <SelectItem value="hamster">Hamsters</SelectItem>
                  <SelectItem value="conejo">Conejos</SelectItem>
                  <SelectItem value="otro">Otros</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={() => setShowAddPetDialog(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Agregar Mascota
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPets.map((pet) => (
              <Card key={pet.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square relative bg-gradient-to-br from-primary/10 to-secondary/10">
                  {pet.image ? (
                  <img
                      src={pet.image}
                    alt={pet.name}
                    className="w-full h-full object-cover"
                  />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <PawPrint className="h-16 w-16 text-primary/40 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Sin foto</p>
                      </div>
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="flex items-center gap-1 bg-white/90 backdrop-blur-sm">
                      {getPetTypeIcon(pet.type)}
                      {pet.type}
                    </Badge>
                  </div>
                  <div className="absolute bottom-2 left-2">
                    <Badge variant="outline" className="bg-white/90 backdrop-blur-sm">
                    {pet.name}
                    </Badge>
                  </div>
                </div>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{pet.name}</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deletePet(pet.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardDescription>
                    {pet.breed && `${pet.breed} • `}
                    {pet.birthDate && `Nacido: ${new Date(pet.birthDate).toLocaleDateString()} • `}
                    {pet.weight && `${pet.weight}kg`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {pet.notes && (
                    <p className="text-sm text-muted-foreground mb-4">{pet.notes}</p>
                  )}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedPet(pet)
                        setNewTask({ petId: pet.id })
                        setShowAddTaskDialog(true)
                      }}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Tarea
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedPet(pet)
                        setNewHealthRecord({ petId: pet.id })
                        setShowAddHealthDialog(true)
                      }}
                    >
                      <Stethoscope className="h-4 w-4 mr-1" />
                      Salud
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedPet(pet)
                        setNewPet({
                          name: pet.name,
                          type: pet.type,
                          breed: pet.breed,
                          birthDate: pet.birthDate,
                          weight: pet.weight,
                          color: pet.color,
                          image: pet.image,
                          notes: pet.notes
                        })
                        setShowAddPetDialog(true)
                      }}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab: Tareas */}
        <TabsContent value="tareas" className="space-y-6">
          <div className="flex justify-between items-center">
            <Input
              placeholder="Buscar tareas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
            <Button onClick={() => setShowAddTaskDialog(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Agregar Tarea
            </Button>
          </div>

          <div className="space-y-4">
            {filteredTasks.map((task) => {
              const pet = getPetById(task.petId)
              return (
                <Card key={task.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          {getTaskTypeIcon(task.type)}
                        </div>
                        <div>
                          <h3 className="font-semibold">{task.title}</h3>
                          <p className="text-sm text-muted-foreground">{task.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {pet?.name}
                            </Badge>
                            <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </Badge>
                            <Badge className={`text-xs ${getStatusColor(task.status)}`}>
                              {task.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => toggleTaskStatus(task.id)}
                          className={task.status === 'pendiente' ? 'bg-green-500 hover:bg-green-600' : 'bg-yellow-500 hover:bg-yellow-600'}
                        >
                          {task.status === 'pendiente' ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <Clock className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => editTask(task.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteTask(task.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Tab: Salud */}
        <TabsContent value="salud" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Registros de Salud</h3>
            <Button onClick={() => setShowAddHealthDialog(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Agregar Registro
            </Button>
          </div>

          <div className="space-y-4">
            {healthRecords.map((record) => {
              const pet = getPetById(record.petId)
              return (
                <Card key={record.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Stethoscope className="h-5 w-5 text-primary" />
                        {record.title}
                      </span>
                      <Badge variant="outline">{record.type}</Badge>
                    </CardTitle>
                    <CardDescription>
                      {pet?.name} • {new Date(record.date).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-4">{record.description}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {record.veterinarian && (
                        <div>
                          <span className="font-medium">Veterinario:</span> {record.veterinarian}
                        </div>
                      )}
                      {record.clinic && (
                        <div>
                          <span className="font-medium">Clínica:</span> {record.clinic}
                        </div>
                      )}
                      {record.cost && (
                        <div>
                          <span className="font-medium">Costo:</span> ${record.cost}
                        </div>
                      )}
                      {record.nextDue && (
                        <div>
                          <span className="font-medium">Próxima cita:</span> {new Date(record.nextDue).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    {record.notes && (
                      <p className="text-sm text-muted-foreground mt-4">{record.notes}</p>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Tab: Medicamentos */}
        <TabsContent value="medicamentos" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Medicamentos</h3>
            <Button onClick={() => setShowAddMedicationDialog(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Agregar Medicamento
            </Button>
          </div>

          <div className="space-y-4">
            {medications.map((medication) => {
              const pet = getPetById(medication.petId)
              return (
                <Card key={medication.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Pill className="h-5 w-5 text-primary" />
                        {medication.name}
                      </span>
                      <Badge className={medication.status === 'activo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {medication.status}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      {pet?.name} • {medication.dosage} • {medication.frequency}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-4">{medication.description}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Inicio:</span> {new Date(medication.startDate).toLocaleDateString()}
                      </div>
                      {medication.endDate && (
                        <div>
                          <span className="font-medium">Fin:</span> {new Date(medication.endDate).toLocaleDateString()}
                        </div>
                      )}
                      <div>
                        <span className="font-medium">Veces por día:</span> {medication.timesPerDay}
                      </div>
                      {medication.veterinarian && (
                        <div>
                          <span className="font-medium">Veterinario:</span> {medication.veterinarian}
                        </div>
                      )}
                    </div>
                    {medication.notes && (
                      <p className="text-sm text-muted-foreground mt-4">{medication.notes}</p>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Tab: Peso */}
        <TabsContent value="peso" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Seguimiento de Peso</h3>
            <Button onClick={() => setShowAddWeightDialog(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Agregar Registro
            </Button>
          </div>

          <div className="space-y-4">
            {weightRecords.map((record) => {
              const pet = getPetById(record.petId)
              return (
                <Card key={record.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Target className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{pet?.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(record.date).toLocaleDateString()}
                          </p>
                          <p className="text-lg font-bold text-primary">
                            {record.weight} kg
                          </p>
                        </div>
                      </div>
                      {record.notes && (
                        <p className="text-sm text-muted-foreground max-w-xs">
                          {record.notes}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Tab: Comportamiento */}
        <TabsContent value="comportamiento" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Registros de Comportamiento</h3>
            <Button onClick={() => setShowAddBehaviorDialog(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Agregar Registro
            </Button>
          </div>

          <div className="space-y-4">
            {behaviorRecords.map((record) => {
              const pet = getPetById(record.petId)
              return (
                <Card key={record.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Heart className="h-5 w-5 text-primary" />
                        {record.title}
                      </span>
                      <Badge className={
                        record.type === 'positivo' ? 'bg-green-100 text-green-800' :
                        record.type === 'negativo' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }>
                        {record.type}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      {pet?.name} • {new Date(record.date).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-4">{record.description}</p>
                    {record.severity && (
                      <Badge variant="outline" className="mb-2">
                        Severidad: {record.severity}
                      </Badge>
                    )}
                    {record.notes && (
                      <p className="text-sm text-muted-foreground mt-4">{record.notes}</p>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Tab: Gastos */}
        <TabsContent value="gastos" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Gastos de Mascotas</h3>
            <Button onClick={() => setShowAddExpenseDialog(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Agregar Gasto
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Total Gastos</p>
                  <p className="text-2xl font-bold text-primary">${totalExpenses.toFixed(2)}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Gastos del Mes</p>
                  <p className="text-2xl font-bold text-blue-600">${monthlyExpenses.toFixed(2)}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Total Registros</p>
                  <p className="text-2xl font-bold text-green-600">{expenses.length}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            {expenses.map((expense) => {
              const pet = getPetById(expense.petId)
              return (
                <Card key={expense.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <DollarSign className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{expense.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {pet?.name} • {expense.category} • {new Date(expense.date).toLocaleDateString()}
                          </p>
                          {expense.description && (
                            <p className="text-sm text-muted-foreground">{expense.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-primary">${expense.amount.toFixed(2)}</p>
                        {expense.recurring && (
                          <Badge variant="outline" className="text-xs">
                            Recurrente: {expense.frequency}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Tab: Fotos */}
        <TabsContent value="fotos" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Biblioteca de Fotos</h3>
            <Button onClick={() => setShowAddPhotoDialog(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Agregar Foto
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map((photo) => {
              const pet = getPetById(photo.petId)
              return (
                <Card key={photo.id} className="overflow-hidden">
                  <div className="aspect-square relative">
                    <img
                      src={photo.image}
                      alt={photo.description || 'Foto de mascota'}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setPhotos(photos.filter(p => p.id !== photo.id))
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    {photo.description && (
                      <p className="text-sm text-muted-foreground">
                        {photo.description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Tab: Inventario */}
        <TabsContent value="inventario" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Inventario de Mascotas</h3>
            <Button onClick={() => setShowAddInventoryDialog(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Agregar Item
            </Button>
          </div>

          <div className="space-y-4">
            {inventory.map((item) => {
              const pet = getPetById(item.petId)
              return (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        )}
                        <div>
                          <h3 className="font-semibold">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {pet?.name} • {item.category}
                          </p>
                          {item.description && (
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              Cantidad: {item.quantity} {item.unit}
                            </Badge>
                            {item.price && (
                              <Badge variant="outline" className="text-xs">
                                ${item.price}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        {item.purchaseDate && (
                          <p className="text-sm text-muted-foreground">
                            Comprado: {new Date(item.purchaseDate).toLocaleDateString()}
                          </p>
                        )}
                        {item.expiryDate && (
                          <p className="text-sm text-muted-foreground">
                            Vence: {new Date(item.expiryDate).toLocaleDateString()}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => editInventoryItem(item.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteInventoryItem(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>


      </Tabs>

      {/* Dialog: Agregar Mascota */}
      <Dialog open={showAddPetDialog} onOpenChange={setShowAddPetDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedPet ? 'Editar Mascota' : 'Agregar Nueva Mascota'}</DialogTitle>
            <DialogDescription>
              {selectedPet ? 'Modifica la información de tu mascota.' : 'Completa la información de tu nueva mascota.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <FormValidation errors={validationErrors} />
            <div className="grid gap-2">
              <label htmlFor="name">Nombre</label>
              <Input
                id="name"
                value={newPet.name || ''}
                onChange={(e) => setNewPet({ ...newPet, name: e.target.value })}
                placeholder="Nombre de la mascota"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="type">Tipo</label>
              <Select value={newPet.type || ''} onValueChange={(value: 'perro' | 'gato' | 'pajaro' | 'pez' | 'hamster' | 'conejo' | 'otro') => setNewPet({ ...newPet, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="perro">Perro</SelectItem>
                  <SelectItem value="gato">Gato</SelectItem>
                  <SelectItem value="pajaro">Ave</SelectItem>
                  <SelectItem value="pez">Pez</SelectItem>
                  <SelectItem value="hamster">Hamster</SelectItem>
                  <SelectItem value="conejo">Conejo</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="breed">Raza</label>
              <Input
                id="breed"
                value={newPet.breed || ''}
                onChange={(e) => setNewPet({ ...newPet, breed: e.target.value })}
                placeholder="Raza (opcional)"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="birthDate">Fecha de Nacimiento</label>
              <Input
                id="birthDate"
                type="date"
                value={newPet.birthDate || ''}
                onChange={(e) => setNewPet({ ...newPet, birthDate: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="weight">Peso (kg)</label>
              <Input
                id="weight"
                type="number"
                value={newPet.weight || ''}
                onChange={(e) => setNewPet({ ...newPet, weight: parseFloat(e.target.value) || undefined })}
                placeholder="Peso en kilogramos"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="notes">Notas</label>
              <Input
                id="notes"
                value={newPet.notes || ''}
                onChange={(e) => setNewPet({ ...newPet, notes: e.target.value })}
                placeholder="Notas adicionales"
              />
            </div>
            <div className="grid gap-2">
              <label>Foto de la Mascota</label>
              <div className="space-y-2">
                {newPet.image ? (
                  <div className="relative">
                    <img
                      src={newPet.image}
                      alt="Vista previa"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 h-6 w-6 p-0"
                      onClick={() => setNewPet({ ...newPet, image: undefined })}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          const reader = new FileReader()
                          reader.onload = (e) => {
                            setNewPet({ ...newPet, image: e.target?.result as string })
                          }
                          reader.readAsDataURL(file)
                        }
                      }}
                      className="hidden"
                      id="pet-image"
                    />
                    <label htmlFor="pet-image" className="cursor-pointer">
                      <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Haz clic para agregar una foto</p>
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowAddPetDialog(false)
              setSelectedPet(null)
              setNewPet({})
              setValidationErrors([])
            }}>
              Cancelar
            </Button>
            <Button onClick={addPet}>{selectedPet ? 'Guardar Cambios' : 'Agregar Mascota'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: Agregar Tarea */}
      <Dialog open={showAddTaskDialog} onOpenChange={setShowAddTaskDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{isEditingTask ? 'Editar Tarea' : 'Agregar Nueva Tarea'}</DialogTitle>
            <DialogDescription>
              {isEditingTask ? 'Modifica la información de la tarea.' : 'Crea una nueva tarea de cuidado para tu mascota.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="taskTitle">Título</label>
              <Input
                id="taskTitle"
                value={newTask.title || ''}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                placeholder="Título de la tarea"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="taskDescription">Descripción</label>
              <Input
                id="taskDescription"
                value={newTask.description || ''}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                placeholder="Descripción de la tarea"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="taskType">Tipo</label>
              <Select value={newTask.type || ''} onValueChange={(value: 'alimentacion' | 'ejercicio' | 'limpieza' | 'veterinario' | 'medicina' | 'otro') => setNewTask({ ...newTask, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alimentacion">Alimentación</SelectItem>
                  <SelectItem value="ejercicio">Ejercicio</SelectItem>
                  <SelectItem value="limpieza">Limpieza</SelectItem>
                  <SelectItem value="veterinario">Veterinario</SelectItem>
                  <SelectItem value="medicina">Medicina</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="taskFrequency">Frecuencia</label>
              <Select value={newTask.frequency || ''} onValueChange={(value: 'diario' | 'semanal' | 'mensual' | 'personalizado') => setNewTask({ ...newTask, frequency: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar frecuencia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="diario">Diario</SelectItem>
                  <SelectItem value="semanal">Semanal</SelectItem>
                  <SelectItem value="mensual">Mensual</SelectItem>
                  <SelectItem value="personalizado">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="taskPriority">Prioridad</label>
              <Select value={newTask.priority || ''} onValueChange={(value: 'Alta' | 'Media' | 'Baja') => setNewTask({ ...newTask, priority: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar prioridad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Alta">Alta</SelectItem>
                  <SelectItem value="Media">Media</SelectItem>
                  <SelectItem value="Baja">Baja</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowAddTaskDialog(false)
              setIsEditingTask(false)
              setNewTask({})
            }}>
              Cancelar
            </Button>
            <Button onClick={addTask}>{isEditingTask ? 'Guardar Cambios' : 'Agregar Tarea'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: Agregar Registro de Salud */}
      <Dialog open={showAddHealthDialog} onOpenChange={setShowAddHealthDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Agregar Registro de Salud</DialogTitle>
            <DialogDescription>
              Registra una visita al veterinario o tratamiento médico.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="healthTitle">Título</label>
              <Input
                id="healthTitle"
                value={newHealthRecord.title || ''}
                onChange={(e) => setNewHealthRecord({ ...newHealthRecord, title: e.target.value })}
                placeholder="Título del registro"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="healthType">Tipo</label>
              <Select value={newHealthRecord.type || ''} onValueChange={(value: 'vacuna' | 'desparasitacion' | 'revision' | 'tratamiento' | 'otro') => setNewHealthRecord({ ...newHealthRecord, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vacuna">Vacuna</SelectItem>
                  <SelectItem value="desparasitacion">Desparasitación</SelectItem>
                  <SelectItem value="revision">Revisión</SelectItem>
                  <SelectItem value="tratamiento">Tratamiento</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="healthDate">Fecha</label>
              <Input
                id="healthDate"
                type="date"
                value={newHealthRecord.date || ''}
                onChange={(e) => setNewHealthRecord({ ...newHealthRecord, date: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="healthDescription">Descripción</label>
              <Input
                id="healthDescription"
                value={newHealthRecord.description || ''}
                onChange={(e) => setNewHealthRecord({ ...newHealthRecord, description: e.target.value })}
                placeholder="Descripción del tratamiento"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="healthCost">Costo</label>
              <Input
                id="healthCost"
                type="number"
                value={newHealthRecord.cost || ''}
                onChange={(e) => setNewHealthRecord({ ...newHealthRecord, cost: parseFloat(e.target.value) || undefined })}
                placeholder="Costo del tratamiento"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddHealthDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={addHealthRecord}>Agregar Registro</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: Agregar Medicamento */}
      <Dialog open={showAddMedicationDialog} onOpenChange={setShowAddMedicationDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{isEditingMedication ? 'Editar Medicamento' : 'Agregar Medicamento'}</DialogTitle>
            <DialogDescription>
              {isEditingMedication ? 'Modifica la información del medicamento.' : 'Registra un nuevo medicamento para tu mascota.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="medicationName">Nombre del Medicamento</label>
              <Input
                id="medicationName"
                value={newMedication.name || ''}
                onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
                placeholder="Nombre del medicamento"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="medicationPet">Mascota</label>
              <Select value={newMedication.petId?.toString() || ''} onValueChange={(value) => setNewMedication({ ...newMedication, petId: parseInt(value) })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar mascota" />
                </SelectTrigger>
                <SelectContent>
                  {pets.map((pet) => (
                    <SelectItem key={pet.id} value={pet.id.toString()}>
                      {pet.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="medicationDosage">Dosis</label>
              <Input
                id="medicationDosage"
                value={newMedication.dosage || ''}
                onChange={(e) => setNewMedication({ ...newMedication, dosage: e.target.value })}
                placeholder="Ej: 1 tableta, 5ml, etc."
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="medicationFrequency">Frecuencia</label>
              <Select value={newMedication.frequency || ''} onValueChange={(value: 'una_vez' | 'diario' | 'cada_12h' | 'cada_8h' | 'cada_6h' | 'personalizado') => setNewMedication({ ...newMedication, frequency: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar frecuencia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="una_vez">Una vez</SelectItem>
                  <SelectItem value="diario">Diario</SelectItem>
                  <SelectItem value="cada_12h">Cada 12 horas</SelectItem>
                  <SelectItem value="cada_8h">Cada 8 horas</SelectItem>
                  <SelectItem value="cada_6h">Cada 6 horas</SelectItem>
                  <SelectItem value="personalizado">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="medicationStartDate">Fecha de Inicio</label>
              <Input
                id="medicationStartDate"
                type="date"
                value={newMedication.startDate || ''}
                onChange={(e) => setNewMedication({ ...newMedication, startDate: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="medicationEndDate">Fecha de Fin (opcional)</label>
              <Input
                id="medicationEndDate"
                type="date"
                value={newMedication.endDate || ''}
                onChange={(e) => setNewMedication({ ...newMedication, endDate: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="medicationTimesPerDay">Veces por Día</label>
              <Input
                id="medicationTimesPerDay"
                type="number"
                min="1"
                value={newMedication.timesPerDay || ''}
                onChange={(e) => setNewMedication({ ...newMedication, timesPerDay: parseInt(e.target.value) || 1 })}
                placeholder="Número de veces por día"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="medicationDescription">Descripción</label>
              <Input
                id="medicationDescription"
                value={newMedication.description || ''}
                onChange={(e) => setNewMedication({ ...newMedication, description: e.target.value })}
                placeholder="Descripción del medicamento"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="medicationVeterinarian">Veterinario (opcional)</label>
              <Input
                id="medicationVeterinarian"
                value={newMedication.veterinarian || ''}
                onChange={(e) => setNewMedication({ ...newMedication, veterinarian: e.target.value })}
                placeholder="Nombre del veterinario"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="medicationNotes">Notas</label>
              <Input
                id="medicationNotes"
                value={newMedication.notes || ''}
                onChange={(e) => setNewMedication({ ...newMedication, notes: e.target.value })}
                placeholder="Notas adicionales"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowAddMedicationDialog(false)
              setIsEditingMedication(false)
              setNewMedication({})
            }}>
              Cancelar
            </Button>
            <Button onClick={addMedication}>{isEditingMedication ? 'Guardar Cambios' : 'Agregar Medicamento'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>



      {/* Dialog: Agregar Registro de Peso */}
      <Dialog open={showAddWeightDialog} onOpenChange={setShowAddWeightDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Agregar Registro de Peso</DialogTitle>
            <DialogDescription>
              Registra el peso actual de tu mascota para seguimiento.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="weightPet">Mascota</label>
              <Select value={newWeightRecord.petId?.toString() || ''} onValueChange={(value) => setNewWeightRecord({ ...newWeightRecord, petId: parseInt(value) })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar mascota" />
                </SelectTrigger>
                <SelectContent>
                  {pets.map((pet) => (
                    <SelectItem key={pet.id} value={pet.id.toString()}>
                      {pet.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="weightDate">Fecha</label>
              <Input
                id="weightDate"
                type="date"
                value={newWeightRecord.date || ''}
                onChange={(e) => setNewWeightRecord({ ...newWeightRecord, date: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="weightValue">Peso (kg)</label>
              <Input
                id="weightValue"
                type="number"
                step="0.1"
                value={newWeightRecord.weight || ''}
                onChange={(e) => setNewWeightRecord({ ...newWeightRecord, weight: parseFloat(e.target.value) || 0 })}
                placeholder="Peso en kilogramos"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="weightNotes">Notas</label>
              <Input
                id="weightNotes"
                value={newWeightRecord.notes || ''}
                onChange={(e) => setNewWeightRecord({ ...newWeightRecord, notes: e.target.value })}
                placeholder="Notas adicionales"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddWeightDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={addWeightRecord}>Agregar Registro</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: Agregar Registro de Comportamiento */}
      <Dialog open={showAddBehaviorDialog} onOpenChange={setShowAddBehaviorDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Agregar Registro de Comportamiento</DialogTitle>
            <DialogDescription>
              Registra un comportamiento o evento importante de tu mascota.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="behaviorPet">Mascota</label>
              <Select value={newBehaviorRecord.petId?.toString() || ''} onValueChange={(value) => setNewBehaviorRecord({ ...newBehaviorRecord, petId: parseInt(value) })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar mascota" />
                </SelectTrigger>
                <SelectContent>
                  {pets.map((pet) => (
                    <SelectItem key={pet.id} value={pet.id.toString()}>
                      {pet.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="behaviorTitle">Título</label>
              <Input
                id="behaviorTitle"
                value={newBehaviorRecord.title || ''}
                onChange={(e) => setNewBehaviorRecord({ ...newBehaviorRecord, title: e.target.value })}
                placeholder="Título del comportamiento"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="behaviorType">Tipo</label>
              <Select value={newBehaviorRecord.type || ''} onValueChange={(value: 'positivo' | 'negativo' | 'neutro') => setNewBehaviorRecord({ ...newBehaviorRecord, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="positivo">Positivo</SelectItem>
                  <SelectItem value="negativo">Negativo</SelectItem>
                  <SelectItem value="neutro">Neutro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="behaviorSeverity">Severidad (opcional)</label>
              <Select value={newBehaviorRecord.severity || ''} onValueChange={(value: 'leve' | 'moderado' | 'grave') => setNewBehaviorRecord({ ...newBehaviorRecord, severity: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar severidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="leve">Leve</SelectItem>
                  <SelectItem value="moderado">Moderado</SelectItem>
                  <SelectItem value="grave">Grave</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="behaviorDate">Fecha</label>
              <Input
                id="behaviorDate"
                type="date"
                value={newBehaviorRecord.date || ''}
                onChange={(e) => setNewBehaviorRecord({ ...newBehaviorRecord, date: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="behaviorDescription">Descripción</label>
              <Input
                id="behaviorDescription"
                value={newBehaviorRecord.description || ''}
                onChange={(e) => setNewBehaviorRecord({ ...newBehaviorRecord, description: e.target.value })}
                placeholder="Descripción del comportamiento"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="behaviorNotes">Notas</label>
              <Input
                id="behaviorNotes"
                value={newBehaviorRecord.notes || ''}
                onChange={(e) => setNewBehaviorRecord({ ...newBehaviorRecord, notes: e.target.value })}
                placeholder="Notas adicionales"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddBehaviorDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={addBehaviorRecord}>Agregar Registro</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: Agregar Gasto */}
      <Dialog open={showAddExpenseDialog} onOpenChange={setShowAddExpenseDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Agregar Gasto</DialogTitle>
            <DialogDescription>
              Registra un gasto relacionado con el cuidado de tu mascota.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="expenseTitle">Título</label>
              <Input
                id="expenseTitle"
                value={newExpense.title || ''}
                onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
                placeholder="Título del gasto"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="expensePet">Mascota</label>
              <Select value={newExpense.petId?.toString() || ''} onValueChange={(value) => setNewExpense({ ...newExpense, petId: parseInt(value) })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar mascota" />
                </SelectTrigger>
                <SelectContent>
                  {pets.map((pet) => (
                    <SelectItem key={pet.id} value={pet.id.toString()}>
                      {pet.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="expenseCategory">Categoría</label>
              <Select value={newExpense.category || ''} onValueChange={(value: 'alimentacion' | 'veterinario' | 'accesorios' | 'juguetes' | 'limpieza' | 'medicina' | 'servicios' | 'otro') => setNewExpense({ ...newExpense, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alimentacion">Alimentación</SelectItem>
                  <SelectItem value="veterinario">Veterinario</SelectItem>
                  <SelectItem value="accesorios">Accesorios</SelectItem>
                  <SelectItem value="juguetes">Juguetes</SelectItem>
                  <SelectItem value="limpieza">Limpieza</SelectItem>
                  <SelectItem value="medicina">Medicina</SelectItem>
                  <SelectItem value="servicios">Servicios</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="expenseAmount">Monto</label>
              <Input
                id="expenseAmount"
                type="number"
                step="0.01"
                value={newExpense.amount || ''}
                onChange={(e) => setNewExpense({ ...newExpense, amount: parseFloat(e.target.value) || 0 })}
                placeholder="Monto del gasto"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="expenseDate">Fecha</label>
              <Input
                id="expenseDate"
                type="date"
                value={newExpense.date || ''}
                onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="expenseDescription">Descripción</label>
              <Input
                id="expenseDescription"
                value={newExpense.description || ''}
                onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                placeholder="Descripción del gasto"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="expenseRecurring"
                checked={newExpense.recurring || false}
                onChange={(e) => setNewExpense({ ...newExpense, recurring: e.target.checked })}
              />
              <label htmlFor="expenseRecurring">Gasto recurrente</label>
            </div>
            {newExpense.recurring && (
              <div className="grid gap-2">
                <label htmlFor="expenseFrequency">Frecuencia</label>
                <Select value={newExpense.frequency || ''} onValueChange={(value: 'mensual' | 'trimestral' | 'semestral' | 'anual') => setNewExpense({ ...newExpense, frequency: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar frecuencia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mensual">Mensual</SelectItem>
                    <SelectItem value="trimestral">Trimestral</SelectItem>
                    <SelectItem value="semestral">Semestral</SelectItem>
                    <SelectItem value="anual">Anual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddExpenseDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={addExpense}>Agregar Gasto</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: Agregar Foto */}
      <Dialog open={showAddPhotoDialog} onOpenChange={setShowAddPhotoDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Agregar Nueva Foto</DialogTitle>
            <DialogDescription>
              Sube una foto de tu mascota con información adicional.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="photoDescription">Descripción</label>
              <Input
                id="photoDescription"
                value={newPhoto.description || ''}
                onChange={(e) => setNewPhoto({ ...newPhoto, description: e.target.value })}
                placeholder="Descripción de la foto (opcional)"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="photoPet">Mascota</label>
              <Select value={newPhoto.petId?.toString() || ''} onValueChange={(value) => setNewPhoto({ ...newPhoto, petId: parseInt(value) })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar mascota" />
                </SelectTrigger>
                <SelectContent>
                  {pets.map((pet) => (
                    <SelectItem key={pet.id} value={pet.id.toString()}>
                      {pet.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <ImageUpload
              onImageSelect={(file) => {
                const reader = new FileReader()
                reader.onload = (e) => {
                  setNewPhoto({ ...newPhoto, image: e.target?.result as string })
                }
                reader.readAsDataURL(file)
              }}
              placeholder="Seleccionar foto de la mascota"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddPhotoDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={addPhoto}>Agregar Foto</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: Agregar Item al Inventario */}
      <Dialog open={showAddInventoryDialog} onOpenChange={setShowAddInventoryDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{isEditingInventory ? 'Editar Item' : 'Agregar Item al Inventario'}</DialogTitle>
            <DialogDescription>
              {isEditingInventory ? 'Modifica la información del item.' : 'Agrega un nuevo item al inventario de tu mascota.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="inventoryName">Nombre</label>
              <Input
                id="inventoryName"
                value={newInventory.name || ''}
                onChange={(e) => setNewInventory({ ...newInventory, name: e.target.value })}
                placeholder="Nombre del item"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="inventoryPet">Mascota</label>
              <Select value={newInventory.petId?.toString() || ''} onValueChange={(value) => setNewInventory({ ...newInventory, petId: parseInt(value) })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar mascota" />
                </SelectTrigger>
                <SelectContent>
                  {pets.map((pet) => (
                    <SelectItem key={pet.id} value={pet.id.toString()}>
                      {pet.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="inventoryCategory">Categoría</label>
              <Select value={newInventory.category || ''} onValueChange={(value: 'alimentacion' | 'juguetes' | 'accesorios' | 'limpieza' | 'medicina' | 'otro') => setNewInventory({ ...newInventory, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alimentacion">Alimentación</SelectItem>
                  <SelectItem value="juguetes">Juguetes</SelectItem>
                  <SelectItem value="accesorios">Accesorios</SelectItem>
                  <SelectItem value="limpieza">Limpieza</SelectItem>
                  <SelectItem value="medicina">Medicina</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="inventoryQuantity">Cantidad</label>
              <Input
                id="inventoryQuantity"
                type="number"
                value={newInventory.quantity || ''}
                onChange={(e) => setNewInventory({ ...newInventory, quantity: parseInt(e.target.value) || 1 })}
                placeholder="Cantidad"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="inventoryUnit">Unidad</label>
              <Input
                id="inventoryUnit"
                value={newInventory.unit || ''}
                onChange={(e) => setNewInventory({ ...newInventory, unit: e.target.value })}
                placeholder="Unidad (kg, unidades, etc.)"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="inventoryPrice">Precio</label>
              <Input
                id="inventoryPrice"
                type="number"
                step="0.01"
                value={newInventory.price || ''}
                onChange={(e) => setNewInventory({ ...newInventory, price: parseFloat(e.target.value) || undefined })}
                placeholder="Precio"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="inventoryDescription">Descripción</label>
              <Input
                id="inventoryDescription"
                value={newInventory.description || ''}
                onChange={(e) => setNewInventory({ ...newInventory, description: e.target.value })}
                placeholder="Descripción del item"
              />
            </div>
            <ImageUpload
              onImageSelect={(file) => {
                const reader = new FileReader()
                reader.onload = (e) => {
                  setNewInventory({ ...newInventory, image: e.target?.result as string })
                }
                reader.readAsDataURL(file)
              }}
              placeholder="Seleccionar imagen del item"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowAddInventoryDialog(false)
              setIsEditingInventory(false)
              setNewInventory({})
            }}>
              Cancelar
            </Button>
            <Button onClick={addInventory}>{isEditingInventory ? 'Guardar Cambios' : 'Agregar Item'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
