import { Test, TestingModule } from "@nestjs/testing";
import { ApplicationService } from "./application.service";
import { Platform } from "@track_dog/common";
import { ApplicationRepository } from "@/schema/application.schema";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository, UpdateResult } from "typeorm";
import { ObjectId } from "mongodb";

describe("ApplicationService", () => {
  let service: ApplicationService;
  let applicationModel: Repository<ApplicationRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationService,
        {
          provide: getRepositoryToken(ApplicationRepository),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            findAndCount: jest.fn(),
          },
        },
      ],
    }).compile();

    applicationModel = module.get<Repository<ApplicationRepository>>(
      getRepositoryToken(ApplicationRepository),
    );
    service = module.get<ApplicationService>(ApplicationService);
  });

  it("should create an application", async () => {
    const application = {
      name: "Test Application",
      icon: "https://example.com/icon.png",
      platform: Platform.Flutter,
    };

    jest.spyOn(applicationModel, "create").mockImplementation((data) => {
      return {
        _id: new ObjectId(),
        ...data,
      } as ApplicationRepository;
    });
    jest.spyOn(applicationModel, "save").mockImplementation((data) => {
      return Promise.resolve(data as ApplicationRepository);
    });

    const result = await service.createApplication(application, "123");
    expect(result).toBeDefined();
    expect(result.name).toEqual(application.name);
    expect(result.platform).toEqual(application.platform);
    expect(result.icon).toEqual(application.icon);
    expect(result.id).toBeDefined();
    expect(result["creator"]).not.toBeDefined();
    expect(result["create_time"]).not.toBeDefined();
    expect(result["update_time"]).not.toBeDefined();
  });

  it("should update an application", async () => {
    const application = {
      _id: new ObjectId().toString(),
      name: "Test Application",
      icon: "https://example.com/icon.png",
      platform: Platform.Flutter,
    };
    jest.spyOn(applicationModel, "update").mockImplementation(() => {
      return Promise.resolve({
        affected: 1,
      } as UpdateResult);
    });
    const result = await service.updateApplication(application);
    expect(result).toBe(true);
  });

  it("should return false when updating an application fails", async () => {
    const application = {
      _id: new ObjectId().toString(),
      name: "Test Application",
      icon: "https://example.com/icon.png",
      platform: Platform.Flutter,
    };
    jest.spyOn(applicationModel, "update").mockImplementation(() => {
      return Promise.resolve({
        affected: 0,
      } as UpdateResult);
    });
    const result = await service.updateApplication(application);
    expect(result).toBe(false);
  });

  it("should return application list", async () => {
    const data = [
      {
        _id: "123",
        name: "Test Application",
      },
    ] as unknown as ApplicationRepository[];
    jest.spyOn(applicationModel, "findAndCount").mockImplementation(() => {
      return Promise.resolve([data, data.length]);
    });
    const result = await service.queryApplicationList("123", {
      keyword: "test",
      page: 1,
      pageSize: 10,
    });
    expect(result).toBeDefined();
    expect(result[0]).toEqual(data);
    expect(result[1]).toBe(data.length);
  });
});
