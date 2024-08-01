// src/container.ts
import { container } from "tsyringe";
import { ClockRepository } from "./infra/repositories/ClockInOutRepository";
import { ClockInController } from "./controllers/clockin/ClockInController";
import { CreateClockInUseCase } from "./usecases/clockIn/CreateClockInUseCase";
import { ValidateClockActionUseCase } from "./usecases/validateClockAction/validateClockAction";

console.log('Registering dependencies...');

// Register dependencies
container.register("ClockRepository", { useClass: ClockRepository });
console.log('ClockRepository registered');

container.register("ValidateClockActionUseCase", { useClass: ValidateClockActionUseCase });
console.log('ValidateClockActionUseCase registered');

container.register("CreateClockInUseCase", { useClass: CreateClockInUseCase });
console.log('CreateClockInUseCase registered');

container.register("ClockInController", { useClass: ClockInController });
console.log('ClockInController registered');

export { container };
