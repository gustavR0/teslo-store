import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/products/entities';
import { ProductsService } from 'src/products/products.service';
import { Repository } from 'typeorm';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {
  constructor(
    private readonly prodcutService: ProductsService,
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  async runSeed() {
    await this.inserNewProducts();
    return 'SEED EXECUTED';
  }

  private async inserNewProducts() {
    await this.prodcutService.deleteAllProduct();
    const products = initialData.products;

    const inserPromises = [];
    products.forEach((product) => {
      inserPromises.push(this.prodcutService.create(product));
    });

    await Promise.all(inserPromises);
  }
}
