package com.tj.kvasir.service;

import com.tj.kvasir.domain.QuestionChoice;
import com.tj.kvasir.repository.QuestionChoiceRepository;
import com.tj.kvasir.repository.search.QuestionChoiceSearchRepository;
import com.tj.kvasir.service.dto.QuestionChoiceDTO;
import com.tj.kvasir.service.mapper.QuestionChoiceMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing QuestionChoice.
 */
@Service
@Transactional
public class QuestionChoiceService {

    private final Logger log = LoggerFactory.getLogger(QuestionChoiceService.class);

    private final QuestionChoiceRepository questionChoiceRepository;

    private final QuestionChoiceMapper questionChoiceMapper;

    private final QuestionChoiceSearchRepository questionChoiceSearchRepository;

    public QuestionChoiceService(QuestionChoiceRepository questionChoiceRepository, QuestionChoiceMapper questionChoiceMapper, QuestionChoiceSearchRepository questionChoiceSearchRepository) {
        this.questionChoiceRepository = questionChoiceRepository;
        this.questionChoiceMapper = questionChoiceMapper;
        this.questionChoiceSearchRepository = questionChoiceSearchRepository;
    }

    /**
     * Save a questionChoice.
     *
     * @param questionChoiceDTO the entity to save
     * @return the persisted entity
     */
    public QuestionChoiceDTO save(QuestionChoiceDTO questionChoiceDTO) {
        log.debug("Request to save QuestionChoice : {}", questionChoiceDTO);
        QuestionChoice questionChoice = questionChoiceMapper.toEntity(questionChoiceDTO);
        questionChoice = questionChoiceRepository.save(questionChoice);
        QuestionChoiceDTO result = questionChoiceMapper.toDto(questionChoice);
        questionChoiceSearchRepository.save(questionChoice);
        return result;
    }

    /**
     *  Get all the questionChoices.
     *
     *  @param pageable the pagination information
     *  @return the list of entities
     */
    @Transactional(readOnly = true)
    public Page<QuestionChoiceDTO> findAll(Pageable pageable) {
        log.debug("Request to get all QuestionChoices");
        return questionChoiceRepository.findAll(pageable)
            .map(questionChoiceMapper::toDto);
    }

    /**
     *  Get one questionChoice by id.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    @Transactional(readOnly = true)
    public QuestionChoiceDTO findOne(Long id) {
        log.debug("Request to get QuestionChoice : {}", id);
        QuestionChoice questionChoice = questionChoiceRepository.findOneWithEagerRelationships(id);
        return questionChoiceMapper.toDto(questionChoice);
    }

    /**
     *  Delete the  questionChoice by id.
     *
     *  @param id the id of the entity
     */
    public void delete(Long id) {
        log.debug("Request to delete QuestionChoice : {}", id);
        questionChoiceRepository.delete(id);
        questionChoiceSearchRepository.delete(id);
    }

    /**
     * Search for the questionChoice corresponding to the query.
     *
     *  @param query the query of the search
     *  @param pageable the pagination information
     *  @return the list of entities
     */
    @Transactional(readOnly = true)
    public Page<QuestionChoiceDTO> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of QuestionChoices for query {}", query);
        Page<QuestionChoice> result = questionChoiceSearchRepository.search(queryStringQuery(query), pageable);
        return result.map(questionChoiceMapper::toDto);
    }
}
