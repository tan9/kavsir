package com.tj.kvasir.service;

import com.tj.kvasir.domain.QuestionChoice;
import com.tj.kvasir.domain.ResourceImage;
import com.tj.kvasir.repository.QuestionChoiceRepository;
import com.tj.kvasir.repository.ResourceImageRepository;
import com.tj.kvasir.repository.search.QuestionChoiceSearchRepository;
import com.tj.kvasir.service.dto.QuestionChoiceDTO;
import com.tj.kvasir.service.mapper.QuestionChoiceMapper;
import com.tj.kvasir.web.rest.ResourceHelper;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.index.query.TermsQueryBuilder;
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
 * Service Implementation for managing {@link QuestionChoice}.
 */
@Service
@Transactional
public class QuestionChoiceService {

    private final Logger log = LoggerFactory.getLogger(QuestionChoiceService.class);

    private final QuestionChoiceRepository questionChoiceRepository;

    private final QuestionChoiceMapper questionChoiceMapper;

    private final QuestionChoiceSearchRepository questionChoiceSearchRepository;

    private final ResourceImageRepository resourceImageRepository;

    private final ResourceHelper resourceHelper;

    public QuestionChoiceService(QuestionChoiceRepository questionChoiceRepository, QuestionChoiceMapper questionChoiceMapper, QuestionChoiceSearchRepository questionChoiceSearchRepository,
                                 ResourceImageRepository resourceImageRepository, ResourceHelper resourceHelper) {
        this.questionChoiceRepository = questionChoiceRepository;
        this.questionChoiceMapper = questionChoiceMapper;
        this.questionChoiceSearchRepository = questionChoiceSearchRepository;
        this.resourceImageRepository = resourceImageRepository;
        this.resourceHelper = resourceHelper;
    }

    /**
     * Save a questionChoice.
     *
     * @param questionChoiceDTO the entity to save.
     * @return the persisted entity.
     */
    public QuestionChoiceDTO save(QuestionChoiceDTO questionChoiceDTO) {
        log.debug("Request to save QuestionChoice : {}", questionChoiceDTO);
        QuestionChoice questionChoice = questionChoiceMapper.toEntity(questionChoiceDTO);
        // TODO clarify & cleanup
        if (questionChoice.getId() != null) {
            for (ResourceImage image : questionChoice.getImages()) {
                image.setId(resourceImageRepository.save(image).getId());
                // TODO remove image
            }
            questionChoice = questionChoiceRepository.save(questionChoice);
        } else {
            questionChoice = questionChoiceRepository.save(questionChoice);
            for (ResourceImage image : questionChoice.getImages()) {
                image.setId(resourceImageRepository.save(image).getId());
                // TODO remove image
            }
        }
        QuestionChoiceDTO result = questionChoiceMapper.toDto(questionChoice);
        questionChoiceSearchRepository.save(questionChoice);
        return result;
    }

    /**
     * Get all the questionChoices.
     *
     * @param categories limiting result in categories
     *  @param multi limiting result to the type of multipleResponse
     *  @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<QuestionChoiceDTO> findAll(Optional<Set<Long>> categories, Optional<Boolean> multi, Pageable pageable) {
        log.debug("REST request to get a page of QuestionChoices in categories {} with multi {}", categories, multi);

        Page<QuestionChoice> page;
        if (categories.isPresent()) {
            Set<Long> targetCategories = resourceHelper.includeChildren(categories.get());
            if (multi.isPresent()) {
                page = questionChoiceRepository.findAllByCategoriesAndMultipleResponse(targetCategories, multi.get(), pageable);
            } else {
                page = questionChoiceRepository.findAllByCategories(targetCategories, pageable);
            }
        } else {
            if (multi.isPresent()) {
                page = questionChoiceRepository.findAllByMultipleResponse(multi.get(), pageable);
            } else {
                page = questionChoiceRepository.findAll(pageable);
            }
        }

        return page.map(questionChoiceMapper::toDto);
    }

    /**
     * Get all the questionChoices with eager load of many-to-many relationships.
     *
     * @return the list of entities.
     */
    public Page<QuestionChoiceDTO> findAllWithEagerRelationships(Pageable pageable) {
        return questionChoiceRepository.findAllWithEagerRelationships(pageable).map(questionChoiceMapper::toDto);
    }


    /**
     * Get one questionChoice by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<QuestionChoiceDTO> findOne(Long id) {
        log.debug("Request to get QuestionChoice : {}", id);
        return questionChoiceRepository.findOneWithEagerRelationships(id)
            .map(questionChoiceMapper::toDto);
    }

    /**
     * Delete the questionChoice by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete QuestionChoice : {}", id);
        questionChoiceRepository.deleteById(id);
        questionChoiceSearchRepository.deleteById(id);
    }

    /**
     * Search for the questionChoice corresponding to the query.
     *
     * @param query the query of the search.
     * @param categories  limiting result in category
     *  @param multi limiting result to the type of multipleResponse
     *  @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<QuestionChoiceDTO> search(String query, Optional<Set<Long>> categories, Optional<Boolean> multi,Pageable pageable) {
        log.debug("Request to search for a page of QuestionChoices for query {} in categories {} with multi {}", query, categories, multi);

        NativeSearchQueryBuilder builder = new NativeSearchQueryBuilder()
            .withQuery(queryStringQuery(query))
            .withPageable(pageable);

        if (categories.isPresent() && multi.isPresent()) {
            BoolQueryBuilder boolQuery = QueryBuilders.boolQuery()
                .must(QueryBuilders.termQuery("multipleResponse", (boolean) multi.get()))
                .filter(resourceHelper.asCategoriesFilter(categories.get()));
            builder.withFilter(boolQuery);

        } else if (categories.isPresent()) {
            TermsQueryBuilder filterBuilder = resourceHelper.asCategoriesFilter(categories.get());
            builder.withFilter(filterBuilder);

        } else if (multi.isPresent()) {
            builder.withFilter(QueryBuilders.termQuery("multipleResponse", (boolean) multi.get()));
        }

        Page<QuestionChoice> result = questionChoiceSearchRepository.search(builder.build());

        return result.map(questionChoiceMapper::toDto);
    }
}
