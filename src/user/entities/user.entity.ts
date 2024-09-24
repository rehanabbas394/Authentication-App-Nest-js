import { Roles } from "src/utility/common/user.role.enum";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";

@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id:number

    @Column({unique:true})
    username:string

    @Column({select:false})
    password:string

    @Column()
    email:string

    @Column({type:'enum', enum:Roles, array:true, default:[Roles.USER]})
    role:Roles[]

    @CreateDateColumn()
    CreatedAt:Timestamp

    @UpdateDateColumn()
    UpdatedAt:Timestamp
}
