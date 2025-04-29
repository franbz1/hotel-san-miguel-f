"use client"

import { CreateHuespedSecundarioWithoutIdDto } from "@/Types/huesped-secundario-sin-id-Dto"
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"

interface CompanionItemProps {
  companion: CreateHuespedSecundarioWithoutIdDto
  index: number
  onEdit: (index: number) => void
  onDelete: (index: number) => void
}

export function CompanionItem({ companion, index, onEdit, onDelete }: CompanionItemProps) {
  return (
    <AccordionItem 
      value={`companion-${index}`} 
      className="border border-muted rounded-md mb-2 overflow-hidden"
    >
      <AccordionTrigger className="px-4 hover:bg-muted/20 py-3 rounded-t-md cursor-pointer">
        <div className="flex justify-between w-full items-center">
          <span className="font-medium">
            {companion.nombres} {companion.primer_apellido} {companion.segundo_apellido || ""}
          </span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-6 py-4 bg-muted/5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Datos esenciales */}
          <div>
            <p className="text-sm font-medium text-gray-500">Documento</p>
            <p className="text-sm">{companion.tipo_documento} {companion.numero_documento}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Nombres y apellidos</p>
            <p className="text-sm">{companion.nombres} {companion.primer_apellido} {companion.segundo_apellido || ""}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Fecha de Nacimiento</p>
            <p className="text-sm">{companion.fecha_nacimiento?.toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Género</p>
            <p className="text-sm">{companion.genero}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Nacionalidad</p>
            <p className="text-sm">{companion.nacionalidad}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Ocupación</p>
            <p className="text-sm">{companion.ocupacion}</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm font-medium text-gray-500">Ubicación</p>
            <p className="text-sm">Residencia: {companion.ciudad_residencia}, {companion.pais_residencia}</p>
            <p className="text-sm">Procedencia: {companion.ciudad_procedencia}, {companion.pais_procedencia}</p>
          </div>
          
          {/* Datos opcionales - solo mostrar si existen */}
          {(companion.telefono || companion.correo) && (
            <div className="col-span-2 mt-2 pt-2 border-t border-dashed">
              <p className="text-sm font-medium text-gray-500 mb-1">Información de contacto (Opcional)</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {companion.telefono && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Teléfono</p>
                    <p className="text-sm">{companion.telefono}</p>
                  </div>
                )}
                {companion.correo && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Correo</p>
                    <p className="text-sm">{companion.correo}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-end space-x-2 mt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(index)}
          >
            <Pencil className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(index)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Eliminar
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  )
} 