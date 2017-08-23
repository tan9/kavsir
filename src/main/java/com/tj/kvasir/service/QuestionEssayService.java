package com.tj.kvasir.service;

import com.tj.kvasir.domain.QuestionEssay;
import com.tj.kvasir.repository.QuestionEssayRepository;
import com.tj.kvasir.repository.search.QuestionEssaySearchRepository;
import com.tj.kvasir.service.dto.QuestionEssayDTO;
import com.tj.kvasir.service.mapper.QuestionEssayMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing QuestionEssay.
 */
@Service
@Transactional
public class QuestionEssayService {

    private final Logger log = LoggerFactory.getLogger(QuestionEssayService.class);

    private final QuestionEssayRepository questionEssayRepository;

    private final QuestionEssayMapper questionEssayMapper;

    private final QuestionEssaySearchRepository questionEssaySearchRepository;
    public QuestionEssayService(QuestionEssayRepository questionEssayRepository, QuestionEssayMapper questionEssayMapper, QuestionEssaySearchRepository questionEssaySearchRepository) {
        this.questionEssayRepository = questionEssayRepository;
        this.questionEssayMapper = questionEssayMapper;
        this.questionEssaySearchRepository = questionEssaySearchRepository;
    }

    /**
     * Save a questionEssay.
     *
     * @param questionEssayDTO the entity to save
     * @return the persisted entity
     */
    public QuestionEssayDTO save(QuestionEssayDTO questionEssayDTO) {
        log.debug("Request to save QuestionEssay : {}", questionEssayDTO);
        QuestionEssay questionEssay = questionEssayMapper.toEntity(questionEssayDTO);
        questionEssay = questionEssayRepository.save(questionEssay);
        QuestionEssayDTO result = questionEssayMapper.toDto(questionEssay);
        questionEssaySearchRepository.save(questionEssay);
        return result;
    }

    /**
     *  Get all the questionEssays.
     *
     *  @param pageable the pagination information
     *  @return the list of entities
     */
    @Transactional(readOnly = true)
    public Page<QuestionEssayDTO> findAll(Pageable pageable) {
        log.debug("Request to get all QuestionEssays");
        return questionEssayRepository.findAll(pageable)
            .map(questionEssayMapper::toDto);
    }

    /**
     *  Get one questionEssay by id.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    @Transactional(readOnly = true)
    public QuestionEssayDTO findOne(Long id) {
        log.debug("Request to get QuestionEssay : {}", id);
        QuestionEssay questionEssay = questionEssayRepository.findOneWithEagerRelationships(id);
        return questionEssayMapper.toDto(questionEssay);
    }

    /**
     *  Delete the  questionEssay by id.
     *
     *  @param id the id of the entity
     */
    public void delete(Long id) {
        log.debug("Request to delete QuestionEssay : {}", id);
        questionEssayRepository.delete(id);
        questionEssaySearchRepository.delete(id);
    }

    /**
     * Search for the questionEssay corresponding to the query.
     *
     *  @param query the query of the search
     *  @param pageable the pagination information
     *  @return the list of entities
     */
    @Transactional(readOnly = true)
    public Page<QuestionEssayDTO> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of QuestionEssays for query {}", query);
        Page<QuestionEssay> result = questionEssaySearchRepository.search(queryStringQuery(query), pageable);
        return result.map(questionEssayMapper::toDto);
    }
}
