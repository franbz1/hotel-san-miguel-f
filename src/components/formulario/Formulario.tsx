import { LinkFormulario } from "@/Types/link-formulario";
import { Wizard, WizardStep } from "../Wizard";
import { useForm } from "react-hook-form";
import { CreateRegistroFormulario } from "@/Types/registro-formularioDto";
import { createRegistroFormularioDtoSchema } from "@/lib/formulario/schemas/RegistroFormularioDto.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateRegistroFormulario } from "@/hooks/formulario/useRegistroFormulario";
import { toast } from "sonner";
import { PasoBienvenida } from "./pasos/PasoBienvenida";
import { PasoInformacionPersonal } from "./pasos/PasoInformacionPersonal";
import { PasoAcompaniantes } from "./pasos/PasoAcompaniantes";
import { PasoConfirmacion } from "./pasos/PasoConfirmacion";
import { WizardProgress } from "../ui/wizard-progress";
import { WizardControls } from "../ui/wizard-controls";
import { useState, useEffect } from "react";

interface FormularioProps {
  linkFormulario: LinkFormulario;
}

/**
 * Componente del formulario de registro
 * Responsabilidades:
 * - Inicializar el formulario con React Hook Form con schema de zod
 * - Manejar el estado del formulario
 * - Orquestar los pasos del formulario
 * - Armar el DTO del formulario
 * - Enviar el DTO al servidor
 * - Manejar los errores del servidor
 * @param linkFormulario - Link del formulario
 */
export const Formulario = ({ linkFormulario }: FormularioProps) => {
  // Estado para trackear el paso actual
  const [currentStepKey, setCurrentStepKey] = useState('Bienvenida');
  
  const extraerToken = (linkFormulario: LinkFormulario) => {
    const url = linkFormulario.url;
    const token = url.split('/').pop();
    if (!token) {
      throw new Error('Token no encontrado');
    }
    return token;
  }

  const { formState: { errors }, reset, trigger, getValues } = useForm<CreateRegistroFormulario>({
    resolver: zodResolver(createRegistroFormularioDtoSchema),
    defaultValues: {
      fecha_inicio: linkFormulario.fechaInicio,
      fecha_fin: linkFormulario.fechaFin,
      numero_habitacion: linkFormulario.numeroHabitacion,
      costo: linkFormulario.costo,

      tipo_documento: undefined,
      numero_documento: undefined,
      primer_apellido: undefined,
      segundo_apellido: undefined,
      nombres: undefined,
      pais_residencia: undefined,
      ciudad_residencia: undefined,
      pais_procedencia: undefined,
      ciudad_procedencia: undefined,
      fecha_nacimiento: undefined,
      nacionalidad: undefined,
      ocupacion: undefined,
      genero: undefined,
      telefono: undefined,
      correo: undefined,

      huespedes_secundarios: undefined,
    }
  });

  const camposPorPaso: Record<string, (keyof CreateRegistroFormulario)[]> = {
    'Bienvenida': [],
    'HuespedPrincipal': ['tipo_documento', 'numero_documento', 'primer_apellido', 'segundo_apellido', 'nombres', 'pais_residencia', 'ciudad_residencia', 'pais_procedencia', 'ciudad_procedencia', 'fecha_nacimiento', 'nacionalidad', 'ocupacion', 'genero', 'telefono', 'correo'],
    'Acompañantes': ['huespedes_secundarios'],
    'Confirmacion': [],
  };

  const createRegistroFormulario = useCreateRegistroFormulario();

  // Efectos para manejar estados de la mutación
  useEffect(() => {
    if (createRegistroFormulario.isSuccess) {
      reset();
      toast.success("¡Registro completado exitosamente!");
    }
  }, [createRegistroFormulario.isSuccess, reset]);

  useEffect(() => {
    if (createRegistroFormulario.isError) {
      const errorMessage = createRegistroFormulario.error instanceof Error 
        ? createRegistroFormulario.error.message 
        : 'Error desconocido';
      toast.error(`Error al crear el registro: ${errorMessage}`);
    }
  }, [createRegistroFormulario.isError, createRegistroFormulario.error]);

  // Lógica de envío del formulario en el último paso
  const handleSubmitForm = async () => {
    // Validar todos los campos antes del envío
    const isValid = await trigger();
    if (!isValid) {
      toast.error("Por favor, corrige los errores en el formulario");
      return;
    }

    const token = extraerToken(linkFormulario);
    const data = getValues();

    // React Query maneja automáticamente los estados de carga, éxito y error
    // Los useEffect se encargan de mostrar toasts y resetear el formulario
    createRegistroFormulario.mutate({
      token,
      data
    });
  };

  // Lógica de validación por pasos
  const handleNextStep = async (goNext: () => void, currentStep: string) => {
    try {
      const campos = camposPorPaso[currentStep];
      const isValid = await trigger(campos);

      console.log("Formulario", getValues());
      
      if (isValid) {
        goNext();
      } else {
        // Mostrar errores específicos del paso
        const stepErrors = campos.filter(campo => errors[campo]);
        if (stepErrors.length > 0) {
          toast.error(`Por favor, completa todos los campos requeridos en este paso`);
        }
      }
    } catch (error) {
      console.error('Error en validación:', error);
      toast.error("Error al validar el formulario");
    }
  };

  // Lógica de cancelación del formulario
  const handleCancel = () => {
    const hasData = Object.values(getValues()).some(value => 
      value !== undefined && value !== null && value !== ''
    );
    
    if (hasData) {
      const confirmed = confirm(
        "¿Estás seguro de que quieres cancelar? Se perderán todos los datos ingresados."
      );
      
      if (confirmed) {
        reset();
        toast.info("Formulario cancelado");
        // Aquí podrías redirigir a otra página si es necesario
      }
    } else {
      reset();
      toast.info("Formulario cancelado");
    }
  };

  const steps: WizardStep<string>[] = [
    {
      key: 'Bienvenida',
      component: () => <PasoBienvenida linkFormulario={linkFormulario} />
    },
    {
      key: 'HuespedPrincipal',
      component: () => <PasoInformacionPersonal />
    },
    /*
    {
      key: 'Acompañantes',
      component: () => <PasoAcompaniantes />
    },
    {
      key: 'Confirmacion',
      component: () => <PasoConfirmacion />
    }
    */
  ];

  const stepLabels: Record<string, string> = {
    Bienvenida: "Bienvenida",
    HuespedPrincipal: "Huesped Principal",
    Acompañantes: "Acompañantes",
    Confirmacion: "Confirmación",
  };

  return <Wizard steps={steps}
    defaultStep="Bienvenida"
    renderProgress={({ progress, goToStep }) => (
      <WizardProgress
        progress={progress}
        goToStep={(step) => {
          setCurrentStepKey(step);
          goToStep(step);
        }}
        stepLabels={stepLabels}
      />
    )}
    renderButtons={({ isFirst, isLast, goBack, goNext }) => {
      const handleNext = () => {
        if (isLast) {
          handleSubmitForm();
        } else {
          handleNextStep(() => {
            // Encontrar el siguiente paso
            const currentIndex = steps.findIndex(s => s.key === currentStepKey);
            const nextStep = steps[currentIndex + 1];
            if (nextStep) {
              setCurrentStepKey(nextStep.key);
            }
            goNext();
          }, currentStepKey);
        }
      };

      const handleBack = () => {
        // Encontrar el paso anterior
        const currentIndex = steps.findIndex(s => s.key === currentStepKey);
        const prevStep = steps[currentIndex - 1];
        if (prevStep) {
          setCurrentStepKey(prevStep.key);
        }
        goBack();
      };

      return (
        <WizardControls
          isFirst={isFirst}
          isLast={isLast}
          goBack={handleBack}
          goNext={handleNext}
          onCancel={handleCancel}
          showCancel={true}
          isLoading={createRegistroFormulario.isPending}
          backLabel="Anterior"
          nextLabel="Continuar"
          finishLabel="Completar Registro"
          cancelLabel="Cancelar"
        />
      );
    }}
  />;
};
