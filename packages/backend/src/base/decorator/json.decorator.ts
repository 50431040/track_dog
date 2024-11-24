import { applyDecorators } from "@nestjs/common";
import { Schema as MongooseSchema, SchemaOptions } from "@nestjs/mongoose";

function commonToJSONTransform(doc: any, ret: any) {
  ret.id = doc._id;
  delete ret._id;
  delete ret.__v;
  return ret;
}

export function ToJSONSchema(options?: SchemaOptions) {
  return applyDecorators(
    MongooseSchema({
      toJSON: {
        transform: commonToJSONTransform,
      },
      ...options,
    }),
  );
}
