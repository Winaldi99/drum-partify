import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, IsOptional } from "class-validator"; // <-- Tambahkan IsOptional jika perlu

export class CreateProductDTO {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  categoryId: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  merek: string;

  @IsString() // <-- TAMBAHKAN VALIDATOR INI
  @IsOptional() // <-- Buat optional jika gambar tidak wajib, hapus jika wajib
  @ApiProperty({ required: false }) // <-- Sesuaikan required berdasarkan IsOptional
  imageUrl: string; // <-- TAMBAHKAN PROPERTY INI
}