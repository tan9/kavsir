package com.tj.kvasir.service;

import com.tj.kvasir.domain.QuestionTrueFalse;
import com.tj.kvasir.repository.QuestionTrueFalseRepository;
import com.tj.kvasir.repository.search.QuestionTrueFalseSearchRepository;
import com.tj.kvasir.service.dto.QuestionTrueFalseDTO;
import com.tj.kvasir.service.mapper.QuestionTrueFalseMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing QuestionTrueFalse.
 */
@Service
@Transactional
public class QuestionTrueFalseService {

    private final Logger log = LoggerFactory.getLogger(QuestionTrueFalseService.class);

    private final QuestionTrueFalseRepository questionTrueFalseRepository;

    private final QuestionTrueFalseMapper questionTrueFalseMapper;

    private final QuestionTrueFalseSearchRepository questionTrueFalseSearchRepository;
    public QuestionTrueFalseService(QuestionTrueFalseRepository questionTrueFalseRepository, QuestionTrueFalseMapper questionTrueFalseMapper, QuestionTrueFalseSearchRepository questionTrueFalseSearchRepository) {
        this.questionTrueFalseRepository = questionTrueFalseRepository;
        this.questionTrueFalseMapper = questionTrueFalseMapper;
        this.questionTrueFalseSearchRepository = questionTrueFalseSearchRepository;
    }

    /**
     * Save a questionTrueFalse.
     *
     * @param questionTrueFalseDTO the entity to save
     * @return the persisted entity
     */
    public QuestionTrueFalseDTO save(QuestionTrueFalseDTO questionTrueFalseDTO) {
        log.debug("Request to save QuestionTrueFalse : {}", questionTrueFalseDTO);
        QuestionTrueFalse questionTrueFalse = questionTrueFalseMapper.toEntity(questionTrueFalseDTO);
        questionTrueFalse = questionTrueFalseRepository.save(questionTrueFalse);
        QuestionTrueFalseDTO result = questionTrueFalseMapper.toDto(questionTrueFalse);
        questionTrueFalseSearchRepository.save(questionTrueFalse);
        return result;
    }

    /**
     *  Get all the questionTrueFalses.
     *
     *  @param pageable the pagination information
     *  @return the list of entities
     */
    @Transactional(readOnly = true)
    public Page<QuestionTrueFalseDTO> findAll(Pageable pageable) {
        log.debug("Request to get all QuestionTrueFalses");
        return questionTrueFalseRepository.findAll(pageable)
            .map(questionTrueFalseMapper::toDto);
    }

    /**
     *  Get one questionTrueFalse by id.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    @Transactional(readOnly = true)
    public QuestionTrueFalseDTO findOne(Long id) {
        log.debug("Request to get QuestionTrueFalse : {}", id);
        QuestionTrueFalse questionTrueFalse = questionTrueFalseRepository.findOneWithEagerRelationships(id);
        return questionTrueFalseMapper.toDto(questionTrueFalse);
    }

    /**
     *  Delete the  questionTrueFalse by id.
     *
     *  @param id the id of the entity
     */
    public void delete(Long id) {
        log.debug("Request to delete QuestionTrueFalse : {}", id);
        questionTrueFalseRepository.delete(id);
        questionTrueFalseSearchRepository.delete(id);
    }

    /**
     * Search for the questionTrueFalse corresponding to the query.
     *
     *  @param query the query of the search
     *  @param pageable the pagination information
     *  @return the list of entities
     */
    @Transactional(readOnly = true)
    public Page<QuestionTrueFalseDTO> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of QuestionTrueFalses for query {}", query);
        Page<QuestionTrueFalse> result = questionTrueFalseSearchRepository.search(queryStringQuery(query), pageable);
        return result.map(questionTrueFalseMapper::toDto);
    }
}
