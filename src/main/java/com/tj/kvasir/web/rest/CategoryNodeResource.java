package com.tj.kvasir.web.rest;

import com.tj.kvasir.domain.CategoryNode;
import com.tj.kvasir.repository.CategoryNodeRepository;
import com.tj.kvasir.repository.search.CategoryNodeSearchRepository;
import com.tj.kvasir.web.rest.errors.BadRequestAlertException;
import com.tj.kvasir.service.dto.CategoryNodeDTO;
import com.tj.kvasir.service.mapper.CategoryNodeMapper;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.util.MultiValueMap;
import org.springframework.web.util.UriComponentsBuilder;
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
 * REST controller for managing {@link com.tj.kvasir.domain.CategoryNode}.
 */
@RestController
@RequestMapping("/api")
public class CategoryNodeResource {

    private final Logger log = LoggerFactory.getLogger(CategoryNodeResource.class);

    private static final String ENTITY_NAME = "categoryNode";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CategoryNodeRepository categoryNodeRepository;

    private final CategoryNodeMapper categoryNodeMapper;

    private final CategoryNodeSearchRepository categoryNodeSearchRepository;

    public CategoryNodeResource(CategoryNodeRepository categoryNodeRepository, CategoryNodeMapper categoryNodeMapper, CategoryNodeSearchRepository categoryNodeSearchRepository) {
        this.categoryNodeRepository = categoryNodeRepository;
        this.categoryNodeMapper = categoryNodeMapper;
        this.categoryNodeSearchRepository = categoryNodeSearchRepository;
    }

    /**
     * {@code POST  /category-nodes} : Create a new categoryNode.
     *
     * @param categoryNodeDTO the categoryNodeDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new categoryNodeDTO, or with status {@code 400 (Bad Request)} if the categoryNode has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/category-nodes")
    public ResponseEntity<CategoryNodeDTO> createCategoryNode(@Valid @RequestBody CategoryNodeDTO categoryNodeDTO) throws URISyntaxException {
        log.debug("REST request to save CategoryNode : {}", categoryNodeDTO);
        if (categoryNodeDTO.getId() != null) {
            throw new BadRequestAlertException("A new categoryNode cannot already have an ID", ENTITY_NAME, "idexists");
        }
        CategoryNode categoryNode = categoryNodeMapper.toEntity(categoryNodeDTO);
        categoryNode = categoryNodeRepository.save(categoryNode);
        CategoryNodeDTO result = categoryNodeMapper.toDto(categoryNode);
        categoryNodeSearchRepository.save(categoryNode);
        return ResponseEntity.created(new URI("/api/category-nodes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /category-nodes} : Updates an existing categoryNode.
     *
     * @param categoryNodeDTO the categoryNodeDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated categoryNodeDTO,
     * or with status {@code 400 (Bad Request)} if the categoryNodeDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the categoryNodeDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/category-nodes")
    public ResponseEntity<CategoryNodeDTO> updateCategoryNode(@Valid @RequestBody CategoryNodeDTO categoryNodeDTO) throws URISyntaxException {
        log.debug("REST request to update CategoryNode : {}", categoryNodeDTO);
        if (categoryNodeDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        CategoryNode categoryNode = categoryNodeMapper.toEntity(categoryNodeDTO);
        categoryNode = categoryNodeRepository.save(categoryNode);
        CategoryNodeDTO result = categoryNodeMapper.toDto(categoryNode);
        categoryNodeSearchRepository.save(categoryNode);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, categoryNodeDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /category-nodes} : get all the categoryNodes.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of categoryNodes in body.
     */
    @GetMapping("/category-nodes")
    public ResponseEntity<List<CategoryNodeDTO>> getAllCategoryNodes(Pageable pageable, @RequestParam MultiValueMap<String, String> queryParams, UriComponentsBuilder uriBuilder) {
        log.debug("REST request to get a page of CategoryNodes");
        Page<CategoryNodeDTO> page = categoryNodeRepository.findAll(pageable).map(categoryNodeMapper::toDto);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(uriBuilder.queryParams(queryParams), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /category-nodes/:id} : get the "id" categoryNode.
     *
     * @param id the id of the categoryNodeDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the categoryNodeDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/category-nodes/{id}")
    public ResponseEntity<CategoryNodeDTO> getCategoryNode(@PathVariable Long id) {
        log.debug("REST request to get CategoryNode : {}", id);
        Optional<CategoryNodeDTO> categoryNodeDTO = categoryNodeRepository.findById(id)
            .map(categoryNodeMapper::toDto);
        return ResponseUtil.wrapOrNotFound(categoryNodeDTO);
    }

    /**
     * {@code DELETE  /category-nodes/:id} : delete the "id" categoryNode.
     *
     * @param id the id of the categoryNodeDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/category-nodes/{id}")
    public ResponseEntity<Void> deleteCategoryNode(@PathVariable Long id) {
        log.debug("REST request to delete CategoryNode : {}", id);
        categoryNodeRepository.deleteById(id);
        categoryNodeSearchRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/category-nodes?query=:query} : search for the categoryNode corresponding
     * to the query.
     *
     * @param query the query of the categoryNode search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/category-nodes")
    public ResponseEntity<List<CategoryNodeDTO>> searchCategoryNodes(@RequestParam String query, Pageable pageable, @RequestParam MultiValueMap<String, String> queryParams, UriComponentsBuilder uriBuilder) {
        log.debug("REST request to search for a page of CategoryNodes for query {}", query);
        Page<CategoryNode> page = categoryNodeSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(uriBuilder.queryParams(queryParams), page);
        return ResponseEntity.ok().headers(headers).body(categoryNodeMapper.toDto(page.getContent()));
    }

}
