"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface NavigationButtonsProps {
  onNext: () => void
  onPrevious: () => void
}

export function NavigationButtons({ onNext, onPrevious }: NavigationButtonsProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6 sm:mt-8 pt-4 border-t">
      <Button type="button" variant="outline" onClick={onPrevious} className="w-full sm:w-auto sm:min-w-[120px]">
        <ChevronLeft className="h-4 w-4 mr-2" />
        Atrás
      </Button>
      <Button type="button" onClick={onNext} className="w-full sm:w-auto sm:min-w-[120px]">
        Continuar
        <ChevronRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  )
} 