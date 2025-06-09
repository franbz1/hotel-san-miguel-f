"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Usuario, CreateUsuarioDto, UpdateUsuarioDto } from "@/Types/usuario"
import { RoleType } from "@/lib/common/constants/constants"

const usuarioSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  rol: z.enum(['ADMINISTRADOR', 'CAJERO', 'ASEO', 'REGISTRO_FORMULARIO'], {
    errorMap: () => ({ message: "Debe seleccionar un rol válido" })
  }),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
})

type UsuarioFormData = z.infer<typeof usuarioSchema>

interface UsuarioModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  usuario?: Usuario | null
  onSubmit: (data: CreateUsuarioDto | UpdateUsuarioDto) => void
  isLoading?: boolean
}

const roleLabels: Record<RoleType, string> = {
  ADMINISTRADOR: 'Administrador',
  CAJERO: 'Cajero',
  ASEO: 'Personal de Aseo',
  REGISTRO_FORMULARIO: 'Registro de Formularios'
}

export function UsuarioModal({ 
  open, 
  onOpenChange, 
  usuario, 
  onSubmit, 
  isLoading = false 
}: UsuarioModalProps) {
  const isEditing = !!usuario

  const form = useForm<UsuarioFormData>({
    resolver: zodResolver(usuarioSchema),
    defaultValues: {
      nombre: usuario?.nombre || '',
      rol: usuario?.rol || 'CAJERO',
      password: '',
    },
  })

  const handleSubmit = (data: UsuarioFormData) => {
    if (isEditing) {
      // Si es edición y no se cambió la contraseña, no incluirla
      const updateData: UpdateUsuarioDto = {
        nombre: data.nombre,
        rol: data.rol,
      }
      
      // Solo incluir la contraseña si se proporcionó
      if (data.password) {
        updateData.password = data.password
      }
      
      onSubmit(updateData)
    } else {
      onSubmit(data as CreateUsuarioDto)
    }
  }

  const handleClose = () => {
    form.reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Modifica los datos del usuario. Deja la contraseña vacía si no deseas cambiarla.' 
              : 'Completa los datos para crear un nuevo usuario.'
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre del usuario" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rol"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rol</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un rol" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(roleLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Contraseña {isEditing && '(opcional)'}
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder={isEditing ? "Dejar vacío para no cambiar" : "Contraseña"} 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 