import { Header } from "@/components/layout/header";
import { ConfiguracionAseoComponent } from "@/components/aseo/configuracion-aseo";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Settings, Brush, Cog, Users, BellRing } from "lucide-react";

export default function ConfiguracionesPage() {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <Header title="Configuraciones - Hotel San Miguel" />
      
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
            <AccordionItem value="usuarios" className="border-b">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-gray-900">Configuración de Usuarios</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Roles, permisos y configuraciones de usuarios del sistema
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <div className="text-center py-8 text-gray-500">
                  <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6" />
                  </div>
                  <p>Configuración de usuarios estará disponible próximamente</p>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Configuración de Notificaciones */}
            <AccordionItem value="notificaciones" className="border-b">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <BellRing className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-gray-900">Configuración de Notificaciones</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Configuraciones generales de notificaciones del sistema
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <div className="text-center py-8 text-gray-500">
                  <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                    <BellRing className="w-6 h-6" />
                  </div>
                  <p>Configuración de notificaciones estará disponible próximamente</p>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Configuración del Sistema */}
            <AccordionItem value="sistema" className="border-b-0">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Cog className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-gray-900">Configuración del Sistema</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Configuraciones generales, respaldos y mantenimiento del sistema
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <div className="text-center py-8 text-gray-500">
                  <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Settings className="w-6 h-6" />
                  </div>
                  <p>Configuración del sistema estará disponible próximamente</p>
                </div>
              </AccordionContent>
            </AccordionItem>

          </Accordion>
        </div>
      </main>
    </div>
  );
} 