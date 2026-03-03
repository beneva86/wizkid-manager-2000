import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Wizkid, WizkidDocument } from './schemas/wizkid.schema';

@Injectable()
export class WizkidsService {
  constructor(
    @InjectModel(Wizkid.name)
    private readonly wizkidModel: Model<WizkidDocument>,
  ) {}

  async findAll() {
    return this.wizkidModel.find().sort({ createdAt: -1 }).lean();
  }

  async create(data: Partial<Wizkid>) {
    return this.wizkidModel.create(data);
  }

  async findById(id: string) {
    const found = await this.wizkidModel.findById(id).lean();
    if (!found) throw new NotFoundException('Wizkid not found');
    return found;
  }
}
