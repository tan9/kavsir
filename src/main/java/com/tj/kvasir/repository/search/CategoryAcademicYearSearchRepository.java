package com.tj.kvasir.repository.search;

import com.tj.kvasir.domain.CategoryAcademicYear;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link CategoryAcademicYear} entity.
 */
public interface CategoryAcademicYearSearchRepository extends ElasticsearchRepository<CategoryAcademicYear, Long> {
}
