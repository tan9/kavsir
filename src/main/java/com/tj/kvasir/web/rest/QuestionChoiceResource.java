package com.tj.kvasir.web.rest;

import com.tj.kvasir.service.QuestionChoiceService;
import com.tj.kvasir.web.rest.errors.BadRequestAlertException;
import com.tj.kvasir.service.dto.QuestionChoiceDTO;

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
 * REST controller for managing {@link com.tj.kvasir.domain.QuestionChoice}.
 */
@RestController
@RequestMapping("/api")
public class QuestionChoiceResource {

    private final Logger log = LoggerFactory.getLogger(QuestionChoiceResource.class);

    private static final String ENTITY_NAME = "questionChoice";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final QuestionChoiceService questionChoiceService;

    public QuestionChoiceResource(QuestionChoiceService questionChoiceService) {
        this.questionChoiceService = questionChoiceService;
    }

    /**
     * {@code POST  /question-choices} : Create a new questionChoice.
     *
     * @param questionChoiceDTO the questionChoiceDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new questionChoiceDTO, or with status {@code 400 (Bad Request)} if the questionChoice has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/question-choices")
    public ResponseEntity<QuestionChoiceDTO> createQuestionChoice(@Valid @RequestBody QuestionChoiceDTO questionChoiceDTO) throws URISyntaxException {
        log.debug("REST request to save QuestionChoice : {}", questionChoiceDTO);
        if (questionChoiceDTO.getId() != null) {
            throw new BadRequestAlertException("A new questionChoice cannot already have an ID", ENTITY_NAME, "idexists");
        }
        QuestionChoiceDTO result = questionChoiceService.save(questionChoiceDTO);
        return ResponseEntity.created(new URI("/api/question-choices/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /question-choices} : Updates an existing questionChoice.
     *
     * @param questionChoiceDTO the questionChoiceDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated questionChoiceDTO,
     * or with status {@code 400 (Bad Request)} if the questionChoiceDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the questionChoiceDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/question-choices")
    public ResponseEntity<QuestionChoiceDTO> updateQuestionChoice(@Valid @RequestBody QuestionChoiceDTO questionChoiceDTO) throws URISyntaxException {
        log.debug("REST request to update QuestionChoice : {}", questionChoiceDTO);
        if (questionChoiceDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        QuestionChoiceDTO result = questionChoiceService.save(questionChoiceDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, questionChoiceDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /question-choices} : get all the questionChoices.
     *
     * @param categories limiting result in categories
     * @param multi limiting result to the type of multipleResponse
     * @param pageable the pagination information.
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of questionChoices in body.
     */
    @GetMapping("/question-choices")
    public ResponseEntity<List<QuestionChoiceDTO>> getAllQuestionChoices(@RequestParam Optional<Set<Long>> categories,
                                                                         @RequestParam Optional<Boolean> multi,
                                                                         Pageable pageable, @RequestParam MultiValueMap<String, String> queryParams, UriComponentsBuilder uriBuilder, @RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get a page of QuestionChoices in categories {} with multi {}", categories, multi);
        Page<QuestionChoiceDTO> page;
        if (eagerload) {
            page = questionChoiceService.findAllWithEagerRelationships(pageable);
        } else {
            page = questionChoiceService.findAll(categories, multi, pageable);
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(uriBuilder.queryParams(queryParams), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /question-choices/:id} : get the "id" questionChoice.
     *
     * @param id the id of the questionChoiceDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the questionChoiceDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/question-choices/{id}")
    public ResponseEntity<QuestionChoiceDTO> getQuestionChoice(@PathVariable Long id) {
        log.debug("REST request to get QuestionChoice : {}", id);
        Optional<QuestionChoiceDTO> questionChoiceDTO = questionChoiceService.findOne(id);
        return ResponseUtil.wrapOrNotFound(questionChoiceDTO);
    }

    /**
     * {@code DELETE  /question-choices/:id} : delete the "id" questionChoice.
     *
     * @param id the id of the questionChoiceDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/question-choices/{id}")
    public ResponseEntity<Void> deleteQuestionChoice(@PathVariable Long id) {
        log.debug("REST request to delete QuestionChoice : {}", id);
        questionChoiceService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/question-choices?query=:query} : search for the questionChoice corresponding
     * to the query.
     *
     * @param query the query of the questionChoice search.
     * @param categories  limiting result in category
     * @param multi limiting result to the type of multipleResponse
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/question-choices")
    public ResponseEntity<List<QuestionChoiceDTO>> searchQuestionChoices(@RequestParam String query,
                                                                         @RequestParam Optional<Set<Long>> categories,
                                                                         @RequestParam Optional<Boolean> multi,
                                                                         Pageable pageable, @RequestParam MultiValueMap<String, String> queryParams, UriComponentsBuilder uriBuilder) {
        log.debug("REST request to search for a page of QuestionChoices for query {} in categories {} with multi {}", query, categories, multi);
        Page<QuestionChoiceDTO> page = questionChoiceService.search(query, categories, multi, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(uriBuilder.queryParams(queryParams), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

}
