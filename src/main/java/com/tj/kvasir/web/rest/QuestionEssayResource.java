package com.tj.kvasir.web.rest;

import com.tj.kvasir.service.QuestionEssayService;
import com.tj.kvasir.web.rest.errors.BadRequestAlertException;
import com.tj.kvasir.service.dto.QuestionEssayDTO;

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

/**
 * REST controller for managing {@link com.tj.kvasir.domain.QuestionEssay}.
 */
@RestController
@RequestMapping("/api")
public class QuestionEssayResource {

    private final Logger log = LoggerFactory.getLogger(QuestionEssayResource.class);

    private static final String ENTITY_NAME = "questionEssay";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final QuestionEssayService questionEssayService;

    public QuestionEssayResource(QuestionEssayService questionEssayService) {
        this.questionEssayService = questionEssayService;
    }

    /**
     * {@code POST  /question-essays} : Create a new questionEssay.
     *
     * @param questionEssayDTO the questionEssayDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new questionEssayDTO, or with status {@code 400 (Bad Request)} if the questionEssay has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/question-essays")
    public ResponseEntity<QuestionEssayDTO> createQuestionEssay(@Valid @RequestBody QuestionEssayDTO questionEssayDTO) throws URISyntaxException {
        log.debug("REST request to save QuestionEssay : {}", questionEssayDTO);
        if (questionEssayDTO.getId() != null) {
            throw new BadRequestAlertException("A new questionEssay cannot already have an ID", ENTITY_NAME, "idexists");
        }
        QuestionEssayDTO result = questionEssayService.save(questionEssayDTO);
        return ResponseEntity.created(new URI("/api/question-essays/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /question-essays} : Updates an existing questionEssay.
     *
     * @param questionEssayDTO the questionEssayDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated questionEssayDTO,
     * or with status {@code 400 (Bad Request)} if the questionEssayDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the questionEssayDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/question-essays")
    public ResponseEntity<QuestionEssayDTO> updateQuestionEssay(@Valid @RequestBody QuestionEssayDTO questionEssayDTO) throws URISyntaxException {
        log.debug("REST request to update QuestionEssay : {}", questionEssayDTO);
        if (questionEssayDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        QuestionEssayDTO result = questionEssayService.save(questionEssayDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, questionEssayDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /question-essays} : get all the questionEssays.
     *
     * @param categories limiting result in categories
     * @param pageable the pagination information.
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of questionEssays in body.
     */
    @GetMapping("/question-essays")
    public ResponseEntity<List<QuestionEssayDTO>> getAllQuestionEssays(@RequestParam Optional<Set<Long>> categories,
                                                                    Pageable pageable, @RequestParam MultiValueMap<String, String> queryParams, UriComponentsBuilder uriBuilder, @RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get a page of QuestionEssays in categories {}", categories);
        Page<QuestionEssayDTO> page;
        if (eagerload) {
            page = questionEssayService.findAllWithEagerRelationships(pageable);
        } else {
            page = questionEssayService.findAll(categories, pageable);
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(uriBuilder.queryParams(queryParams), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /question-essays/:id} : get the "id" questionEssay.
     *
     * @param id the id of the questionEssayDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the questionEssayDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/question-essays/{id}")
    public ResponseEntity<QuestionEssayDTO> getQuestionEssay(@PathVariable Long id) {
        log.debug("REST request to get QuestionEssay : {}", id);
        Optional<QuestionEssayDTO> questionEssayDTO = questionEssayService.findOne(id);
        return ResponseUtil.wrapOrNotFound(questionEssayDTO);
    }

    /**
     * {@code DELETE  /question-essays/:id} : delete the "id" questionEssay.
     *
     * @param id the id of the questionEssayDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/question-essays/{id}")
    public ResponseEntity<Void> deleteQuestionEssay(@PathVariable Long id) {
        log.debug("REST request to delete QuestionEssay : {}", id);
        questionEssayService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/question-essays?query=:query} : search for the questionEssay corresponding
     * to the query.
     *
     * @param query the query of the questionEssay search.
     * @param categories  limiting result in category
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/question-essays")
    public ResponseEntity<List<QuestionEssayDTO>> searchQuestionEssays(@RequestParam String query,
                                                                       @RequestParam Optional<Set<Long>> categories,
                                                                       Pageable pageable, @RequestParam MultiValueMap<String, String> queryParams, UriComponentsBuilder uriBuilder) {
        log.debug("REST request to search for a page of QuestionEssays for query {} in categories {}", query, categories);
        Page<QuestionEssayDTO> page = questionEssayService.search(query, categories, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(uriBuilder.queryParams(queryParams), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

}
