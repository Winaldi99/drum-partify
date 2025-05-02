import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
// Hapus import IsNumber

export class CreateCategoryDTO { // <-- Ubah nama class
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  jenis: string; // <-- Ubah title menjadi jenis

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  deskripsi: string; // <-- Ubah director menjadi deskripsi

  // Hapus genreId
  // Hapus imageUrl
}