package com.tj.kvasir.repository.search;

import com.tj.kvasir.domain.CategoryNode;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the CategoryNode entity.
 */
public interface CategoryNodeSearchRepository extends ElasticsearchRepository<CategoryNode, Long> {
}
