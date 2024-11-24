import { Test, TestingModule } from "@nestjs/testing";
import { WebUserService } from "./web-user.service";

describe("WebUserService", () => {
  let service: WebUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WebUserService],
    }).compile();

    service = module.get<WebUserService>(WebUserService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
