package com.tj.kvasir.service;

import com.tj.kvasir.domain.QuestionEssay;
import com.tj.kvasir.domain.ResourceImage;
import com.tj.kvasir.repository.QuestionEssayRepository;
import com.tj.kvasir.repository.ResourceImageRepository;
import com.tj.kvasir.repository.search.QuestionEssaySearchRepository;
import com.tj.kvasir.service.dto.QuestionEssayDTO;
import com.tj.kvasir.service.mapper.QuestionEssayMapper;
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
 * Service Implementation for managing QuestionEssay.
 */
@Service
@Transactional
public class QuestionEssayService {

    private final Logger log = LoggerFactory.getLogger(QuestionEssayService.class);

    private final QuestionEssayRepository questionEssayRepository;

    private final QuestionEssayMapper questionEssayMapper;

    private final QuestionEssaySearchRepository questionEssaySearchRepository;

    private final ResourceImageRepository resourceImageRepository;

    private final ResourceHelper resourceHelper;

    public QuestionEssayService(QuestionEssayRepository questionEssayRepository, QuestionEssayMapper questionEssayMapper, QuestionEssaySearchRepository questionEssaySearchRepository,
                                ResourceImageRepository resourceImageRepository, ResourceHelper resourceHelper) {
        this.questionEssayRepository = questionEssayRepository;
        this.questionEssayMapper = questionEssayMapper;
        this.questionEssaySearchRepository = questionEssaySearchRepository;
        this.resourceImageRepository = resourceImageRepository;
        this.resourceHelper = resourceHelper;
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
        // TODO clarify & cleanup
        if (questionEssay.getId() != null) {
            for (ResourceImage image : questionEssay.getImages()) {
                image.setId(resourceImageRepository.save(image).getId());
                // TODO remove image
            }
            questionEssay = questionEssayRepository.save(questionEssay);
        } else {
            questionEssay = questionEssayRepository.save(questionEssay);
            for (ResourceImage image : questionEssay.getImages()) {
                image.setId(resourceImageRepository.save(image).getId());
                // TODO remove image
            }
        }
        QuestionEssayDTO result = questionEssayMapper.toDto(questionEssay);
        questionEssaySearchRepository.save(questionEssay);
        return result;
    }

    /**
     *  Get all the questionEssays.
     *
     *  @param categories limiting result in categories
     *  @param pageable the pagination information
     *  @return the list of entities
     */
    @Transactional(readOnly = true)
    public Page<QuestionEssayDTO> findAll(Optional<Set<Long>> categories, Pageable pageable) {
        log.debug("Request to get all QuestionEssays in categories {}", categories);
        Page<QuestionEssay> page;
        if (categories.isPresent()) {
            Set<Long> targetCategories = resourceHelper.includeChildren(categories.get());
            page = questionEssayRepository.findAllByCategories(targetCategories, pageable);
        } else {
            page = questionEssayRepository.findAll(pageable);
        }
        return page.map(questionEssayMapper::toDto);
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
     *  @param categories  limiting result in category
     *  @param pageable the pagination information
     *  @return the list of entities
     */
    @Transactional(readOnly = true)
    public Page<QuestionEssayDTO> search(String query, Optional<Set<Long>> categories, Pageable pageable) {
        log.debug("Request to search for a page of QuestionEssays for query {} in categories {}", query, categories);
        NativeSearchQueryBuilder builder = new NativeSearchQueryBuilder()
            .withQuery(queryStringQuery(query))
            .withPageable(pageable);
        if (categories.isPresent()) {
            builder.withFilter(resourceHelper.asCategoriesFilter(categories.get()));
        }
        Page<QuestionEssay> result = questionEssaySearchRepository.search(builder.build());
        return result.map(questionEssayMapper::toDto);
    }
}
