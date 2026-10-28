import { IsEmail, IsString, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class loginDto {
    @ApiProperty({ example: "john@example.com" })
    @IsEmail()
    email: string;

    @ApiProperty({ example: "password123", minLength: 8 })
    @IsString()
    @IsNotEmpty()
    password: string; 
}