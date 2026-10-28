import { IsEmail } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class forgotPasswordDto {
    @ApiProperty({ example: 'john@example.com' }) 
    @IsEmail()
    email: string
}