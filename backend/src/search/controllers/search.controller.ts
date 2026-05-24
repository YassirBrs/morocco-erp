import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from '../services/search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  businessSearch(@Query() query: { q?: string; types?: string; limit?: string }) {
    return this.searchService.businessSearch(query);
  }
}
