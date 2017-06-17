package com.tj.kvasir.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.tj.kvasir.domain.QuestionChoice;

import com.tj.kvasir.repository.QuestionChoiceRepository;
import com.tj.kvasir.repository.search.QuestionChoiceSearchRepository;
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
 * REST controller for managing QuestionChoice.
 */
@RestController
@RequestMapping("/api")
public class QuestionChoiceResource {

    private final Logger log = LoggerFactory.getLogger(QuestionChoiceResource.class);

    private static final String ENTITY_NAME = "questionChoice";

    private final QuestionChoiceRepository questionChoiceRepository;

    private final QuestionChoiceSearchRepository questionChoiceSearchRepository;

    public QuestionChoiceResource(QuestionChoiceRepository questionChoiceRepository, QuestionChoiceSearchRepository questionChoiceSearchRepository) {
        this.questionChoiceRepository = questionChoiceRepository;
        this.questionChoiceSearchRepository = questionChoiceSearchRepository;
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
     * @return the ResponseEntity with status 200 (OK) and the list of questionChoices in body
     */
    @GetMapping("/question-choices")
    @Timed
    public List<QuestionChoice> getAllQuestionChoices() {
        log.debug("REST request to get all QuestionChoices");
        return questionChoiceRepository.findAllWithEagerRelationships();
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
     * @return the result of the search
     */
    @GetMapping("/_search/question-choices")
    @Timed
    public List<QuestionChoice> searchQuestionChoices(@RequestParam String query) {
        log.debug("REST request to search QuestionChoices for query {}", query);
        return StreamSupport
            .stream(questionChoiceSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

}
