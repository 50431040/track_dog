import { Test, TestingModule } from "@nestjs/testing";
import { EventCustomService } from "./event-custom.service";

describe("EventCustomService", () => {
  let service: EventCustomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventCustomService],
    }).compile();

    service = module.get<EventCustomService>(EventCustomService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
