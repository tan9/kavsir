package com.tj.kvasir.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.tj.kvasir.service.QuestionTrueFalseService;
import com.tj.kvasir.web.rest.errors.BadRequestAlertException;
import com.tj.kvasir.web.rest.util.HeaderUtil;
import com.tj.kvasir.web.rest.util.PaginationUtil;
import com.tj.kvasir.service.dto.QuestionTrueFalseDTO;
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

    private final QuestionTrueFalseService questionTrueFalseService;

    public QuestionTrueFalseResource(QuestionTrueFalseService questionTrueFalseService) {
        this.questionTrueFalseService = questionTrueFalseService;
    }

    /**
     * POST  /question-true-falses : Create a new questionTrueFalse.
     *
     * @param questionTrueFalseDTO the questionTrueFalseDTO to create
     * @return the ResponseEntity with status 201 (Created) and with body the new questionTrueFalseDTO, or with status 400 (Bad Request) if the questionTrueFalse has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/question-true-falses")
    @Timed
    public ResponseEntity<QuestionTrueFalseDTO> createQuestionTrueFalse(@Valid @RequestBody QuestionTrueFalseDTO questionTrueFalseDTO) throws URISyntaxException {
        log.debug("REST request to save QuestionTrueFalse : {}", questionTrueFalseDTO);
        if (questionTrueFalseDTO.getId() != null) {
            throw new BadRequestAlertException("A new questionTrueFalse cannot already have an ID", ENTITY_NAME, "idexists");
        }
        QuestionTrueFalseDTO result = questionTrueFalseService.save(questionTrueFalseDTO);
        return ResponseEntity.created(new URI("/api/question-true-falses/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /question-true-falses : Updates an existing questionTrueFalse.
     *
     * @param questionTrueFalseDTO the questionTrueFalseDTO to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated questionTrueFalseDTO,
     * or with status 400 (Bad Request) if the questionTrueFalseDTO is not valid,
     * or with status 500 (Internal Server Error) if the questionTrueFalseDTO couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/question-true-falses")
    @Timed
    public ResponseEntity<QuestionTrueFalseDTO> updateQuestionTrueFalse(@Valid @RequestBody QuestionTrueFalseDTO questionTrueFalseDTO) throws URISyntaxException {
        log.debug("REST request to update QuestionTrueFalse : {}", questionTrueFalseDTO);
        if (questionTrueFalseDTO.getId() == null) {
            return createQuestionTrueFalse(questionTrueFalseDTO);
        }
        QuestionTrueFalseDTO result = questionTrueFalseService.save(questionTrueFalseDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, questionTrueFalseDTO.getId().toString()))
            .body(result);
    }

    /**
     * GET  /question-true-falses : get all the questionTrueFalses.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of questionTrueFalses in body
     */
    @GetMapping("/question-true-falses")
    @Timed
    public ResponseEntity<List<QuestionTrueFalseDTO>> getAllQuestionTrueFalses(Pageable pageable) {
        log.debug("REST request to get a page of QuestionTrueFalses");
        Page<QuestionTrueFalseDTO> page = questionTrueFalseService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/question-true-falses");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /question-true-falses/:id : get the "id" questionTrueFalse.
     *
     * @param id the id of the questionTrueFalseDTO to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the questionTrueFalseDTO, or with status 404 (Not Found)
     */
    @GetMapping("/question-true-falses/{id}")
    @Timed
    public ResponseEntity<QuestionTrueFalseDTO> getQuestionTrueFalse(@PathVariable Long id) {
        log.debug("REST request to get QuestionTrueFalse : {}", id);
        QuestionTrueFalseDTO questionTrueFalseDTO = questionTrueFalseService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(questionTrueFalseDTO));
    }

    /**
     * DELETE  /question-true-falses/:id : delete the "id" questionTrueFalse.
     *
     * @param id the id of the questionTrueFalseDTO to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/question-true-falses/{id}")
    @Timed
    public ResponseEntity<Void> deleteQuestionTrueFalse(@PathVariable Long id) {
        log.debug("REST request to delete QuestionTrueFalse : {}", id);
        questionTrueFalseService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/question-true-falses?query=:query : search for the questionTrueFalse corresponding
     * to the query.
     *
     * @param query the query of the questionTrueFalse search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/question-true-falses")
    @Timed
    public ResponseEntity<List<QuestionTrueFalseDTO>> searchQuestionTrueFalses(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of QuestionTrueFalses for query {}", query);
        Page<QuestionTrueFalseDTO> page = questionTrueFalseService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/question-true-falses");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

}
