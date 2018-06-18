package com.tj.kvasir.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.tj.kvasir.service.QuestionGroupService;
import com.tj.kvasir.web.rest.errors.BadRequestAlertException;
import com.tj.kvasir.web.rest.util.HeaderUtil;
import com.tj.kvasir.web.rest.util.PaginationUtil;
import com.tj.kvasir.service.dto.QuestionGroupDTO;
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
 * REST controller for managing QuestionGroup.
 */
@RestController
@RequestMapping("/api")
public class QuestionGroupResource {

    private final Logger log = LoggerFactory.getLogger(QuestionGroupResource.class);

    private static final String ENTITY_NAME = "questionGroup";

    private final QuestionGroupService questionGroupService;

    public QuestionGroupResource(QuestionGroupService questionGroupService) {
        this.questionGroupService = questionGroupService;
    }

    /**
     * POST  /question-groups : Create a new questionGroup.
     *
     * @param questionGroupDTO the questionGroupDTO to create
     * @return the ResponseEntity with status 201 (Created) and with body the new questionGroupDTO, or with status 400 (Bad Request) if the questionGroup has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/question-groups")
    @Timed
    public ResponseEntity<QuestionGroupDTO> createQuestionGroup(@Valid @RequestBody QuestionGroupDTO questionGroupDTO) throws URISyntaxException {
        log.debug("REST request to save QuestionGroup : {}", questionGroupDTO);
        if (questionGroupDTO.getId() != null) {
            throw new BadRequestAlertException("A new questionGroup cannot already have an ID", ENTITY_NAME, "idexists");
        }
        QuestionGroupDTO result = questionGroupService.save(questionGroupDTO);
        return ResponseEntity.created(new URI("/api/question-groups/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /question-groups : Updates an existing questionGroup.
     *
     * @param questionGroupDTO the questionGroupDTO to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated questionGroupDTO,
     * or with status 400 (Bad Request) if the questionGroupDTO is not valid,
     * or with status 500 (Internal Server Error) if the questionGroupDTO couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/question-groups")
    @Timed
    public ResponseEntity<QuestionGroupDTO> updateQuestionGroup(@Valid @RequestBody QuestionGroupDTO questionGroupDTO) throws URISyntaxException {
        log.debug("REST request to update QuestionGroup : {}", questionGroupDTO);
        if (questionGroupDTO.getId() == null) {
            return createQuestionGroup(questionGroupDTO);
        }
        QuestionGroupDTO result = questionGroupService.save(questionGroupDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, questionGroupDTO.getId().toString()))
            .body(result);
    }

    /**
     * GET  /question-groups : get all the questionGroups.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of questionGroups in body
     */
    @GetMapping("/question-groups")
    @Timed
    public ResponseEntity<List<QuestionGroupDTO>> getAllQuestionGroups(Pageable pageable) {
        log.debug("REST request to get a page of QuestionGroups");
        Page<QuestionGroupDTO> page = questionGroupService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/question-groups");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /question-groups/:id : get the "id" questionGroup.
     *
     * @param id the id of the questionGroupDTO to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the questionGroupDTO, or with status 404 (Not Found)
     */
    @GetMapping("/question-groups/{id}")
    @Timed
    public ResponseEntity<QuestionGroupDTO> getQuestionGroup(@PathVariable Long id) {
        log.debug("REST request to get QuestionGroup : {}", id);
        QuestionGroupDTO questionGroupDTO = questionGroupService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(questionGroupDTO));
    }

    /**
     * DELETE  /question-groups/:id : delete the "id" questionGroup.
     *
     * @param id the id of the questionGroupDTO to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/question-groups/{id}")
    @Timed
    public ResponseEntity<Void> deleteQuestionGroup(@PathVariable Long id) {
        log.debug("REST request to delete QuestionGroup : {}", id);
        questionGroupService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/question-groups?query=:query : search for the questionGroup corresponding
     * to the query.
     *
     * @param query the query of the questionGroup search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/question-groups")
    @Timed
    public ResponseEntity<List<QuestionGroupDTO>> searchQuestionGroups(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of QuestionGroups for query {}", query);
        Page<QuestionGroupDTO> page = questionGroupService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/question-groups");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

}
