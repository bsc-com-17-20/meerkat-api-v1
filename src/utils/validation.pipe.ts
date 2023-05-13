import { BadRequestException, Logger, PipeTransform } from '@nestjs/common';
import { ObjectSchema } from 'joi';

export class JoiValidatorPipe implements PipeTransform {
  logger = new Logger(JoiValidatorPipe.name);
  constructor(private schema: ObjectSchema) {}
  public transform(value: any) {
    this.logger.log({ ...value });
    const result = this.schema.validate(value);
    if (result.error) {
      const errorMessages = result.error.details.map((d) => d.message).join();
      throw new BadRequestException(errorMessages);
    }
    return value;
  }
}
