import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { HttpRoute } from '../http-routes/http-route.entity';
import { Role } from '../roles/role.entity';

@Entity({ name: 'permissions' })
@Unique('uk_permissions', ['role', 'httpRoute'])
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'boolean' })
  allowed: boolean;

  // relations

  @ManyToOne(type => Role, role => role.permissions)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @ManyToOne(type => HttpRoute, httpRoute => httpRoute.permissions)
  @JoinColumn({ name: 'http_route_id' })
  httpRoute: HttpRoute
}