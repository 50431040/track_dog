import { Test, TestingModule } from "@nestjs/testing";
import { EventRecordService } from "./event-record.service";

describe("EventRecordService", () => {
  let service: EventRecordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventRecordService],
    }).compile();

    service = module.get<EventRecordService>(EventRecordService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
