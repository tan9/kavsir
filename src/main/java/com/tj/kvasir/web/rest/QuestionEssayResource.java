package com.tj.kvasir.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.tj.kvasir.service.QuestionEssayService;
import com.tj.kvasir.service.dto.QuestionEssayDTO;
import com.tj.kvasir.web.rest.util.HeaderUtil;
import com.tj.kvasir.web.rest.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import io.swagger.annotations.ApiParam;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

/**
 * REST controller for managing QuestionEssay.
 */
@RestController
@RequestMapping("/api")
public class QuestionEssayResource {

    private final Logger log = LoggerFactory.getLogger(QuestionEssayResource.class);

    private static final String ENTITY_NAME = "questionEssay";

    private final QuestionEssayService questionEssayService;

    public QuestionEssayResource(QuestionEssayService questionEssayService) {
        this.questionEssayService = questionEssayService;
    }

    /**
     * POST  /question-essays : Create a new questionEssay.
     *
     * @param questionEssayDTO the questionEssayDTO to create
     * @return the ResponseEntity with status 201 (Created) and with body the new questionEssayDTO, or with status 400 (Bad Request) if the questionEssay has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/question-essays")
    @Timed
    public ResponseEntity<QuestionEssayDTO> createQuestionEssay(@Valid @RequestBody QuestionEssayDTO questionEssayDTO) throws URISyntaxException {
        log.debug("REST request to save QuestionEssay : {}", questionEssayDTO);
        if (questionEssayDTO.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new questionEssay cannot already have an ID")).body(null);
        }
        QuestionEssayDTO result = questionEssayService.save(questionEssayDTO);
        return ResponseEntity.created(new URI("/api/question-essays/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /question-essays : Updates an existing questionEssay.
     *
     * @param questionEssayDTO the questionEssayDTO to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated questionEssayDTO,
     * or with status 400 (Bad Request) if the questionEssayDTO is not valid,
     * or with status 500 (Internal Server Error) if the questionEssayDTO couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/question-essays")
    @Timed
    public ResponseEntity<QuestionEssayDTO> updateQuestionEssay(@Valid @RequestBody QuestionEssayDTO questionEssayDTO) throws URISyntaxException {
        log.debug("REST request to update QuestionEssay : {}", questionEssayDTO);
        if (questionEssayDTO.getId() == null) {
            return createQuestionEssay(questionEssayDTO);
        }
        QuestionEssayDTO result = questionEssayService.save(questionEssayDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, questionEssayDTO.getId().toString()))
            .body(result);
    }

    /**
     * GET  /question-essays : get all the questionEssays.
     *
     * @param categories limiting result in categories
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of questionEssays in body
     */
    @GetMapping("/question-essays")
    @Timed
    public ResponseEntity<List<QuestionEssayDTO>> getAllQuestionEssays(@RequestParam Optional<Set<Long>> categories,
                                                                    @ApiParam Pageable pageable) {
        log.debug("REST request to get a page of QuestionEssays in categories {}", categories);
        Page<QuestionEssayDTO> page = questionEssayService.findAll(categories, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/question-essays");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /question-essays/:id : get the "id" questionEssay.
     *
     * @param id the id of the questionEssayDTO to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the questionEssayDTO, or with status 404 (Not Found)
     */
    @GetMapping("/question-essays/{id}")
    @Timed
    public ResponseEntity<QuestionEssayDTO> getQuestionEssay(@PathVariable Long id) {
        log.debug("REST request to get QuestionEssay : {}", id);
        QuestionEssayDTO questionEssayDTO = questionEssayService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(questionEssayDTO));
    }

    /**
     * DELETE  /question-essays/:id : delete the "id" questionEssay.
     *
     * @param id the id of the questionEssayDTO to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/question-essays/{id}")
    @Timed
    public ResponseEntity<Void> deleteQuestionEssay(@PathVariable Long id) {
        log.debug("REST request to delete QuestionEssay : {}", id);
        questionEssayService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/question-essays?query=:query : search for the questionEssay corresponding
     * to the query.
     *
     * @param query the query of the questionEssay search
     * @param categories  limiting result in category
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/question-essays")
    @Timed
    public ResponseEntity<List<QuestionEssayDTO>> searchQuestionEssays(@RequestParam String query,
                                                                       @RequestParam Optional<Set<Long>> categories,
                                                                       @ApiParam Pageable pageable) {
        log.debug("REST request to search for a page of QuestionEssays for query {} in categories {}", query, categories);
        Page<QuestionEssayDTO> page = questionEssayService.search(query, categories, pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/question-essays");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

}
