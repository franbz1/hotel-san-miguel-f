"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal, Pencil, Trash2, User, Shield, Settings, ClipboardList } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Usuario } from "@/Types/usuario"
import { RoleType } from "@/lib/common/constants/constants"
import { AdminOnly } from "@/components/auth/permission-guard"

interface UsuariosTableProps {
  usuarios: Usuario[]
  currentPage: number
  totalPages: number
  isLoading: boolean
  searchTerm: string
  onSearchChange: (term: string) => void
  onPageChange: (page: number) => void
  onEdit: (usuario: Usuario) => void
  onDelete: (id: number) => void
}

// Función para obtener el ícono del rol
const getRoleIcon = (rol: RoleType) => {
  switch (rol) {
    case 'ADMINISTRADOR':
      return <Shield className="w-4 h-4" />
    case 'CAJERO':
      return <Settings className="w-4 h-4" />
    case 'ASEO':
      return <ClipboardList className="w-4 h-4" />
    case 'REGISTRO_FORMULARIO':
      return <User className="w-4 h-4" />
    default:
      return <User className="w-4 h-4" />
  }
}

// Función para obtener el color del badge del rol
const getRoleBadgeVariant = (rol: RoleType) => {
  switch (rol) {
    case 'ADMINISTRADOR':
      return 'destructive'
    case 'CAJERO':
      return 'default'
    case 'ASEO':
      return 'secondary'
    case 'REGISTRO_FORMULARIO':
      return 'outline'
    default:
      return 'outline'
  }
}

// Función para generar colores consistentes para avatares
const getAvatarColor = (nombre: string) => {
  const colors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
  ]
  let hash = 0
  for (let i = 0; i < nombre.length; i++) {
    hash = nombre.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

// Función para obtener las iniciales del nombre
const getInitials = (nombre: string) => {
  return nombre
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function UsuariosTable({
  usuarios,
  currentPage,
  totalPages,
  isLoading,
  searchTerm,
  onSearchChange,
  onPageChange,
  onEdit,
  onDelete
}: UsuariosTableProps) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [usuarioToDelete, setUsuarioToDelete] = useState<Usuario | null>(null)

  const handleDeleteClick = (usuario: Usuario) => {
    setUsuarioToDelete(usuario)
    setDeleteModalOpen(true)
  }

  const handleConfirmDelete = () => {
    if (usuarioToDelete) {
      onDelete(usuarioToDelete.id)
      setDeleteModalOpen(false)
      setUsuarioToDelete(null)
    }
  }

  const handlePreviousPage = () => {
    if (currentPage > 1 && !isLoading) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages && !isLoading) {
      onPageChange(currentPage + 1)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Barra de búsqueda */}
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Buscar usuarios..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Tabla */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuario</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Fecha de creación</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usuarios.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  <div className="text-muted-foreground">
                    No se encontraron usuarios
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              usuarios.map((usuario) => (
                <TableRow key={usuario.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div 
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium ${getAvatarColor(usuario.nombre)}`}
                      >
                        {getInitials(usuario.nombre)}
                      </div>
                      <div>
                        <div className="font-medium">{usuario.nombre}</div>
                        <div className="text-sm text-muted-foreground">
                          ID: {usuario.id}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={getRoleBadgeVariant(usuario.rol)}
                      className="flex items-center gap-1 w-fit"
                    >
                      {getRoleIcon(usuario.rol)}
                      {usuario.rol}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {new Date(usuario.createdAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menú</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <AdminOnly>
                          <DropdownMenuItem
                            onClick={() => onEdit(usuario)}
                            className="cursor-pointer"
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                        </AdminOnly>
                        <DropdownMenuSeparator />
                        <AdminOnly>
                          <DropdownMenuItem
                            onClick={() => handleDeleteClick(usuario)}
                            className="cursor-pointer text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                          </DropdownMenuItem>
                        </AdminOnly>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Página {currentPage} de {totalPages}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={currentPage <= 1 || isLoading}
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage >= totalPages || isLoading}
            >
              Siguiente
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar al usuario &quot;{usuarioToDelete?.nombre}&quot;?
              Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 