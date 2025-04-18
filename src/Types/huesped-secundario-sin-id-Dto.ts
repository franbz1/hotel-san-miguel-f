import { CreateHuespedSecundario } from "./huesped-secundarioDto";

export interface CreateHuespedSecundarioWithoutIdDto extends Omit<CreateHuespedSecundario, 'huespedId'> {
}
