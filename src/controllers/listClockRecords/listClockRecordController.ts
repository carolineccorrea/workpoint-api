import { Request, Response } from "express";
import { injectable, inject } from "tsyringe";
import { IController } from "../protocols/IController";
import { ListUserClockRecordsUseCase } from "../../usecases/listClockRecords/ListUserClockRecordsUseCase";

@injectable()
class ListUserClockRecordsController implements IController {
  constructor(
    @inject(ListUserClockRecordsUseCase) private listUserClockRecordsUseCase: ListUserClockRecordsUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const userId = req.query.userId as string;
    try {
      const clockRecords = await this.listUserClockRecordsUseCase.execute(userId);
      res.status(200).json(clockRecords);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export { ListUserClockRecordsController };
