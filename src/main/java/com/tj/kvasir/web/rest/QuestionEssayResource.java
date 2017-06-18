package com.tj.kvasir.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.tj.kvasir.domain.QuestionEssay;

import com.tj.kvasir.repository.QuestionEssayRepository;
import com.tj.kvasir.repository.search.QuestionEssaySearchRepository;
import com.tj.kvasir.web.rest.util.HeaderUtil;
import com.tj.kvasir.web.rest.util.PaginationUtil;
import io.swagger.annotations.ApiParam;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing QuestionEssay.
 */
@RestController
@RequestMapping("/api")
public class QuestionEssayResource {

    private final Logger log = LoggerFactory.getLogger(QuestionEssayResource.class);

    private static final String ENTITY_NAME = "questionEssay";

    private final QuestionEssayRepository questionEssayRepository;

    private final QuestionEssaySearchRepository questionEssaySearchRepository;

    public QuestionEssayResource(QuestionEssayRepository questionEssayRepository, QuestionEssaySearchRepository questionEssaySearchRepository) {
        this.questionEssayRepository = questionEssayRepository;
        this.questionEssaySearchRepository = questionEssaySearchRepository;
    }

    /**
     * POST  /question-essays : Create a new questionEssay.
     *
     * @param questionEssay the questionEssay to create
     * @return the ResponseEntity with status 201 (Created) and with body the new questionEssay, or with status 400 (Bad Request) if the questionEssay has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/question-essays")
    @Timed
    public ResponseEntity<QuestionEssay> createQuestionEssay(@Valid @RequestBody QuestionEssay questionEssay) throws URISyntaxException {
        log.debug("REST request to save QuestionEssay : {}", questionEssay);
        if (questionEssay.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new questionEssay cannot already have an ID")).body(null);
        }
        QuestionEssay result = questionEssayRepository.save(questionEssay);
        questionEssaySearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/question-essays/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /question-essays : Updates an existing questionEssay.
     *
     * @param questionEssay the questionEssay to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated questionEssay,
     * or with status 400 (Bad Request) if the questionEssay is not valid,
     * or with status 500 (Internal Server Error) if the questionEssay couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/question-essays")
    @Timed
    public ResponseEntity<QuestionEssay> updateQuestionEssay(@Valid @RequestBody QuestionEssay questionEssay) throws URISyntaxException {
        log.debug("REST request to update QuestionEssay : {}", questionEssay);
        if (questionEssay.getId() == null) {
            return createQuestionEssay(questionEssay);
        }
        QuestionEssay result = questionEssayRepository.save(questionEssay);
        questionEssaySearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, questionEssay.getId().toString()))
            .body(result);
    }

    /**
     * GET  /question-essays : get all the questionEssays.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of questionEssays in body
     */
    @GetMapping("/question-essays")
    @Timed
    public ResponseEntity<List<QuestionEssay>> getAllQuestionEssays(@ApiParam Pageable pageable) {
        log.debug("REST request to get a page of QuestionEssays");
        Page<QuestionEssay> page = questionEssayRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/question-essays");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /question-essays/:id : get the "id" questionEssay.
     *
     * @param id the id of the questionEssay to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the questionEssay, or with status 404 (Not Found)
     */
    @GetMapping("/question-essays/{id}")
    @Timed
    public ResponseEntity<QuestionEssay> getQuestionEssay(@PathVariable Long id) {
        log.debug("REST request to get QuestionEssay : {}", id);
        QuestionEssay questionEssay = questionEssayRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(questionEssay));
    }

    /**
     * DELETE  /question-essays/:id : delete the "id" questionEssay.
     *
     * @param id the id of the questionEssay to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/question-essays/{id}")
    @Timed
    public ResponseEntity<Void> deleteQuestionEssay(@PathVariable Long id) {
        log.debug("REST request to delete QuestionEssay : {}", id);
        questionEssayRepository.delete(id);
        questionEssaySearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/question-essays?query=:query : search for the questionEssay corresponding
     * to the query.
     *
     * @param query the query of the questionEssay search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/question-essays")
    @Timed
    public ResponseEntity<List<QuestionEssay>> searchQuestionEssays(@RequestParam String query, @ApiParam Pageable pageable) {
        log.debug("REST request to search for a page of QuestionEssays for query {}", query);
        Page<QuestionEssay> page = questionEssaySearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/question-essays");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

}
