import { ArgumentsHost, Catch, HttpStatus, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response } from 'express';
import { MongooseError } from 'mongoose';

@Catch(MongooseError)
export class MongooseExceptionFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(MongooseExceptionFilter.name);

  catch(exception: MongooseError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status;
    switch (exception.name) {
      case 'DocumentNotFoundError': {
        status = HttpStatus.NOT_FOUND;
        response.status(status).json({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Not Found',
        });

        break;
      }
      case 'CastError':
      case 'DisconnectedError':
      case 'DivergentArrayError':
      case 'MissingSchemaError':
      case 'ValidatorError':
      case 'ValidationError':
      case 'ObjectExpectedError':
      case 'ObjectParameterError':
      case 'OverwriteModelError':
      case 'ParallelSaveError':
      case 'StrictModeError':
      case 'VersionError':
      case 'MongooseError':
      default: {
        super.catch(exception, host);

        break;
      }
    }
  }
}
