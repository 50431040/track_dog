import { Test, TestingModule } from "@nestjs/testing";
import { ClickEventService } from "./click-event.service";

describe("ClickEventService", () => {
  let service: ClickEventService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClickEventService],
    }).compile();

    service = module.get<ClickEventService>(ClickEventService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
