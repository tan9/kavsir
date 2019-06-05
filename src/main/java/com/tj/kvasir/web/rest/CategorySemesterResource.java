package com.tj.kvasir.web.rest;

import com.tj.kvasir.domain.CategoryNode;
import com.tj.kvasir.domain.CategorySemester;
import com.tj.kvasir.domain.enumeration.CategoryType;
import com.tj.kvasir.repository.CategoryNodeRepository;
import com.tj.kvasir.repository.CategorySemesterRepository;
import com.tj.kvasir.repository.search.CategorySemesterSearchRepository;
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
 * REST controller for managing {@link com.tj.kvasir.domain.CategorySemester}.
 */
@RestController
@RequestMapping("/api")
public class CategorySemesterResource {

    private final Logger log = LoggerFactory.getLogger(CategorySemesterResource.class);

    private static final String ENTITY_NAME = "categorySemester";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CategorySemesterRepository categorySemesterRepository;

    private final CategorySemesterSearchRepository categorySemesterSearchRepository;

    private final CategoryNodeRepository categoryNodeRepository;

    public CategorySemesterResource(CategorySemesterRepository categorySemesterRepository, CategorySemesterSearchRepository categorySemesterSearchRepository, CategoryNodeRepository categoryNodeRepository) {
        this.categorySemesterRepository = categorySemesterRepository;
        this.categorySemesterSearchRepository = categorySemesterSearchRepository;
        this.categoryNodeRepository = categoryNodeRepository;
    }

    /**
     * {@code POST  /category-semesters} : Create a new categorySemester.
     *
     * @param categorySemester the categorySemester to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new categorySemester, or with status {@code 400 (Bad Request)} if the categorySemester has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/category-semesters")
    public ResponseEntity<CategorySemester> createCategorySemester(@Valid @RequestBody CategorySemester categorySemester) throws URISyntaxException {
        log.debug("REST request to save CategorySemester : {}", categorySemester);
        if (categorySemester.getId() != null) {
            throw new BadRequestAlertException("A new categorySemester cannot already have an ID", ENTITY_NAME, "idexists");
        }
        CategorySemester result = categorySemesterRepository.save(categorySemester);
        categorySemesterSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/category-semesters/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /category-semesters} : Updates an existing categorySemester.
     *
     * @param categorySemester the categorySemester to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated categorySemester,
     * or with status {@code 400 (Bad Request)} if the categorySemester is not valid,
     * or with status {@code 500 (Internal Server Error)} if the categorySemester couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/category-semesters")
    public ResponseEntity<CategorySemester> updateCategorySemester(@Valid @RequestBody CategorySemester categorySemester) throws URISyntaxException {
        log.debug("REST request to update CategorySemester : {}", categorySemester);
        if (categorySemester.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        CategorySemester result = categorySemesterRepository.save(categorySemester);
        categorySemesterSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, categorySemester.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /category-semesters} : get all the categorySemesters.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of categorySemesters in body.
     */
    @GetMapping("/category-semesters")
    public List<CategorySemester> getAllCategorySemesters() {
        log.debug("REST request to get all CategorySemesters");
        return categorySemesterRepository.findAll();
    }

    /**
     * {@code GET  /category-semesters/:id} : get the "id" categorySemester.
     *
     * @param id the id of the categorySemester to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the categorySemester, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/category-semesters/{id}")
    public ResponseEntity<CategorySemester> getCategorySemester(@PathVariable Long id) {
        log.debug("REST request to get CategorySemester : {}", id);
        Optional<CategorySemester> categorySemester = categorySemesterRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(categorySemester);
    }

    /**
     * {@code DELETE  /category-semesters/:id} : delete the "id" categorySemester.
     *
     * @param id the id of the categorySemester to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/category-semesters/{id}")
    public ResponseEntity<Void> deleteCategorySemester(@PathVariable Long id) {
        log.debug("REST request to delete CategorySemester : {}", id);
        CategoryNode node = new CategoryNode();
        node.setType(CategoryType.SEMESTER);
        node.setTypeId(id);
        List<CategoryNode> nodes = categoryNodeRepository.findAll(Example.of(node));
        if (nodes.isEmpty()) {
            categorySemesterRepository.deleteById(id);
            categorySemesterSearchRepository.deleteById(id);
            return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
        } else {
            HttpHeaders alert = HeaderUtil.createFailureAlert(applicationName, true, ENTITY_NAME, "categoryinuse", "Can not delete category in use");
            return ResponseEntity.status(HttpStatus.CONFLICT).headers(alert).build();
        }
    }

    /**
     * {@code SEARCH  /_search/category-semesters?query=:query} : search for the categorySemester corresponding
     * to the query.
     *
     * @param query the query of the categorySemester search.
     * @return the result of the search.
     */
    @GetMapping("/_search/category-semesters")
    public List<CategorySemester> searchCategorySemesters(@RequestParam String query) {
        log.debug("REST request to search CategorySemesters for query {}", query);
        return StreamSupport
            .stream(categorySemesterSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

}
