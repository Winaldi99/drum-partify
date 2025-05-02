import { Injectable } from '@nestjs/common';
import { Category } from './category.entity'; // <-- Ubah Entity
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CategoryService { // <-- Ubah nama class
  constructor(
    @InjectRepository(Category) private categoryRepository: Repository<Category>, // <-- Ubah Repository & Entity
  ) {}

  async save(category: Category): Promise<Category> { // <-- Ubah parameter & return type
    return this.categoryRepository.save(category); // <-- Ubah repository call
  }

  async findByUserId(
    userId: number,
    page: number,
    limit: number,
  ): Promise<Category[]> { // <-- Ubah return type
    return await this.categoryRepository.find({ // <-- Ubah repository call
      where: { user_id: userId },
      // Hapus relations: ['genre'],
      skip: (page - 1) * limit,
      take: limit,
      order: {
        created_at: 'DESC',
      },
    });
  }

  // Ubah nama method dan parameter kedua
  async findByUserIdAndCategoryId(userId: number, categoryId: number): Promise<Category> { // <-- Ubah return type
    const category = await this.categoryRepository.findOne({ // <-- Ubah repository call & variable name
      where: {
        user_id: userId,
        id: categoryId, // <-- Ubah parameter ke id
      },
      // Hapus relations: ['genre'],
    });
    if (!category) { // <-- Ubah variable check
      return new Category(); // <-- Ubah Entity
    }
    return category; // <-- Ubah variable return
  }

  async findById(categoryId: number): Promise<Category> { // <-- Ubah parameter & return type
    const category = await this.categoryRepository.findOne({ // <-- Ubah repository call & variable name
      where: { id: categoryId }, // <-- Ubah parameter
      // Hapus relations: ['genre'],
    });

    if (!category) { // <-- Ubah variable check
      return new Category(); // <-- Ubah Entity
    }

    return category; // <-- Ubah variable return
  }

  async deleteById(categoryId: number) { // <-- Ubah parameter
    await this.categoryRepository.delete({ id: categoryId }); // <-- Ubah repository call & parameter
  }
}