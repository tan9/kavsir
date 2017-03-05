package com.tj.kvasir.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.tj.kvasir.domain.QuestionChoiceOption;

import com.tj.kvasir.repository.QuestionChoiceOptionRepository;
import com.tj.kvasir.repository.search.QuestionChoiceOptionSearchRepository;
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
 * REST controller for managing QuestionChoiceOption.
 */
@RestController
@RequestMapping("/api")
public class QuestionChoiceOptionResource {

    private final Logger log = LoggerFactory.getLogger(QuestionChoiceOptionResource.class);

    private static final String ENTITY_NAME = "questionChoiceOption";
        
    private final QuestionChoiceOptionRepository questionChoiceOptionRepository;

    private final QuestionChoiceOptionSearchRepository questionChoiceOptionSearchRepository;

    public QuestionChoiceOptionResource(QuestionChoiceOptionRepository questionChoiceOptionRepository, QuestionChoiceOptionSearchRepository questionChoiceOptionSearchRepository) {
        this.questionChoiceOptionRepository = questionChoiceOptionRepository;
        this.questionChoiceOptionSearchRepository = questionChoiceOptionSearchRepository;
    }

    /**
     * POST  /question-choice-options : Create a new questionChoiceOption.
     *
     * @param questionChoiceOption the questionChoiceOption to create
     * @return the ResponseEntity with status 201 (Created) and with body the new questionChoiceOption, or with status 400 (Bad Request) if the questionChoiceOption has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/question-choice-options")
    @Timed
    public ResponseEntity<QuestionChoiceOption> createQuestionChoiceOption(@Valid @RequestBody QuestionChoiceOption questionChoiceOption) throws URISyntaxException {
        log.debug("REST request to save QuestionChoiceOption : {}", questionChoiceOption);
        if (questionChoiceOption.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new questionChoiceOption cannot already have an ID")).body(null);
        }
        QuestionChoiceOption result = questionChoiceOptionRepository.save(questionChoiceOption);
        questionChoiceOptionSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/question-choice-options/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /question-choice-options : Updates an existing questionChoiceOption.
     *
     * @param questionChoiceOption the questionChoiceOption to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated questionChoiceOption,
     * or with status 400 (Bad Request) if the questionChoiceOption is not valid,
     * or with status 500 (Internal Server Error) if the questionChoiceOption couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/question-choice-options")
    @Timed
    public ResponseEntity<QuestionChoiceOption> updateQuestionChoiceOption(@Valid @RequestBody QuestionChoiceOption questionChoiceOption) throws URISyntaxException {
        log.debug("REST request to update QuestionChoiceOption : {}", questionChoiceOption);
        if (questionChoiceOption.getId() == null) {
            return createQuestionChoiceOption(questionChoiceOption);
        }
        QuestionChoiceOption result = questionChoiceOptionRepository.save(questionChoiceOption);
        questionChoiceOptionSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, questionChoiceOption.getId().toString()))
            .body(result);
    }

    /**
     * GET  /question-choice-options : get all the questionChoiceOptions.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of questionChoiceOptions in body
     */
    @GetMapping("/question-choice-options")
    @Timed
    public List<QuestionChoiceOption> getAllQuestionChoiceOptions() {
        log.debug("REST request to get all QuestionChoiceOptions");
        List<QuestionChoiceOption> questionChoiceOptions = questionChoiceOptionRepository.findAllWithEagerRelationships();
        return questionChoiceOptions;
    }

    /**
     * GET  /question-choice-options/:id : get the "id" questionChoiceOption.
     *
     * @param id the id of the questionChoiceOption to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the questionChoiceOption, or with status 404 (Not Found)
     */
    @GetMapping("/question-choice-options/{id}")
    @Timed
    public ResponseEntity<QuestionChoiceOption> getQuestionChoiceOption(@PathVariable Long id) {
        log.debug("REST request to get QuestionChoiceOption : {}", id);
        QuestionChoiceOption questionChoiceOption = questionChoiceOptionRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(questionChoiceOption));
    }

    /**
     * DELETE  /question-choice-options/:id : delete the "id" questionChoiceOption.
     *
     * @param id the id of the questionChoiceOption to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/question-choice-options/{id}")
    @Timed
    public ResponseEntity<Void> deleteQuestionChoiceOption(@PathVariable Long id) {
        log.debug("REST request to delete QuestionChoiceOption : {}", id);
        questionChoiceOptionRepository.delete(id);
        questionChoiceOptionSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/question-choice-options?query=:query : search for the questionChoiceOption corresponding
     * to the query.
     *
     * @param query the query of the questionChoiceOption search 
     * @return the result of the search
     */
    @GetMapping("/_search/question-choice-options")
    @Timed
    public List<QuestionChoiceOption> searchQuestionChoiceOptions(@RequestParam String query) {
        log.debug("REST request to search QuestionChoiceOptions for query {}", query);
        return StreamSupport
            .stream(questionChoiceOptionSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }


}
