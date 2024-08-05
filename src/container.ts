// src/container.ts
import 'reflect-metadata'; // Certifique-se de que isto está no topo
import { container } from 'tsyringe';
import { ClockRepository } from './infra/repositories/ClockInOutRepository';
import { AuthRepository } from './infra/repositories/AuthRepository';
import { CreateClockInUseCase } from './usecases/clockIn/CreateClockInUseCase';
import { ValidateClockActionUseCase } from './usecases/validateClockAction/validateClockAction';
import { AuthUserUseCase } from './usecases/users/AuthUserUseCase';
import { ClockRecordRepository } from './infra/repositories/ClockRecordRepository';
import { UserRepository } from './infra/repositories/UserRepository';
import { FlagRepository } from './infra/repositories/FlagsRepository';
import { ManageFlagsUseCase } from './usecases/flags/ManageFlagsUseCase';
import { CreateLunchBreakStartUseCase } from './usecases/lunchBreakStart/CreateLunchBreakStartUseCase';

// Register repositories
container.registerSingleton('ClockRepository', ClockRepository);
container.registerSingleton('AuthRepository', AuthRepository);
container.registerSingleton('ClockRecordRepository', ClockRecordRepository);
container.registerSingleton('UserRepository', UserRepository);
container.registerSingleton('FlagRepository', FlagRepository);

// Register use cases
container.registerSingleton('ValidateClockActionUseCase', ValidateClockActionUseCase);
container.registerSingleton('CreateClockInUseCase', CreateClockInUseCase);
container.registerSingleton('CreateLunchBreakStartUseCase', CreateLunchBreakStartUseCase);
container.registerSingleton('AuthUserUseCase', AuthUserUseCase);
container.registerSingleton('ManageFlagsUseCase', ManageFlagsUseCase);

export { container };
