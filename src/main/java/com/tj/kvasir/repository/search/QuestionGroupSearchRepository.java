package com.tj.kvasir.repository.search;

import com.tj.kvasir.domain.QuestionGroup;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link QuestionGroup} entity.
 */
public interface QuestionGroupSearchRepository extends ElasticsearchRepository<QuestionGroup, Long> {
}
