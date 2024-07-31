import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { imageResponeSchema } from './dto';

@Injectable()
export class ImageUploadService {
  constructor(private prisma: PrismaService) {}

  async create(file: Express.Multer.File) {
    const image = await this.prisma.image.create({
      data: { filename: file.originalname, data: file.buffer },
    });

    return imageResponeSchema.parse(image);
  }

  async findAll() {
    const images = await this.prisma.image.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, filename: true, createdAt: true },
    });

    return images;
  }

  async findOne(id: number) {
    try {
      const image = await this.prisma.image.findUniqueOrThrow({
        where: { id },
      });

      return imageResponeSchema.parse(image);
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Resource with id ${id} not found`);
      }

      Logger.log(error);
      throw error;
    }
  }

  async update(id: number, file: Express.Multer.File) {
    await this.findOne(id);

    const updatedImage = await this.prisma.image.update({
      where: { id },
      data: { filename: file.originalname, data: file.buffer },
    });

    return imageResponeSchema.parse(updatedImage);
  }

  async remove(id: number) {
    await this.findOne(id);

    const removedImage = await this.prisma.image.delete({
      where: { id },
    });

    return imageResponeSchema.parse(removedImage);
    // return removedImage;
  }
}
