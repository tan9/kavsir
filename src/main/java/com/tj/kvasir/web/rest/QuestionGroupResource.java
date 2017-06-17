package com.tj.kvasir.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.tj.kvasir.domain.QuestionGroup;

import com.tj.kvasir.repository.QuestionGroupRepository;
import com.tj.kvasir.repository.search.QuestionGroupSearchRepository;
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
 * REST controller for managing QuestionGroup.
 */
@RestController
@RequestMapping("/api")
public class QuestionGroupResource {

    private final Logger log = LoggerFactory.getLogger(QuestionGroupResource.class);

    private static final String ENTITY_NAME = "questionGroup";

    private final QuestionGroupRepository questionGroupRepository;

    private final QuestionGroupSearchRepository questionGroupSearchRepository;

    public QuestionGroupResource(QuestionGroupRepository questionGroupRepository, QuestionGroupSearchRepository questionGroupSearchRepository) {
        this.questionGroupRepository = questionGroupRepository;
        this.questionGroupSearchRepository = questionGroupSearchRepository;
    }

    /**
     * POST  /question-groups : Create a new questionGroup.
     *
     * @param questionGroup the questionGroup to create
     * @return the ResponseEntity with status 201 (Created) and with body the new questionGroup, or with status 400 (Bad Request) if the questionGroup has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/question-groups")
    @Timed
    public ResponseEntity<QuestionGroup> createQuestionGroup(@Valid @RequestBody QuestionGroup questionGroup) throws URISyntaxException {
        log.debug("REST request to save QuestionGroup : {}", questionGroup);
        if (questionGroup.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new questionGroup cannot already have an ID")).body(null);
        }
        QuestionGroup result = questionGroupRepository.save(questionGroup);
        questionGroupSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/question-groups/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /question-groups : Updates an existing questionGroup.
     *
     * @param questionGroup the questionGroup to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated questionGroup,
     * or with status 400 (Bad Request) if the questionGroup is not valid,
     * or with status 500 (Internal Server Error) if the questionGroup couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/question-groups")
    @Timed
    public ResponseEntity<QuestionGroup> updateQuestionGroup(@Valid @RequestBody QuestionGroup questionGroup) throws URISyntaxException {
        log.debug("REST request to update QuestionGroup : {}", questionGroup);
        if (questionGroup.getId() == null) {
            return createQuestionGroup(questionGroup);
        }
        QuestionGroup result = questionGroupRepository.save(questionGroup);
        questionGroupSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, questionGroup.getId().toString()))
            .body(result);
    }

    /**
     * GET  /question-groups : get all the questionGroups.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of questionGroups in body
     */
    @GetMapping("/question-groups")
    @Timed
    public List<QuestionGroup> getAllQuestionGroups() {
        log.debug("REST request to get all QuestionGroups");
        return questionGroupRepository.findAllWithEagerRelationships();
    }

    /**
     * GET  /question-groups/:id : get the "id" questionGroup.
     *
     * @param id the id of the questionGroup to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the questionGroup, or with status 404 (Not Found)
     */
    @GetMapping("/question-groups/{id}")
    @Timed
    public ResponseEntity<QuestionGroup> getQuestionGroup(@PathVariable Long id) {
        log.debug("REST request to get QuestionGroup : {}", id);
        QuestionGroup questionGroup = questionGroupRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(questionGroup));
    }

    /**
     * DELETE  /question-groups/:id : delete the "id" questionGroup.
     *
     * @param id the id of the questionGroup to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/question-groups/{id}")
    @Timed
    public ResponseEntity<Void> deleteQuestionGroup(@PathVariable Long id) {
        log.debug("REST request to delete QuestionGroup : {}", id);
        questionGroupRepository.delete(id);
        questionGroupSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/question-groups?query=:query : search for the questionGroup corresponding
     * to the query.
     *
     * @param query the query of the questionGroup search
     * @return the result of the search
     */
    @GetMapping("/_search/question-groups")
    @Timed
    public List<QuestionGroup> searchQuestionGroups(@RequestParam String query) {
        log.debug("REST request to search QuestionGroups for query {}", query);
        return StreamSupport
            .stream(questionGroupSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

}
