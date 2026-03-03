import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Wizkid, WizkidDocument } from './schemas/wizkid.schema';
import { WizkidRole } from './wizkid-role.enum';
import * as bcrypt from 'bcrypt';
import { EmailService } from 'src/email/email.service';
import { EmailTemplate } from 'src/email/email.types';

@Injectable()
export class WizkidsService {
  constructor(
    @InjectModel(Wizkid.name)
    private readonly wizkidModel: Model<WizkidDocument>,
    private readonly emailService: EmailService,
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

    if (!found) {
      throw new NotFoundException('Wizkid not found');
    }

    return found;
  }

  async findByEmail(email: string) {
    return this.wizkidModel
      .findOne({ email: email.toLowerCase().trim() })
      .lean()
      .exec();
  }

  async updateWizkid(id: string, dto: any) {
    const wizkid = await this.wizkidModel.findById(id);

    if (!wizkid) {
      throw new NotFoundException('Wizkid not found');
    }

    // normalize email
    if (dto.email) {
      wizkid.email = dto.email.toLowerCase().trim();
    }

    if (dto.name !== undefined) {
      wizkid.name = dto.name;
    }

    if (dto.role !== undefined) {
      wizkid.role = dto.role;
    }

    if (dto.profilePicture !== undefined) {
      wizkid.profilePicture = dto.profilePicture;
    }

    if (dto.phone !== undefined) {
      wizkid.phone = dto.phone;
    }

    // password update if it is provided
    if (dto.password) {
      wizkid.passwordHash = await bcrypt.hash(dto.password, 10);
    }

    try {
      const saved = await wizkid.save();
      return saved.toObject();
    } catch (err: any) {
      if (err?.code === 11000) {
        throw new ConflictException('Email already exists');
      }
      throw new BadRequestException('Unable to update wizkid');
    }
  }

  async deleteWizkid(id: string) {
    const deleted = await this.wizkidModel.findByIdAndDelete(id).lean().exec();

    if (!deleted) {
      throw new NotFoundException('Wizkid not found');
    }

    return deleted;
  }

  async fireWizkid(targetId: string, actorId: string) {
    if (targetId === actorId) {
      throw new ForbiddenException('You cannot fire yourself');
    }

    const wizkid = await this.wizkidModel.findById(targetId);
    if (!wizkid) {
      throw new NotFoundException('Wizkid not found');
    }

    // if already fired, do nothing and return the wizkid
    if (wizkid.firedAt) {
      return wizkid.toObject();
    }

    wizkid.firedAt = new Date();
    const savedWizkid = await wizkid.save();

    if (wizkid.email) {
      await this.emailService.sendTemplate(wizkid.email, EmailTemplate.FIRED, {
        name: wizkid.name,
      });
    }
    return savedWizkid.toObject();
  }

  async unfireWizkid(targetId: string) {
    const wizkid = await this.wizkidModel.findById(targetId);
    if (!wizkid) {
      throw new NotFoundException('Wizkid not found');
    }

    // if the wizkid is not fired, do nothing and return the wizkid
    if (!wizkid.firedAt) {
      return wizkid.toObject();
    }

    wizkid.firedAt = null;
    const savedWizkid = await wizkid.save();

    if (wizkid.email) {
      await this.emailService.sendTemplate(
        wizkid.email,
        EmailTemplate.UNFIRED,
        { name: wizkid.name },
      );
    }
    return savedWizkid.toObject();
  }

  async deleteFiredWizkidsOlderThanDays(days: number): Promise<number> {
    const threshold = new Date();
    threshold.setDate(threshold.getDate() - days);

    const result = await this.wizkidModel.deleteMany({
      firedAt: { $lte: threshold },
    });

    return result.deletedCount ?? 0;
  }
}
