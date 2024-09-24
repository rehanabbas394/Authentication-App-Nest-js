import {DataSource,DataSourceOptions } from 'typeorm'
import { config } from 'dotenv'
import { UserEntity } from 'src/user/entities/user.entity';

config()
export const dataSourceOption:DataSourceOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: +process.env.PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: ['dist/**/*.entity{.ts,.js}'],
    logging: true,
    synchronize: true,
    migrations: ['dist/migrations/*.js']
}

const datasource = new DataSource(dataSourceOption);
export default datasource;