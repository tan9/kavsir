package com.tj.kvasir.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.tj.kvasir.domain.CategoryNode;

import com.tj.kvasir.repository.CategoryNodeRepository;
import com.tj.kvasir.repository.search.CategoryNodeSearchRepository;
import com.tj.kvasir.web.rest.util.HeaderUtil;
import com.tj.kvasir.web.rest.util.PaginationUtil;
import io.swagger.annotations.ApiParam;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
 * REST controller for managing CategoryNode.
 */
@RestController
@RequestMapping("/api")
public class CategoryNodeResource {

    private final Logger log = LoggerFactory.getLogger(CategoryNodeResource.class);

    private static final String ENTITY_NAME = "categoryNode";

    private final CategoryNodeRepository categoryNodeRepository;

    private final CategoryNodeSearchRepository categoryNodeSearchRepository;

    public CategoryNodeResource(CategoryNodeRepository categoryNodeRepository, CategoryNodeSearchRepository categoryNodeSearchRepository) {
        this.categoryNodeRepository = categoryNodeRepository;
        this.categoryNodeSearchRepository = categoryNodeSearchRepository;
    }

    /**
     * POST  /category-nodes : Create a new categoryNode.
     *
     * @param categoryNode the categoryNode to create
     * @return the ResponseEntity with status 201 (Created) and with body the new categoryNode, or with status 400 (Bad Request) if the categoryNode has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/category-nodes")
    @Timed
    public ResponseEntity<CategoryNode> createCategoryNode(@Valid @RequestBody CategoryNode categoryNode) throws URISyntaxException {
        log.debug("REST request to save CategoryNode : {}", categoryNode);
        if (categoryNode.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new categoryNode cannot already have an ID")).body(null);
        }
        CategoryNode result = categoryNodeRepository.save(categoryNode);
        categoryNodeSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/category-nodes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /category-nodes : Updates an existing categoryNode.
     *
     * @param categoryNode the categoryNode to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated categoryNode,
     * or with status 400 (Bad Request) if the categoryNode is not valid,
     * or with status 500 (Internal Server Error) if the categoryNode couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/category-nodes")
    @Timed
    public ResponseEntity<CategoryNode> updateCategoryNode(@Valid @RequestBody CategoryNode categoryNode) throws URISyntaxException {
        log.debug("REST request to update CategoryNode : {}", categoryNode);
        if (categoryNode.getId() == null) {
            return createCategoryNode(categoryNode);
        }
        CategoryNode result = categoryNodeRepository.save(categoryNode);
        categoryNodeSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, categoryNode.getId().toString()))
            .body(result);
    }

    /**
     * GET  /category-nodes : get all the categoryNodes.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of categoryNodes in body
     */
    @GetMapping("/category-nodes")
    @Timed
    public ResponseEntity<List<CategoryNode>> getAllCategoryNodes(@ApiParam Pageable pageable) {
        log.debug("REST request to get a page of CategoryNodes");
        Page<CategoryNode> page = categoryNodeRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/category-nodes");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /category-nodes/:id : get the "id" categoryNode.
     *
     * @param id the id of the categoryNode to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the categoryNode, or with status 404 (Not Found)
     */
    @GetMapping("/category-nodes/{id}")
    @Timed
    public ResponseEntity<CategoryNode> getCategoryNode(@PathVariable Long id) {
        log.debug("REST request to get CategoryNode : {}", id);
        CategoryNode categoryNode = categoryNodeRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(categoryNode));
    }

    /**
     * DELETE  /category-nodes/:id : delete the "id" categoryNode.
     *
     * @param id the id of the categoryNode to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/category-nodes/{id}")
    @Timed
    public ResponseEntity<Void> deleteCategoryNode(@PathVariable Long id) {
        log.debug("REST request to delete CategoryNode : {}", id);
        categoryNodeRepository.delete(id);
        categoryNodeSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/category-nodes?query=:query : search for the categoryNode corresponding
     * to the query.
     *
     * @param query the query of the categoryNode search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/category-nodes")
    @Timed
    public ResponseEntity<List<CategoryNode>> searchCategoryNodes(@RequestParam String query, @ApiParam Pageable pageable) {
        log.debug("REST request to search for a page of CategoryNodes for query {}", query);
        Page<CategoryNode> page = categoryNodeSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/category-nodes");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

}
