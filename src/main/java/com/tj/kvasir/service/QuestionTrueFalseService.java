package com.tj.kvasir.service;

import com.tj.kvasir.domain.QuestionTrueFalse;
import com.tj.kvasir.domain.ResourceImage;
import com.tj.kvasir.repository.QuestionTrueFalseRepository;
import com.tj.kvasir.repository.ResourceImageRepository;
import com.tj.kvasir.repository.search.QuestionTrueFalseSearchRepository;
import com.tj.kvasir.service.dto.QuestionTrueFalseDTO;
import com.tj.kvasir.service.mapper.QuestionTrueFalseMapper;
import com.tj.kvasir.web.rest.ResourceHelper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.core.query.NativeSearchQueryBuilder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.Set;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

/**
 * Service Implementation for managing {@link QuestionTrueFalse}.
 */
@Service
@Transactional
public class QuestionTrueFalseService {

    private final Logger log = LoggerFactory.getLogger(QuestionTrueFalseService.class);

    private final QuestionTrueFalseRepository questionTrueFalseRepository;

    private final QuestionTrueFalseMapper questionTrueFalseMapper;

    private final QuestionTrueFalseSearchRepository questionTrueFalseSearchRepository;

    private final ResourceImageRepository resourceImageRepository;

    private final ResourceHelper resourceHelper;

    public QuestionTrueFalseService(QuestionTrueFalseRepository questionTrueFalseRepository, QuestionTrueFalseMapper questionTrueFalseMapper, QuestionTrueFalseSearchRepository questionTrueFalseSearchRepository,
                                    ResourceImageRepository resourceImageRepository, ResourceHelper resourceHelper) {
        this.questionTrueFalseRepository = questionTrueFalseRepository;
        this.questionTrueFalseMapper = questionTrueFalseMapper;
        this.questionTrueFalseSearchRepository = questionTrueFalseSearchRepository;
        this.resourceImageRepository = resourceImageRepository;
        this.resourceHelper = resourceHelper;
    }

    /**
     * Save a questionTrueFalse.
     *
     * @param questionTrueFalseDTO the entity to save.
     * @return the persisted entity.
     */
    public QuestionTrueFalseDTO save(QuestionTrueFalseDTO questionTrueFalseDTO) {
        log.debug("Request to save QuestionTrueFalse : {}", questionTrueFalseDTO);
        QuestionTrueFalse questionTrueFalse = questionTrueFalseMapper.toEntity(questionTrueFalseDTO);
        // TODO clarify & cleanup
        if (questionTrueFalse.getId() != null) {
            for (ResourceImage image : questionTrueFalse.getImages()) {
                image.setId(resourceImageRepository.save(image).getId());
                // TODO remove image
            }
            questionTrueFalse = questionTrueFalseRepository.save(questionTrueFalse);
        } else {
            questionTrueFalse = questionTrueFalseRepository.save(questionTrueFalse);
            for (ResourceImage image : questionTrueFalse.getImages()) {
                image.setId(resourceImageRepository.save(image).getId());
                // TODO remove image
            }
        }
        QuestionTrueFalseDTO result = questionTrueFalseMapper.toDto(questionTrueFalse);
        questionTrueFalseSearchRepository.save(questionTrueFalse);
        return result;
    }

    /**
     * Get all the questionTrueFalses.
     *
     * @param categories limiting result in categories
     *  @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<QuestionTrueFalseDTO> findAll(Optional<Set<Long>> categories, Pageable pageable) {
        log.debug("Request to get all QuestionTrueFalses in categories {}", categories);
        Page<QuestionTrueFalse> page;
        if (categories.isPresent()) {
            Set<Long> targetCategories = resourceHelper.includeChildren(categories.get());
            page = questionTrueFalseRepository.findAllByCategories(targetCategories, pageable);
        } else {
            page = questionTrueFalseRepository.findAll(pageable);
        }
        return page.map(questionTrueFalseMapper::toDto);
    }

    /**
     * Get all the questionTrueFalses with eager load of many-to-many relationships.
     *
     * @return the list of entities.
     */
    public Page<QuestionTrueFalseDTO> findAllWithEagerRelationships(Pageable pageable) {
        return questionTrueFalseRepository.findAllWithEagerRelationships(pageable).map(questionTrueFalseMapper::toDto);
    }


    /**
     * Get one questionTrueFalse by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<QuestionTrueFalseDTO> findOne(Long id) {
        log.debug("Request to get QuestionTrueFalse : {}", id);
        return questionTrueFalseRepository.findOneWithEagerRelationships(id)
            .map(questionTrueFalseMapper::toDto);
    }

    /**
     * Delete the questionTrueFalse by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete QuestionTrueFalse : {}", id);
        questionTrueFalseRepository.deleteById(id);
        questionTrueFalseSearchRepository.deleteById(id);
    }

    /**
     * Search for the questionTrueFalse corresponding to the query.
     *
     * @param query the query of the search.
     * @param categories  limiting result in category
     *  @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<QuestionTrueFalseDTO> search(String query, Optional<Set<Long>> categories, Pageable pageable) {
        log.debug("Request to search for a page of QuestionTrueFalses for query {} in categories {}", query, categories);
        NativeSearchQueryBuilder builder = new NativeSearchQueryBuilder()
            .withQuery(queryStringQuery(query))
            .withPageable(pageable);
        if (categories.isPresent()) {
            builder.withFilter(resourceHelper.asCategoriesFilter(categories.get()));
        }
        return questionTrueFalseSearchRepository.search(builder.build())
            .map(questionTrueFalseMapper::toDto);
    }
}
