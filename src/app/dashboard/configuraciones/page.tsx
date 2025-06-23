"use client";

import { Header } from "@/components/layout/header";
import { ConfiguracionAseoComponent } from "@/components/aseo/configuracion-aseo";
import { ConfiguracionUsuariosComponent } from "@/components/usuarios/configuracion-usuarios";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Brush, Users, Shield, Settings } from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";

export default function ConfiguracionesPage() {
  const { canAccessConfiguration, isAdmin } = usePermissions();

  // Verificar permisos de acceso
  if (!canAccessConfiguration && !isAdmin()) {
    return (
      <div>
        <Header />
        
        <main className="container mx-auto px-4 py-6">
          <div className="flex flex-col items-center justify-center min-h-[500px] space-y-6">
            <div className="p-6 rounded-full bg-red-100">
              <Shield className="w-12 h-12 text-red-600" />
            </div>
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold text-gray-900">Acceso Restringido</h1>
              <p className="text-gray-600 max-w-md">
                No tienes permisos para acceder a las configuraciones del sistema.
                Solo los administradores pueden gestionar estas configuraciones.
              </p>
              <p className="text-sm text-gray-500 mt-4">
                Contacta con un administrador si necesitas acceso a esta sección.
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-lg border border-amber-200">
              <Settings className="w-4 h-4" />
              <span className="text-sm font-medium">Configuraciones del Sistema</span>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Configuraciones del Sistema</h1>
          <p className="text-gray-600 mt-2">
            Gestiona las configuraciones generales del hotel y módulos específicos
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border">
          <Accordion type="single" collapsible className="w-full">
            
            {/* Configuración de Aseo */}
            <AccordionItem value="aseo" className="border-b">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Brush className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-gray-900">Configuración de Aseo</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Horarios, procedimientos, elementos y configuraciones del módulo de aseo
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <ConfiguracionAseoComponent />
              </AccordionContent>
            </AccordionItem>

            {/* Configuración de Usuarios */}
            <AccordionItem value="usuarios" className="border-b-0">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-gray-900">Configuración de Usuarios</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Roles, permisos y gestión completa de usuarios del sistema
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <ConfiguracionUsuariosComponent />
              </AccordionContent>
            </AccordionItem>

          </Accordion>
        </div>
      </main>
    </div>
  );
} 