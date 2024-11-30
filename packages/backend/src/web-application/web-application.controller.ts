import { ApplicationService } from "@/application/application.service";
import { CreateApplicationDto } from "@/application/dto/create.dto";
import { GetApplicationListDto } from "@/application/dto/get-list.dto";
import { Body, Controller, Get, Post, Query, Req } from "@nestjs/common";

@Controller("web/application")
export class WebApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  // 创建应用
  @Post()
  async createApplication(@Req() req, @Body() body: CreateApplicationDto) {
    return await this.applicationService.createApplication(body, req.user.id);
  }

  // 获取应用列表
  @Get()
  async getApplicationList(@Req() req, @Query() query: GetApplicationListDto) {
    const queryResult = await this.applicationService.queryApplicationList(
      req.user.id,
      query,
    );
    return {
      list: queryResult[0],
      total: queryResult[1],
    };
  }
}
