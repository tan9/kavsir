package com.tj.kvasir.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.tj.kvasir.domain.CategoryNode;
import com.tj.kvasir.domain.CategorySemester;

import com.tj.kvasir.domain.enumeration.CategoryType;
import com.tj.kvasir.repository.CategoryNodeRepository;
import com.tj.kvasir.repository.CategorySemesterRepository;
import com.tj.kvasir.repository.search.CategorySemesterSearchRepository;
import com.tj.kvasir.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
 * REST controller for managing CategorySemester.
 */
@RestController
@RequestMapping("/api")
public class CategorySemesterResource {

    private final Logger log = LoggerFactory.getLogger(CategorySemesterResource.class);

    private static final String ENTITY_NAME = "categorySemester";

    private final CategorySemesterRepository categorySemesterRepository;

    private final CategorySemesterSearchRepository categorySemesterSearchRepository;

    private final CategoryNodeRepository categoryNodeRepository;

    public CategorySemesterResource(CategorySemesterRepository categorySemesterRepository, CategorySemesterSearchRepository categorySemesterSearchRepository, CategoryNodeRepository categoryNodeRepository) {
        this.categorySemesterRepository = categorySemesterRepository;
        this.categorySemesterSearchRepository = categorySemesterSearchRepository;
        this.categoryNodeRepository = categoryNodeRepository;
    }

    /**
     * POST  /category-semesters : Create a new categorySemester.
     *
     * @param categorySemester the categorySemester to create
     * @return the ResponseEntity with status 201 (Created) and with body the new categorySemester, or with status 400 (Bad Request) if the categorySemester has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/category-semesters")
    @Timed
    public ResponseEntity<CategorySemester> createCategorySemester(@Valid @RequestBody CategorySemester categorySemester) throws URISyntaxException {
        log.debug("REST request to save CategorySemester : {}", categorySemester);
        if (categorySemester.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new categorySemester cannot already have an ID")).body(null);
        }
        CategorySemester result = categorySemesterRepository.save(categorySemester);
        categorySemesterSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/category-semesters/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /category-semesters : Updates an existing categorySemester.
     *
     * @param categorySemester the categorySemester to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated categorySemester,
     * or with status 400 (Bad Request) if the categorySemester is not valid,
     * or with status 500 (Internal Server Error) if the categorySemester couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/category-semesters")
    @Timed
    public ResponseEntity<CategorySemester> updateCategorySemester(@Valid @RequestBody CategorySemester categorySemester) throws URISyntaxException {
        log.debug("REST request to update CategorySemester : {}", categorySemester);
        if (categorySemester.getId() == null) {
            return createCategorySemester(categorySemester);
        }
        CategorySemester result = categorySemesterRepository.save(categorySemester);
        categorySemesterSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, categorySemester.getId().toString()))
            .body(result);
    }

    /**
     * GET  /category-semesters : get all the categorySemesters.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of categorySemesters in body
     */
    @GetMapping("/category-semesters")
    @Timed
    public List<CategorySemester> getAllCategorySemesters() {
        log.debug("REST request to get all CategorySemesters");
        return categorySemesterRepository.findAll();
    }

    /**
     * GET  /category-semesters/:id : get the "id" categorySemester.
     *
     * @param id the id of the categorySemester to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the categorySemester, or with status 404 (Not Found)
     */
    @GetMapping("/category-semesters/{id}")
    @Timed
    public ResponseEntity<CategorySemester> getCategorySemester(@PathVariable Long id) {
        log.debug("REST request to get CategorySemester : {}", id);
        CategorySemester categorySemester = categorySemesterRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(categorySemester));
    }

    /**
     * DELETE  /category-semesters/:id : delete the "id" categorySemester.
     *
     * @param id the id of the categorySemester to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/category-semesters/{id}")
    @Timed
    public ResponseEntity<Void> deleteCategorySemester(@PathVariable Long id) {
        log.debug("REST request to delete CategorySemester : {}", id);
        CategoryNode node = new CategoryNode();
        node.setType(CategoryType.SEMESTER);
        node.setTypeId(id);
        List<CategoryNode> nodes = categoryNodeRepository.findAll(Example.of(node));
        if (nodes.isEmpty()) {
            categorySemesterRepository.delete(id);
            categorySemesterSearchRepository.delete(id);
            return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
        } else {
            HttpHeaders alert = HeaderUtil.createFailureAlert(ENTITY_NAME, "categoryinuse", "Can not delete category in use");
            return ResponseEntity.status(HttpStatus.CONFLICT).headers(alert).build();
        }
    }

    /**
     * SEARCH  /_search/category-semesters?query=:query : search for the categorySemester corresponding
     * to the query.
     *
     * @param query the query of the categorySemester search
     * @return the result of the search
     */
    @GetMapping("/_search/category-semesters")
    @Timed
    public List<CategorySemester> searchCategorySemesters(@RequestParam String query) {
        log.debug("REST request to search CategorySemesters for query {}", query);
        return StreamSupport
            .stream(categorySemesterSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

}
