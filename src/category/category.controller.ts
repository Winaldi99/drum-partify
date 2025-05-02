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
  import { CreateCategoryDTO } from './create-category.dto'; // <-- Ubah DTO
  import { CategoryService } from './category.service'; // <-- Ubah Service
  import { Category } from './category.entity'; // <-- Ubah Entity
  import { ApiParam, ApiQuery } from '@nestjs/swagger';
  // Hapus import GenreService
  
  @Controller('categories') // <-- Ubah route
  export class CategoryController { // <-- Ubah nama class
    constructor(
      private readonly categoryService: CategoryService, // <-- Ubah service
      // Hapus genreService
    ) {}
  
    @Post()
    async create(@Req() request: Request, @Body() createCategoryDTO: CreateCategoryDTO) { // <-- Ubah DTO
      const category: Category = new Category(); // <-- Ubah Entity
      const userJwtPayload: JwtPayloadDto = request['user'];
  
      // Hapus verifikasi genre
  
      category.jenis = createCategoryDTO.jenis; // <-- Ubah property
      category.deskripsi = createCategoryDTO.deskripsi; // <-- Ubah property
      // Hapus genre_id
      // Hapus image_url
      category.user_id = userJwtPayload.sub;
      await this.categoryService.save(category); // <-- Ubah service method call
    }
  
    @Get()
    @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
    @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
    async findAll(
      @Req() request: Request,
      @Query('page') page: number = 1,
      @Query('limit') limit: number = 10,
    ): Promise<Category[]> { // <-- Ubah return type
      const userJwtPayload: JwtPayloadDto = request['user'];
      return await this.categoryService.findByUserId(userJwtPayload.sub, page, limit); // <-- Ubah service method call
    }
  
    @Get(':id')
    @ApiParam({ name: 'id', type: Number, description: 'ID of the category' }) // <-- Ubah deskripsi
    async findOne(
      @Req() request: Request,
      @Param('id') id: number,
    ): Promise<Category> { // <-- Ubah return type
      const userJwtPayload: JwtPayloadDto = request['user'];
      // Ubah nama method di service (lihat di category.service.ts)
      return await this.categoryService.findByUserIdAndCategoryId(userJwtPayload.sub, id);
    }
  
    @Put(':id')
    @ApiParam({ name: 'id', type: Number, description: 'ID of the category' }) // <-- Ubah deskripsi
    async updateOne(
      @Req() request: Request,
      @Param('id') id: number,
      @Body() createCategoryDTO: CreateCategoryDTO, // <-- Ubah DTO
    ) {
      const userJwtPayload: JwtPayloadDto = request['user'];
      // Ubah nama method di service dan tipe variable
      const category: Category = await this.categoryService.findByUserIdAndCategoryId(
        userJwtPayload.sub,
        id,
      );
      if (category.id == null) { // <-- Ubah variable check
        throw new NotFoundException();
      }
  
      // Hapus verifikasi genre
  
      category.jenis = createCategoryDTO.jenis; // <-- Ubah property
      category.deskripsi = createCategoryDTO.deskripsi; // <-- Ubah property
      // Hapus genre_id
      // Hapus image_url
      await this.categoryService.save(category); // <-- Ubah service method call
    }
  
    @Delete(':id')
    @ApiParam({ name: 'id', type: Number, description: 'ID of the category' }) // <-- Ubah deskripsi
    async deleteOne(@Req() request: Request, @Param('id') id: number) {
      const userJwtPayload: JwtPayloadDto = request['user'];
      // Ubah nama method di service dan tipe variable
      const category: Category = await this.categoryService.findByUserIdAndCategoryId(
        userJwtPayload.sub,
        id,
      );
      if (category.id == null) { // <-- Ubah variable check
        throw new NotFoundException();
      }
      await this.categoryService.deleteById(id); // <-- Ubah service method call
    }
  }