package com.tj.kvasir.repository.search;

import com.tj.kvasir.domain.CategorySubject;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link CategorySubject} entity.
 */
public interface CategorySubjectSearchRepository extends ElasticsearchRepository<CategorySubject, Long> {
}
