package com.tj.kvasir.repository.search;

import com.tj.kvasir.domain.CategorySource;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the CategorySource entity.
 */
public interface CategorySourceSearchRepository extends ElasticsearchRepository<CategorySource, Long> {
}
