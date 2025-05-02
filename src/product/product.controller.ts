import {
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Post,
    Put,
    Query,
    Req,
  } from '@nestjs/common';
  import { JwtPayloadDto } from 'src/auth/dto/jwt-payload.dto';
  import { CreateProductDTO } from './create-product.dto';
  import { ProductService } from './product.service';
  import { Product } from './product.entity';
  import { ApiParam, ApiQuery } from '@nestjs/swagger';
  import { CategoryService } from '../category/category.service';
  
  @Controller('product')
  export class ProductController {
    constructor(
      private readonly productService: ProductService,
      private readonly categoryService: CategoryService,
    ) {}
  
    @Post()
    async create(@Req() request: Request, @Body() createProductDTO: CreateProductDTO) {
      const product: Product = new Product();
      const userJwtPayload: JwtPayloadDto = request['user'];
  
      const category = await this.categoryService.findById(createProductDTO.categoryId);
      // Penting: Periksa apakah category benar-benar ada (findById service sebaiknya melempar error atau mengembalikan null/undefined jika tidak ada)
      if (!category || category.id == null) {
        throw new NotFoundException('Category not found');
      }
  
      product.category_id = createProductDTO.categoryId;
      product.merek = createProductDTO.merek;
      product.image_url = createProductDTO.imageUrl; // <-- TAMBAHKAN BARIS INI
      product.user_id = userJwtPayload.sub;
      await this.productService.save(product);
      // Sebaiknya return hasil save atau respons standar (seperti { message: 'Product created' })
    }
  
    @Get()
    @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
    @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
    async findAll(
      @Req() request: Request,
      @Query('page') page: number = 1,
      @Query('limit') limit: number = 10,
    ): Promise<Product[]> {
      const userJwtPayload: JwtPayloadDto = request['user'];
      // Pertimbangkan apakah ingin mengembalikan *semua* produk atau hanya milik user
      // return await this.productService.findAllPaginated(page, limit); // Untuk semua produk
      return await this.productService.findByUserId(userJwtPayload.sub, page, limit); // Untuk produk user
    }
  
    @Get('category/:categoryId')
    @ApiParam({ name: 'categoryId', type: Number, description: 'ID of the category' })
    @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
    @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
    async findByCategoryId(
      @Param('categoryId') categoryId: number,
      @Query('page') page: number = 1,
      @Query('limit') limit: number = 10,
    ): Promise<Product[]> {
       // Pastikan category ada sebelum mencari produk? (Opsional)
       // const category = await this.categoryService.findById(categoryId);
       // if (!category || category.id == null) {
       //   throw new NotFoundException('Category not found');
       // }
      return await this.productService.findByCategoryId(categoryId, page, limit);
    }
  
    @Get(':id')
    @ApiParam({ name: 'id', type: Number, description: 'ID of the product' })
    async findOne(
      @Req() request: Request, // Hapus jika user tidak diperlukan
      @Param('id') id: number,
    ): Promise<Product> {
      // const userJwtPayload: JwtPayloadDto = request['user']; // Jika perlu check user
      // return await this.productService.findByUserIdAndProductId(userJwtPayload.sub, id);
      // Atau cari berdasarkan ID saja:
       const product = await this.productService.findById(id); // Modifikasi service findById agar throw error jika tidak ketemu
       if (!product || product.id == null) { // Handle jika service mengembalikan null/undefined/instance kosong
          throw new NotFoundException(`Product with ID ${id} not found`);
       }
       return product;
    }
  
    // Contoh route baru untuk produk user
    @Get('user/mine')
    @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
    @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
    async findMyProducts(
        @Req() request: Request,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ): Promise<Product[]> {
        const userJwtPayload: JwtPayloadDto = request['user'];
        return await this.productService.findByUserId(userJwtPayload.sub, page, limit);
    }
  
  
    @Put(':id')
    @ApiParam({ name: 'id', type: Number, description: 'ID of the product' })
    async updateOne(
      @Req() request: Request,
      @Param('id') id: number,
      @Body() createProductDTO: CreateProductDTO,
    ) {
      const userJwtPayload: JwtPayloadDto = request['user'];
      // Pastikan user hanya bisa update produk miliknya
      const product: Product = await this.productService.findByUserIdAndProductId(
        userJwtPayload.sub,
        id,
      );
       // Service findByUserIdAndProductId sebaiknya throw error jika tidak ketemu
      if (!product || product.id == null) {
        throw new NotFoundException('Product not found or you do not have permission to update it.');
      }
  
      // Verify that the category exists
      const category = await this.categoryService.findById(createProductDTO.categoryId);
      if (!category || category.id == null) {
        throw new NotFoundException('Category not found');
      }
  
      product.category_id = createProductDTO.categoryId;
      product.merek = createProductDTO.merek;
      product.image_url = createProductDTO.imageUrl; // <-- TAMBAHKAN BARIS INI
      await this.productService.save(product);
       // Sebaiknya return hasil update atau respons standar
    }
  
    @Delete(':id')
    @ApiParam({ name: 'id', type: Number, description: 'ID of the product' })
    async deleteOne(@Req() request: Request, @Param('id') id: number) {
      const userJwtPayload: JwtPayloadDto = request['user'];
      // Pastikan user hanya bisa delete produk miliknya
      const product: Product = await this.productService.findByUserIdAndProductId(
        userJwtPayload.sub,
        id,
      );
      if (!product || product.id == null) {
         throw new NotFoundException('Product not found or you do not have permission to delete it.');
      }
      await this.productService.deleteById(id); // Service deleteById sebaiknya throw error jika gagal
      // Sebaiknya return respons standar (e.g., status 204 No Content)
    }
  }