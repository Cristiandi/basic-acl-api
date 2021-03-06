import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';

import { Company } from '../companies/company.entity';
import { GraphqlAction } from '../graphql-actions/graphql-action.entity';
import { HttpRoute } from '../http-routes/http-route.entity';

@Entity({ name: 'projects' })
@Unique('uk_projects', ['code', 'company'])
export class Project {
    @ApiPropertyOptional()
    @PrimaryGeneratedColumn()
    id: number;
    
    @ApiProperty()
    @Column({ type: 'varchar', length: 100 })
    name: string;

    @ApiProperty()
    @Column({ type: 'varchar', length: 5 })
    code: string;

    @ApiProperty()
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  
    @ApiProperty()
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    // relations

    @ApiProperty({  type: () => Company })
    @ManyToOne(type => Company, company => company.projects)
    @JoinColumn({ name: 'company_id' })
    company: Company;

    @ApiProperty({  type: () => [HttpRoute] })
    @OneToMany(type => HttpRoute, httpRoute => httpRoute.project)
    httpRoutes: HttpRoute[]

    @ApiProperty({  type: () => [GraphqlAction] })
    @OneToMany(type => GraphqlAction, graphqlAction => graphqlAction.project)
    graphqlActions: GraphqlAction[]
}