package com.tj.kvasir.repository.search;

import com.tj.kvasir.domain.QuestionTrueFalse;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the QuestionTrueFalse entity.
 */
public interface QuestionTrueFalseSearchRepository extends ElasticsearchRepository<QuestionTrueFalse, Long> {
}
