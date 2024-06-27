import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ProductService');

  onModuleInit() {
    this.$connect();
    this.logger.log('Base de datos conectada');
  }

  async create(createProductDto: CreateProductDto) {
    return await this.product.create({
      data: createProductDto,
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const totalPages = await this.product.count({
      where: {
        available: true,
      },
    });
    const lastPage = Math.ceil(totalPages / limit);
    return {
      data: await this.product.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: {
          available: true,
        },
      }),
      meta: {
        total: totalPages,
        page,
        lastPage,
      },
    };
  }

  async findOne(id: number) {
    const product = await this.product.findUnique({
      where: {
        id,
        available: true,
      },
    });
    if (!product) {
      throw new NotFoundException(`Producto con id #${id} no encontrado`);
    }
    return product;
  }

  async update(updateProductDto: UpdateProductDto) {
    const { id, ...data } = updateProductDto;
    await this.findOne(id);
    return await this.product.update({
      where: { id },
      data: data,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    // return await this.product.delete({
    //   where: { id },
    // });
    const product = await this.product.update({
      where: { id },
      data: {
        available: false,
      },
    });
    return product;
  }
}
