# Documentación de Validaciones - CreateRegistroFormularioDto

Este documento describe todas las validaciones aplicadas a los campos del DTO `CreateRegistroFormularioDto` utilizado en el endpoint de registro de formularios.

## Estructura General

El DTO se divide en tres secciones principales:
1. **Datos de la Reserva**
2. **Datos del Huésped Principal**  
3. **Datos de Huéspedes Secundarios** (opcional)

---

## 1. Datos de la Reserva

### `fecha_inicio` *(obligatorio)*
- **Tipo**: Date
- **Descripción**: Fecha de inicio de la reserva
- **Validaciones**:
  - Debe ser una fecha válida
- **Ejemplo**: `"2023-08-15T00:00:00.000Z"`

### `fecha_fin` *(obligatorio)*
- **Tipo**: Date
- **Descripción**: Fecha de fin de la reserva
- **Validaciones**:
  - Debe ser una fecha válida
- **Ejemplo**: `"2023-08-20T00:00:00.000Z"`

### `motivo_viaje` *(obligatorio)*
- **Tipo**: Enum (MotivosViajes)
- **Descripción**: Motivo del viaje
- **Validaciones**:
  - Debe ser uno de los valores del enum MotivosViajes
- **Valores válidos**:
  - `NEGOCIOS_Y_MOTIVOS_PROFESIONALES`
  - `VACACIONES_RECREO_Y_OCIO`
  - `VISITAS_A_FAMILIARES_Y_AMIGOS`
  - `EDUCACION_Y_FORMACION`
  - `SALUD_Y_ATENCION_MEDICA`
  - `RELIGION_Y_PEREGRINACIONES`
  - `COMPRAS`
  - `TRANSITO`
  - `OTROS_MOTIVOS`
- **Ejemplo**: `"COMPRAS"`

### `costo` *(obligatorio)*
- **Tipo**: Number
- **Descripción**: Costo de la reserva
- **Validaciones**:
  - Debe ser un número positivo
  - Máximo 2 decimales
- **Ejemplo**: `500.5`

### `numero_habitacion` *(obligatorio)*
- **Tipo**: Number
- **Descripción**: Número de la habitación asignada
- **Validaciones**:
  - Debe ser un número positivo
- **Ejemplo**: `101`

### `numero_acompaniantes` *(obligatorio)*
- **Tipo**: Integer
- **Descripción**: Número de acompañantes en la reserva
- **Validaciones**:
  - Debe ser un número entero
  - Mínimo valor: 0
- **Ejemplo**: `2`

---

## 2. Datos del Huésped Principal

### `tipo_documento` *(obligatorio)*
- **Tipo**: Enum (TipoDoc)
- **Descripción**: Tipo de documento del huésped
- **Validaciones**:
  - Debe ser uno de los valores del enum TipoDoc
- **Valores válidos**:
  - `CC` (Cédula de Ciudadanía)
  - `CE` (Cédula de Extranjería)
  - `PASAPORTE`
  - `PPT` (Permiso por Protección Temporal)
  - `PEP` (Permiso Especial de Permanencia)
  - `DNI` (Documento Nacional de Identidad)
- **Ejemplo**: `"CC"`

### `numero_documento` *(obligatorio)*
- **Tipo**: String
- **Descripción**: Número de documento del huésped
- **Validaciones**:
  - Debe ser un texto
  - Longitud mínima: 6 caracteres
  - Longitud máxima: 20 caracteres
- **Ejemplo**: `"12345678"`

### `primer_apellido` *(obligatorio)*
- **Tipo**: String
- **Descripción**: Primer apellido del huésped
- **Validaciones**:
  - Debe ser un texto
  - Longitud mínima: 2 caracteres
  - Longitud máxima: 50 caracteres
- **Ejemplo**: `"Pérez"`

### `segundo_apellido` *(opcional)*
- **Tipo**: String
- **Descripción**: Segundo apellido del huésped
- **Validaciones**:
  - Debe ser un texto (si se proporciona)
  - Longitud mínima: 2 caracteres
  - Longitud máxima: 50 caracteres
- **Ejemplo**: `"García"`

### `nombres` *(obligatorio)*
- **Tipo**: String
- **Descripción**: Nombres del huésped
- **Validaciones**:
  - Debe ser un texto
  - Longitud mínima: 2 caracteres
  - Longitud máxima: 50 caracteres
- **Ejemplo**: `"Juan Carlos"`

### `pais_residencia` *(obligatorio)*
- **Tipo**: String
- **Descripción**: País de residencia del huésped
- **Validaciones**:
  - Debe ser un texto
  - Longitud mínima: 2 caracteres
  - Longitud máxima: 50 caracteres
- **Ejemplo**: `"Colombia"`

### `ciudad_residencia` *(obligatorio)*
- **Tipo**: String
- **Descripción**: Ciudad de residencia del huésped
- **Validaciones**:
  - Debe ser un texto
  - Longitud mínima: 2 caracteres
  - Longitud máxima: 50 caracteres
- **Ejemplo**: `"Medellín"`

### `pais_procedencia` *(obligatorio)*
- **Tipo**: String
- **Descripción**: País de procedencia del huésped
- **Validaciones**:
  - Debe ser un texto
  - Longitud mínima: 2 caracteres
  - Longitud máxima: 50 caracteres
  - Mensaje de error personalizado: "El país de procedencia es obligatorio y debe ser un texto"
- **Ejemplo**: `"Colombia"`

### `ciudad_procedencia` *(obligatorio)*
- **Tipo**: String
- **Descripción**: Ciudad de procedencia del huésped
- **Validaciones**:
  - Debe ser un texto
  - Longitud mínima: 2 caracteres
  - Longitud máxima: 50 caracteres
  - Mensaje de error personalizado: "La ciudad de procedencia es obligatoria y debe ser un texto"
- **Ejemplo**: `"Medellín"`

### `fecha_nacimiento` *(obligatorio)*
- **Tipo**: Date
- **Descripción**: Fecha de nacimiento del huésped
- **Validaciones**:
  - Debe ser una fecha válida
- **Ejemplo**: `"1990-01-01T00:00:00.000Z"`

### `nacionalidad` *(obligatorio)*
- **Tipo**: String
- **Descripción**: Nacionalidad del huésped
- **Validaciones**:
  - Debe ser un texto
  - Longitud mínima: 2 caracteres
  - Longitud máxima: 50 caracteres
- **Ejemplo**: `"Colombiano"`

### `ocupacion` *(obligatorio)*
- **Tipo**: String
- **Descripción**: Ocupación del huésped
- **Validaciones**:
  - Debe ser un texto
  - Longitud mínima: 2 caracteres
  - Longitud máxima: 50 caracteres
- **Ejemplo**: `"Ingeniero"`

### `genero` *(obligatorio)*
- **Tipo**: Enum (Genero)
- **Descripción**: Género del huésped
- **Validaciones**:
  - Debe ser uno de los valores del enum Genero
- **Valores válidos**:
  - `MASCULINO`
  - `FEMENINO`
  - `OTRO`
- **Ejemplo**: `"MASCULINO"`

### `telefono` *(opcional)*
- **Tipo**: String
- **Descripción**: Teléfono del huésped
- **Validaciones**:
  - Debe ser un número de teléfono válido (formato internacional)
- **Ejemplo**: `"+573001112233"`

### `correo` *(opcional)*
- **Tipo**: String
- **Descripción**: Correo electrónico del huésped
- **Validaciones**:
  - Debe ser un email válido
- **Ejemplo**: `"correo@ejemplo.com"`

---

## 3. Datos de Huéspedes Secundarios (Opcional)

### `huespedes_secundarios` *(opcional)*
- **Tipo**: Array de objetos CreateHuespedSecundarioWithoutIdDto
- **Descripción**: Lista de huéspedes secundarios asociados al registro
- **Validaciones**:
  - Cada elemento del array debe cumplir con las validaciones del DTO de huésped secundario
  - Se valida cada objeto anidado

#### Estructura de cada huésped secundario:

### `tipo_documento` *(obligatorio)*
- **Tipo**: Enum (TipoDocumentoHuespedSecundario)
- **Descripción**: Tipo de documento del huésped secundario
- **Validaciones**:
  - Debe ser uno de los valores del enum TipoDocumentoHuespedSecundario
- **Valores válidos**: CC, CE, PASAPORTE, PPT, PEP, DNI
- **Ejemplo**: `"CC"`

### `numero_documento` *(obligatorio)*
- **Tipo**: String
- **Descripción**: Número de documento del huésped secundario
- **Validaciones**:
  - Debe ser un texto
  - Longitud mínima: 6 caracteres
  - Longitud máxima: 20 caracteres
  - Mensaje de error: "El numero de documento es obligatorio y debe ser un texto"
- **Ejemplo**: `"12345678"`

### `primer_apellido` *(obligatorio)*
- **Tipo**: String
- **Descripción**: Primer apellido del huésped secundario
- **Validaciones**:
  - Debe ser un texto
  - Longitud mínima: 2 caracteres
  - Longitud máxima: 50 caracteres
  - Mensaje de error: "El primer apellido es obligatorio y debe ser un texto"
- **Ejemplo**: `"Pérez"`

### `segundo_apellido` *(opcional)*
- **Tipo**: String
- **Descripción**: Segundo apellido del huésped secundario
- **Validaciones**:
  - Debe ser un texto (si se proporciona)
  - Longitud mínima: 2 caracteres
  - Longitud máxima: 50 caracteres
  - Mensaje de error: "El segundo apellido es opcional y debe ser un texto"
- **Ejemplo**: `"García"`

### `nombres` *(obligatorio)*
- **Tipo**: String
- **Descripción**: Nombres del huésped secundario
- **Validaciones**:
  - Debe ser un texto
  - Longitud mínima: 2 caracteres
  - Longitud máxima: 100 caracteres
  - Mensaje de error: "Los nombres son obligatorios y deben ser un texto"
- **Ejemplo**: `"Juan Carlos"`

### `pais_residencia` *(obligatorio)*
- **Tipo**: String
- **Descripción**: País de residencia del huésped secundario
- **Validaciones**:
  - Debe ser un texto
  - Longitud mínima: 2 caracteres
  - Longitud máxima: 50 caracteres
  - Mensaje de error: "El pais de residencia es obligatorio y debe ser un texto"
- **Ejemplo**: `"Colombia"`

### `ciudad_residencia` *(obligatorio)*
- **Tipo**: String
- **Descripción**: Ciudad de residencia del huésped secundario
- **Validaciones**:
  - Debe ser un texto
  - Longitud mínima: 2 caracteres
  - Longitud máxima: 50 caracteres
  - Mensaje de error: "La ciudad de residencia es obligatorio y debe ser un texto"
- **Ejemplo**: `"Medellín"`

### `pais_procedencia` *(obligatorio)*
- **Tipo**: String
- **Descripción**: País de procedencia del huésped secundario
- **Validaciones**:
  - Debe ser un texto
  - Longitud mínima: 2 caracteres
  - Longitud máxima: 50 caracteres
  - Mensaje de error: "El pais de procedencia es obligatorio y debe ser un texto"
- **Ejemplo**: `"Colombia"`

### `ciudad_procedencia` *(obligatorio)*
- **Tipo**: String
- **Descripción**: Ciudad de procedencia del huésped secundario
- **Validaciones**:
  - Debe ser un texto
  - Longitud mínima: 2 caracteres
  - Longitud máxima: 50 caracteres
  - Mensaje de error: "La ciudad de procedencia es obligatorio y debe ser un texto"
- **Ejemplo**: `"Bogotá"`

### `fecha_nacimiento` *(obligatorio)*
- **Tipo**: Date
- **Descripción**: Fecha de nacimiento del huésped secundario
- **Validaciones**:
  - Debe ser una fecha válida
  - Mensaje de error: "La fecha de nacimiento es obligatoria y debe ser una fecha"
- **Ejemplo**: `"1990-01-01T00:00:00.000Z"`

### `nacionalidad` *(obligatorio)*
- **Tipo**: String
- **Descripción**: Nacionalidad del huésped secundario
- **Validaciones**:
  - Debe ser un texto
  - Longitud mínima: 2 caracteres
  - Longitud máxima: 50 caracteres
  - Mensaje de error: "La nacionalidad es obligatoria y debe ser un texto"
- **Ejemplo**: `"Colombiano"`

### `ocupacion` *(obligatorio)*
- **Tipo**: String
- **Descripción**: Ocupación del huésped secundario
- **Validaciones**:
  - Debe ser un texto
  - Longitud mínima: 2 caracteres
  - Longitud máxima: 50 caracteres
  - Mensaje de error: "La ocupacion es obligatoria y debe ser un texto"
- **Ejemplo**: `"Estudiante"`

### `genero` *(obligatorio)*
- **Tipo**: Enum (Genero)
- **Descripción**: Género del huésped secundario
- **Validaciones**:
  - Debe ser uno de los valores del enum Genero
  - Mensaje de error: "El genero es obligatorio y debe ser uno de los siguientes: MASCULINO, FEMENINO, OTRO"
- **Valores válidos**:
  - `MASCULINO`
  - `FEMENINO`
  - `OTRO`
- **Ejemplo**: `"MASCULINO"`

### `telefono` *(opcional)*
- **Tipo**: String
- **Descripción**: Teléfono del huésped secundario
- **Validaciones**:
  - Debe ser un texto (si se proporciona)
  - Mensaje de error: "El telefono es opcional y debe ser un texto"
- **Ejemplo**: `"+573001112233"`

### `correo` *(opcional)*
- **Tipo**: String
- **Descripción**: Correo electrónico del huésped secundario
- **Validaciones**:
  - Debe ser un texto (si se proporciona)
  - Mensaje de error: "El correo es opcional y debe ser un correo"
- **Ejemplo**: `"correo@example.com"`

---

## Ejemplo de Payload Completo

```json
{
  "fecha_inicio": "2023-08-15T00:00:00.000Z",
  "fecha_fin": "2023-08-20T00:00:00.000Z",
  "motivo_viaje": "COMPRAS",
  "costo": 500.5,
  "numero_habitacion": 101,
  "numero_acompaniantes": 1,
  "tipo_documento": "CC",
  "numero_documento": "12345678",
  "primer_apellido": "Pérez",
  "segundo_apellido": "García",
  "nombres": "Juan Carlos",
  "pais_residencia": "Colombia",
  "ciudad_residencia": "Medellín",
  "pais_procedencia": "Colombia",
  "ciudad_procedencia": "Medellín",
  "fecha_nacimiento": "1990-01-01T00:00:00.000Z",
  "nacionalidad": "Colombiano",
  "ocupacion": "Ingeniero",
  "genero": "MASCULINO",
  "telefono": "+573001112233",
  "correo": "correo@ejemplo.com",
  "huespedes_secundarios": [
    {
      "tipo_documento": "CC",
      "numero_documento": "87654321",
      "primer_apellido": "López",
      "segundo_apellido": "Martínez",
      "nombres": "María Isabel",
      "pais_residencia": "Colombia",
      "ciudad_residencia": "Bogotá",
      "pais_procedencia": "Colombia", 
      "ciudad_procedencia": "Bogotá",
      "fecha_nacimiento": "1985-05-15T00:00:00.000Z",
      "nacionalidad": "Colombiano",
      "ocupacion": "Estudiante",
      "genero": "FEMENINO",
      "telefono": "+573007654321",
      "correo": "maria@example.com"
    }
  ]
}
```

---

## Notas Importantes

1. **Campos Obligatorios**: Todos los campos marcados como *(obligatorio)* deben incluirse en el payload.

2. **Campos Opcionales**: Los campos marcados como *(opcional)* pueden omitirse del payload.

3. **Validaciones de Negocio**: Además de las validaciones de formato, pueden aplicarse validaciones de negocio adicionales en el servicio.

4. **Formatos de Fecha**: Las fechas deben enviarse en formato ISO 8601 (UTC).

5. **Números Decimales**: Los números decimales deben usar punto (.) como separador decimal.

6. **Teléfonos**: Los números telefónicos deben incluir el código de país (formato internacional).

7. **Huéspedes Secundarios**: El campo `huespedId` se omite automáticamente en el DTO de huéspedes secundarios ya que se asigna internamente. 