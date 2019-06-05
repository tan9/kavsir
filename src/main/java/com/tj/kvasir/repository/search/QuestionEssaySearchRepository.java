package com.tj.kvasir.repository.search;

import com.tj.kvasir.domain.QuestionEssay;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link QuestionEssay} entity.
 */
public interface QuestionEssaySearchRepository extends ElasticsearchRepository<QuestionEssay, Long> {
}
