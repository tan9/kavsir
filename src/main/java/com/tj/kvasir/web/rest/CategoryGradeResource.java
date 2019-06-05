package com.tj.kvasir.web.rest;

import com.tj.kvasir.domain.CategoryGrade;
import com.tj.kvasir.domain.CategoryNode;
import com.tj.kvasir.domain.enumeration.CategoryType;
import com.tj.kvasir.repository.CategoryGradeRepository;
import com.tj.kvasir.repository.CategoryNodeRepository;
import com.tj.kvasir.repository.search.CategoryGradeSearchRepository;
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
 * REST controller for managing {@link com.tj.kvasir.domain.CategoryGrade}.
 */
@RestController
@RequestMapping("/api")
public class CategoryGradeResource {

    private final Logger log = LoggerFactory.getLogger(CategoryGradeResource.class);

    private static final String ENTITY_NAME = "categoryGrade";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CategoryGradeRepository categoryGradeRepository;

    private final CategoryGradeSearchRepository categoryGradeSearchRepository;

    private final CategoryNodeRepository categoryNodeRepository;

    public CategoryGradeResource(CategoryGradeRepository categoryGradeRepository, CategoryGradeSearchRepository categoryGradeSearchRepository, CategoryNodeRepository categoryNodeRepository) {
        this.categoryGradeRepository = categoryGradeRepository;
        this.categoryGradeSearchRepository = categoryGradeSearchRepository;
        this.categoryNodeRepository = categoryNodeRepository;
    }

    /**
     * {@code POST  /category-grades} : Create a new categoryGrade.
     *
     * @param categoryGrade the categoryGrade to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new categoryGrade, or with status {@code 400 (Bad Request)} if the categoryGrade has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/category-grades")
    public ResponseEntity<CategoryGrade> createCategoryGrade(@Valid @RequestBody CategoryGrade categoryGrade) throws URISyntaxException {
        log.debug("REST request to save CategoryGrade : {}", categoryGrade);
        if (categoryGrade.getId() != null) {
            throw new BadRequestAlertException("A new categoryGrade cannot already have an ID", ENTITY_NAME, "idexists");
        }
        CategoryGrade result = categoryGradeRepository.save(categoryGrade);
        categoryGradeSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/category-grades/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /category-grades} : Updates an existing categoryGrade.
     *
     * @param categoryGrade the categoryGrade to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated categoryGrade,
     * or with status {@code 400 (Bad Request)} if the categoryGrade is not valid,
     * or with status {@code 500 (Internal Server Error)} if the categoryGrade couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/category-grades")
    public ResponseEntity<CategoryGrade> updateCategoryGrade(@Valid @RequestBody CategoryGrade categoryGrade) throws URISyntaxException {
        log.debug("REST request to update CategoryGrade : {}", categoryGrade);
        if (categoryGrade.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        CategoryGrade result = categoryGradeRepository.save(categoryGrade);
        categoryGradeSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, categoryGrade.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /category-grades} : get all the categoryGrades.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of categoryGrades in body.
     */
    @GetMapping("/category-grades")
    public List<CategoryGrade> getAllCategoryGrades() {
        log.debug("REST request to get all CategoryGrades");
        return categoryGradeRepository.findAll();
    }

    /**
     * {@code GET  /category-grades/:id} : get the "id" categoryGrade.
     *
     * @param id the id of the categoryGrade to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the categoryGrade, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/category-grades/{id}")
    public ResponseEntity<CategoryGrade> getCategoryGrade(@PathVariable Long id) {
        log.debug("REST request to get CategoryGrade : {}", id);
        Optional<CategoryGrade> categoryGrade = categoryGradeRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(categoryGrade);
    }

    /**
     * {@code DELETE  /category-grades/:id} : delete the "id" categoryGrade.
     *
     * @param id the id of the categoryGrade to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/category-grades/{id}")
    public ResponseEntity<Void> deleteCategoryGrade(@PathVariable Long id) {
        log.debug("REST request to delete CategoryGrade : {}", id);
        CategoryNode node = new CategoryNode();
        node.setType(CategoryType.GRADE);
        node.setTypeId(id);
        List<CategoryNode> nodes = categoryNodeRepository.findAll(Example.of(node));
        if (nodes.isEmpty()) {
            categoryGradeRepository.deleteById(id);
            categoryGradeSearchRepository.deleteById(id);
            return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
        } else {
            HttpHeaders alert = HeaderUtil.createFailureAlert(applicationName, true, ENTITY_NAME, "categoryinuse", "Can not delete category in use");
            return ResponseEntity.status(HttpStatus.CONFLICT).headers(alert).build();
        }
    }

    /**
     * {@code SEARCH  /_search/category-grades?query=:query} : search for the categoryGrade corresponding
     * to the query.
     *
     * @param query the query of the categoryGrade search.
     * @return the result of the search.
     */
    @GetMapping("/_search/category-grades")
    public List<CategoryGrade> searchCategoryGrades(@RequestParam String query) {
        log.debug("REST request to search CategoryGrades for query {}", query);
        return StreamSupport
            .stream(categoryGradeSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

}
