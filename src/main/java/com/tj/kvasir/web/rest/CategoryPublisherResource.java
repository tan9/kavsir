package com.tj.kvasir.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.tj.kvasir.domain.CategoryPublisher;

import com.tj.kvasir.repository.CategoryPublisherRepository;
import com.tj.kvasir.repository.search.CategoryPublisherSearchRepository;
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
 * REST controller for managing CategoryPublisher.
 */
@RestController
@RequestMapping("/api")
public class CategoryPublisherResource {

    private final Logger log = LoggerFactory.getLogger(CategoryPublisherResource.class);

    private static final String ENTITY_NAME = "categoryPublisher";

    private final CategoryPublisherRepository categoryPublisherRepository;

    private final CategoryPublisherSearchRepository categoryPublisherSearchRepository;
    public CategoryPublisherResource(CategoryPublisherRepository categoryPublisherRepository, CategoryPublisherSearchRepository categoryPublisherSearchRepository) {
        this.categoryPublisherRepository = categoryPublisherRepository;
        this.categoryPublisherSearchRepository = categoryPublisherSearchRepository;
    }

    /**
     * POST  /category-publishers : Create a new categoryPublisher.
     *
     * @param categoryPublisher the categoryPublisher to create
     * @return the ResponseEntity with status 201 (Created) and with body the new categoryPublisher, or with status 400 (Bad Request) if the categoryPublisher has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/category-publishers")
    @Timed
    public ResponseEntity<CategoryPublisher> createCategoryPublisher(@Valid @RequestBody CategoryPublisher categoryPublisher) throws URISyntaxException {
        log.debug("REST request to save CategoryPublisher : {}", categoryPublisher);
        if (categoryPublisher.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new categoryPublisher cannot already have an ID")).body(null);
        }
        CategoryPublisher result = categoryPublisherRepository.save(categoryPublisher);
        categoryPublisherSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/category-publishers/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /category-publishers : Updates an existing categoryPublisher.
     *
     * @param categoryPublisher the categoryPublisher to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated categoryPublisher,
     * or with status 400 (Bad Request) if the categoryPublisher is not valid,
     * or with status 500 (Internal Server Error) if the categoryPublisher couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/category-publishers")
    @Timed
    public ResponseEntity<CategoryPublisher> updateCategoryPublisher(@Valid @RequestBody CategoryPublisher categoryPublisher) throws URISyntaxException {
        log.debug("REST request to update CategoryPublisher : {}", categoryPublisher);
        if (categoryPublisher.getId() == null) {
            return createCategoryPublisher(categoryPublisher);
        }
        CategoryPublisher result = categoryPublisherRepository.save(categoryPublisher);
        categoryPublisherSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, categoryPublisher.getId().toString()))
            .body(result);
    }

    /**
     * GET  /category-publishers : get all the categoryPublishers.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of categoryPublishers in body
     */
    @GetMapping("/category-publishers")
    @Timed
    public List<CategoryPublisher> getAllCategoryPublishers() {
        log.debug("REST request to get all CategoryPublishers");
        return categoryPublisherRepository.findAll();
        }

    /**
     * GET  /category-publishers/:id : get the "id" categoryPublisher.
     *
     * @param id the id of the categoryPublisher to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the categoryPublisher, or with status 404 (Not Found)
     */
    @GetMapping("/category-publishers/{id}")
    @Timed
    public ResponseEntity<CategoryPublisher> getCategoryPublisher(@PathVariable Long id) {
        log.debug("REST request to get CategoryPublisher : {}", id);
        CategoryPublisher categoryPublisher = categoryPublisherRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(categoryPublisher));
    }

    /**
     * DELETE  /category-publishers/:id : delete the "id" categoryPublisher.
     *
     * @param id the id of the categoryPublisher to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/category-publishers/{id}")
    @Timed
    public ResponseEntity<Void> deleteCategoryPublisher(@PathVariable Long id) {
        log.debug("REST request to delete CategoryPublisher : {}", id);
        categoryPublisherRepository.delete(id);
        categoryPublisherSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/category-publishers?query=:query : search for the categoryPublisher corresponding
     * to the query.
     *
     * @param query the query of the categoryPublisher search
     * @return the result of the search
     */
    @GetMapping("/_search/category-publishers")
    @Timed
    public List<CategoryPublisher> searchCategoryPublishers(@RequestParam String query) {
        log.debug("REST request to search CategoryPublishers for query {}", query);
        return StreamSupport
            .stream(categoryPublisherSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

}
