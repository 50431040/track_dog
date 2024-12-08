import { Test, TestingModule } from "@nestjs/testing";
import { WebNormalEventController } from "./web-normal-event.controller";

describe("WebNormalEventController", () => {
  let controller: WebNormalEventController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WebNormalEventController],
    }).compile();

    controller = module.get<WebNormalEventController>(WebNormalEventController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
