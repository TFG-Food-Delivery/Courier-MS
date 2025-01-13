import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { CouriersService } from './couriers.service';
import { CreateCourierDto, PaginationDto, UpdateCourierDto } from './dto';

/**
 * Controller for handling courier-related operations.
 */
@Controller()
export class CouriersController {
  /**
   * Constructor for CouriersController.
   * @param couriersService - The service to handle courier operations.
   */
  constructor(private readonly couriersService: CouriersService) {}

  /**
   * Handles the creation of a new courier.
   * @param createCourierDto - Data transfer object containing courier creation details.
   * @returns The created courier.
   */
  @MessagePattern('createCourier')
  createCourier(@Payload() createCourierDto: CreateCourierDto) {
    return this.couriersService.createCourier(createCourierDto);
  }

  /**
   * Retrieves all couriers with pagination.
   * @param paginationDto - Data transfer object containing pagination details.
   * @returns A list of couriers.
   */
  @MessagePattern('findAllCouriers')
  findAllCouriers(@Payload() paginationDto: PaginationDto) {
    return this.couriersService.findAllCouriers(paginationDto);
  }

  /**
   * Retrieves a single courier by ID.
   * @param payload - Object containing the ID of the courier to retrieve.
   * @returns The requested courier.
   */
  @MessagePattern('findOneCourier')
  findOneCourier(@Payload() payload) {
    const { id } = payload;
    return this.couriersService.findOneCourier(id);
  }

  /**
   * Updates an existing courier.
   * @param updateCourierDto - Data transfer object containing courier update details.
   * @returns The updated courier.
   */
  @MessagePattern('updateCourier')
  updateCourier(@Payload() updateCourierDto: UpdateCourierDto) {
    return this.couriersService.updateCourier(updateCourierDto);
  }

  /**
   * Handles the event when a courier is assigned to an order.
   * @param orderAssigned - Object containing details of the assigned order.
   * @returns The result of the assignment operation.
   */
  @EventPattern('courier_assigned')
  courierAssigned(@Payload() orderAssigned) {
    return this.couriersService.courierAssigned(orderAssigned);
  }

  /**
   * Handles the event when an order is delivered.
   * @param orderDelivered - Object containing details of the delivered order.
   * @returns The result of the delivery operation.
   */
  @EventPattern('order_delivered')
  orderDelivered(@Payload() orderDelivered) {
    return this.couriersService.orderDelivered(orderDelivered);
  }

  /**
   * Updates the availability status of a courier.
   * @param payload - Object containing the ID of the courier to update.
   * @returns The updated availability status.
   */
  @MessagePattern('updateCourierAvailability')
  updateCourierAvailability(@Payload() payload: { id: string }) {
    return this.couriersService.updateCourierAvailability(payload.id);
  }

  /**
   * Deletes a courier by ID.
   * @param id - The ID of the courier to delete.
   * @returns The result of the deletion operation.
   */
  @MessagePattern('deleteCourier')
  deleteCourier(@Payload('id', ParseUUIDPipe) id: string) {
    return this.couriersService.deleteCourier(id);
  }
}
