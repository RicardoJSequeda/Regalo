'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Heart, Calendar, Clock, Users, Image } from 'lucide-react'
import { formatAnniversaryDate } from '@/lib/auth'
import { useTimeTogether } from '@/hooks/useTimeTogether'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useDataExport } from '@/hooks/useDataExport'

export function InicioSection() {
  const anniversaryDate = '2023-02-03'
  const formattedDate = formatAnniversaryDate(anniversaryDate)
  const timeTogether = useTimeTogether(anniversaryDate)
  
  // Obtener datos de todos los módulos para estadísticas dinámicas
  const { value: milestones } = useLocalStorage<any[]>('milestones', [])
  const { value: messages } = useLocalStorage<any[]>('messages', [])
  const { value: photos } = useLocalStorage<any[]>('photos', [])
  const { value: plans } = useLocalStorage<any[]>('plans', [])
  const { value: diaryEntries } = useLocalStorage<any[]>('diaryEntries', [])
  const { value: recipes } = useLocalStorage<any[]>('recipes', [])
  const { value: movies } = useLocalStorage<any[]>('movies', [])
  const { value: gifts } = useLocalStorage<any[]>('gifts', [])
  const { value: goals } = useLocalStorage<any[]>('goals', [])
  const { value: dreams } = useLocalStorage<any[]>('dreams', [])
  const { value: pets } = useLocalStorage<any[]>('pets', [])
  
  const { exportAllData, importAllData, clearAllData, getStorageInfo } = useDataExport()
  
  // Imágenes para el carrusel más grande
  const carouselImages = [
    {
      id: 1,
      title: "Nuestro Primer Encuentro",
      description: "Unidos por la emoción y el amor",
      longDescription: "Compartiendo la pasión del deporte, pero lo más emocionante siempre es tenerte a mi lado. Cada instante contigo es una victoria en mi corazón.",
      image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=1200&h=600&fit=crop&crop=center",
      date: "3 de Febrero, 2023"
    },
    {
      id: 2,
      title: "Momentos Especiales",
      description: "Cada día contigo es un regalo del cielo",
      longDescription: "Los momentos más simples se vuelven extraordinarios cuando los compartimos juntos. Tu sonrisa ilumina cada día de mi vida.",
      image: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=1200&h=600&fit=crop&crop=center",
      date: "Siempre"
    },
    {
      id: 3,
      title: "Nuestro Amor",
      description: "Un amor que crece cada día más fuerte",
      longDescription: "Cada día que pasa, nuestro amor se fortalece más. Eres mi compañera perfecta en esta hermosa aventura llamada vida.",
      image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=1200&h=600&fit=crop&crop=center",
      date: "Para siempre"
    },
    {
      id: 4,
      title: "Juntos por Siempre",
      description: "Nuestro futuro está lleno de promesas y amor",
      longDescription: "Mirando hacia el futuro, veo un camino lleno de amor, risas y momentos inolvidables. Contigo todo es posible.",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop&crop=center",
      date: "Eternamente"
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">¡Bienvenida a tu espacio especial!</h1>
        <p className="text-muted-foreground">
          Aquí encontrarás todos nuestros recuerdos, mensajes y momentos especiales juntos.
        </p>
      </div>

      <Separator />

      {/* Contador de Tiempo Juntos */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            <Heart className="h-6 w-6 text-primary" />
            Nuestro Tiempo Juntos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">{timeTogether.years}</div>
              <div className="text-sm text-muted-foreground font-medium">AÑOS</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">{timeTogether.months}</div>
              <div className="text-sm text-muted-foreground font-medium">MESES</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">{timeTogether.days}</div>
              <div className="text-sm text-muted-foreground font-medium">DÍAS</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">{timeTogether.hours}</div>
              <div className="text-sm text-muted-foreground font-medium">HORAS</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">{timeTogether.minutes}</div>
              <div className="text-sm text-muted-foreground font-medium">MIN</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">{timeTogether.seconds}</div>
              <div className="text-sm text-muted-foreground font-medium">SEG</div>
            </div>
          </div>
          <div className="text-center mt-6">
            <p className="text-lg text-muted-foreground">
              Faltan {365 - (timeTogether.days + timeTogether.months * 30)} días para nuestro próximo aniversario ❤️❤️❤️
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Carrusel Grande */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Así comenzó todo:</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                {carouselImages.map((item) => (
                  <CarouselItem key={item.id} className="basis-full">
                    <div className="p-1">
                      <div className="relative overflow-hidden rounded-lg">
                        <div className="aspect-[16/9] relative overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                          <div className="absolute bottom-6 left-6 right-6 text-white">
                            <h3 className="font-bold text-2xl mb-2">{item.title}</h3>
                            <p className="text-lg opacity-90 mb-3">{item.description}</p>
                            <p className="text-base opacity-80 leading-relaxed mb-4">{item.longDescription}</p>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-sm">
                                <Calendar className="h-4 w-4 mr-1" />
                                {item.date}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4" />
              <CarouselNext className="right-4" />
            </Carousel>
          </div>
        </CardContent>
      </Card>

      {/* Nuestro Rincón de Amor */}
      <Card className="bg-gradient-to-r from-secondary/5 to-accent/5 border-secondary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-secondary" />
            Nuestro Rincón de Amor
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg leading-relaxed text-center">
            Este es nuestro espacio especial para guardar y revivir todos los momentos mágicos que hemos compartido juntos. 
            Cada foto, cada mensaje y cada canción es un tesoro que nos recuerda lo especial que es nuestro amor.
          </p>
          <div className="text-center">
            <blockquote className="text-lg italic text-muted-foreground">
              "El amor no se mide por cuánto tiempo lo has esperado, sino por cuánto estás dispuesto a esperar por él."
            </blockquote>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Días Juntos</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{timeTogether.totalDays}</div>
            <p className="text-xs text-muted-foreground">
              +1 desde ayer
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aniversario</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formattedDate}</div>
            <p className="text-xs text-muted-foreground">
              Nuestro día especial
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recuerdos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{milestones.length}</div>
            <p className="text-xs text-muted-foreground">
              Momentos especiales
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mensajes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{messages.length}</div>
            <p className="text-xs text-muted-foreground">
              Palabras de amor
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Estadísticas Adicionales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fotos</CardTitle>
            <Image className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{photos.length}</div>
            <p className="text-xs text-muted-foreground">
              Momentos capturados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Planes</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{plans.length}</div>
            <p className="text-xs text-muted-foreground">
              Aventuras planificadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Metas</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{goals.length + dreams.length}</div>
            <p className="text-xs text-muted-foreground">
              Sueños por cumplir
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mascotas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pets.length}</div>
            <p className="text-xs text-muted-foreground">
              Miembros de la familia
            </p>
          </CardContent>
        </Card>
      </div>


    </div>
  )
}
