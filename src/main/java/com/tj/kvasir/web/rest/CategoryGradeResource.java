package com.tj.kvasir.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.tj.kvasir.domain.CategoryGrade;

import com.tj.kvasir.repository.CategoryGradeRepository;
import com.tj.kvasir.repository.search.CategoryGradeSearchRepository;
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
 * REST controller for managing CategoryGrade.
 */
@RestController
@RequestMapping("/api")
public class CategoryGradeResource {

    private final Logger log = LoggerFactory.getLogger(CategoryGradeResource.class);

    private static final String ENTITY_NAME = "categoryGrade";

    private final CategoryGradeRepository categoryGradeRepository;

    private final CategoryGradeSearchRepository categoryGradeSearchRepository;
    public CategoryGradeResource(CategoryGradeRepository categoryGradeRepository, CategoryGradeSearchRepository categoryGradeSearchRepository) {
        this.categoryGradeRepository = categoryGradeRepository;
        this.categoryGradeSearchRepository = categoryGradeSearchRepository;
    }

    /**
     * POST  /category-grades : Create a new categoryGrade.
     *
     * @param categoryGrade the categoryGrade to create
     * @return the ResponseEntity with status 201 (Created) and with body the new categoryGrade, or with status 400 (Bad Request) if the categoryGrade has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/category-grades")
    @Timed
    public ResponseEntity<CategoryGrade> createCategoryGrade(@Valid @RequestBody CategoryGrade categoryGrade) throws URISyntaxException {
        log.debug("REST request to save CategoryGrade : {}", categoryGrade);
        if (categoryGrade.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new categoryGrade cannot already have an ID")).body(null);
        }
        CategoryGrade result = categoryGradeRepository.save(categoryGrade);
        categoryGradeSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/category-grades/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /category-grades : Updates an existing categoryGrade.
     *
     * @param categoryGrade the categoryGrade to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated categoryGrade,
     * or with status 400 (Bad Request) if the categoryGrade is not valid,
     * or with status 500 (Internal Server Error) if the categoryGrade couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/category-grades")
    @Timed
    public ResponseEntity<CategoryGrade> updateCategoryGrade(@Valid @RequestBody CategoryGrade categoryGrade) throws URISyntaxException {
        log.debug("REST request to update CategoryGrade : {}", categoryGrade);
        if (categoryGrade.getId() == null) {
            return createCategoryGrade(categoryGrade);
        }
        CategoryGrade result = categoryGradeRepository.save(categoryGrade);
        categoryGradeSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, categoryGrade.getId().toString()))
            .body(result);
    }

    /**
     * GET  /category-grades : get all the categoryGrades.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of categoryGrades in body
     */
    @GetMapping("/category-grades")
    @Timed
    public List<CategoryGrade> getAllCategoryGrades() {
        log.debug("REST request to get all CategoryGrades");
        return categoryGradeRepository.findAll();
        }

    /**
     * GET  /category-grades/:id : get the "id" categoryGrade.
     *
     * @param id the id of the categoryGrade to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the categoryGrade, or with status 404 (Not Found)
     */
    @GetMapping("/category-grades/{id}")
    @Timed
    public ResponseEntity<CategoryGrade> getCategoryGrade(@PathVariable Long id) {
        log.debug("REST request to get CategoryGrade : {}", id);
        CategoryGrade categoryGrade = categoryGradeRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(categoryGrade));
    }

    /**
     * DELETE  /category-grades/:id : delete the "id" categoryGrade.
     *
     * @param id the id of the categoryGrade to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/category-grades/{id}")
    @Timed
    public ResponseEntity<Void> deleteCategoryGrade(@PathVariable Long id) {
        log.debug("REST request to delete CategoryGrade : {}", id);
        categoryGradeRepository.delete(id);
        categoryGradeSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/category-grades?query=:query : search for the categoryGrade corresponding
     * to the query.
     *
     * @param query the query of the categoryGrade search
     * @return the result of the search
     */
    @GetMapping("/_search/category-grades")
    @Timed
    public List<CategoryGrade> searchCategoryGrades(@RequestParam String query) {
        log.debug("REST request to search CategoryGrades for query {}", query);
        return StreamSupport
            .stream(categoryGradeSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

}
