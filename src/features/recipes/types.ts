export interface Recipe {
  id: string
  title: string
  description: string
  category: 'desayuno' | 'almuerzo' | 'cena' | 'postre' | 'bebida' | 'snack' | 'sopa' | 'ensalada' | 'pasta' | 'carne' | 'pescado' | 'vegetariano' | 'vegano' | 'otro'
  cuisine: 'mexicana' | 'italiana' | 'china' | 'japonesa' | 'francesa' | 'española' | 'americana' | 'mediterranea' | 'asiatica' | 'otra'
  difficulty: 'facil' | 'medio' | 'dificil'
  prepTime?: number
  cookTime?: number
  servings: number
  ingredients: string[]
  instructions: string[]
  tips?: string
  author: 'yo' | 'pareja' | 'ambos'
  isFavorite?: boolean
  rating?: number
  tags: string[]
  images?: string[]
  created_at?: string
  updated_at?: string
}

export interface RecipeForm {
  title: string
  description: string
  category: Recipe['category']
  cuisine: Recipe['cuisine']
  difficulty: Recipe['difficulty']
  prepTime: number
  cookTime: number
  servings: number
  ingredients: string[]
  instructions: string[]
  tips: string
  author: Recipe['author']
  tags: string[]
  images: File[]
}
