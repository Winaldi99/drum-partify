import { Injectable, NotFoundException } from '@nestjs/common'; // <-- Pastikan NotFoundException diimport
import { Product } from './product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}

  async save(product: Product): Promise<Product> {
    return this.productRepository.save(product);
  }

  async findByUserId(
    userId: number,
    page: number,
    limit: number,
  ): Promise<Product[]> {
    return await this.productRepository.find({
      where: { user_id: userId },
      // Hapus 'category.genre' jika Genre tidak ada di Category Entity
      relations: ['category'], // <-- Sesuaikan relasi jika perlu
      skip: (page - 1) * limit,
      take: limit,
      order: {
        created_at: 'DESC',
      },
    });
  }

  async findByCategoryId(
    categoryId: number,
    page: number,
    limit: number,
  ): Promise<Product[]> {
    return await this.productRepository.find({
      where: { category_id: categoryId },
      // Hapus 'category.genre' jika Genre tidak ada di Category Entity
      relations: ['category'], // <-- Sesuaikan relasi jika perlu
      skip: (page - 1) * limit,
      take: limit,
      order: {
        created_at: 'DESC',
      },
    });
  }

  async findByUserIdAndProductId(userId: number, productId: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: {
        user_id: userId,
        id: productId,
      },
      // Hapus 'category.genre' jika Genre tidak ada di Category Entity
      relations: ['category'], // <-- Sesuaikan relasi jika perlu
    });
    // Jangan return new Product(). Biarkan controller handle jika null/undefined.
    // if (!product) {
    //   throw new NotFoundException(`Product with ID ${productId} not found for user ${userId}`);
    // }
    if (!product) {
        throw new NotFoundException(`Product with the specified criteria not found`);
    }
    return product;
  }

   // Tambahkan/modifikasi findById ini jika belum ada atau belum sesuai
  async findById(productId: number): Promise<Product> {
    const product = await this.productRepository.findOne({
        where: { id: productId },
        relations: ['category'], // Sesuaikan relasi
    });
    if (!product) {
        throw new NotFoundException(`Product with ID ${productId} not found`);
    }
    return product;
  }


  // Pastikan deleteById melempar error jika tidak ditemukan
  async deleteById(productId: number): Promise<void> { // Return void
    const result = await this.productRepository.delete({ id: productId });
    if (result.affected === 0) {
        throw new NotFoundException(`Product with ID ${productId} not found`);
    }
  }
}