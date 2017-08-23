package com.tj.kvasir.repository.search;

import com.tj.kvasir.domain.CategorySemester;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the CategorySemester entity.
 */
public interface CategorySemesterSearchRepository extends ElasticsearchRepository<CategorySemester, Long> {
}
