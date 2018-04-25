package com.tj.kvasir.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.tj.kvasir.service.QuestionChoiceOptionService;
import com.tj.kvasir.service.dto.QuestionChoiceOptionDTO;
import com.tj.kvasir.web.rest.errors.BadRequestAlertException;
import com.tj.kvasir.web.rest.util.HeaderUtil;
import com.tj.kvasir.web.rest.util.PaginationUtil;
import com.tj.kvasir.service.dto.QuestionChoiceOptionDTO;
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

/**
 * REST controller for managing QuestionChoiceOption.
 */
@RestController
@RequestMapping("/api")
public class QuestionChoiceOptionResource {

    private final Logger log = LoggerFactory.getLogger(QuestionChoiceOptionResource.class);

    private static final String ENTITY_NAME = "questionChoiceOption";

    private final QuestionChoiceOptionService questionChoiceOptionService;

    public QuestionChoiceOptionResource(QuestionChoiceOptionService questionChoiceOptionService) {
        this.questionChoiceOptionService = questionChoiceOptionService;
    }

    /**
     * POST  /question-choice-options : Create a new questionChoiceOption.
     *
     * @param questionChoiceOptionDTO the questionChoiceOptionDTO to create
     * @return the ResponseEntity with status 201 (Created) and with body the new questionChoiceOptionDTO, or with status 400 (Bad Request) if the questionChoiceOption has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/question-choice-options")
    @Timed
    public ResponseEntity<QuestionChoiceOptionDTO> createQuestionChoiceOption(@Valid @RequestBody QuestionChoiceOptionDTO questionChoiceOptionDTO) throws URISyntaxException {
        log.debug("REST request to save QuestionChoiceOption : {}", questionChoiceOptionDTO);
        if (questionChoiceOptionDTO.getId() != null) {
            throw new BadRequestAlertException("A new questionChoiceOption cannot already have an ID", ENTITY_NAME, "idexists");
        }
        QuestionChoiceOptionDTO result = questionChoiceOptionService.save(questionChoiceOptionDTO);
        return ResponseEntity.created(new URI("/api/question-choice-options/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /question-choice-options : Updates an existing questionChoiceOption.
     *
     * @param questionChoiceOptionDTO the questionChoiceOptionDTO to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated questionChoiceOptionDTO,
     * or with status 400 (Bad Request) if the questionChoiceOptionDTO is not valid,
     * or with status 500 (Internal Server Error) if the questionChoiceOptionDTO couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/question-choice-options")
    @Timed
    public ResponseEntity<QuestionChoiceOptionDTO> updateQuestionChoiceOption(@Valid @RequestBody QuestionChoiceOptionDTO questionChoiceOptionDTO) throws URISyntaxException {
        log.debug("REST request to update QuestionChoiceOption : {}", questionChoiceOptionDTO);
        if (questionChoiceOptionDTO.getId() == null) {
            return createQuestionChoiceOption(questionChoiceOptionDTO);
        }
        QuestionChoiceOptionDTO result = questionChoiceOptionService.save(questionChoiceOptionDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, questionChoiceOptionDTO.getId().toString()))
            .body(result);
    }

    /**
     * GET  /question-choice-options : get all the questionChoiceOptions.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of questionChoiceOptions in body
     */
    @GetMapping("/question-choice-options")
    @Timed
    public ResponseEntity<List<QuestionChoiceOptionDTO>> getAllQuestionChoiceOptions(@RequestParam Optional<Long> questionChoiceId,
                                                                                     Pageable pageable) {
        log.debug("REST request to get a page of QuestionChoiceOptions with questionChoiceId : {}", questionChoiceId);
        Page<QuestionChoiceOptionDTO> page;

        if (questionChoiceId.isPresent()) {
            page = questionChoiceOptionService.findAllByQuestionChoice(questionChoiceId.get());

        } else {
            page = questionChoiceOptionService.findAll(pageable);
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/question-choice-options");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /question-choice-options/:id : get the "id" questionChoiceOption.
     *
     * @param id the id of the questionChoiceOptionDTO to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the questionChoiceOptionDTO, or with status 404 (Not Found)
     */
    @GetMapping("/question-choice-options/{id}")
    @Timed
    public ResponseEntity<QuestionChoiceOptionDTO> getQuestionChoiceOption(@PathVariable Long id) {
        log.debug("REST request to get QuestionChoiceOption : {}", id);
        QuestionChoiceOptionDTO questionChoiceOptionDTO = questionChoiceOptionService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(questionChoiceOptionDTO));
    }

    /**
     * DELETE  /question-choice-options/:id : delete the "id" questionChoiceOption.
     *
     * @param id the id of the questionChoiceOptionDTO to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/question-choice-options/{id}")
    @Timed
    public ResponseEntity<Void> deleteQuestionChoiceOption(@PathVariable Long id) {
        log.debug("REST request to delete QuestionChoiceOption : {}", id);
        questionChoiceOptionService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/question-choice-options?query=:query : search for the questionChoiceOption corresponding
     * to the query.
     *
     * @param query the query of the questionChoiceOption search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/question-choice-options")
    @Timed
    public ResponseEntity<List<QuestionChoiceOptionDTO>> searchQuestionChoiceOptions(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of QuestionChoiceOptions for query {}", query);
        Page<QuestionChoiceOptionDTO> page = questionChoiceOptionService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/question-choice-options");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

}
