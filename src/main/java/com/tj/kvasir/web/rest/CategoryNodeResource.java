package com.tj.kvasir.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.tj.kvasir.domain.CategoryNode;

import com.tj.kvasir.repository.CategoryNodeRepository;
import com.tj.kvasir.repository.search.CategoryNodeSearchRepository;
import com.tj.kvasir.web.rest.util.HeaderUtil;
import com.tj.kvasir.web.rest.util.PaginationUtil;
import com.tj.kvasir.service.dto.CategoryNodeDTO;
import com.tj.kvasir.service.mapper.CategoryNodeMapper;
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

    private final CategoryNodeMapper categoryNodeMapper;

    private final CategoryNodeSearchRepository categoryNodeSearchRepository;
    public CategoryNodeResource(CategoryNodeRepository categoryNodeRepository, CategoryNodeMapper categoryNodeMapper, CategoryNodeSearchRepository categoryNodeSearchRepository) {
        this.categoryNodeRepository = categoryNodeRepository;
        this.categoryNodeMapper = categoryNodeMapper;
        this.categoryNodeSearchRepository = categoryNodeSearchRepository;
    }

    /**
     * POST  /category-nodes : Create a new categoryNode.
     *
     * @param categoryNodeDTO the categoryNodeDTO to create
     * @return the ResponseEntity with status 201 (Created) and with body the new categoryNodeDTO, or with status 400 (Bad Request) if the categoryNode has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/category-nodes")
    @Timed
    public ResponseEntity<CategoryNodeDTO> createCategoryNode(@Valid @RequestBody CategoryNodeDTO categoryNodeDTO) throws URISyntaxException {
        log.debug("REST request to save CategoryNode : {}", categoryNodeDTO);
        if (categoryNodeDTO.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new categoryNode cannot already have an ID")).body(null);
        }
        CategoryNode categoryNode = categoryNodeMapper.toEntity(categoryNodeDTO);
        categoryNode = categoryNodeRepository.save(categoryNode);
        CategoryNodeDTO result = categoryNodeMapper.toDto(categoryNode);
        categoryNodeSearchRepository.save(categoryNode);
        return ResponseEntity.created(new URI("/api/category-nodes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /category-nodes : Updates an existing categoryNode.
     *
     * @param categoryNodeDTO the categoryNodeDTO to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated categoryNodeDTO,
     * or with status 400 (Bad Request) if the categoryNodeDTO is not valid,
     * or with status 500 (Internal Server Error) if the categoryNodeDTO couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/category-nodes")
    @Timed
    public ResponseEntity<CategoryNodeDTO> updateCategoryNode(@Valid @RequestBody CategoryNodeDTO categoryNodeDTO) throws URISyntaxException {
        log.debug("REST request to update CategoryNode : {}", categoryNodeDTO);
        if (categoryNodeDTO.getId() == null) {
            return createCategoryNode(categoryNodeDTO);
        }
        CategoryNode categoryNode = categoryNodeMapper.toEntity(categoryNodeDTO);
        categoryNode = categoryNodeRepository.save(categoryNode);
        CategoryNodeDTO result = categoryNodeMapper.toDto(categoryNode);
        categoryNodeSearchRepository.save(categoryNode);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, categoryNodeDTO.getId().toString()))
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
    public ResponseEntity<List<CategoryNodeDTO>> getAllCategoryNodes(@ApiParam Pageable pageable) {
        log.debug("REST request to get a page of CategoryNodes");
        Page<CategoryNode> page = categoryNodeRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/category-nodes");
        return new ResponseEntity<>(categoryNodeMapper.toDto(page.getContent()), headers, HttpStatus.OK);
    }

    /**
     * GET  /category-nodes/:id : get the "id" categoryNode.
     *
     * @param id the id of the categoryNodeDTO to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the categoryNodeDTO, or with status 404 (Not Found)
     */
    @GetMapping("/category-nodes/{id}")
    @Timed
    public ResponseEntity<CategoryNodeDTO> getCategoryNode(@PathVariable Long id) {
        log.debug("REST request to get CategoryNode : {}", id);
        CategoryNode categoryNode = categoryNodeRepository.findOne(id);
        CategoryNodeDTO categoryNodeDTO = categoryNodeMapper.toDto(categoryNode);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(categoryNodeDTO));
    }

    /**
     * DELETE  /category-nodes/:id : delete the "id" categoryNode.
     *
     * @param id the id of the categoryNodeDTO to delete
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
    public ResponseEntity<List<CategoryNodeDTO>> searchCategoryNodes(@RequestParam String query, @ApiParam Pageable pageable) {
        log.debug("REST request to search for a page of CategoryNodes for query {}", query);
        Page<CategoryNode> page = categoryNodeSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/category-nodes");
        return new ResponseEntity<>(categoryNodeMapper.toDto(page.getContent()), headers, HttpStatus.OK);
    }

}
