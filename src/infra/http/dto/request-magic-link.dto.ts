import { IsEmail, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RequestMagicLinkDto {
  @ApiProperty({
    description: "User email address",
    example: "rafael.marques.vale.dev@gmail.com",
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;
}
