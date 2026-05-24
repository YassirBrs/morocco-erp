import { Injectable } from '@nestjs/common';
import { BusinessSearchType } from '../../common/erp/erp.types';
import { ErpStoreService } from '../../common/erp/erp-store.service';

@Injectable()
export class SearchService {
  constructor(private readonly store: ErpStoreService) {}

  businessSearch(query: { q?: string; types?: string; limit?: string | number }) {
    const types = query.types
      ? query.types.split(',').map((type) => type.trim()).filter(Boolean) as BusinessSearchType[]
      : undefined;
    return this.store.businessSearch({
      q: query.q ?? '',
      types,
      limit: Number(query.limit ?? 10),
    });
  }
}
