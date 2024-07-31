import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

export const imageUploadSchema = z.object({
  id: z.number(),
  filename: z.string(),
  data: z.instanceof(Buffer),
  createdAt: z.date(),
});

export class ImageUploadDto extends createZodDto(imageUploadSchema) {}

export const imageResponeSchema = imageUploadSchema.pick({
  id: true,
  filename: true,
  createdAt: true,
});

export class ImageResponeDto extends createZodDto(imageResponeSchema) {}
