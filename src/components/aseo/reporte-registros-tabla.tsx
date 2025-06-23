'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Users, 
  Building, 
  Calendar,
  User,
  Search,
  AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';
import { RegistroAseoHabitacion } from '@/Types/aseo/RegistroAseoHabitacion';
import { RegistroAseoZonaComun } from '@/Types/aseo/RegistroAseoZonaComun';
import { TiposAseo } from '@/Types/aseo/tiposAseoEnum';
import Link from 'next/link';

interface RegistroUnificado {
  id: number;
  tipo: 'habitacion' | 'zona_comun';
  ubicacion: string;
  fecha: Date;
  usuario: string;
  tiposAseo: TiposAseo[];
  objetosPerdidos: boolean;
  rastrosAnimales: boolean;
  observaciones?: string;
}

interface ReporteRegistrosTablaProps {
  habitaciones: RegistroAseoHabitacion[];
  zonasComunes: RegistroAseoZonaComun[];
}

export default function ReporteRegistrosTabla({ 
  habitaciones, 
  zonasComunes 
}: ReporteRegistrosTablaProps) {
  
  // Unificar registros de habitaciones y zonas comunes
  const registrosUnificados: RegistroUnificado[] = [
    // Registros de habitaciones
    ...habitaciones.map(registro => ({
      id: registro.id,
      tipo: 'habitacion' as const,
      ubicacion: `Habitación ${registro.habitacion.numero_habitacion}`,
      fecha: registro.fecha_registro,
      usuario: registro.usuario.nombre,
      tiposAseo: registro.tipos_realizados,
      objetosPerdidos: registro.objetos_perdidos,
      rastrosAnimales: registro.rastros_de_animales,
      observaciones: registro.observaciones
    })),
    // Registros de zonas comunes
    ...zonasComunes.map(registro => ({
      id: registro.id,
      tipo: 'zona_comun' as const,
      ubicacion: registro.zonaComun.nombre,
      fecha: registro.fecha_registro,
      usuario: registro.usuario.nombre,
      tiposAseo: registro.tipos_realizados,
      objetosPerdidos: registro.objetos_perdidos,
      rastrosAnimales: registro.rastros_de_animales,
      observaciones: registro.observaciones
    }))
  ].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

  const getTipoAseoColor = (tipo: TiposAseo) => {
    switch (tipo) {
      case TiposAseo.LIMPIEZA:
        return 'bg-green-100 text-green-800 border-green-200';
      case TiposAseo.DESINFECCION:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case TiposAseo.ROTACION_COLCHONES:
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case TiposAseo.LIMPIEZA_BANIO:
        return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      case TiposAseo.DESINFECCION_BANIO:
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTipoAseoText = (tipo: TiposAseo) => {
    switch (tipo) {
      case TiposAseo.LIMPIEZA:
        return 'Limpieza';
      case TiposAseo.DESINFECCION:
        return 'Desinfección';
      case TiposAseo.ROTACION_COLCHONES:
        return 'Rotación Colchones';
      case TiposAseo.LIMPIEZA_BANIO:
        return 'Limpieza Baño';
      case TiposAseo.DESINFECCION_BANIO:
        return 'Desinfección Baño';
      default:
        return tipo;
    }
  };

  if (registrosUnificados.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Registros de Aseo del Reporte
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No hay registros de aseo en este reporte</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Registros de Aseo del Reporte
          <Badge variant="secondary" className="ml-2">
            {registrosUnificados.length} registros
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ubicación</TableHead>
                <TableHead>Fecha y Hora</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Tipos de Aseo</TableHead>
                <TableHead>Hallazgos</TableHead>
                <TableHead>Observaciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {registrosUnificados.map((registro) => (
                <TableRow key={`${registro.tipo}-${registro.id}`}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {registro.tipo === 'habitacion' ? (
                        <Users className="h-4 w-4 text-blue-500" />
                      ) : (
                        <Building className="h-4 w-4 text-green-500" />
                      )}
                      <div>
                        <Link 
                          href={
                            registro.tipo === 'habitacion' 
                              ? `/aseo/habitaciones/registros/${registro.id}`
                              : `/aseo/zonas-comunes/registros/${registro.id}`
                          }
                          className="font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                        >
                          {registro.ubicacion}
                        </Link>
                        <div className="text-sm text-gray-500">
                          {registro.tipo === 'habitacion' ? 'Habitación' : 'Zona Común'}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">
                        {format(new Date(registro.fecha), 'dd/MM/yyyy')}
                      </div>
                      <div className="text-gray-500">
                        {format(new Date(registro.fecha), 'HH:mm')}
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{registro.usuario}</span>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {registro.tiposAseo.map((tipo, index) => (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          className={`text-xs ${getTipoAseoColor(tipo)}`}
                        >
                          {getTipoAseoText(tipo)}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {registro.objetosPerdidos && (
                        <div className="flex items-center gap-1 text-orange-600">
                          <Search className="h-3 w-3" />
                          <span className="text-xs">Objetos perdidos</span>
                        </div>
                      )}
                      {registro.rastrosAnimales && (
                        <div className="flex items-center gap-1 text-red-600">
                          <AlertTriangle className="h-3 w-3" />
                          <span className="text-xs">Rastros animales</span>
                        </div>
                      )}
                      {!registro.objetosPerdidos && !registro.rastrosAnimales && (
                        <span className="text-xs text-gray-400">Sin hallazgos</span>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    {registro.observaciones ? (
                      <div className="max-w-xs">
                        <p className="text-sm text-gray-600 truncate" title={registro.observaciones}>
                          {registro.observaciones}
                        </p>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">Sin observaciones</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Resumen rápido */}
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-blue-600">
                {habitaciones.length}
              </div>
              <div className="text-xs text-gray-600">Habitaciones</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-green-600">
                {zonasComunes.length}
              </div>
              <div className="text-xs text-gray-600">Zonas Comunes</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-orange-600">
                {registrosUnificados.filter(r => r.objetosPerdidos).length}
              </div>
              <div className="text-xs text-gray-600">Con Objetos Perdidos</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-red-600">
                {registrosUnificados.filter(r => r.rastrosAnimales).length}
              </div>
              <div className="text-xs text-gray-600">Con Rastros Animales</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 