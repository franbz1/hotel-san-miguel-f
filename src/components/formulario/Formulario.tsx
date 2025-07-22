import { LinkFormulario } from '@/Types/link-formulario'
import { Wizard, WizardStep } from '../Wizard'
import { useForm, FormProvider } from 'react-hook-form'
import { CreateRegistroFormulario } from '@/Types/registro-formularioDto'
import { createRegistroFormularioDtoSchema } from '@/lib/formulario/schemas/RegistroFormularioDto.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCreateRegistroFormulario } from '@/hooks/formulario/useRegistroFormulario'
import { toast } from 'sonner'
import { PasoBienvenida } from './pasos/PasoBienvenida'
import { PasoHuespedPrincipal } from './pasos/PasoHuespedPrincipal'
import { Confirmacion } from './pasos/Confirmacion'
import { WizardProgress } from '../ui/wizard-progress'
import { WizardControls } from '../ui/wizard-controls'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '../ui/card'
import { useState } from 'react'
import { ICity, ICountry } from 'country-state-city'
import { PasoAcompaniantes } from './pasos/PasoAcompaniantes'
import { CuentaRegresiva } from './CuentaRegresiva'
import { z } from 'zod'
import { CreateHuespedSecundarioWithoutIdDto } from '@/Types/huesped-secundario-sin-id-Dto'

interface FormularioProps {
  linkFormulario: LinkFormulario
  onTimeExpired: () => void
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
export const Formulario = ({
  linkFormulario,
  onTimeExpired,
}: FormularioProps) => {
  // Estado para trackear el paso actual
  const [currentStepKey, setCurrentStepKey] = useState('Bienvenida')

  // Estado de seleccion de pais, estado y ciudad huespes principal, para reusar en secundarios
  const [selectedProcedenciaLocation, setSelectedProcedenciaLocation] =
    useState<ICity | null>(null)
  const [selectedResidenciaLocation, setSelectedResidenciaLocation] =
    useState<ICity | null>(null)
  const [selectedNacionalidad, setSelectedNacionalidad] =
    useState<ICountry | null>(null)
  const [selectedDestinoLocation, setSelectedDestinoLocation] =
    useState<ICity | null>(null)

  const extraerToken = (linkFormulario: LinkFormulario) => {
    const url = linkFormulario.url
    const token = url.split('/').pop()
    if (!token) {
      throw new Error('Token no encontrado')
    }
    return token
  }

  // Tipo campos del formulario con campos auxiliares
  type FormFields = Omit<CreateRegistroFormulario, 'huespedes_secundarios'> & {
    telefono_dial_code?: string
    telefono_number?: string

    huespedes_secundarios?: Array<
      CreateHuespedSecundarioWithoutIdDto & {
        telefono_dial_code?: string
        telefono_number?: string
      }
    >
  }

  const methods = useForm<FormFields>({
    resolver: zodResolver(
      createRegistroFormularioDtoSchema.extend({
        telefono_dial_code: z.string().optional(),
        telefono_number: z
          .string()
          .min(10, 'El número de teléfono debe tener 10 caracteres')
          .max(10, 'El número de teléfono debe tener 10 caracteres')
          .optional(),
      })
    ),
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
      pais_destino: undefined,
      ciudad_destino: undefined,
      fecha_nacimiento: undefined,
      nacionalidad: undefined,
      ocupacion: undefined,
      genero: undefined,
      telefono: undefined,
      correo: undefined,
      motivo_viaje: undefined,

      huespedes_secundarios: undefined,

      //Datos auxiliares (no se envian al servidor)
      telefono_dial_code: undefined,
      telefono_number: undefined,
    },
  })

  const camposPorPaso: Record<string, (keyof FormFields)[]> = {
    Bienvenida: [],
    HuespedPrincipal: [
      'tipo_documento',
      'numero_documento',
      'primer_apellido',
      'segundo_apellido',
      'nombres',
      'pais_residencia',
      'ciudad_residencia',
      'pais_procedencia',
      'ciudad_procedencia',
      'pais_destino',
      'ciudad_destino',
      'fecha_nacimiento',
      'nacionalidad',
      'ocupacion',
      'genero',
      'telefono',
      'correo',
      'motivo_viaje',

      //Datos auxiliares (no se envian al servidor)
      'telefono_dial_code',
      'telefono_number',
    ],
    Acompañantes: ['huespedes_secundarios'],
    Confirmacion: [],
  }

  const createRegistroFormulario = useCreateRegistroFormulario()

  function cleanFormData(data: FormFields): CreateRegistroFormulario {
    // Extraigo y descarto auxiliares del huésped principal
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { telefono_dial_code, telefono_number, huespedes_secundarios, ...mainData } = data

    // Si hay secundarios, limpio sus auxiliares de la misma forma
    const cleanHuespedes = Array.isArray(huespedes_secundarios)
      ? huespedes_secundarios.map(huesped => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { telefono_dial_code: _, telefono_number: __, ...cleanHuesped } = huesped
          return cleanHuesped
        })
      : undefined

    // Devuelvo sólo lo que el DTO espera
    return {
      ...mainData,
      ...(cleanHuespedes ? { huespedes_secundarios: cleanHuespedes } : {}),
    }
  }

  // Los estados de la mutación se manejan en el componente Confirmacion

  // Lógica de envío del formulario en el último paso
  const handleSubmitForm = async (goToConfirmation: () => void) => {
    // Validar todos los campos antes del envío
    console.log('Formulario', methods.getValues())
    console.log('Error', methods.formState.errors)
    const isValid = await methods.trigger()
    if (!isValid) {
      toast.error('Por favor, corrige los errores en el formulario')
      return
    }

    // Ir al paso de confirmación antes de enviar
    setCurrentStepKey('Confirmacion')
    goToConfirmation()

    const token = extraerToken(linkFormulario)
    const data = methods.getValues()
    const cleanData = cleanFormData(data)

    // React Query maneja automáticamente los estados de carga, éxito y error
    createRegistroFormulario.mutate({
      token,
      data: cleanData,
    })
  }

  // Lógica de validación por pasos
  const handleNextStep = async (goNext: () => void, currentStep: string) => {
    try {
      const campos = camposPorPaso[currentStep]
      const isValid = await methods.trigger(campos)

      console.log('Formulario', methods.getValues())

      if (isValid) {
        goNext()
      } else {
        // Mostrar errores específicos del paso
        const stepErrors = campos.filter(
          (campo) => methods.formState.errors[campo]
        )
        if (stepErrors.length > 0) {
          toast.error(
            `Por favor, completa todos los campos requeridos en este paso`
          )
        }
      }
    } catch (error) {
      console.error('Error en validación:', error)
      toast.error('Error al validar el formulario')
    }
  }

  // Lógica de cancelación del formulario - ahora retrocede al primer paso
  const handleCancel = (goToFirstStep: () => void) => {
    const hasData = Object.values(methods.getValues()).some(
      (value) => value !== undefined && value !== null && value !== ''
    )

    if (hasData) {
      const confirmed = confirm(
        '¿Estás seguro de que quieres cancelar? Se perderán todos los datos ingresados y regresarás al inicio.'
      )

      if (confirmed) {
        methods.reset()
        setCurrentStepKey('Bienvenida')
        goToFirstStep()
        toast.info('Formulario cancelado')
      }
    } else {
      methods.reset()
      setCurrentStepKey('Bienvenida')
      goToFirstStep()
      toast.info('Regresando al inicio')
    }
  }

  const steps: WizardStep<string>[] = [
    {
      key: 'Bienvenida',
      component: () => <PasoBienvenida linkFormulario={linkFormulario} />,
    },
    {
      key: 'HuespedPrincipal',
      component: () => (
        <PasoHuespedPrincipal
          selectedProcedenciaLocation={selectedProcedenciaLocation}
          setSelectedProcedenciaLocation={setSelectedProcedenciaLocation}
          selectedResidenciaLocation={selectedResidenciaLocation}
          setSelectedResidenciaLocation={setSelectedResidenciaLocation}
          selectedNacionalidad={selectedNacionalidad}
          setSelectedNacionalidad={setSelectedNacionalidad}
          selectedDestinoLocation={selectedDestinoLocation}
          setSelectedDestinoLocation={setSelectedDestinoLocation}
        />
      ),
    },
    {
      key: 'Acompañantes',
      component: () => (
        <PasoAcompaniantes
          procedenciaLocation={selectedProcedenciaLocation}
          residenciaLocation={selectedResidenciaLocation}
          nacionalidad={methods.watch('nacionalidad')}
          destinoLocation={selectedDestinoLocation}
        />
      ),
    },
    {
      key: 'Confirmacion',
      component: () => (
        <Confirmacion
          isLoading={createRegistroFormulario.isPending}
          isSuccess={createRegistroFormulario.isSuccess}
          isError={createRegistroFormulario.isError}
          error={createRegistroFormulario.error}
          onRetry={() => {
            // Reintentar el envío
            const token = extraerToken(linkFormulario)
            const data = methods.getValues()
            const cleanData = cleanFormData(data)
            createRegistroFormulario.mutate({ token, data: cleanData })
          }}
          onGoToStart={() => {
            // Resetear el formulario y volver al inicio
            methods.reset()
            createRegistroFormulario.reset()
            setCurrentStepKey('Bienvenida')
          }}
        />
      ),
    },
  ]

  const stepLabels: Record<string, string> = {
    Bienvenida: 'Bienvenida',
    HuespedPrincipal: 'Huesped Principal',
    Acompañantes: 'Acompañantes',
    Confirmacion: 'Confirmación',
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-4 lg:py-8 px-4 sm:px-6 lg:px-8 xl:px-12'>
      {/* Contenedor responsivo que se adapta al contenido */}
      <div className='w-full max-w-7xl mx-auto'>
        <Card className='shadow-xl border-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60'>
          <CardHeader className='text-center lg:text-left lg:flex lg:items-center lg:justify-between space-y-4 lg:space-y-0 pb-2 lg:pb-4'>
            <div className='lg:flex-1'>
              <div className='flex items-center justify-between pb-2'>
                <CardTitle className='text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent pb-2'>
                  Registro de Huésped
                </CardTitle>
                <CuentaRegresiva
                  fechaVencimiento={linkFormulario.vencimiento}
                  onExpired={onTimeExpired}
                />
              </div>
              <CardDescription className='text-base lg:text-lg text-muted-foreground max-w-3xl lg:mx-0 mx-auto'>
                Complete la información solicitada para completar su registro en
                el Hotel San Miguel
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className='space-y-6 lg:space-y-8'>
            {/* Contenedor del wizard optimizado */}
            <div className='lg:px-6'>
              <FormProvider {...methods}>
                <Wizard
                  steps={steps}
                  defaultStep='Bienvenida'
                  renderProgress={({ progress, goToStep }) => (
                    <WizardProgress
                      progress={progress}
                      goToStep={(step) => {
                        setCurrentStepKey(step)
                        goToStep(step)
                      }}
                      stepLabels={stepLabels}
                      className='mb-2 lg:mb-4'
                    />
                  )}
                  renderButtons={({
                    isFirst,
                    isLast,
                    goBack,
                    goNext,
                    goToStep,
                  }) => {
                    const handleNext = () => {
                      if (isLast) {
                        handleSubmitForm(() => {
                          // Encontrar el paso de confirmación
                          const confirmacionIndex = steps.findIndex(
                            (s) => s.key === 'Confirmacion'
                          )
                          if (confirmacionIndex !== -1) {
                            goToStep('Confirmacion')
                          }
                        })
                      } else {
                        handleNextStep(() => {
                          // Encontrar el siguiente paso
                          const currentIndex = steps.findIndex(
                            (s) => s.key === currentStepKey
                          )
                          const nextStep = steps[currentIndex + 1]
                          if (nextStep) {
                            setCurrentStepKey(nextStep.key)
                          }
                          goNext()
                        }, currentStepKey)
                      }
                    }

                    const handleBack = () => {
                      // Encontrar el paso anterior
                      const currentIndex = steps.findIndex(
                        (s) => s.key === currentStepKey
                      )
                      const prevStep = steps[currentIndex - 1]
                      if (prevStep) {
                        setCurrentStepKey(prevStep.key)
                      }
                      goBack()
                    }

                    const goToFirstStep = () => {
                      setCurrentStepKey('Bienvenida')
                      goToStep('Bienvenida')
                    }

                    return (
                      <div className='mt-2 lg:mt-4 lg:px-4'>
                        <WizardControls
                          isFirst={isFirst}
                          isLast={isLast}
                          goBack={handleBack}
                          goNext={handleNext}
                          onCancel={() => handleCancel(goToFirstStep)}
                          showCancel={true}
                          isLoading={createRegistroFormulario.isPending}
                          backLabel='Anterior'
                          nextLabel='Continuar'
                          finishLabel='Completar Registro'
                          cancelLabel='Cancelar'
                        />
                      </div>
                    )
                  }}
                />
              </FormProvider>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
