package com.tj.kvasir.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.tj.kvasir.domain.CategorySource;

import com.tj.kvasir.repository.CategorySourceRepository;
import com.tj.kvasir.repository.search.CategorySourceSearchRepository;
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
 * REST controller for managing CategorySource.
 */
@RestController
@RequestMapping("/api")
public class CategorySourceResource {

    private final Logger log = LoggerFactory.getLogger(CategorySourceResource.class);

    private static final String ENTITY_NAME = "categorySource";

    private final CategorySourceRepository categorySourceRepository;

    private final CategorySourceSearchRepository categorySourceSearchRepository;
    public CategorySourceResource(CategorySourceRepository categorySourceRepository, CategorySourceSearchRepository categorySourceSearchRepository) {
        this.categorySourceRepository = categorySourceRepository;
        this.categorySourceSearchRepository = categorySourceSearchRepository;
    }

    /**
     * POST  /category-sources : Create a new categorySource.
     *
     * @param categorySource the categorySource to create
     * @return the ResponseEntity with status 201 (Created) and with body the new categorySource, or with status 400 (Bad Request) if the categorySource has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/category-sources")
    @Timed
    public ResponseEntity<CategorySource> createCategorySource(@Valid @RequestBody CategorySource categorySource) throws URISyntaxException {
        log.debug("REST request to save CategorySource : {}", categorySource);
        if (categorySource.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new categorySource cannot already have an ID")).body(null);
        }
        CategorySource result = categorySourceRepository.save(categorySource);
        categorySourceSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/category-sources/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /category-sources : Updates an existing categorySource.
     *
     * @param categorySource the categorySource to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated categorySource,
     * or with status 400 (Bad Request) if the categorySource is not valid,
     * or with status 500 (Internal Server Error) if the categorySource couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/category-sources")
    @Timed
    public ResponseEntity<CategorySource> updateCategorySource(@Valid @RequestBody CategorySource categorySource) throws URISyntaxException {
        log.debug("REST request to update CategorySource : {}", categorySource);
        if (categorySource.getId() == null) {
            return createCategorySource(categorySource);
        }
        CategorySource result = categorySourceRepository.save(categorySource);
        categorySourceSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, categorySource.getId().toString()))
            .body(result);
    }

    /**
     * GET  /category-sources : get all the categorySources.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of categorySources in body
     */
    @GetMapping("/category-sources")
    @Timed
    public List<CategorySource> getAllCategorySources() {
        log.debug("REST request to get all CategorySources");
        return categorySourceRepository.findAll();
        }

    /**
     * GET  /category-sources/:id : get the "id" categorySource.
     *
     * @param id the id of the categorySource to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the categorySource, or with status 404 (Not Found)
     */
    @GetMapping("/category-sources/{id}")
    @Timed
    public ResponseEntity<CategorySource> getCategorySource(@PathVariable Long id) {
        log.debug("REST request to get CategorySource : {}", id);
        CategorySource categorySource = categorySourceRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(categorySource));
    }

    /**
     * DELETE  /category-sources/:id : delete the "id" categorySource.
     *
     * @param id the id of the categorySource to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/category-sources/{id}")
    @Timed
    public ResponseEntity<Void> deleteCategorySource(@PathVariable Long id) {
        log.debug("REST request to delete CategorySource : {}", id);
        categorySourceRepository.delete(id);
        categorySourceSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/category-sources?query=:query : search for the categorySource corresponding
     * to the query.
     *
     * @param query the query of the categorySource search
     * @return the result of the search
     */
    @GetMapping("/_search/category-sources")
    @Timed
    public List<CategorySource> searchCategorySources(@RequestParam String query) {
        log.debug("REST request to search CategorySources for query {}", query);
        return StreamSupport
            .stream(categorySourceSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

}
