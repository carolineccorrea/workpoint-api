import { Request, Response } from "express";
import { ListCustomersService } from "../../services/customer/ListCustomersService";

class ListCustomersController {
  async handle(request: Request, response: Response) {
    const listCustomersService = new ListCustomersService();
    const customers = await listCustomersService.execute();
    return response.json(customers);
  }
}

export { ListCustomersController };