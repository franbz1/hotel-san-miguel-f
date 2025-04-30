import { Formulario } from "./formulario";

// Respuesta del endpoint registerFormularioInTra
export interface RegisterFormularioInTraResponse {
    statusCode: number;
    message: string;
    data: RegisterFormularioInTraData;
}

// Estructura de datos dentro de la respuesta
export interface RegisterFormularioInTraData {
    formulario: Formulario;
    traData?: TraData;  // Opcional, presente solo en caso de éxito
}

// Estructura de datos TRA
export interface TraData {
    huespedPrincipal: {
        code: number;
        // Otros campos que pueda retornar la API de TRA
    };
    huespedesSecundarios: Array<{
        code: number;
        // Otros campos que pueda retornar la API de TRA
    }>;
}