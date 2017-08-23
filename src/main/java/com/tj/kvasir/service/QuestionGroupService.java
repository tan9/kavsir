package com.tj.kvasir.service;

import com.tj.kvasir.domain.QuestionGroup;
import com.tj.kvasir.repository.QuestionGroupRepository;
import com.tj.kvasir.repository.search.QuestionGroupSearchRepository;
import com.tj.kvasir.service.dto.QuestionGroupDTO;
import com.tj.kvasir.service.mapper.QuestionGroupMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing QuestionGroup.
 */
@Service
@Transactional
public class QuestionGroupService {

    private final Logger log = LoggerFactory.getLogger(QuestionGroupService.class);

    private final QuestionGroupRepository questionGroupRepository;

    private final QuestionGroupMapper questionGroupMapper;

    private final QuestionGroupSearchRepository questionGroupSearchRepository;
    public QuestionGroupService(QuestionGroupRepository questionGroupRepository, QuestionGroupMapper questionGroupMapper, QuestionGroupSearchRepository questionGroupSearchRepository) {
        this.questionGroupRepository = questionGroupRepository;
        this.questionGroupMapper = questionGroupMapper;
        this.questionGroupSearchRepository = questionGroupSearchRepository;
    }

    /**
     * Save a questionGroup.
     *
     * @param questionGroupDTO the entity to save
     * @return the persisted entity
     */
    public QuestionGroupDTO save(QuestionGroupDTO questionGroupDTO) {
        log.debug("Request to save QuestionGroup : {}", questionGroupDTO);
        QuestionGroup questionGroup = questionGroupMapper.toEntity(questionGroupDTO);
        questionGroup = questionGroupRepository.save(questionGroup);
        QuestionGroupDTO result = questionGroupMapper.toDto(questionGroup);
        questionGroupSearchRepository.save(questionGroup);
        return result;
    }

    /**
     *  Get all the questionGroups.
     *
     *  @param pageable the pagination information
     *  @return the list of entities
     */
    @Transactional(readOnly = true)
    public Page<QuestionGroupDTO> findAll(Pageable pageable) {
        log.debug("Request to get all QuestionGroups");
        return questionGroupRepository.findAll(pageable)
            .map(questionGroupMapper::toDto);
    }

    /**
     *  Get one questionGroup by id.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    @Transactional(readOnly = true)
    public QuestionGroupDTO findOne(Long id) {
        log.debug("Request to get QuestionGroup : {}", id);
        QuestionGroup questionGroup = questionGroupRepository.findOneWithEagerRelationships(id);
        return questionGroupMapper.toDto(questionGroup);
    }

    /**
     *  Delete the  questionGroup by id.
     *
     *  @param id the id of the entity
     */
    public void delete(Long id) {
        log.debug("Request to delete QuestionGroup : {}", id);
        questionGroupRepository.delete(id);
        questionGroupSearchRepository.delete(id);
    }

    /**
     * Search for the questionGroup corresponding to the query.
     *
     *  @param query the query of the search
     *  @param pageable the pagination information
     *  @return the list of entities
     */
    @Transactional(readOnly = true)
    public Page<QuestionGroupDTO> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of QuestionGroups for query {}", query);
        Page<QuestionGroup> result = questionGroupSearchRepository.search(queryStringQuery(query), pageable);
        return result.map(questionGroupMapper::toDto);
    }
}
