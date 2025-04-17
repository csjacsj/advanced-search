import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  search(params: any): any {
    // Example: Process the search parameters
    return { result: `Search results for: ${JSON.stringify(params)}` };
  }
}
