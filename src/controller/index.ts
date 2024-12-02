import type {Request, Response} from 'express';
export interface controllerAction {
    (req: Request, res: Response): void;
}
