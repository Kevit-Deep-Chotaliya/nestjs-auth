import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class resetPasswordDto {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    token: string;

    @ApiProperty({minLength : 8})
    @IsString()
    @MinLength(8)
    password: string
}