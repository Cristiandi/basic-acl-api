import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { HttpRoute } from '../http-routes/http-route.entity';
import { Role } from '../roles/role.entity';

@Entity({ name: 'permissions' })
@Unique('uk_permissions', ['role', 'httpRoute'])
export class Permission {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: 'boolean' })
  allowed: boolean;

  // relations

  @ApiProperty({ type: () => Role })
  @ManyToOne(type => Role, role => role.permissions)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @ApiProperty({ type: () => HttpRoute })
  @ManyToOne(type => HttpRoute, httpRoute => httpRoute.permissions)
  @JoinColumn({ name: 'http_route_id' })
  httpRoute: HttpRoute
}