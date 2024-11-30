import { WebUserRepository } from "@/schema/web-user.schema";
import { TestingModule, Test } from "@nestjs/testing";
import { InsertResult, Repository } from "typeorm";
import { WebUserService } from "./web-user.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import md5 from "md5";

describe("WebUserService", () => {
  let service: WebUserService;
  let webUserRepository: Repository<WebUserRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WebUserService,
        {
          provide: getRepositoryToken(WebUserRepository),
          useValue: {
            create: jest.fn(),
            insert: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    webUserRepository = module.get<Repository<WebUserRepository>>(
      getRepositoryToken(WebUserRepository),
    );
    service = module.get<WebUserService>(WebUserService);
  });

  it("get admin account", async () => {
    const result = await service.getAdminAccount();
    jest.spyOn(webUserRepository, "findOne").mockResolvedValue(undefined);
    expect(result).not.toBeDefined();
  });

  it("create admin account successfully", async () => {
    jest.spyOn(webUserRepository, "create").mockImplementation((data) => {
      return {
        ...data,
      } as WebUserRepository;
    });
    jest.spyOn(webUserRepository, "insert").mockResolvedValue({
      raw: [],
      generatedMaps: [],
    } as InsertResult);
    const result = await service.createAdminAccount({
      name: "test",
      password: md5("test"),
      email: "test@test.com",
    });
    expect(result).toBe(true);
  });

  it("create admin account failed", async () => {
    jest.spyOn(webUserRepository, "create").mockImplementation((data) => {
      return {
        ...data,
      } as WebUserRepository;
    });
    jest
      .spyOn(webUserRepository, "insert")
      .mockRejectedValue(new Error("test"));
    await expect(
      service.createAdminAccount({
        name: "test",
        password: md5("test"),
        email: "test@test.com",
      }),
    ).rejects.toThrow("test");
  });

  it("login successfully", async () => {
    const user = {
      id: 1,
      name: "test",
      email: "test@test.com",
      isAdmin: true,
    };
    jest
      .spyOn(webUserRepository, "findOne")
      .mockResolvedValue(user as unknown as WebUserRepository);
    const result = await service.login({
      name: "test",
      password: md5("test"),
    });
    expect(result).toEqual(user);
  });
});
