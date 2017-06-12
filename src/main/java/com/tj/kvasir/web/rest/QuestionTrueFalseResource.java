package com.tj.kvasir.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.tj.kvasir.domain.QuestionTrueFalse;

import com.tj.kvasir.repository.QuestionTrueFalseRepository;
import com.tj.kvasir.repository.search.QuestionTrueFalseSearchRepository;
import com.tj.kvasir.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
 * REST controller for managing QuestionTrueFalse.
 */
@RestController
@RequestMapping("/api")
public class QuestionTrueFalseResource {

    private final Logger log = LoggerFactory.getLogger(QuestionTrueFalseResource.class);

    private static final String ENTITY_NAME = "questionTrueFalse";

    private final QuestionTrueFalseRepository questionTrueFalseRepository;

    private final QuestionTrueFalseSearchRepository questionTrueFalseSearchRepository;

    public QuestionTrueFalseResource(QuestionTrueFalseRepository questionTrueFalseRepository, QuestionTrueFalseSearchRepository questionTrueFalseSearchRepository) {
        this.questionTrueFalseRepository = questionTrueFalseRepository;
        this.questionTrueFalseSearchRepository = questionTrueFalseSearchRepository;
    }

    /**
     * POST  /question-true-falses : Create a new questionTrueFalse.
     *
     * @param questionTrueFalse the questionTrueFalse to create
     * @return the ResponseEntity with status 201 (Created) and with body the new questionTrueFalse, or with status 400 (Bad Request) if the questionTrueFalse has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/question-true-falses")
    @Timed
    public ResponseEntity<QuestionTrueFalse> createQuestionTrueFalse(@Valid @RequestBody QuestionTrueFalse questionTrueFalse) throws URISyntaxException {
        log.debug("REST request to save QuestionTrueFalse : {}", questionTrueFalse);
        if (questionTrueFalse.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new questionTrueFalse cannot already have an ID")).body(null);
        }
        QuestionTrueFalse result = questionTrueFalseRepository.save(questionTrueFalse);
        questionTrueFalseSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/question-true-falses/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /question-true-falses : Updates an existing questionTrueFalse.
     *
     * @param questionTrueFalse the questionTrueFalse to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated questionTrueFalse,
     * or with status 400 (Bad Request) if the questionTrueFalse is not valid,
     * or with status 500 (Internal Server Error) if the questionTrueFalse couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/question-true-falses")
    @Timed
    public ResponseEntity<QuestionTrueFalse> updateQuestionTrueFalse(@Valid @RequestBody QuestionTrueFalse questionTrueFalse) throws URISyntaxException {
        log.debug("REST request to update QuestionTrueFalse : {}", questionTrueFalse);
        if (questionTrueFalse.getId() == null) {
            return createQuestionTrueFalse(questionTrueFalse);
        }
        QuestionTrueFalse result = questionTrueFalseRepository.save(questionTrueFalse);
        questionTrueFalseSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, questionTrueFalse.getId().toString()))
            .body(result);
    }

    /**
     * GET  /question-true-falses : get all the questionTrueFalses.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of questionTrueFalses in body
     */
    @GetMapping("/question-true-falses")
    @Timed
    public List<QuestionTrueFalse> getAllQuestionTrueFalses() {
        log.debug("REST request to get all QuestionTrueFalses");
        return questionTrueFalseRepository.findAllWithEagerRelationships();
    }

    /**
     * GET  /question-true-falses/:id : get the "id" questionTrueFalse.
     *
     * @param id the id of the questionTrueFalse to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the questionTrueFalse, or with status 404 (Not Found)
     */
    @GetMapping("/question-true-falses/{id}")
    @Timed
    public ResponseEntity<QuestionTrueFalse> getQuestionTrueFalse(@PathVariable Long id) {
        log.debug("REST request to get QuestionTrueFalse : {}", id);
        QuestionTrueFalse questionTrueFalse = questionTrueFalseRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(questionTrueFalse));
    }

    /**
     * DELETE  /question-true-falses/:id : delete the "id" questionTrueFalse.
     *
     * @param id the id of the questionTrueFalse to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/question-true-falses/{id}")
    @Timed
    public ResponseEntity<Void> deleteQuestionTrueFalse(@PathVariable Long id) {
        log.debug("REST request to delete QuestionTrueFalse : {}", id);
        questionTrueFalseRepository.delete(id);
        questionTrueFalseSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/question-true-falses?query=:query : search for the questionTrueFalse corresponding
     * to the query.
     *
     * @param query the query of the questionTrueFalse search
     * @return the result of the search
     */
    @GetMapping("/_search/question-true-falses")
    @Timed
    public List<QuestionTrueFalse> searchQuestionTrueFalses(@RequestParam String query) {
        log.debug("REST request to search QuestionTrueFalses for query {}", query);
        return StreamSupport
            .stream(questionTrueFalseSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

}
