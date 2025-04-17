import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { SearchParams, ResultRecord } from './asearch';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('search')
  async search(@Body() params: SearchParams): Promise<{
    code: number;
    result_record_list: ResultRecord[];
  }> {
    try {
      const { result_record_list } = await this.appService.search(params);
      return {
        code: 0,
        result_record_list,
      };
    } catch (error) {
      console.log(error);
      return {
        code: 2,
        result_record_list: [],
      };
    }
  }
}
