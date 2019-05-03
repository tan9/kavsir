package com.tj.kvasir.web.rest;

import com.tj.kvasir.domain.CategorySubject;
import com.tj.kvasir.repository.CategorySubjectRepository;
import com.tj.kvasir.repository.search.CategorySubjectSearchRepository;
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
 * REST controller for managing {@link com.tj.kvasir.domain.CategorySubject}.
 */
@RestController
@RequestMapping("/api")
public class CategorySubjectResource {

    private final Logger log = LoggerFactory.getLogger(CategorySubjectResource.class);

    private static final String ENTITY_NAME = "categorySubject";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CategorySubjectRepository categorySubjectRepository;

    private final CategorySubjectSearchRepository categorySubjectSearchRepository;

    public CategorySubjectResource(CategorySubjectRepository categorySubjectRepository, CategorySubjectSearchRepository categorySubjectSearchRepository) {
        this.categorySubjectRepository = categorySubjectRepository;
        this.categorySubjectSearchRepository = categorySubjectSearchRepository;
    }

    /**
     * {@code POST  /category-subjects} : Create a new categorySubject.
     *
     * @param categorySubject the categorySubject to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new categorySubject, or with status {@code 400 (Bad Request)} if the categorySubject has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/category-subjects")
    public ResponseEntity<CategorySubject> createCategorySubject(@Valid @RequestBody CategorySubject categorySubject) throws URISyntaxException {
        log.debug("REST request to save CategorySubject : {}", categorySubject);
        if (categorySubject.getId() != null) {
            throw new BadRequestAlertException("A new categorySubject cannot already have an ID", ENTITY_NAME, "idexists");
        }
        CategorySubject result = categorySubjectRepository.save(categorySubject);
        categorySubjectSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/category-subjects/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /category-subjects} : Updates an existing categorySubject.
     *
     * @param categorySubject the categorySubject to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated categorySubject,
     * or with status {@code 400 (Bad Request)} if the categorySubject is not valid,
     * or with status {@code 500 (Internal Server Error)} if the categorySubject couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/category-subjects")
    public ResponseEntity<CategorySubject> updateCategorySubject(@Valid @RequestBody CategorySubject categorySubject) throws URISyntaxException {
        log.debug("REST request to update CategorySubject : {}", categorySubject);
        if (categorySubject.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        CategorySubject result = categorySubjectRepository.save(categorySubject);
        categorySubjectSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, categorySubject.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /category-subjects} : get all the categorySubjects.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of categorySubjects in body.
     */
    @GetMapping("/category-subjects")
    public List<CategorySubject> getAllCategorySubjects() {
        log.debug("REST request to get all CategorySubjects");
        return categorySubjectRepository.findAll();
    }

    /**
     * {@code GET  /category-subjects/:id} : get the "id" categorySubject.
     *
     * @param id the id of the categorySubject to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the categorySubject, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/category-subjects/{id}")
    public ResponseEntity<CategorySubject> getCategorySubject(@PathVariable Long id) {
        log.debug("REST request to get CategorySubject : {}", id);
        Optional<CategorySubject> categorySubject = categorySubjectRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(categorySubject);
    }

    /**
     * {@code DELETE  /category-subjects/:id} : delete the "id" categorySubject.
     *
     * @param id the id of the categorySubject to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/category-subjects/{id}")
    public ResponseEntity<Void> deleteCategorySubject(@PathVariable Long id) {
        log.debug("REST request to delete CategorySubject : {}", id);
        categorySubjectRepository.deleteById(id);
        categorySubjectSearchRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/category-subjects?query=:query} : search for the categorySubject corresponding
     * to the query.
     *
     * @param query the query of the categorySubject search.
     * @return the result of the search.
     */
    @GetMapping("/_search/category-subjects")
    public List<CategorySubject> searchCategorySubjects(@RequestParam String query) {
        log.debug("REST request to search CategorySubjects for query {}", query);
        return StreamSupport
            .stream(categorySubjectSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

}
