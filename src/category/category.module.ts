import { Module } from '@nestjs/common';
import { CategoryService } from './category.service'; // <-- Ganti nama file & class service
import { CategoryController } from './category.controller'; // <-- Ganti nama file & class controller
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './category.entity'; // <-- Ganti nama file & class entity
// Hapus import GenreModule

@Module({
  providers: [CategoryService], // <-- Ganti provider
  imports: [
    TypeOrmModule.forFeature([Category]), // <-- Ganti entity
    // Hapus GenreModule
  ],
  controllers: [CategoryController], // <-- Ganti controller
  exports: [CategoryService] // <-- Ganti export service
})
export class CategoryModule {} // <-- Ganti nama class module