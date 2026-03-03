import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { WizkidsService } from './wizkids.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WizkidsCleanupService {
  private readonly logger = new Logger(WizkidsCleanupService.name);

  constructor(
    private readonly wizkidsService: WizkidsService,
    private configService: ConfigService,
  ) {}

  // Runs every day at midnight
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async deleteFiredWizkids() {
    this.logger.log('Running auto-delete job for fired wizkids');

    const days = this.configService.get<number>('AUTO_DELETE_AFTER_DAYS') ?? 7;

    const deletedCount =
      await this.wizkidsService.deleteFiredWizkidsOlderThanDays(days);

    if (deletedCount > 0) {
      this.logger.log(`Deleted ${deletedCount} fired wizkids`);
    }
  }
}
