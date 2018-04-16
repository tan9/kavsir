package com.tj.kvasir.service;

import com.tj.kvasir.domain.QuestionChoiceOption;
import com.tj.kvasir.repository.QuestionChoiceOptionRepository;
import com.tj.kvasir.repository.search.QuestionChoiceOptionSearchRepository;
import com.tj.kvasir.service.dto.QuestionChoiceOptionDTO;
import com.tj.kvasir.service.mapper.QuestionChoiceOptionMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing QuestionChoiceOption.
 */
@Service
@Transactional
public class QuestionChoiceOptionService {

    private final Logger log = LoggerFactory.getLogger(QuestionChoiceOptionService.class);

    private final QuestionChoiceOptionRepository questionChoiceOptionRepository;

    private final QuestionChoiceOptionMapper questionChoiceOptionMapper;

    private final QuestionChoiceOptionSearchRepository questionChoiceOptionSearchRepository;

    public QuestionChoiceOptionService(QuestionChoiceOptionRepository questionChoiceOptionRepository, QuestionChoiceOptionMapper questionChoiceOptionMapper, QuestionChoiceOptionSearchRepository questionChoiceOptionSearchRepository) {
        this.questionChoiceOptionRepository = questionChoiceOptionRepository;
        this.questionChoiceOptionMapper = questionChoiceOptionMapper;
        this.questionChoiceOptionSearchRepository = questionChoiceOptionSearchRepository;
    }

    /**
     * Save a questionChoiceOption.
     *
     * @param questionChoiceOptionDTO the entity to save
     * @return the persisted entity
     */
    public QuestionChoiceOptionDTO save(QuestionChoiceOptionDTO questionChoiceOptionDTO) {
        log.debug("Request to save QuestionChoiceOption : {}", questionChoiceOptionDTO);
        QuestionChoiceOption questionChoiceOption = questionChoiceOptionMapper.toEntity(questionChoiceOptionDTO);
        questionChoiceOption = questionChoiceOptionRepository.save(questionChoiceOption);
        QuestionChoiceOptionDTO result = questionChoiceOptionMapper.toDto(questionChoiceOption);
        questionChoiceOptionSearchRepository.save(questionChoiceOption);
        return result;
    }

    /**
     * Get all the questionChoiceOptions.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public Page<QuestionChoiceOptionDTO> findAll(Pageable pageable) {
        log.debug("Request to get all QuestionChoiceOptions");
        return questionChoiceOptionRepository.findAll(pageable)
            .map(questionChoiceOptionMapper::toDto);
    }

    /**
     * Get one questionChoiceOption by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Transactional(readOnly = true)
    public QuestionChoiceOptionDTO findOne(Long id) {
        log.debug("Request to get QuestionChoiceOption : {}", id);
        QuestionChoiceOption questionChoiceOption = questionChoiceOptionRepository.findOneWithEagerRelationships(id);
        return questionChoiceOptionMapper.toDto(questionChoiceOption);
    }

    /**
     * Delete the questionChoiceOption by id.
     *
     * @param id the id of the entity
     */
    public void delete(Long id) {
        log.debug("Request to delete QuestionChoiceOption : {}", id);
        questionChoiceOptionRepository.delete(id);
        questionChoiceOptionSearchRepository.delete(id);
    }

    /**
     * Search for the questionChoiceOption corresponding to the query.
     *
     * @param query the query of the search
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public Page<QuestionChoiceOptionDTO> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of QuestionChoiceOptions for query {}", query);
        Page<QuestionChoiceOption> result = questionChoiceOptionSearchRepository.search(queryStringQuery(query), pageable);
        return result.map(questionChoiceOptionMapper::toDto);
    }
}
