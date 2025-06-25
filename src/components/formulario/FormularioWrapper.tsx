'use client';

import { createContext, useContext, ReactNode, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { toast } from 'sonner';
import { ZodError } from 'zod';
import { 
  informacionPersonalSchema, 
  acompaniantesSchema,
  InformacionPersonalFormData,
  AcompaniantesFormData 
} from '@/lib/formulario/schemas/RegistroFormularioDto.schema';
import { CreateRegistroFormulario } from '@/Types/registro-formularioDto';
import { LinkFormulario } from '@/Types/link-formulario';

// Tipos para los datos del formulario por pasos
type FormStepData = {
  informacionPersonal?: InformacionPersonalFormData;
  acompaniantes?: AcompaniantesFormData;
};

// Contexto para el estado del formulario
interface FormularioContextType {
  currentStep: number;
  totalSteps: number;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  canAdvance: boolean;
  validateAndAdvance: () => Promise<boolean>;
  stepData: FormStepData;
  updateStepData: <T extends keyof FormStepData>(step: T, data: FormStepData[T]) => void;

  // Nuevos campos para acceso a datos
  linkFormulario?: LinkFormulario;
  getCurrentFormData: () => Record<string, unknown>;
  getCompleteFormData: () => Partial<CreateRegistroFormulario>;
  getAllAvailableData: () => {
    link: LinkFormulario | undefined;
    currentForm: Record<string, unknown>;
    stepData: FormStepData;
    complete: Partial<CreateRegistroFormulario>;
  };
}

const FormularioContext = createContext<FormularioContextType | null>(null);

// Hook para usar el contexto del formulario
export const useFormularioContext = () => {
  const context = useContext(FormularioContext);
  if (!context) {
    throw new Error('useFormularioContext debe ser usado dentro de FormularioWrapper');
  }
  return context;
};

interface FormularioWrapperProps {
  children: ReactNode;
  onSubmit: (data: Partial<CreateRegistroFormulario>) => void;
  linkFormulario?: LinkFormulario;
}

export const FormularioWrapper = ({
  children,
  onSubmit,
  linkFormulario
}: FormularioWrapperProps) => {
  // Estado de navegación
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // Estado de datos por pasos
  const [stepData, setStepData] = useState<FormStepData>({});

  // Configuración del formulario principal (solo para el paso actual)
  const form = useForm({
    mode: 'onChange', // Validar en tiempo real
    defaultValues: {
      // Información Personal
      tipo_documento: undefined,
      numero_documento: '',
      nombres: '',
      primer_apellido: '',
      segundo_apellido: '',
      fecha_nacimiento: undefined,
      genero: undefined,
      
      // Ubicación
      nacionalidad: '',
      pais_procedencia: '',
      estado_procedencia: '',
      ciudad_procedencia: '',
      pais_residencia: '',
      estado_residencia: '',
      ciudad_residencia: '',
      
      // Contacto
      telefono: '',
      codigo_pais_telefono: '',
      email: '',
      
      // Reserva
      motivo_viaje: undefined,
      
      // Acompañantes (para paso 3)
      huespedes_secundarios: []
    } as Partial<CreateRegistroFormulario>
    // La validación se maneja en validateCurrentStep usando los schemas específicos
  });

  // ==========================================
  // FUNCIONES DE ACCESO A DATOS
  // ==========================================

  /**
   * Obtiene los datos actuales del formulario (paso actual)
   */
  const getCurrentFormData = () => {
    return form.getValues();
  };

  /**
   * Obtiene todos los datos del formulario combinados
   */
  const getCompleteFormData = (): Partial<CreateRegistroFormulario> => {
    return {
      // Datos de información personal (paso 2)
      ...stepData.informacionPersonal,

      // Datos de acompañantes (paso 3)
      ...stepData.acompaniantes,

      // Datos del formulario actual
      ...getCurrentFormData()
    };
  };

  /**
   * Obtiene todos los datos disponibles (link + formulario + pasos)
   */
  const getAllAvailableData = () => {
    return {
      link: linkFormulario,
      currentForm: getCurrentFormData(),
      stepData: stepData,
      complete: getCompleteFormData()
    };
  };

  // ==========================================
  // FUNCIONES DE NAVEGACIÓN
  // ==========================================

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
    }
  };

  // ==========================================
  // VALIDACIÓN Y MANEJO DE DATOS POR PASOS
  // ==========================================

  const updateStepData = <T extends keyof FormStepData>(
    step: T,
    data: FormStepData[T]
  ) => {
    setStepData(prev => ({
      ...prev,
      [step]: data
    }));
  };

  /**
   * Maneja errores de validación de Zod y los muestra en el formulario y toast
   */
  const handleValidationErrors = (error: ZodError, stepName: string) => {
    // Limpiar errores previos
    form.clearErrors();

    // Configurar errores en los campos del formulario
    error.errors.forEach((err) => {
      const fieldPath = err.path.join('.');
      // Usar setError con paths conocidos
      if (fieldPath in form.getValues()) {
        form.setError(fieldPath as keyof typeof form.getValues, {
          type: 'validation',
          message: err.message
        });
      }
    });

    // Mostrar resumen de errores en toast
    const errorCount = error.errors.length;
    const firstErrors = error.errors.slice(0, 3).map(err => err.message);

    toast.error(`Errores en ${stepName}`, {
      description: (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-black">Se encontraron {errorCount} errores.</p>
          <p className="text-sm text-black">Por favor, corrija los siguientes errores:</p>
          <p className="text-sm text-black">{firstErrors.join('\n• ')} {errorCount > 3 ? '\n• ...' : ''}</p>
        </div>
      ),
      duration: 5000,
      style: {
        color: '#dc2626', // text-red-600
        borderColor: '#dc2626'
      },
      className: 'text-red-600'
    });
  };

  const validateCurrentStep = async (): Promise<boolean> => {
    const formData = form.getValues();

    try {
      switch (currentStep) {
        case 1: // Bienvenida - no requiere validación
          return true;

        case 2: // Información Personal
          const personalData = await informacionPersonalSchema.parseAsync(formData);
          updateStepData('informacionPersonal', personalData);
          // Limpiar errores si la validación es exitosa
          form.clearErrors();
          toast.success('Información personal validada correctamente');
          return true;

        case 3: // Acompañantes
          const companionData = await acompaniantesSchema.parseAsync(formData);
          updateStepData('acompaniantes', companionData);
          // Limpiar errores si la validación es exitosa
          form.clearErrors();
          toast.success('Información de acompañantes validada correctamente');
          return true;

        case 4: // Confirmación - validar datos completos
          return validateCompleteForm();

        default:
          return false;
      }
    } catch (error) {
      if (error instanceof ZodError) {
        const stepNames = {
          1: 'Bienvenida',
          2: 'Información Personal',
          3: 'Acompañantes',
          4: 'Confirmación'
        };

        handleValidationErrors(error, stepNames[currentStep as keyof typeof stepNames] || `Paso ${currentStep}`);
      } else {
        console.error('Error de validación en paso:', currentStep, error);
        toast.error('Error inesperado', {
          description: 'Ocurrió un error durante la validación. Por favor, inténtalo de nuevo.',
          style: {
            color: '#dc2626', // text-red-600
            borderColor: '#dc2626'
          },
          className: 'text-red-600'
        });
      }
      return false;
    }
  };

  const validateCompleteForm = (): boolean => {
    // Verificar que todos los pasos requeridos tengan datos
    const hasPersonalInfo = !!stepData.informacionPersonal;
    const hasCompanionInfo = !!stepData.acompaniantes;

    return hasPersonalInfo && hasCompanionInfo;
  };

  const validateAndAdvance = async (): Promise<boolean> => {
    const isValid = await validateCurrentStep();

    if (isValid && !isLastStep) {
      nextStep();
    }

    return isValid;
  };

  // ==========================================
  // MANEJO DEL ENVÍO FINAL
  // ==========================================

  const handleSubmit = async () => {
    // Validar una última vez
    const isValid = await validateCurrentStep();

    if (!isValid) {
      console.error('Formulario inválido en el paso final');
      return;
    }

    // Combinar todos los datos de los pasos
    const completeFormData = getCompleteFormData();

    // Ejecutar callback de envío
    onSubmit(completeFormData);
  };

  // ==========================================
  // PROPIEDADES CALCULADAS
  // ==========================================

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep >= totalSteps;

  // Determinar si se puede avanzar basado en el paso actual
  const canAdvance = (() => {
    switch (currentStep) {
      case 1: // Bienvenida - siempre se puede avanzar
        return true;
      case 2: // Información Personal - verificar validez del formulario
        return form.formState.isValid;
      case 3: // Acompañantes - verificar validez del formulario
        return form.formState.isValid;
      case 4: // Confirmación - verificar datos completos
        return validateCompleteForm();
      default:
        return false;
    }
  })();

  // ==========================================
  // CONTEXTO Y RENDERIZADO
  // ==========================================

  const contextValue: FormularioContextType = {
    currentStep,
    totalSteps,
    nextStep,
    prevStep,
    goToStep,
    isFirstStep,
    isLastStep,
    canAdvance,
    validateAndAdvance,
    stepData,
    updateStepData,

    // Nuevos campos para acceso a datos
    linkFormulario,
    getCurrentFormData,
    getCompleteFormData,
    getAllAvailableData
  };

  return (
    <FormProvider {...form}>
      <FormularioContext.Provider value={contextValue}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full">
          {children}
        </form>
      </FormularioContext.Provider>
    </FormProvider>
  );
}; 