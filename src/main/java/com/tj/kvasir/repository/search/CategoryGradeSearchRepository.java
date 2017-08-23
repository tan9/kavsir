package com.tj.kvasir.repository.search;

import com.tj.kvasir.domain.CategoryGrade;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the CategoryGrade entity.
 */
public interface CategoryGradeSearchRepository extends ElasticsearchRepository<CategoryGrade, Long> {
}
