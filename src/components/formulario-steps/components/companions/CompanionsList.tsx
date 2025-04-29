"use client"

import { CreateHuespedSecundarioWithoutIdDto } from "@/Types/huesped-secundario-sin-id-Dto"
import { Accordion } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, UserPlus } from "lucide-react"
import { CompanionItem } from "./CompanionItem"

interface CompanionsListProps {
  companions: CreateHuespedSecundarioWithoutIdDto[]
  onAddCompanion: () => void
  onEditCompanion: (index: number) => void
  onDeleteCompanion: (index: number) => void
}

export function CompanionsList({ 
  companions, 
  onAddCompanion, 
  onEditCompanion, 
  onDeleteCompanion 
}: CompanionsListProps) {
  if (companions.length === 0) {
    return (
      <Card className="bg-muted/5 border-dashed">
        <CardContent className="pt-4 sm:pt-6 pb-4 sm:pb-6 flex flex-col items-center justify-center">
          <p className="text-gray-500 mb-4 text-sm sm:text-base">No ha agregado ningún acompañante</p>
          <Button onClick={onAddCompanion} className="px-4 sm:px-6 w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Agregar acompañante
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Accordion type="single" collapsible className="w-full">
        {companions.map((companion, index) => (
          <CompanionItem
            key={index}
            companion={companion}
            index={index}
            onEdit={onEditCompanion}
            onDelete={onDeleteCompanion}
          />
        ))}
      </Accordion>
      <Button 
        variant="outline" 
        onClick={onAddCompanion}
        className="w-full mt-4"
      >
        <UserPlus className="h-4 w-4 mr-2" />
        Agregar otro acompañante
      </Button>
    </div>
  )
} 