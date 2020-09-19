import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { AssignedRolesService } from './assigned-roles.service';

@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Controller('assigned-roles')
export class AssignedRolesController {
  constructor (private readonly assignedRolesService: AssignedRolesService) {}

  
}
