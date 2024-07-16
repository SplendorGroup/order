import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { RpcException } from '@nestjs/microservices';
import { addPeriodIfMissing } from '@/infraestructure/helpers/add-period-if-missing';

export const ValidateGrpcInput = (
  dtos: {
    params?: any;
    query?: any;
    body?: any;
    user?: any;
  },
  error?: {
    code: number;
    identify: string;
  },
) => {
  return (
    _target: any,
    _key: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const context = args[2];
      const request = context.request;

      await validateRequestData(dtos, request, error);

      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
};

async function validateRequestData(
  dtos: {
    params?: any;
    query?: any;
    body?: any;
    user?: any;
  },
  request: any,
  error?: {
    code: number;
    identify: string;
  },
) {
  const validationPromises = [
    { key: 'params', dto: dtos?.params },
    { key: 'query', dto: dtos?.query },
    { key: 'body', dto: dtos?.body },
    { key: 'user', dto: dtos?.user },
  ].map(async ({ key, dto }: { key: string; dto: any }) => {
    if (!dto) return Promise.resolve();

    console.log(dto, request)

    const instance = plainToInstance(dto, request[key]) as object;
    if (!(instance instanceof dto)) {
      throw new RpcException({
        code: 422,
        details: JSON.stringify({
          name: 'Unprocessable Content',
          identify: error?.identify,
          status: 422,
          message: `Validation error: ${key} is not an instance of the expected class`,
        }),
      });
    }

    const errors = await validate(instance);
    if (errors.length > 0) {
      throwValidationError(errors, error);
    }
  });

  await Promise.all(validationPromises);
}

function throwValidationError(
  errors: any[],
  error: {
    code: number;
    identify: string;
  },
) {
  throw new RpcException({
    code: error?.code,
    details: JSON.stringify({
      name: 'Unprocessable Content',
      identify: error?.identify,
      status: 422,
      message: extractDescriptionsInErrors(errors),
    }),
  });
}

function extractDescriptionsInErrors(errors: any[]) {
  const descriptions = errors.flatMap(({ constraints }) => {
    return Object.values(constraints);
  });

  const description = descriptions.join(', ');

  return addPeriodIfMissing(description);
}
