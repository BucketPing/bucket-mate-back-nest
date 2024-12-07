import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  search(searchTerm: string) {
    return searchTerm;
  }
}
