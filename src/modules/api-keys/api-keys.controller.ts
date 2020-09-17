import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiKeysService } from './api-keys.service';
import { CreateApiKeyInput } from './dto/create-api-key-input.dto';

@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Controller('api-keys')
export class ApiKeysController {
  constructor(private readonly apiKeysService: ApiKeysService) {}

  @Post()
  create(@Body() createApiKeyInput: CreateApiKeyInput): Promise<any> {
    return this.apiKeysService.create(createApiKeyInput);
  }
}
