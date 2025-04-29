"use client"

import { TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Globe, MapPin, Phone, User } from "lucide-react"
import { AlertCircle } from "lucide-react"

interface TabNavProps {
  activeTab: string
  tabErrors?: Record<string, boolean>
}

export function TabNav({ activeTab, tabErrors = {} }: TabNavProps) {
  return (
    <TabsList className="grid grid-cols-4 w-full mb-6">
      <TabsTrigger 
        value="personal" 
        className="flex items-center gap-2 cursor-pointer"
        data-state={activeTab === "personal" ? "active" : "inactive"}
      >
        <User className="h-4 w-4" />
        <span className="hidden sm:inline">Datos Personales</span>
        {tabErrors.personal && (
          <AlertCircle className="h-4 w-4 text-destructive" />
        )}
      </TabsTrigger>
      <TabsTrigger 
        value="contacto" 
        className="flex items-center gap-2 cursor-pointer"
        data-state={activeTab === "contacto" ? "active" : "inactive"}
      >
        <Phone className="h-4 w-4" />
        <span className="hidden sm:inline">Contacto</span>
        {tabErrors.contacto && (
          <AlertCircle className="h-4 w-4 text-destructive" />
        )}
      </TabsTrigger>
      <TabsTrigger 
        value="ubicacion" 
        className="flex items-center gap-2 cursor-pointer"
        data-state={activeTab === "ubicacion" ? "active" : "inactive"}
      >
        <MapPin className="h-4 w-4" />
        <span className="hidden sm:inline">Ubicación</span>
        {tabErrors.ubicacion && (
          <AlertCircle className="h-4 w-4 text-destructive" />
        )}
      </TabsTrigger>
      <TabsTrigger 
        value="viaje" 
        className="flex items-center gap-2 cursor-pointer"
        data-state={activeTab === "viaje" ? "active" : "inactive"}
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">Viaje</span>
        {tabErrors.viaje && (
          <AlertCircle className="h-4 w-4 text-destructive" />
        )}
      </TabsTrigger>
    </TabsList>
  )
} 