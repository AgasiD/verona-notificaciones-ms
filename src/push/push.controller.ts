import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';

import { CreatePushDto } from './dto/create-push.dto';
import { UpdatePushDto } from './dto/update-push.dto';
import { PushNotificactionService } from './push.service';

@Controller('push')
export class PushController {
  constructor(private readonly pushService: PushNotificactionService) {}


}
