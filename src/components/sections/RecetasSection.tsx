'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { 
  ChefHat, 
  Heart, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Clock, 
  Users, 
  Star,
  Camera,
  X,
  Save,
  Image as ImageIcon,
  Timer,
  Utensils,
  Flame,
  Leaf,
  Coffee,
  Cake,
  Pizza,
  Fish,
  Beef,
  Salad,
  Soup,
  Dessert
} from 'lucide-react'
import { useLocalStorage } from '@/hooks/useLocalStorage'

interface Recipe {
  id: string
  title: string
  description: string
  category: 'desayuno' | 'almuerzo' | 'cena' | 'postre' | 'bebida' | 'snack' | 'sopa' | 'ensalada' | 'pasta' | 'carne' | 'pescado' | 'vegetariano' | 'vegano' | 'otro'
  cuisine: 'mexicana' | 'italiana' | 'china' | 'japonesa' | 'francesa' | 'española' | 'americana' | 'mediterranea' | 'asiatica' | 'otra'
  difficulty: 'facil' | 'medio' | 'dificil'
  prepTime: number
  cookTime: number
  servings: number
  ingredients: string[]
  instructions: string[]
  tips?: string
  author: 'yo' | 'pareja' | 'ambos'
  isFavorite: boolean
  rating?: number
  tags: string[]
  images?: string[]
  createdAt: string
  updatedAt: string
}

const categories = [
  { value: 'desayuno', label: 'Desayuno', icon: '🌅' },
  { value: 'almuerzo', label: 'Almuerzo', icon: '🍽️' },
  { value: 'cena', label: 'Cena', icon: '🌙' },
  { value: 'postre', label: 'Postre', icon: '🍰' },
  { value: 'bebida', label: 'Bebida', icon: '🥤' },
  { value: 'snack', label: 'Snack', icon: '🍿' },
  { value: 'sopa', label: 'Sopa', icon: '🍲' },
  { value: 'ensalada', label: 'Ensalada', icon: '🥗' },
  { value: 'pasta', label: 'Pasta', icon: '🍝' },
  { value: 'carne', label: 'Carne', icon: '🥩' },
  { value: 'pescado', label: 'Pescado', icon: '🐟' },
  { value: 'vegetariano', label: 'Vegetariano', icon: '🥬' },
  { value: 'vegano', label: 'Vegano', icon: '🌱' },
  { value: 'otro', label: 'Otro', icon: '🍴' }
]

const cuisines = [
  { value: 'mexicana', label: 'Mexicana', icon: '🇲🇽' },
  { value: 'italiana', label: 'Italiana', icon: '🇮🇹' },
  { value: 'china', label: 'China', icon: '🇨🇳' },
  { value: 'japonesa', label: 'Japonesa', icon: '🇯🇵' },
  { value: 'francesa', label: 'Francesa', icon: '🇫🇷' },
  { value: 'española', label: 'Española', icon: '🇪🇸' },
  { value: 'americana', label: 'Americana', icon: '🇺🇸' },
  { value: 'mediterranea', label: 'Mediterránea', icon: '🌊' },
  { value: 'asiatica', label: 'Asiática', icon: '🌏' },
  { value: 'otra', label: 'Otra', icon: '🌍' }
]

const predefinedTags = [
  'Romántico', 'Fácil', 'Rápido', 'Saludable', 'Picante', 'Dulce', 'Salado', 'Sin Gluten',
  'Sin Lactosa', 'Bajo en Calorías', 'Proteína', 'Favorito', 'Tradicional', 'Innovador'
]

export function RecetasSection() {
  const { value: recipes, setValue: setRecipes } = useLocalStorage<Recipe[]>('recipes', [
    {
      id: '1',
      title: 'Pasta Carbonara Romántica',
      description: 'Una deliciosa pasta carbonara perfecta para una cena romántica en casa',
      category: 'cena',
      cuisine: 'italiana',
      difficulty: 'medio',
      prepTime: 15,
      cookTime: 20,
      servings: 2,
      ingredients: [
        '200g spaghetti',
        '100g panceta o tocino',
        '2 huevos',
        '50g queso parmesano rallado',
        'Pimienta negra molida',
        'Sal al gusto'
      ],
      instructions: [
        'Cocina la pasta en agua con sal hasta que esté al dente',
        'Mientras tanto, corta la panceta en trozos pequeños y fríela hasta que esté crujiente',
        'En un bowl, bate los huevos con el queso parmesano y pimienta',
        'Escurre la pasta y mézclala inmediatamente con la mezcla de huevos',
        'Agrega la panceta y revuelve suavemente',
        'Sirve caliente con queso parmesano adicional'
      ],
      tips: 'El secreto está en mezclar la pasta caliente con los huevos para crear una salsa cremosa sin que se cuajen.',
      author: 'ambos',
      isFavorite: true,
      rating: 5,
      tags: ['Romántico', 'Favorito', 'Italiana'],
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      title: 'Smoothie de Frutos Rojos',
      description: 'Un refrescante smoothie perfecto para el desayuno o merienda',
      category: 'bebida',
      cuisine: 'otra',
      difficulty: 'facil',
      prepTime: 5,
      cookTime: 0,
      servings: 2,
      ingredients: [
        '1 taza de frutos rojos (fresas, frambuesas, moras)',
        '1 plátano',
        '1 taza de leche o leche de almendras',
        '1 cucharada de miel',
        'Hielo al gusto'
      ],
      instructions: [
        'Lava y prepara las frutas',
        'Coloca todos los ingredientes en la licuadora',
        'Licúa hasta obtener una mezcla suave',
        'Sirve inmediatamente'
      ],
      author: 'yo',
      isFavorite: false,
      rating: 4,
      tags: ['Saludable', 'Rápido', 'Fácil'],
      createdAt: '2024-01-10T15:30:00Z',
      updatedAt: '2024-01-10T15:30:00Z'
    },
    {
      id: '3',
      title: 'Brownies de Chocolate',
      description: 'Brownies caseros con chocolate negro, perfectos para compartir',
      category: 'postre',
      cuisine: 'americana',
      difficulty: 'medio',
      prepTime: 20,
      cookTime: 25,
      servings: 8,
      ingredients: [
        '200g chocolate negro',
        '150g mantequilla',
        '3 huevos',
        '200g azúcar',
        '100g harina',
        '1 cucharadita de vainilla',
        'Pizca de sal'
      ],
      instructions: [
        'Precalienta el horno a 180°C',
        'Derrite el chocolate con la mantequilla al baño maría',
        'Bate los huevos con el azúcar hasta que estén espumosos',
        'Mezcla el chocolate derretido con los huevos',
        'Agrega la harina, vainilla y sal',
        'Vierte en un molde engrasado y hornea 25 minutos'
      ],
      tips: 'No los cocines demasiado, deben quedar un poco húmedos en el centro.',
      author: 'pareja',
      isFavorite: true,
      rating: 5,
      tags: ['Dulce', 'Favorito', 'Chocolate'],
      createdAt: '2024-01-08T19:00:00Z',
      updatedAt: '2024-01-08T19:00:00Z'
    }
  ])

  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Todas')
  const [selectedDifficulty, setSelectedDifficulty] = useState('Todas')

  const [recipeForm, setRecipeForm] = useState({
    title: '',
    description: '',
    category: 'cena' as Recipe['category'],
    cuisine: 'otra' as Recipe['cuisine'],
    difficulty: 'medio' as Recipe['difficulty'],
    prepTime: 30,
    cookTime: 30,
    servings: 2,
    ingredients: [''] as string[],
    instructions: [''] as string[],
    tips: '',
    author: 'yo' as Recipe['author'],
    tags: [] as string[],
    images: [] as File[]
  })

  // Estadísticas
  const stats = {
    totalRecipes: recipes.length,
    totalTime: recipes.reduce((sum, recipe) => sum + recipe.prepTime + recipe.cookTime, 0),
    averageRating: recipes.filter(r => r.rating).reduce((sum, r) => sum + (r.rating || 0), 0) / recipes.filter(r => r.rating).length || 0,
    favoriteRecipes: recipes.filter(r => r.isFavorite).length,
    mostPopularCategory: getMostPopularCategory(),
    easiestRecipes: recipes.filter(r => r.difficulty === 'facil').length
  }

  function getMostPopularCategory() {
    const categoryCounts = recipes.reduce((acc, recipe) => {
      acc[recipe.category] = (acc[recipe.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    return Object.entries(categoryCounts).reduce((a, b) => categoryCounts[a[0]] > categoryCounts[b[0]] ? a : b)[0]
  }

  // Filtrar recetas
  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === 'Todas' || recipe.category === selectedCategory.toLowerCase()
    const matchesDifficulty = selectedDifficulty === 'Todas' || recipe.difficulty === selectedDifficulty.toLowerCase()
    
    return matchesSearch && matchesCategory && matchesDifficulty
  })

  const openAddModal = () => {
    setRecipeForm({
      title: '',
      description: '',
      category: 'cena',
      cuisine: 'otra',
      difficulty: 'medio',
      prepTime: 30,
      cookTime: 30,
      servings: 2,
      ingredients: [''],
      instructions: [''],
      tips: '',
      author: 'yo',
      tags: [],
      images: []
    })
    setShowAddModal(true)
  }

  const openEditModal = (recipe: Recipe) => {
    setSelectedRecipe(recipe)
    setRecipeForm({
      title: recipe.title,
      description: recipe.description,
      category: recipe.category,
      cuisine: recipe.cuisine,
      difficulty: recipe.difficulty,
      prepTime: recipe.prepTime,
      cookTime: recipe.cookTime,
      servings: recipe.servings,
      ingredients: [...recipe.ingredients],
      instructions: [...recipe.instructions],
      tips: recipe.tips || '',
      author: recipe.author,
      tags: [...recipe.tags],
      images: []
    })
    setShowEditModal(true)
  }

  const openDeleteModal = (recipe: Recipe) => {
    setSelectedRecipe(recipe)
    setShowDeleteModal(true)
  }

  const handleSaveRecipe = () => {
    if (!recipeForm.title || !recipeForm.description) return

    const now = new Date().toISOString()

    let imageUrls: string[] = []
    if (recipeForm.images.length > 0) {
      imageUrls = recipeForm.images.map(img => URL.createObjectURL(img))
    }

    if (showEditModal && selectedRecipe) {
      // Editar receta existente
      setRecipes(prev => prev.map(r => 
        r.id === selectedRecipe.id 
          ? { 
              ...r, 
              ...recipeForm, 
              images: imageUrls.length > 0 ? imageUrls : r.images,
              updatedAt: now
            }
          : r
      ))
      setShowEditModal(false)
    } else {
      // Agregar nueva receta
      const newRecipe: Recipe = {
        id: Date.now().toString(),
        title: recipeForm.title,
        description: recipeForm.description,
        category: recipeForm.category,
        cuisine: recipeForm.cuisine,
        difficulty: recipeForm.difficulty,
        prepTime: recipeForm.prepTime,
        cookTime: recipeForm.cookTime,
        servings: recipeForm.servings,
        ingredients: recipeForm.ingredients.filter(ing => ing.trim() !== ''),
        instructions: recipeForm.instructions.filter(inst => inst.trim() !== ''),
        tips: recipeForm.tips,
        author: recipeForm.author,
        isFavorite: false,
        tags: recipeForm.tags,
        images: imageUrls,
        createdAt: now,
        updatedAt: now
      }
      setRecipes(prev => [newRecipe, ...prev])
      setShowAddModal(false)
    }

    // Limpiar formulario
    setRecipeForm({
      title: '',
      description: '',
      category: 'cena',
      cuisine: 'otra',
      difficulty: 'medio',
      prepTime: 30,
      cookTime: 30,
      servings: 2,
      ingredients: [''],
      instructions: [''],
      tips: '',
      author: 'yo',
      tags: [],
      images: []
    })
  }

  const handleDeleteRecipe = () => {
    if (selectedRecipe) {
      setRecipes(prev => prev.filter(r => r.id !== selectedRecipe.id))
      setShowDeleteModal(false)
      setSelectedRecipe(null)
    }
  }

  const toggleFavorite = (recipeId: string) => {
    setRecipes(prev => prev.map(r => 
      r.id === recipeId ? { ...r, isFavorite: !r.isFavorite } : r
    ))
  }

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    const imageFiles = files.filter(file => file.type.startsWith('image/'))
    setRecipeForm(prev => ({ ...prev, images: [...prev.images, ...imageFiles] }))
  }

  const removeImage = (index: number) => {
    setRecipeForm(prev => ({ 
      ...prev, 
      images: prev.images.filter((_, i) => i !== index) 
    }))
  }

  const addIngredient = () => {
    setRecipeForm(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, '']
    }))
  }

  const removeIngredient = (index: number) => {
    setRecipeForm(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }))
  }

  const updateIngredient = (index: number, value: string) => {
    setRecipeForm(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) => i === index ? value : ing)
    }))
  }

  const addInstruction = () => {
    setRecipeForm(prev => ({
      ...prev,
      instructions: [...prev.instructions, '']
    }))
  }

  const removeInstruction = (index: number) => {
    setRecipeForm(prev => ({
      ...prev,
      instructions: prev.instructions.filter((_, i) => i !== index)
    }))
  }

  const updateInstruction = (index: number, value: string) => {
    setRecipeForm(prev => ({
      ...prev,
      instructions: prev.instructions.map((inst, i) => i === index ? value : inst)
    }))
  }

  const handleTagToggle = (tag: string) => {
    setRecipeForm(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }))
  }

  const getCategoryIcon = (category: string) => {
    return categories.find(c => c.value === category)?.icon || '🍴'
  }

  const getCuisineIcon = (cuisine: string) => {
    return cuisines.find(c => c.value === cuisine)?.icon || '🌍'
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'facil': return 'bg-green-100 text-green-800 border-green-200'
      case 'medio': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'dificil': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-gray-800 flex items-center justify-center gap-3">
          <ChefHat className="h-10 w-10 text-pink-500" />
          Nuestras Recetas de Amor
        </h1>
        <p className="text-gray-600 text-lg">
          Comparte y guarda tus recetas favoritas para cocinar juntos
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-pink-600 font-medium">Total Recetas</p>
                <p className="text-2xl font-bold text-pink-700">{stats.totalRecipes}</p>
              </div>
              <ChefHat className="h-8 w-8 text-pink-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Tiempo Total</p>
                <p className="text-2xl font-bold text-blue-700">{formatTime(stats.totalTime)}</p>
              </div>
              <Timer className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Promedio</p>
                <p className="text-2xl font-bold text-green-700">{stats.averageRating.toFixed(1)} ⭐</p>
              </div>
              <Star className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 font-medium">Favoritas</p>
                <p className="text-2xl font-bold text-yellow-700">{stats.favoriteRecipes}</p>
              </div>
              <Heart className="h-8 w-8 text-yellow-500" />
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
                  placeholder="Buscar recetas..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
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

              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todas">Todas las dificultades</SelectItem>
                  <SelectItem value="facil">Fácil</SelectItem>
                  <SelectItem value="medio">Medio</SelectItem>
                  <SelectItem value="dificil">Difícil</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={openAddModal}
              className="bg-pink-500 hover:bg-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nueva Receta
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Recetas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRecipes.map((recipe) => (
          <motion.div
            key={recipe.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className={`hover:shadow-lg transition-all duration-200 cursor-pointer ${
              recipe.isFavorite ? 'ring-2 ring-pink-200 bg-pink-50' : ''
            }`}>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Imagen */}
                  <div className="relative">
                    {recipe.images && recipe.images.length > 0 ? (
                      <AspectRatio ratio={16/9} className="rounded-lg overflow-hidden">
                        <img 
                          src={recipe.images[0]} 
                          alt={recipe.title}
                          className="w-full h-full object-cover"
                        />
                      </AspectRatio>
                    ) : (
                      <div className="w-full h-32 bg-gradient-to-br from-orange-100 to-red-100 rounded-lg flex items-center justify-center">
                        <Utensils className="h-12 w-12 text-orange-400" />
                      </div>
                    )}
                    
                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      <Badge className={`text-xs ${getDifficultyColor(recipe.difficulty)}`}>
                        {recipe.difficulty === 'facil' ? 'Fácil' : recipe.difficulty === 'medio' ? 'Medio' : 'Difícil'}
                      </Badge>
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs">
                        {getCategoryIcon(recipe.category)} {categories.find(c => c.value === recipe.category)?.label}
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
                          toggleFavorite(recipe.id)
                        }}
                      >
                        <Heart className={`h-4 w-4 ${recipe.isFavorite ? 'fill-current text-red-500' : 'text-gray-400'}`} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 bg-white/80 hover:bg-white"
                        onClick={(e) => {
                          e.stopPropagation()
                          openEditModal(recipe)
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
                          openDeleteModal(recipe)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Información */}
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-gray-800 line-clamp-2">{recipe.title}</h3>
                      {recipe.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-current text-yellow-400" />
                          <span className="text-xs text-gray-500">{recipe.rating}</span>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 line-clamp-2">{recipe.description}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatTime(recipe.prepTime + recipe.cookTime)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{recipe.servings} porciones</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>{getCuisineIcon(recipe.cuisine)}</span>
                        <span>{cuisines.find(c => c.value === recipe.cuisine)?.label}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    {recipe.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {recipe.tags.slice(0, 3).map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {recipe.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{recipe.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Modal para Agregar/Editar Receta */}
      <Dialog open={showAddModal || showEditModal} onOpenChange={() => {
        setShowAddModal(false)
        setShowEditModal(false)
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ChefHat className="h-5 w-5 text-pink-500" />
              {showEditModal ? 'Editar Receta' : 'Nueva Receta'}
            </DialogTitle>
            <DialogDescription>
              Comparte tu receta especial con todos los detalles
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Información básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de la Receta *
                </label>
                <Input
                  value={recipeForm.title}
                  onChange={(e) => setRecipeForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Ej: Pasta Carbonara Romántica"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Autor
                </label>
                <Select value={recipeForm.author} onValueChange={(value: Recipe['author']) => setRecipeForm(prev => ({ ...prev, author: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yo">Yo</SelectItem>
                    <SelectItem value="pareja">Mi pareja</SelectItem>
                    <SelectItem value="ambos">Ambos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción *
              </label>
              <textarea
                value={recipeForm.description}
                onChange={(e) => setRecipeForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe tu receta..."
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-md resize-none focus:border-pink-500 focus:ring-pink-500"
              />
            </div>

            {/* Categorías y cocina */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría
                </label>
                <Select value={recipeForm.category} onValueChange={(value: Recipe['category']) => setRecipeForm(prev => ({ ...prev, category: value }))}>
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
                  Cocina
                </label>
                <Select value={recipeForm.cuisine} onValueChange={(value: Recipe['cuisine']) => setRecipeForm(prev => ({ ...prev, cuisine: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {cuisines.map(cuisine => (
                      <SelectItem key={cuisine.value} value={cuisine.value}>
                        {cuisine.icon} {cuisine.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dificultad
                </label>
                <Select value={recipeForm.difficulty} onValueChange={(value: Recipe['difficulty']) => setRecipeForm(prev => ({ ...prev, difficulty: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="facil">Fácil</SelectItem>
                    <SelectItem value="medio">Medio</SelectItem>
                    <SelectItem value="dificil">Difícil</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tiempos y porciones */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tiempo de Preparación (min)
                </label>
                <Input
                  type="number"
                  value={recipeForm.prepTime}
                  onChange={(e) => setRecipeForm(prev => ({ ...prev, prepTime: parseInt(e.target.value) || 0 }))}
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tiempo de Cocción (min)
                </label>
                <Input
                  type="number"
                  value={recipeForm.cookTime}
                  onChange={(e) => setRecipeForm(prev => ({ ...prev, cookTime: parseInt(e.target.value) || 0 }))}
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Porciones
                </label>
                <Input
                  type="number"
                  value={recipeForm.servings}
                  onChange={(e) => setRecipeForm(prev => ({ ...prev, servings: parseInt(e.target.value) || 1 }))}
                  min="1"
                />
              </div>
            </div>

            {/* Ingredientes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ingredientes *
              </label>
              <div className="space-y-2">
                {recipeForm.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={ingredient}
                      onChange={(e) => updateIngredient(index, e.target.value)}
                      placeholder={`Ingrediente ${index + 1}`}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeIngredient(index)}
                      disabled={recipeForm.ingredients.length === 1}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addIngredient}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Ingrediente
                </Button>
              </div>
            </div>

            {/* Instrucciones */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instrucciones *
              </label>
              <div className="space-y-2">
                {recipeForm.instructions.map((instruction, index) => (
                  <div key={index} className="flex gap-2">
                    <div className="flex-shrink-0 w-6 h-6 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <Input
                      value={instruction}
                      onChange={(e) => updateInstruction(index, e.target.value)}
                      placeholder={`Paso ${index + 1}`}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeInstruction(index)}
                      disabled={recipeForm.instructions.length === 1}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addInstruction}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Paso
                </Button>
              </div>
            </div>

            {/* Tips */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Consejos (Opcional)
              </label>
              <textarea
                value={recipeForm.tips}
                onChange={(e) => setRecipeForm(prev => ({ ...prev, tips: e.target.value }))}
                placeholder="Comparte algún consejo o truco especial..."
                rows={2}
                className="w-full p-3 border border-gray-300 rounded-md resize-none focus:border-pink-500 focus:ring-pink-500"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Etiquetas
              </label>
              <div className="flex flex-wrap gap-2">
                {predefinedTags.map(tag => (
                  <Badge
                    key={tag}
                    variant={recipeForm.tags.includes(tag) ? "default" : "outline"}
                    className={`cursor-pointer ${recipeForm.tags.includes(tag) ? 'bg-pink-100 text-pink-800 border-pink-200' : ''}`}
                    onClick={() => handleTagToggle(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Imágenes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imágenes (Opcional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-pink-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                  className="hidden"
                  id="recipe-images"
                />
                <label htmlFor="recipe-images" className="cursor-pointer">
                  <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Haz clic para agregar imágenes</p>
                </label>
              </div>
              
              {recipeForm.images.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
                  {recipeForm.images.map((image, index) => (
                    <div key={index} className="relative">
                      <AspectRatio ratio={1} className="rounded-lg overflow-hidden">
                        <img 
                          src={URL.createObjectURL(image)} 
                          alt={`Vista previa ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </AspectRatio>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute top-1 right-1 h-6 w-6 p-0"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
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
              onClick={handleSaveRecipe}
              disabled={!recipeForm.title || !recipeForm.description}
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
              Eliminar Receta
            </DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres eliminar "{selectedRecipe?.title}"? Esta acción no se puede deshacer.
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
              onClick={handleDeleteRecipe}
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
