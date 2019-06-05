package com.tj.kvasir.web.rest;

import com.tj.kvasir.domain.CategoryNode;
import com.tj.kvasir.domain.CategorySource;
import com.tj.kvasir.domain.enumeration.CategoryType;
import com.tj.kvasir.repository.CategoryNodeRepository;
import com.tj.kvasir.repository.CategorySourceRepository;
import com.tj.kvasir.repository.search.CategorySourceSearchRepository;

import com.tj.kvasir.web.rest.errors.BadRequestAlertException;
import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Example;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
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
 * REST controller for managing {@link com.tj.kvasir.domain.CategorySource}.
 */
@RestController
@RequestMapping("/api")
public class CategorySourceResource {

    private final Logger log = LoggerFactory.getLogger(CategorySourceResource.class);

    private static final String ENTITY_NAME = "categorySource";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CategorySourceRepository categorySourceRepository;

    private final CategorySourceSearchRepository categorySourceSearchRepository;

    private final CategoryNodeRepository categoryNodeRepository;

    public CategorySourceResource(CategorySourceRepository categorySourceRepository, CategorySourceSearchRepository categorySourceSearchRepository, CategoryNodeRepository categoryNodeRepository) {
        this.categorySourceRepository = categorySourceRepository;
        this.categorySourceSearchRepository = categorySourceSearchRepository;
        this.categoryNodeRepository = categoryNodeRepository;
    }

    /**
     * {@code POST  /category-sources} : Create a new categorySource.
     *
     * @param categorySource the categorySource to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new categorySource, or with status {@code 400 (Bad Request)} if the categorySource has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/category-sources")
    public ResponseEntity<CategorySource> createCategorySource(@Valid @RequestBody CategorySource categorySource) throws URISyntaxException {
        log.debug("REST request to save CategorySource : {}", categorySource);
        if (categorySource.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(applicationName, true, ENTITY_NAME, "idexists", "A new categorySource cannot already have an ID")).body(null);
        }
        CategorySource result = categorySourceRepository.save(categorySource);
        categorySourceSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/category-sources/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /category-sources} : Updates an existing categorySource.
     *
     * @param categorySource the categorySource to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated categorySource,
     * or with status {@code 400 (Bad Request)} if the categorySource is not valid,
     * or with status {@code 500 (Internal Server Error)} if the categorySource couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/category-sources")
    public ResponseEntity<CategorySource> updateCategorySource(@Valid @RequestBody CategorySource categorySource) throws URISyntaxException {
        log.debug("REST request to update CategorySource : {}", categorySource);
        if (categorySource.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        CategorySource result = categorySourceRepository.save(categorySource);
        categorySourceSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, categorySource.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /category-sources} : get all the categorySources.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of categorySources in body.
     */
    @GetMapping("/category-sources")
    public List<CategorySource> getAllCategorySources() {
        log.debug("REST request to get all CategorySources");
        return categorySourceRepository.findAll();
    }

    /**
     * {@code GET  /category-sources/:id} : get the "id" categorySource.
     *
     * @param id the id of the categorySource to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the categorySource, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/category-sources/{id}")
    public ResponseEntity<CategorySource> getCategorySource(@PathVariable Long id) {
        log.debug("REST request to get CategorySource : {}", id);
        Optional<CategorySource> categorySource = categorySourceRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(categorySource);
    }

    /**
     * {@code DELETE  /category-sources/:id} : delete the "id" categorySource.
     *
     * @param id the id of the categorySource to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/category-sources/{id}")
    public ResponseEntity<Void> deleteCategorySource(@PathVariable Long id) {
        log.debug("REST request to delete CategorySource : {}", id);
        CategoryNode node = new CategoryNode();
        node.setType(CategoryType.SOURCE);
        node.setTypeId(id);
        List<CategoryNode> nodes = categoryNodeRepository.findAll(Example.of(node));
        if (nodes.isEmpty()) {
            categorySourceRepository.deleteById(id);
            categorySourceSearchRepository.deleteById(id);
            return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
        } else {
            HttpHeaders alert = HeaderUtil.createFailureAlert(applicationName, true, ENTITY_NAME, "categoryinuse", "Can not delete category in use");
            return ResponseEntity.status(HttpStatus.CONFLICT).headers(alert).build();
        }
    }

    /**
     * {@code SEARCH  /_search/category-sources?query=:query} : search for the categorySource corresponding
     * to the query.
     *
     * @param query the query of the categorySource search.
     * @return the result of the search.
     */
    @GetMapping("/_search/category-sources")
    public List<CategorySource> searchCategorySources(@RequestParam String query) {
        log.debug("REST request to search CategorySources for query {}", query);
        return StreamSupport
            .stream(categorySourceSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

}
