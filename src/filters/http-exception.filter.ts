import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { PrismaClient as Prisma } from '@prisma/client';


@Catch() 
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        let status: number;
        let message: any;
        
        if (exception instanceof HttpException) {
            status = exception.getStatus();
            message = exception.getResponse();
        } else {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            message = 'Internal server error';
        }        
        
        // Convert simple string messages
        if (typeof message === 'string') {
            message = { message };
        }


        /**
         * Centralized logging
         */
        console.error('Exception caught', {
            time: new Date().toISOString(),
            path: request.url,
            method: request.method,
            message: message.message,
            stack:
                exception instanceof Error && exception.stack
                    ? exception.stack : 'No stack trace',
        });

        // formatted error response
        response.status(status).json({
            path: request.url,
            timestamp: new Date().toISOString(),
            ...message,
        });
    }
}
        /**
          Database failure handling
         
        if (exception instanceof Prisma.PrismaClientInitializationError) {
            status = HttpStatus.SERVICE_UNAVAILABLE;
            message = {
                message: 'Database is unavailabe at the moment. Please try again later.',
            };
        }*/

        /**
         * Prisma known errors handling
         
        if (exception instanceof Prisma.PrismaClientKnownRequestError) {
            const friendlyMessage = 
                PRISMA_ERRORS[exception.code as keyof typeof PRISMA_ERRORS] ||
                PRISMA_ERRORS.DEFAULT;
            
            message= { message: friendlyMessage };

            if (exception.code === 'P2002' || exception.code === 'P2025') {
                status = HttpStatus.BAD_REQUEST;
            } else {
                status = HttpStatus.INTERNAL_SERVER_ERROR;
            }
        }*/
