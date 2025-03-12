import { z } from "zod";
import type { StringRecord } from "@/types/StringRecord";
import type { RequestHandler } from "express";

type StrictRequestHandler<TBody = unknown> = RequestHandler<
  StringRecord,
  unknown,
  TBody
>;

type AsyncHandlerDefinition<TBody extends z.AnyZodObject> = {
  bodySchema?: TBody;
  handler: StrictRequestHandler<z.infer<TBody>>;
};

export function asyncHandler<TBody extends z.AnyZodObject>(
  fn: RequestHandler | AsyncHandlerDefinition<TBody>
): RequestHandler {
  return function (this: unknown, req, res, next): Promise<void> {
    if (typeof fn === "function") {
      return Promise.resolve(fn.call(this, req, res, next)).catch(next);
    }

    const { bodySchema, handler } = fn;

    if (bodySchema) {
      const body = bodySchema.safeParse(req.body);

      if (!body.success) {
        res.status(400).json({
          errors: body.error.errors,
        });

        return Promise.resolve();
      }

      req.body = body.data;
    }

    return Promise.resolve(handler.call(this, req, res, next)).catch(next);
  };
}
