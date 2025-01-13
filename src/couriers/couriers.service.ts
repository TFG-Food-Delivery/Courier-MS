import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { readReplicas } from '@prisma/extension-read-replicas';
import { envs } from 'src/config';
import { RpcException } from '@nestjs/microservices';
import { CreateCourierDto, PaginationDto, UpdateCourierDto } from './dto';

@Injectable()
export class CouriersService extends PrismaClient implements OnModuleInit {
  private readonly LOGGER = new Logger('CouriersService');

  onModuleInit() {
    // this.$extends(
    //   readReplicas({
    //     url: [envs.follower1DatabaseUrl, envs.follower2DatabaseUrl],
    //   }),
    // );
    this.$connect();
    this.LOGGER.log('Connected to the database');
  }

  async createCourier(createCourierDto: CreateCourierDto) {
    const existingCourier = await this.courier.findFirst({
      where: { email: createCourierDto.email },
    });
    if (existingCourier) {
      throw new RpcException({
        status: HttpStatus.CONFLICT,
        message: `Courier with email ${createCourierDto.email} already exists`,
      });
    }

    return this.courier.create({ data: createCourierDto });
  }

  async findAllCouriers(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const totalPages = await this.courier.count();
    if (!totalPages) {
      const message = 'No couriers found.';
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: message,
      });
    }
    return {
      data: await this.courier.findMany({
        skip: (page - 1) * limit,
        take: limit,
      }),
      meta: {
        total: totalPages,
        page: page,
        lastPage: Math.ceil(totalPages / limit),
      },
    };
  }

  async findOneCourier(id: string) {
    const courier = await this.courier.findUnique({
      where: { id },
    });
    if (!courier) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Courier #${id} not found`,
      });
    }

    return courier;
  }

  async updateCourier(updateCourierDto: UpdateCourierDto) {
    const { id, ...data } = updateCourierDto;

    await this.findOneCourier(id);

    return this.courier.update({
      where: { id },
      data: data,
    });
  }

  async updateCourierAvailability(id: string) {
    const courier = await this.findOneCourier(id);
    return this.courier.update({
      where: { id },
      data: {
        availability: !courier.availability,
      },
    });
  }

  async courierAssigned(orderAssigned) {
    const { order, courierId } = orderAssigned;
    await this.courier.update({
      where: { id: courierId },
      data: {
        orderAssigned: order.id,
      },
    });
    this.LOGGER.log(`Courier #${courierId} assigned to order #${order.id}`);
  }

  async orderDelivered(orderDelivered: any) {
    const { orderId, courierId } = orderDelivered;
    await this.courier.update({
      where: { id: courierId },
      data: {
        orderAssigned: '',
      },
    });
    this.LOGGER.log(`Courier #${courierId} assigned to order #${orderId}`);
  }

  async deleteCourier(id: string) {
    await this.findOneCourier(id);
    return this.courier.delete({ where: { id } });
  }
}
