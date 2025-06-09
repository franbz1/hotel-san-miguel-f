"use client"

import { useState, useEffect } from "react"
import { Users, Plus, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UsuariosTable } from "@/components/usuarios/usuarios-table"
import { UsuarioModal } from "@/components/usuarios/usuario-modal"
import { AdminOnly } from "@/components/auth/permission-guard"
import { Header } from "@/components/layout/header"
import { usePermissions } from "@/hooks/usePermissions"
import { Usuario, CreateUsuarioDto, UpdateUsuarioDto } from "@/Types/usuario"
import { getUsuarios, createUsuario, updateUsuario, deleteUsuario } from "@/lib/usuarios/usuario-service"
import { toast } from "sonner"

export default function UsuariosPage() {
  const { canAccessUserManagement } = usePermissions()
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchUsuarios = async () => {
    try {
      setIsLoading(true)
      const response = await getUsuarios(currentPage, 10)
      setUsuarios(response.data)
      setTotalPages(response.meta.lastPage)
    } catch (error) {
      console.error('Error al cargar usuarios:', error)
      toast.error('Error al cargar los usuarios')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsuarios()
  }, [currentPage])

  // Filtrar usuarios por término de búsqueda
  const filteredUsuarios = usuarios.filter(usuario =>
    usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.rol.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreateUser = () => {
    setSelectedUsuario(null)
    setModalOpen(true)
  }

  const handleEditUser = (usuario: Usuario) => {
    setSelectedUsuario(usuario)
    setModalOpen(true)
  }

  const handleDeleteUser = async (id: number) => {
    try {
      await deleteUsuario(id)
      toast.success('Usuario eliminado exitosamente')
      fetchUsuarios()
    } catch (error) {
      console.error('Error al eliminar usuario:', error)
      toast.error('Error al eliminar el usuario')
    }
  }

  const handleSubmitUser = async (data: CreateUsuarioDto | UpdateUsuarioDto) => {
    try {
      setIsSubmitting(true)
      
      if (selectedUsuario) {
        // Editar usuario existente
        await updateUsuario(selectedUsuario.id, data as UpdateUsuarioDto)
        toast.success('Usuario actualizado exitosamente')
      } else {
        // Crear nuevo usuario
        await createUsuario(data as CreateUsuarioDto)
        toast.success('Usuario creado exitosamente')
      }
      
      setModalOpen(false)
      setSelectedUsuario(null)
      fetchUsuarios()
    } catch (error) {
      console.error('Error al guardar usuario:', error)
      toast.error(selectedUsuario ? 'Error al actualizar el usuario' : 'Error al crear el usuario')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleSearchChange = (term: string) => {
    setSearchTerm(term)
  }

  // Verificar permisos de acceso
  if (!canAccessUserManagement) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="p-4 rounded-full bg-red-100">
          <Shield className="w-8 h-8 text-red-600" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Acceso Restringido</h2>
          <p className="text-sm text-gray-600 mt-1">
            No tienes permisos para acceder a la gestión de usuarios.
            <br />
            Contacta con un administrador si necesitas acceso.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <Header />

      {/* Contenido Principal */}
      <div className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Header de la página */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Gestión de Usuarios</h1>
              <p className="text-muted-foreground">
                Administra los usuarios del sistema y sus roles
              </p>
            </div>
            <AdminOnly>
              <Button onClick={handleCreateUser}>
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Usuario
              </Button>
            </AdminOnly>
          </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usuarios.length}</div>
            <p className="text-xs text-muted-foreground">
              En el sistema
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Administradores</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {usuarios.filter(u => u.rol === 'ADMINISTRADOR').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Con permisos completos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Personal Activo</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {usuarios.filter(u => !u.deleted).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Usuarios habilitados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de usuarios */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuarios</CardTitle>
          <CardDescription>
            Gestiona todos los usuarios registrados en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UsuariosTable
            usuarios={filteredUsuarios}
            currentPage={currentPage}
            totalPages={totalPages}
            isLoading={isLoading}
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            onPageChange={handlePageChange}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
          />
        </CardContent>
      </Card>

          {/* Modal de usuario */}
          <UsuarioModal
            open={modalOpen}
            onOpenChange={setModalOpen}
            usuario={selectedUsuario}
            onSubmit={handleSubmitUser}
            isLoading={isSubmitting}
          />
        </div>
      </div>
    </div>
  )
} 