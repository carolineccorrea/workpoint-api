import { Request, Response, NextFunction } from 'express';
import { container, DependencyContainer } from 'tsyringe';
import { IController } from './IController';

export function handleController<T extends IController>(controllerType: new (...args: any[]) => T) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const controller = container.resolve(controllerType);
            await controller.handle(req, res, next);
        } catch (error) {
            next(error);
        }
    };
}
