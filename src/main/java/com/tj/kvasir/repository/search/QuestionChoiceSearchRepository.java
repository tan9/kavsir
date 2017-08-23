package com.tj.kvasir.repository.search;

import com.tj.kvasir.domain.QuestionChoice;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the QuestionChoice entity.
 */
public interface QuestionChoiceSearchRepository extends ElasticsearchRepository<QuestionChoice, Long> {
}
