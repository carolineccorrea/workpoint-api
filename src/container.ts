import 'reflect-metadata';
import { container } from 'tsyringe';

// Importar os repositórios do MongoDB


// Importar os repositórios do PostgreSQL (comentados)
/*
import { ClockRepository } from './infra/repositories/ClockInOutRepository';
import { AuthRepository } from './infra/repositories/AuthRepository';
import { ClockRecordRepository } from './infra/repositories/ClockRecordRepository';
import { UserRepository } from './infra/repositories/UserRepository';
import { FlagRepository } from './infra/repositories/FlagsRepository';
*/

// Importar os casos de uso
import { CreateClockInUseCase } from './usecases/clockIn/CreateClockInUseCase';
import { AuthUserUseCase } from './usecases/users/AuthUserUseCase';
import { FlagsUseCase } from './usecases/flags/FlagsUseCase';
import { CreateLunchBreakStartUseCase } from './usecases/lunchBreakStart/CreateLunchBreakStartUseCase';
import { LunchBreakEndUseCase } from './usecases/lunchBreakEnd/LunchBreakEndUseCase';
import { UpdateClockOutUseCase } from './usecases/clockOut/UpdateClockoutUseCase';
import { ValidateClockActionUseCase } from './usecases/validateClockAction/validateClockAction';
import { UserRepository } from './infra/mongodb/repository/UserRepository';
import { LunchBreakRepository } from './infra/mongodb/repository/LunchBreakRepository';
import { FlagRepository } from './infra/mongodb/repository/FlagRepository';
import { ClockRecordRepository } from './infra/mongodb/repository/ClockRecordRepository';
import { ClockRepository } from './infra/mongodb/repository/ClockInOutRepository';
import { AuthRepository } from './infra/mongodb/repository/AuthRepository';
import { ListUserClockRecordsUseCase } from './usecases/listClockRecords/ListUserClockRecordsUseCase';

// Registrar os repositórios do MongoDB
container.registerSingleton('UserRepository', UserRepository);
container.registerSingleton('ClockRepository', ClockRepository);
container.registerSingleton('LunchBreakRepository', LunchBreakRepository);
container.registerSingleton('FlagRepository', FlagRepository);
container.registerSingleton('ClockRecordRepository', ClockRecordRepository);
container.registerSingleton('AuthRepository', AuthRepository);

// Registrar os repositórios do PostgreSQL (comentados)
/*
container.registerSingleton('ClockRepository', ClockRepository);
container.registerSingleton('AuthRepository', AuthRepository);
container.registerSingleton('ClockRecordRepository', ClockRecordRepository);
container.registerSingleton('UserRepository', UserRepository);
container.registerSingleton('FlagRepository', FlagRepository);
*/

// Registrar os casos de uso
container.registerSingleton('ValidateClockActionUseCase', ValidateClockActionUseCase);
container.registerSingleton('CreateClockInUseCase', CreateClockInUseCase);
container.registerSingleton('CreateLunchBreakStartUseCase', CreateLunchBreakStartUseCase);
container.registerSingleton('AuthUserUseCase', AuthUserUseCase);
container.registerSingleton('FlagsUseCase', FlagsUseCase);
container.registerSingleton('UpdateClockOutUseCase', UpdateClockOutUseCase);
container.registerSingleton('LunchBreakEndUseCase', LunchBreakEndUseCase);
container.registerSingleton('ListUserClockRecordsUseCase', ListUserClockRecordsUseCase);

export { container };
