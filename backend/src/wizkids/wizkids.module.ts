import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WizkidsController } from './wizkids.controller';
import { WizkidsService } from './wizkids.service';
import { Wizkid, WizkidSchema } from './schemas/wizkid.schema';
import { WizkidsCleanupService } from './wizkids.cleanup.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Wizkid.name, schema: WizkidSchema }]),
  ],
  controllers: [WizkidsController],
  providers: [WizkidsService, WizkidsCleanupService],
  exports: [WizkidsService],
})
export class WizkidsModule {}
