/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from 'zod';

import { storage } from './storage';
import { MicroserviceMethodConfig, PartialBy } from '../types';
import { camelCase } from '../utils';

export type MethodDecoratorOptions<T, R> =
  { name?: string } &
  PartialBy<Omit<MicroserviceMethodConfig<R, T>, 'handler'>, 'subject' | 'metadata'>;

export function method<
  T extends z.ZodType<any, any, any>,
  R extends z.ZodType<any, any, any> = z.ZodVoid,
>(options?: MethodDecoratorOptions<z.infer<T>, z.infer<R>>) {

  return (
    target: unknown,
    key: string | symbol,
    descriptor: TypedPropertyDescriptor<((test: string, ...args: unknown[]) => any)>,
  ): TypedPropertyDescriptor<((args: z.infer<T>) => Promise<z.infer<R>>)> | void => {

    const name = options?.name ?? camelCase(String(key));

    const ms = storage.ensureAdded(target);

    ms.config.methods[name] = {
      handler: descriptor.value,
      subject: options?.subject,
      request: options?.request ?? z.any(),
      response: options?.response ?? z.void(),
    };

    return descriptor;
  };
}