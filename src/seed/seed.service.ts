import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsService } from 'src/products/products.service';
import { Repository } from 'typeorm';
import { initialData } from './data/seed-data';
import { User } from 'src/auth/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
  constructor(
    private readonly prodcutService: ProductsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async runSeed() {
    this.deleteTable();
    const adminUser = await this.insertUser();
    await this.inserNewProducts(adminUser);
    return 'SEED EXECUTED';
  }

  private async deleteTable() {
    await this.prodcutService.deleteAllProduct();
    const queryBulder = this.userRepository.createQueryBuilder();
    await queryBulder.delete().where({}).execute();
  }

  private async insertUser() {
    const seedUSers = initialData.users;

    const users: User[] = [];

    seedUSers.forEach((user) => {
      user.password = bcrypt.hashSync(user.password, 10);
      users.push(this.userRepository.create(user));
    });

    const dbUsers = await this.userRepository.save(seedUSers);

    return dbUsers[0];
  }

  private async inserNewProducts(user: User) {
    await this.prodcutService.deleteAllProduct();
    const products = initialData.products;

    const inserPromises = [];
    products.forEach((product) => {
      inserPromises.push(this.prodcutService.create(product, user));
    });

    await Promise.all(inserPromises);
  }
}
