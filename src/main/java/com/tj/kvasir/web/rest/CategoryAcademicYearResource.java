package com.tj.kvasir.web.rest;

import com.tj.kvasir.domain.CategoryAcademicYear;
import com.tj.kvasir.repository.CategoryAcademicYearRepository;
import com.tj.kvasir.repository.search.CategoryAcademicYearSearchRepository;
import com.tj.kvasir.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
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
 * REST controller for managing {@link com.tj.kvasir.domain.CategoryAcademicYear}.
 */
@RestController
@RequestMapping("/api")
public class CategoryAcademicYearResource {

    private final Logger log = LoggerFactory.getLogger(CategoryAcademicYearResource.class);

    private static final String ENTITY_NAME = "categoryAcademicYear";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CategoryAcademicYearRepository categoryAcademicYearRepository;

    private final CategoryAcademicYearSearchRepository categoryAcademicYearSearchRepository;

    public CategoryAcademicYearResource(CategoryAcademicYearRepository categoryAcademicYearRepository, CategoryAcademicYearSearchRepository categoryAcademicYearSearchRepository) {
        this.categoryAcademicYearRepository = categoryAcademicYearRepository;
        this.categoryAcademicYearSearchRepository = categoryAcademicYearSearchRepository;
    }

    /**
     * {@code POST  /category-academic-years} : Create a new categoryAcademicYear.
     *
     * @param categoryAcademicYear the categoryAcademicYear to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new categoryAcademicYear, or with status {@code 400 (Bad Request)} if the categoryAcademicYear has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/category-academic-years")
    public ResponseEntity<CategoryAcademicYear> createCategoryAcademicYear(@Valid @RequestBody CategoryAcademicYear categoryAcademicYear) throws URISyntaxException {
        log.debug("REST request to save CategoryAcademicYear : {}", categoryAcademicYear);
        if (categoryAcademicYear.getId() != null) {
            throw new BadRequestAlertException("A new categoryAcademicYear cannot already have an ID", ENTITY_NAME, "idexists");
        }
        CategoryAcademicYear result = categoryAcademicYearRepository.save(categoryAcademicYear);
        categoryAcademicYearSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/category-academic-years/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /category-academic-years} : Updates an existing categoryAcademicYear.
     *
     * @param categoryAcademicYear the categoryAcademicYear to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated categoryAcademicYear,
     * or with status {@code 400 (Bad Request)} if the categoryAcademicYear is not valid,
     * or with status {@code 500 (Internal Server Error)} if the categoryAcademicYear couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/category-academic-years")
    public ResponseEntity<CategoryAcademicYear> updateCategoryAcademicYear(@Valid @RequestBody CategoryAcademicYear categoryAcademicYear) throws URISyntaxException {
        log.debug("REST request to update CategoryAcademicYear : {}", categoryAcademicYear);
        if (categoryAcademicYear.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        CategoryAcademicYear result = categoryAcademicYearRepository.save(categoryAcademicYear);
        categoryAcademicYearSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, categoryAcademicYear.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /category-academic-years} : get all the categoryAcademicYears.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of categoryAcademicYears in body.
     */
    @GetMapping("/category-academic-years")
    public List<CategoryAcademicYear> getAllCategoryAcademicYears() {
        log.debug("REST request to get all CategoryAcademicYears");
        return categoryAcademicYearRepository.findAll();
    }

    /**
     * {@code GET  /category-academic-years/:id} : get the "id" categoryAcademicYear.
     *
     * @param id the id of the categoryAcademicYear to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the categoryAcademicYear, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/category-academic-years/{id}")
    public ResponseEntity<CategoryAcademicYear> getCategoryAcademicYear(@PathVariable Long id) {
        log.debug("REST request to get CategoryAcademicYear : {}", id);
        Optional<CategoryAcademicYear> categoryAcademicYear = categoryAcademicYearRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(categoryAcademicYear);
    }

    /**
     * {@code DELETE  /category-academic-years/:id} : delete the "id" categoryAcademicYear.
     *
     * @param id the id of the categoryAcademicYear to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/category-academic-years/{id}")
    public ResponseEntity<Void> deleteCategoryAcademicYear(@PathVariable Long id) {
        log.debug("REST request to delete CategoryAcademicYear : {}", id);
        categoryAcademicYearRepository.deleteById(id);
        categoryAcademicYearSearchRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/category-academic-years?query=:query} : search for the categoryAcademicYear corresponding
     * to the query.
     *
     * @param query the query of the categoryAcademicYear search.
     * @return the result of the search.
     */
    @GetMapping("/_search/category-academic-years")
    public List<CategoryAcademicYear> searchCategoryAcademicYears(@RequestParam String query) {
        log.debug("REST request to search CategoryAcademicYears for query {}", query);
        return StreamSupport
            .stream(categoryAcademicYearSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

}
