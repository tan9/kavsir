package com.tj.kvasir.web.rest;

import com.tj.kvasir.service.QuestionChoiceOptionService;
import com.tj.kvasir.web.rest.errors.BadRequestAlertException;
import com.tj.kvasir.service.dto.QuestionChoiceOptionDTO;

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
 * REST controller for managing {@link com.tj.kvasir.domain.QuestionChoiceOption}.
 */
@RestController
@RequestMapping("/api")
public class QuestionChoiceOptionResource {

    private final Logger log = LoggerFactory.getLogger(QuestionChoiceOptionResource.class);

    private static final String ENTITY_NAME = "questionChoiceOption";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final QuestionChoiceOptionService questionChoiceOptionService;

    public QuestionChoiceOptionResource(QuestionChoiceOptionService questionChoiceOptionService) {
        this.questionChoiceOptionService = questionChoiceOptionService;
    }

    /**
     * {@code POST  /question-choice-options} : Create a new questionChoiceOption.
     *
     * @param questionChoiceOptionDTO the questionChoiceOptionDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new questionChoiceOptionDTO, or with status {@code 400 (Bad Request)} if the questionChoiceOption has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/question-choice-options")
    public ResponseEntity<QuestionChoiceOptionDTO> createQuestionChoiceOption(@Valid @RequestBody QuestionChoiceOptionDTO questionChoiceOptionDTO) throws URISyntaxException {
        log.debug("REST request to save QuestionChoiceOption : {}", questionChoiceOptionDTO);
        if (questionChoiceOptionDTO.getId() != null) {
            throw new BadRequestAlertException("A new questionChoiceOption cannot already have an ID", ENTITY_NAME, "idexists");
        }
        QuestionChoiceOptionDTO result = questionChoiceOptionService.save(questionChoiceOptionDTO);
        return ResponseEntity.created(new URI("/api/question-choice-options/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /question-choice-options} : Updates an existing questionChoiceOption.
     *
     * @param questionChoiceOptionDTO the questionChoiceOptionDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated questionChoiceOptionDTO,
     * or with status {@code 400 (Bad Request)} if the questionChoiceOptionDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the questionChoiceOptionDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/question-choice-options")
    public ResponseEntity<QuestionChoiceOptionDTO> updateQuestionChoiceOption(@Valid @RequestBody QuestionChoiceOptionDTO questionChoiceOptionDTO) throws URISyntaxException {
        log.debug("REST request to update QuestionChoiceOption : {}", questionChoiceOptionDTO);
        if (questionChoiceOptionDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        QuestionChoiceOptionDTO result = questionChoiceOptionService.save(questionChoiceOptionDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, questionChoiceOptionDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /question-choice-options} : get all the questionChoiceOptions.
     *
     * @param pageable the pagination information.
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of questionChoiceOptions in body.
     */
    @GetMapping("/question-choice-options")
    public ResponseEntity<List<QuestionChoiceOptionDTO>> getAllQuestionChoiceOptions(Pageable pageable, @RequestParam MultiValueMap<String, String> queryParams, UriComponentsBuilder uriBuilder, @RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get a page of QuestionChoiceOptions");
        Page<QuestionChoiceOptionDTO> page;
        if (eagerload) {
            page = questionChoiceOptionService.findAllWithEagerRelationships(pageable);
        } else {
            page = questionChoiceOptionService.findAll(pageable);
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(uriBuilder.queryParams(queryParams), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /question-choice-options/:id} : get the "id" questionChoiceOption.
     *
     * @param id the id of the questionChoiceOptionDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the questionChoiceOptionDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/question-choice-options/{id}")
    public ResponseEntity<QuestionChoiceOptionDTO> getQuestionChoiceOption(@PathVariable Long id) {
        log.debug("REST request to get QuestionChoiceOption : {}", id);
        Optional<QuestionChoiceOptionDTO> questionChoiceOptionDTO = questionChoiceOptionService.findOne(id);
        return ResponseUtil.wrapOrNotFound(questionChoiceOptionDTO);
    }

    /**
     * {@code DELETE  /question-choice-options/:id} : delete the "id" questionChoiceOption.
     *
     * @param id the id of the questionChoiceOptionDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/question-choice-options/{id}")
    public ResponseEntity<Void> deleteQuestionChoiceOption(@PathVariable Long id) {
        log.debug("REST request to delete QuestionChoiceOption : {}", id);
        questionChoiceOptionService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/question-choice-options?query=:query} : search for the questionChoiceOption corresponding
     * to the query.
     *
     * @param query the query of the questionChoiceOption search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/question-choice-options")
    public ResponseEntity<List<QuestionChoiceOptionDTO>> searchQuestionChoiceOptions(@RequestParam String query, Pageable pageable, @RequestParam MultiValueMap<String, String> queryParams, UriComponentsBuilder uriBuilder) {
        log.debug("REST request to search for a page of QuestionChoiceOptions for query {}", query);
        Page<QuestionChoiceOptionDTO> page = questionChoiceOptionService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(uriBuilder.queryParams(queryParams), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

}
