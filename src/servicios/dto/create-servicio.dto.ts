import { IsInt, IsOptional, IsPositive } from "class-validator";

export class CreateServicioDto {
 
    nombre: string;

    @IsInt()
    duracion: number; // duración en minutos

    @IsOptional()
    descripcion: string;

    @IsInt()
    @IsPositive()
    precio: number;
}