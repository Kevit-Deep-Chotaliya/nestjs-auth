import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsPort, isString } from "class-validator";

export class Createtaskdto {
    @ApiProperty({ example: "Build auth system"} )
    @IsString()
    @IsNotEmpty()
    title: string

    @ApiProperty({ example: "Implement JWT with refresh tokens", 
                   required: false
                })
    @IsOptional()
    @IsString()
    description?: string
}