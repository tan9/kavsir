package com.tj.kvasir.web.rest;

import com.tj.kvasir.service.QuestionGroupService;
import com.tj.kvasir.web.rest.errors.BadRequestAlertException;
import com.tj.kvasir.service.dto.QuestionGroupDTO;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.util.MultiValueMap;
import org.springframework.web.util.UriComponentsBuilder;
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
 * REST controller for managing {@link com.tj.kvasir.domain.QuestionGroup}.
 */
@RestController
@RequestMapping("/api")
public class QuestionGroupResource {

    private final Logger log = LoggerFactory.getLogger(QuestionGroupResource.class);

    private static final String ENTITY_NAME = "questionGroup";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final QuestionGroupService questionGroupService;

    public QuestionGroupResource(QuestionGroupService questionGroupService) {
        this.questionGroupService = questionGroupService;
    }

    /**
     * {@code POST  /question-groups} : Create a new questionGroup.
     *
     * @param questionGroupDTO the questionGroupDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new questionGroupDTO, or with status {@code 400 (Bad Request)} if the questionGroup has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/question-groups")
    public ResponseEntity<QuestionGroupDTO> createQuestionGroup(@Valid @RequestBody QuestionGroupDTO questionGroupDTO) throws URISyntaxException {
        log.debug("REST request to save QuestionGroup : {}", questionGroupDTO);
        if (questionGroupDTO.getId() != null) {
            throw new BadRequestAlertException("A new questionGroup cannot already have an ID", ENTITY_NAME, "idexists");
        }
        QuestionGroupDTO result = questionGroupService.save(questionGroupDTO);
        return ResponseEntity.created(new URI("/api/question-groups/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /question-groups} : Updates an existing questionGroup.
     *
     * @param questionGroupDTO the questionGroupDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated questionGroupDTO,
     * or with status {@code 400 (Bad Request)} if the questionGroupDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the questionGroupDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/question-groups")
    public ResponseEntity<QuestionGroupDTO> updateQuestionGroup(@Valid @RequestBody QuestionGroupDTO questionGroupDTO) throws URISyntaxException {
        log.debug("REST request to update QuestionGroup : {}", questionGroupDTO);
        if (questionGroupDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        QuestionGroupDTO result = questionGroupService.save(questionGroupDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, questionGroupDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /question-groups} : get all the questionGroups.
     *
     * @param pageable the pagination information.
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of questionGroups in body.
     */
    @GetMapping("/question-groups")
    public ResponseEntity<List<QuestionGroupDTO>> getAllQuestionGroups(Pageable pageable, @RequestParam MultiValueMap<String, String> queryParams, UriComponentsBuilder uriBuilder, @RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get a page of QuestionGroups");
        Page<QuestionGroupDTO> page;
        if (eagerload) {
            page = questionGroupService.findAllWithEagerRelationships(pageable);
        } else {
            page = questionGroupService.findAll(pageable);
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(uriBuilder.queryParams(queryParams), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /question-groups/:id} : get the "id" questionGroup.
     *
     * @param id the id of the questionGroupDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the questionGroupDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/question-groups/{id}")
    public ResponseEntity<QuestionGroupDTO> getQuestionGroup(@PathVariable Long id) {
        log.debug("REST request to get QuestionGroup : {}", id);
        Optional<QuestionGroupDTO> questionGroupDTO = questionGroupService.findOne(id);
        return ResponseUtil.wrapOrNotFound(questionGroupDTO);
    }

    /**
     * {@code DELETE  /question-groups/:id} : delete the "id" questionGroup.
     *
     * @param id the id of the questionGroupDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/question-groups/{id}")
    public ResponseEntity<Void> deleteQuestionGroup(@PathVariable Long id) {
        log.debug("REST request to delete QuestionGroup : {}", id);
        questionGroupService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/question-groups?query=:query} : search for the questionGroup corresponding
     * to the query.
     *
     * @param query the query of the questionGroup search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/question-groups")
    public ResponseEntity<List<QuestionGroupDTO>> searchQuestionGroups(@RequestParam String query, Pageable pageable, @RequestParam MultiValueMap<String, String> queryParams, UriComponentsBuilder uriBuilder) {
        log.debug("REST request to search for a page of QuestionGroups for query {}", query);
        Page<QuestionGroupDTO> page = questionGroupService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(uriBuilder.queryParams(queryParams), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

}
