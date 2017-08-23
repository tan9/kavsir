package com.tj.kvasir.repository.search;

import com.tj.kvasir.domain.CategoryPublisher;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the CategoryPublisher entity.
 */
public interface CategoryPublisherSearchRepository extends ElasticsearchRepository<CategoryPublisher, Long> {
}
