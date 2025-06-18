import { Header } from "@/components/layout/header";
import { ConfiguracionAseoComponent } from "@/components/aseo/configuracion-aseo";

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

        <div className="grid gap-6">
          {/* Configuración de Aseo */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Configuración de Aseo</h2>
              <p className="text-sm text-gray-600 mt-1">
                Configura los horarios y parámetros del módulo de aseo
              </p>
            </div>
            <div className="p-6">
              <ConfiguracionAseoComponent />
            </div>
          </div>

          {/* Futuras configuraciones */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Otras Configuraciones</h2>
              <p className="text-sm text-gray-600 mt-1">
                Próximamente más opciones de configuración
              </p>
            </div>
            <div className="p-6">
              <div className="text-center py-8 text-gray-500">
                <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                  </svg>
                </div>
                <p>Más configuraciones estarán disponibles próximamente</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 