import { useLinkFormularioById, useValidateLinkFormulario } from "@/hooks/formulario/useLinkFormulario";
import { Role } from "@/lib/common/constants/constants";
import { ValidateLinkFormularioResponse } from "@/lib/formulario/link-formulario-service";
import { LinkFormulario } from "@/Types/link-formulario";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useReducer } from "react";

// Tipos para el state del reducer
interface FormularioGuardState {
  error: string | null;
  validatedLinkId: number | null;
  isValidated: boolean;
  isTimeExpired: boolean;
}

// Acciones del reducer
type FormularioGuardAction =
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'SET_VALIDATED_LINK_ID'; payload: number }
  | { type: 'SET_VALIDATED'; payload: boolean }
  | { type: 'RESET_ERROR' }
  | { type: 'SET_TIME_EXPIRED' };

// Mensajes de error consolidados
const ERROR_MESSAGES = {
  EXPIRED_LINK: 'El link del formulario ha expirado',
  COMPLETED_FORM: 'El formulario ya fue completado',
  MISSING_DATA: 'El formulario no tiene los datos necesarios',
  INSUFFICIENT_PERMISSIONS: 'No tienes permiso para acceder a esta página',
  VALIDATION_ERROR: 'Error al validar el link del formulario',
  LINK_ERROR: 'Error al obtener el link del formulario',
  INVALID_LINK: 'Link inválido o expirado',
  TIME_EXPIRED: 'El tiempo para completar el formulario ha expirado'
} as const;

// Estado inicial del reducer
const initialState: FormularioGuardState = {
  error: null,
  validatedLinkId: null,
  isValidated: false,
  isTimeExpired: false
};

// Reducer para manejar el estado
const formularioGuardReducer = (
  state: FormularioGuardState,
  action: FormularioGuardAction
): FormularioGuardState => {
  switch (action.type) {
    case 'SET_ERROR':
      return { ...state, error: action.payload, isValidated: false };
    case 'SET_VALIDATED_LINK_ID':
      return { ...state, validatedLinkId: action.payload, error: null };
    case 'SET_VALIDATED':
      return { ...state, isValidated: action.payload };
    case 'RESET_ERROR':
      return { ...state, error: null };
    case 'SET_TIME_EXPIRED':
      return { ...state, isTimeExpired: true, error: ERROR_MESSAGES.TIME_EXPIRED };
    default:
      return state;
  }
};

/** 
 * Funciones de validación extraídas para mejor reutilización y testing
 */

// Valida si el link formulario ha expirado
const validateExpiration = (linkFormulario: LinkFormulario): string | null => {
  const fechaActual = new Date();
  const fechaExpiracion = new Date(linkFormulario.vencimiento);
  
  return fechaActual > fechaExpiracion ? ERROR_MESSAGES.EXPIRED_LINK : null;
};

// Valida si el formulario ya fue completado
const validateCompletion = (linkFormulario: LinkFormulario): string | null => {
  return linkFormulario.completado ? ERROR_MESSAGES.COMPLETED_FORM : null;
};

// Valida si el formulario tiene los datos necesarios
const validateRequiredData = (linkFormulario: LinkFormulario): string | null => {
  const requiredFields = [
    linkFormulario.numeroHabitacion,
    linkFormulario.fechaInicio,
    linkFormulario.fechaFin,
    linkFormulario.costo,
    linkFormulario.url,
  ];
  
  return requiredFields.some(field => !field) ? ERROR_MESSAGES.MISSING_DATA : null;
};

// Valida si el rol del token es correcto
const validateRole = (validationData: ValidateLinkFormularioResponse): string | null => {
  return validationData.rol !== Role.REGISTRO_FORMULARIO 
    ? ERROR_MESSAGES.INSUFFICIENT_PERMISSIONS 
    : null;
};

// Valida completamente el link formulario
const validateLinkFormulario = (linkFormulario: LinkFormulario): string | null => {
  return (
    validateExpiration(linkFormulario) ||
    validateCompletion(linkFormulario) ||
    validateRequiredData(linkFormulario)
  );
};

// Maneja errores de validación del servidor
const handleServerError = (error: unknown, defaultMessage: string): string => {
  if (error instanceof Error) {
    const knownErrors = [
      'Link inválido o expirado',
      'Link invalido',
      'Link expirado',
      'Formulario ya completado'
    ];
    
    return knownErrors.includes(error.message) ? error.message : defaultMessage;
  }
  
  return defaultMessage;
};

interface FormularioGuardProps {
  children: (props: { linkFormulario: LinkFormulario; onTimeExpired: () => void }) => React.ReactNode;
}

/** 
 * Componente que se encarga de verificar y validar el acceso al formulario:
 * - Valida el token de la URL
 * - Verifica la expiración del link
 * - Confirma que el formulario no esté completado
 * - Valida los datos necesarios y permisos
 * 
 * @param children - Componentes hijos a renderizar si todas las validaciones pasan
 */
export const FormularioGuard = ({ children }: FormularioGuardProps) => {
  const { token } = useParams();
  const [state, dispatch] = useReducer(formularioGuardReducer, initialState);

  // Hooks de data fetching
  const { 
    data: validationData, 
    isLoading: isValidating, 
    error: validationError 
  } = useValidateLinkFormulario(token as string);

  const { 
    data: linkFormulario, 
    isLoading: isLoadingLink, 
    error: linkError 
  } = useLinkFormularioById(state.validatedLinkId!);

  // Estado de carga calculado
  const isLoading = useMemo(() => 
    isValidating || isLoadingLink, 
    [isValidating, isLoadingLink]
  );

  // Callback para manejar errores de validación
  const handleValidationError = useCallback((error: unknown) => {
    const errorMessage = handleServerError(error, ERROR_MESSAGES.VALIDATION_ERROR);
    dispatch({ type: 'SET_ERROR', payload: errorMessage });
  }, []);

  // Callback para manejar errores de link
  const handleLinkError = useCallback((error: unknown) => {
    const errorMessage = handleServerError(error, ERROR_MESSAGES.LINK_ERROR);
    dispatch({ type: 'SET_ERROR', payload: errorMessage });
  }, []);

  // Callback para manejar la expiración del tiempo
  const handleTimeExpired = useCallback(() => {
    dispatch({ type: 'SET_TIME_EXPIRED' });
  }, []);

  // Efecto para manejar la validación inicial del token
  useEffect(() => {
    if (validationError) {
      handleValidationError(validationError);
      return;
    }

    if (validationData) {
      // Validar rol primero
      const roleError = validateRole(validationData);
      if (roleError) {
        dispatch({ type: 'SET_ERROR', payload: roleError });
        return;
      }

      // Si el rol es válido, establecer el ID del link
      dispatch({ type: 'SET_VALIDATED_LINK_ID', payload: validationData.id });
    }
  }, [validationData, validationError, handleValidationError]);

  // Efecto para manejar la validación del link formulario
  useEffect(() => {
    if (linkError) {
      handleLinkError(linkError);
      return;
    }

    if (linkFormulario) {
      // Ejecutar todas las validaciones del link formulario
      const validationError = validateLinkFormulario(linkFormulario);
      
      if (validationError) {
        dispatch({ type: 'SET_ERROR', payload: validationError });
        return;
      }

      // Si todas las validaciones pasan, marcar como validado
      dispatch({ type: 'SET_VALIDATED', payload: true });
    }
  }, [linkFormulario, linkError, handleLinkError]);

  // Early returns para mejor legibilidad
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Validando acceso al formulario...</div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-600 text-center max-w-md mx-auto p-6">
          <h2 className="text-xl font-semibold mb-4">
            {state.isTimeExpired ? '⏰ Tiempo Expirado' : 'Acceso Denegado'}
          </h2>
          <p className="text-gray-600 mb-4">{state.error}</p>
          
          {state.isTimeExpired || state.error === ERROR_MESSAGES.TIME_EXPIRED ? (
            <div className="space-y-3">
              <p className="text-gray-600">
                El tiempo para completar este formulario ha expirado. Si necesita más tiempo, 
                puede contactar al hotel para solicitar un nuevo enlace.
              </p>
              <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                <p className="text-blue-700 dark:text-blue-300 font-medium mb-2">
                  📧 Contacto para nuevo enlace:
                </p>
                <a 
                  href="mailto:reservas@hotelsanmiguel.com?subject=Solicitud de nuevo enlace de formulario" 
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 underline"
                >
                  reservas@hotelsanmiguel.com
                </a>
                <p className="text-sm text-gray-500 mt-2">
                  Incluya su número de habitación en el correo para un servicio más rápido.
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-600">
              Si cree que esto es un error, por favor, contacta al administrador del sistema:
              <a href="mailto:admin@example.com" className="text-blue-500 hover:text-blue-700 ml-1">
                admin@example.com
              </a>
            </p>
          )}
        </div>
      </div>
    );
  }

  if (!state.isValidated || !linkFormulario) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Verificando datos del formulario...</div>
      </div>
    );
  }

  // Pasar el linkFormulario como prop al child
  if (state.isValidated && linkFormulario) {
    return children({ linkFormulario, onTimeExpired: handleTimeExpired });
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-lg">Cargando...</div>
    </div>
  );
  
};