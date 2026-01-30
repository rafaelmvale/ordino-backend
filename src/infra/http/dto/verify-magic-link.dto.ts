import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class VerifyMagicLinkDto {
  @ApiProperty({
    description: "Magic link token",
    example: "a1b2c3d4e5f6...",
  })
  @IsString()
  @IsNotEmpty()
  token!: string;
}
