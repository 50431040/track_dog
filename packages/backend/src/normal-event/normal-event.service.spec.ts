import { Test, TestingModule } from "@nestjs/testing";
import { NormalEventService } from "./normal-event.service";

describe("ClickEventService", () => {
  let service: NormalEventService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NormalEventService],
    }).compile();

    service = module.get<NormalEventService>(NormalEventService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
