import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Wizkid, WizkidDocument } from './schemas/wizkid.schema';
import { WizkidRole } from './wizkid-role.enum';

@Injectable()
export class WizkidsService {
  constructor(
    @InjectModel(Wizkid.name)
    private readonly wizkidModel: Model<WizkidDocument>,
  ) {}

  async findAll(params?: { search?: string; role?: WizkidRole }) {
    const filter: any = {};

    if (params?.role) {
      filter.role = params.role;
    }

    if (params?.search) {
      filter.$text = { $search: params.search };
    }

    return this.wizkidModel.find(filter).sort({ createdAt: -1 }).lean().exec();
  }

  async create(data: Partial<Wizkid>) {
    return this.wizkidModel.create(data);
  }

  async findById(id: string) {
    const found = await this.wizkidModel.findById(id).lean().exec();
    if (!found) throw new NotFoundException('Wizkid not found');
    return found;
  }
}
