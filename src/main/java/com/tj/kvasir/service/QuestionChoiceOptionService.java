package com.tj.kvasir.service;

import com.tj.kvasir.domain.QuestionChoiceOption;
import com.tj.kvasir.repository.QuestionChoiceOptionRepository;
import com.tj.kvasir.repository.search.QuestionChoiceOptionSearchRepository;
import com.tj.kvasir.service.dto.QuestionChoiceOptionDTO;
import com.tj.kvasir.service.mapper.QuestionChoiceOptionMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import java.util.List;
import java.util.stream.Collectors;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing {@link QuestionChoiceOption}.
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
     * @param questionChoiceOptionDTO the entity to save.
     * @return the persisted entity.
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
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<QuestionChoiceOptionDTO> findAll(Pageable pageable) {
        log.debug("Request to get all QuestionChoiceOptions");
        return questionChoiceOptionRepository.findAll(pageable)
            .map(questionChoiceOptionMapper::toDto);
    }

    /**
     * Get all the questionChoiceOptions with eager load of many-to-many relationships.
     *
     * @return the list of entities.
     */
    public Page<QuestionChoiceOptionDTO> findAllWithEagerRelationships(Pageable pageable) {
        return questionChoiceOptionRepository.findAllWithEagerRelationships(pageable).map(questionChoiceOptionMapper::toDto);
    }


    /**
     * Get all the questionChoiceOptions by question choice.
     *
     * @param questionChoiceId the id of question choice
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public Page<QuestionChoiceOptionDTO> findAllByQuestionChoice(Long questionChoiceId) {
        log.debug("Request to get all QuestionChoiceOptions by questionChoiceId : {}", questionChoiceId);
        List<QuestionChoiceOptionDTO> questionOptions = questionChoiceOptionRepository.findAllByQuestionChoice(questionChoiceId)
            .stream().map(questionChoiceOptionMapper::toDto).collect(Collectors.toList());
        Page<QuestionChoiceOptionDTO> page = new PageImpl<>(questionOptions);
        return page;
    }

    /**
     * Get one questionChoiceOption by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<QuestionChoiceOptionDTO> findOne(Long id) {
        log.debug("Request to get QuestionChoiceOption : {}", id);
        return questionChoiceOptionRepository.findOneWithEagerRelationships(id)
            .map(questionChoiceOptionMapper::toDto);
    }

    /**
     * Delete the questionChoiceOption by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete QuestionChoiceOption : {}", id);
        questionChoiceOptionRepository.deleteById(id);
        questionChoiceOptionSearchRepository.deleteById(id);
    }

    /**
     * Search for the questionChoiceOption corresponding to the query.
     *
     * @param query the query of the search.
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<QuestionChoiceOptionDTO> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of QuestionChoiceOptions for query {}", query);
        return questionChoiceOptionSearchRepository.search(queryStringQuery(query), pageable)
            .map(questionChoiceOptionMapper::toDto);
    }
}
