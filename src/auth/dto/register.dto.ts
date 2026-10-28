import { IsEmail, IsString, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class registerDto {
    @ApiProperty({ example: "John Doe" })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: "john@example.com" })
    @IsEmail()
    email: string;

    @ApiProperty({ example: "password123", minLength: 8 })
    @IsString()
    @IsNotEmpty()
    password: string; 
}