package com.tj.kvasir.repository.search;

import com.tj.kvasir.domain.ResourceImage;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link ResourceImage} entity.
 */
public interface ResourceImageSearchRepository extends ElasticsearchRepository<ResourceImage, Long> {
}
