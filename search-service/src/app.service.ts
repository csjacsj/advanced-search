import { Injectable } from '@nestjs/common';
import { search, SearchParams, ResultRecord } from './asearch';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async search(
    params: SearchParams,
  ): Promise<{ result_record_list: ResultRecord[] }> {
    const { result_record_list } = await search(params);
    return { result_record_list };
  }
}
