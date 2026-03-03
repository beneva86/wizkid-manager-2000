import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Wizkid, WizkidDocument } from './schemas/wizkid.schema';
import { WizkidRole } from './wizkid-role.enum';
import * as bcrypt from 'bcrypt';

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

  async createWizkid(dto: {
    name: string;
    role: WizkidRole;
    email: string;
    profilePicture?: string;
    phone?: string;
    password?: string;
  }) {
    const email = dto.email.toLowerCase().trim();

    let passwordHash: string | undefined;
    if (dto.password) {
      passwordHash = await bcrypt.hash(dto.password, 10);
    }

    try {
      return await this.wizkidModel.create({
        name: dto.name,
        role: dto.role,
        email,
        profilePicture: dto.profilePicture,
        phone: dto.phone,
        passwordHash,
        firedAt: null,
      });
    } catch (err: any) {
      // check Mongo duplicate key error
      if (err?.code === 11000) {
        throw new ConflictException('Email already exists');
      }
      throw new BadRequestException('Unable to create wizkid');
    }
  }

  async findById(id: string) {
    const found = await this.wizkidModel.findById(id).lean().exec();
    if (!found) throw new NotFoundException('Wizkid not found');
    return found;
  }

  async findByEmail(email: string) {
    return this.wizkidModel
      .findOne({ email: email.toLowerCase().trim() })
      .lean()
      .exec();
  }
}
