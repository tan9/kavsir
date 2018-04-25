package com.tj.kvasir.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.tj.kvasir.service.QuestionChoiceService;
import com.tj.kvasir.web.rest.errors.BadRequestAlertException;
import com.tj.kvasir.web.rest.util.HeaderUtil;
import com.tj.kvasir.web.rest.util.PaginationUtil;
import com.tj.kvasir.service.dto.QuestionChoiceDTO;
import io.github.jhipster.web.util.ResponseUtil;
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
 * REST controller for managing QuestionChoice.
 */
@RestController
@RequestMapping("/api")
public class QuestionChoiceResource {

    private final Logger log = LoggerFactory.getLogger(QuestionChoiceResource.class);

    private static final String ENTITY_NAME = "questionChoice";

    private final QuestionChoiceService questionChoiceService;

    public QuestionChoiceResource(QuestionChoiceService questionChoiceService) {
        this.questionChoiceService = questionChoiceService;
    }

    /**
     * POST  /question-choices : Create a new questionChoice.
     *
     * @param questionChoiceDTO the questionChoiceDTO to create
     * @return the ResponseEntity with status 201 (Created) and with body the new questionChoiceDTO, or with status 400 (Bad Request) if the questionChoice has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/question-choices")
    @Timed
    public ResponseEntity<QuestionChoiceDTO> createQuestionChoice(@Valid @RequestBody QuestionChoiceDTO questionChoiceDTO) throws URISyntaxException {
        log.debug("REST request to save QuestionChoice : {}", questionChoiceDTO);
        if (questionChoiceDTO.getId() != null) {
            throw new BadRequestAlertException("A new questionChoice cannot already have an ID", ENTITY_NAME, "idexists");
        }
        QuestionChoiceDTO result = questionChoiceService.save(questionChoiceDTO);
        return ResponseEntity.created(new URI("/api/question-choices/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /question-choices : Updates an existing questionChoice.
     *
     * @param questionChoiceDTO the questionChoiceDTO to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated questionChoiceDTO,
     * or with status 400 (Bad Request) if the questionChoiceDTO is not valid,
     * or with status 500 (Internal Server Error) if the questionChoiceDTO couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/question-choices")
    @Timed
    public ResponseEntity<QuestionChoiceDTO> updateQuestionChoice(@Valid @RequestBody QuestionChoiceDTO questionChoiceDTO) throws URISyntaxException {
        log.debug("REST request to update QuestionChoice : {}", questionChoiceDTO);
        if (questionChoiceDTO.getId() == null) {
            return createQuestionChoice(questionChoiceDTO);
        }
        QuestionChoiceDTO result = questionChoiceService.save(questionChoiceDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, questionChoiceDTO.getId().toString()))
            .body(result);
    }

    /**
     * GET  /question-choices : get all the questionChoices.
     *
     * @param categories limiting result in categories
     * @param multi limiting result to the type of multipleResponse
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of questionChoices in body
     */
    @GetMapping("/question-choices")
    @Timed
    public ResponseEntity<List<QuestionChoiceDTO>> getAllQuestionChoices(@RequestParam Optional<Set<Long>> categories,
                                                                         @RequestParam Optional<Boolean> multi,
                                                                         Pageable pageable) {
        log.debug("REST request to get a page of QuestionChoices in categories {} with multi {}", categories, multi);
        Page<QuestionChoiceDTO> page = questionChoiceService.findAll(categories, multi, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/question-choices");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /question-choices/:id : get the "id" questionChoice.
     *
     * @param id the id of the questionChoiceDTO to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the questionChoiceDTO, or with status 404 (Not Found)
     */
    @GetMapping("/question-choices/{id}")
    @Timed
    public ResponseEntity<QuestionChoiceDTO> getQuestionChoice(@PathVariable Long id) {
        log.debug("REST request to get QuestionChoice : {}", id);
        QuestionChoiceDTO questionChoiceDTO = questionChoiceService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(questionChoiceDTO));
    }

    /**
     * DELETE  /question-choices/:id : delete the "id" questionChoice.
     *
     * @param id the id of the questionChoiceDTO to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/question-choices/{id}")
    @Timed
    public ResponseEntity<Void> deleteQuestionChoice(@PathVariable Long id) {
        log.debug("REST request to delete QuestionChoice : {}", id);
        questionChoiceService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/question-choices?query=:query : search for the questionChoice corresponding
     * to the query.
     *
     * @param query the query of the questionChoice search
     * @param categories  limiting result in category
     * @param multi limiting result to the type of multipleResponse
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/question-choices")
    @Timed
    public ResponseEntity<List<QuestionChoiceDTO>> searchQuestionChoices(@RequestParam String query,
                                                                         @RequestParam Optional<Set<Long>> categories,
                                                                         @RequestParam Optional<Boolean> multi,
                                                                         Pageable pageable) {
        log.debug("REST request to search for a page of QuestionChoices for query {} in categories {} with multi {}", query, categories, multi);
        Page<QuestionChoiceDTO> page = questionChoiceService.search(query, categories, multi, pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/question-choices");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

}
