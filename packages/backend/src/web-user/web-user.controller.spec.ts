import { Test, TestingModule } from "@nestjs/testing";
import { WebUserController } from "./web-user.controller";

describe("WebUserController", () => {
  let controller: WebUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WebUserController],
    }).compile();

    controller = module.get<WebUserController>(WebUserController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
