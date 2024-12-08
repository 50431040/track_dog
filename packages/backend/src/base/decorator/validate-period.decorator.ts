import { registerDecorator, ValidationArguments } from "class-validator";

/**
 * 使用class-validator验证时间段（startTime < endTime）
 * 作用于startTime 或 endTime
 */
export function ValidatePeriod() {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: "validatePeriod",
      target: object.constructor,
      propertyName,
      options: { message: "startTime must be less than endTime" },
      validator: {
        validate(_: any, args: ValidationArguments) {
          if (args.property === "startTime" || args.property === "endTime") {
            if (
              args.object["startTime"] &&
              args.object["endTime"] &&
              new Date(args.object["startTime"]) <
                new Date(args.object["endTime"])
            ) {
              return true;
            }
          }
          return false;
        },
      },
    });
  };
}
