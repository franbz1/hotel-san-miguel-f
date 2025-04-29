"use client"

import { Checkbox } from "@/components/ui/checkbox"

interface CompanionCheckboxProps {
  hasCompanions: boolean
  onChange: (checked: boolean) => void
}

export function CompanionCheckbox({ hasCompanions, onChange }: CompanionCheckboxProps) {
  return (
    <div className="flex items-center space-x-2 p-4 bg-muted/10 rounded-lg">
      <Checkbox 
        id="hasCompanions" 
        checked={hasCompanions}
        onCheckedChange={(checked) => {
          // Solo actualizar si realmente hay un cambio
          if (checked !== hasCompanions) {
            onChange(!!checked)
          }
        }}
      />
      <label
        htmlFor="hasCompanions"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Viajo con uno o más acompañantes
      </label>
    </div>
  )
} 