package com.tj.kvasir.repository.search;

import com.tj.kvasir.domain.QuestionChoiceOption;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link QuestionChoiceOption} entity.
 */
public interface QuestionChoiceOptionSearchRepository extends ElasticsearchRepository<QuestionChoiceOption, Long> {
}
