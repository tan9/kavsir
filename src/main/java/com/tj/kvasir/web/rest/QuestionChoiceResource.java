package com.tj.kvasir.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.tj.kvasir.domain.QuestionChoice;
import com.tj.kvasir.repository.QuestionChoiceRepository;
import com.tj.kvasir.repository.search.QuestionChoiceSearchRepository;
import com.tj.kvasir.web.rest.util.HeaderUtil;
import com.tj.kvasir.web.rest.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import io.swagger.annotations.ApiParam;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.index.query.TermsQueryBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.core.query.NativeSearchQueryBuilder;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

/**
 * REST controller for managing QuestionChoice.
 */
@RestController
@RequestMapping("/api")
public class QuestionChoiceResource {

    private final Logger log = LoggerFactory.getLogger(QuestionChoiceResource.class);

    private static final String ENTITY_NAME = "questionChoice";

    private final QuestionChoiceRepository questionChoiceRepository;

    private final QuestionChoiceSearchRepository questionChoiceSearchRepository;

    private final ResourceHelper resourceHelper;

    public QuestionChoiceResource(QuestionChoiceRepository questionChoiceRepository, QuestionChoiceSearchRepository questionChoiceSearchRepository, ResourceHelper resourceHelper) {
        this.questionChoiceRepository = questionChoiceRepository;
        this.questionChoiceSearchRepository = questionChoiceSearchRepository;
        this.resourceHelper = resourceHelper;
    }

    /**
     * POST  /question-choices : Create a new questionChoice.
     *
     * @param questionChoice the questionChoice to create
     * @return the ResponseEntity with status 201 (Created) and with body the new questionChoice, or with status 400 (Bad Request) if the questionChoice has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/question-choices")
    @Timed
    public ResponseEntity<QuestionChoice> createQuestionChoice(@Valid @RequestBody QuestionChoice questionChoice) throws URISyntaxException {
        log.debug("REST request to save QuestionChoice : {}", questionChoice);
        if (questionChoice.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new questionChoice cannot already have an ID")).body(null);
        }
        QuestionChoice result = questionChoiceRepository.save(questionChoice);
        questionChoiceSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/question-choices/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /question-choices : Updates an existing questionChoice.
     *
     * @param questionChoice the questionChoice to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated questionChoice,
     * or with status 400 (Bad Request) if the questionChoice is not valid,
     * or with status 500 (Internal Server Error) if the questionChoice couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/question-choices")
    @Timed
    public ResponseEntity<QuestionChoice> updateQuestionChoice(@Valid @RequestBody QuestionChoice questionChoice) throws URISyntaxException {
        log.debug("REST request to update QuestionChoice : {}", questionChoice);
        if (questionChoice.getId() == null) {
            return createQuestionChoice(questionChoice);
        }
        QuestionChoice result = questionChoiceRepository.save(questionChoice);
        questionChoiceSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, questionChoice.getId().toString()))
            .body(result);
    }

    /**
     * GET  /question-choices : get all the questionChoices.
     *
     * @param categories limiting result in categories
     * @param multi limiting result to the type of multipleResponse
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of questionChoices in body
     */
    @GetMapping("/question-choices")
    @Timed
    public ResponseEntity<List<QuestionChoice>> getAllQuestionChoices(@RequestParam Optional<Set<Long>> categories,
                                                                      @RequestParam Optional<Boolean> multi,
                                                                      @ApiParam Pageable pageable) {
        log.debug("REST request to get a page of QuestionChoices in categories {}", categories);
        Page<QuestionChoice> page;
        if (categories.isPresent()) {
            Set<Long> targetCategories = resourceHelper.includeChildren(categories.get());
            if (multi.isPresent()) {
                page = questionChoiceRepository.findByCategoriesAndMultipleResponse(targetCategories, multi.get(), pageable);
            } else {
                page = questionChoiceRepository.findByCategories(targetCategories, pageable);
            }
        } else {
            if (multi.isPresent()) {
                page = questionChoiceRepository.findByMultipleResponse(multi.get(), pageable);
            } else {
                page = questionChoiceRepository.findAll(pageable);
            }
        }

        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/question-choices");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /question-choices/:id : get the "id" questionChoice.
     *
     * @param id the id of the questionChoice to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the questionChoice, or with status 404 (Not Found)
     */
    @GetMapping("/question-choices/{id}")
    @Timed
    public ResponseEntity<QuestionChoice> getQuestionChoice(@PathVariable Long id) {
        log.debug("REST request to get QuestionChoice : {}", id);
        QuestionChoice questionChoice = questionChoiceRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(questionChoice));
    }

    /**
     * DELETE  /question-choices/:id : delete the "id" questionChoice.
     *
     * @param id the id of the questionChoice to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/question-choices/{id}")
    @Timed
    public ResponseEntity<Void> deleteQuestionChoice(@PathVariable Long id) {
        log.debug("REST request to delete QuestionChoice : {}", id);
        questionChoiceRepository.delete(id);
        questionChoiceSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/question-choices?query=:query : search for the questionChoice corresponding
     * to the query.
     *
     * @param query the query of the questionChoice search
     * @param categories  limiting result in category
     * @param multi limiting result to the type of multipleResponse
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/question-choices")
    @Timed
    public ResponseEntity<List<QuestionChoice>> searchQuestionChoices(@RequestParam String query,
                                                                      @RequestParam Optional<Set<Long>> categories,
                                                                      @RequestParam Optional<Boolean> multi,
                                                                      @ApiParam Pageable pageable) {
        log.debug("REST request to search for a page of QuestionChoices for query {} in categories {}", query, categories);
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

        Page<QuestionChoice> page = questionChoiceSearchRepository.search(builder.build());
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/question-choices");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

}
