package com.tj.kvasir.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.tj.kvasir.domain.ResourceImage;

import com.tj.kvasir.repository.ResourceImageRepository;
import com.tj.kvasir.repository.search.ResourceImageSearchRepository;
import com.tj.kvasir.web.rest.errors.BadRequestAlertException;
import com.tj.kvasir.web.rest.util.HeaderUtil;
import com.tj.kvasir.web.rest.util.PaginationUtil;
import com.tj.kvasir.service.dto.ResourceImageDTO;
import com.tj.kvasir.service.mapper.ResourceImageMapper;
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
 * REST controller for managing ResourceImage.
 */
@RestController
@RequestMapping("/api")
public class ResourceImageResource {

    private final Logger log = LoggerFactory.getLogger(ResourceImageResource.class);

    private static final String ENTITY_NAME = "resourceImage";

    private final ResourceImageRepository resourceImageRepository;

    private final ResourceImageMapper resourceImageMapper;

    private final ResourceImageSearchRepository resourceImageSearchRepository;

    public ResourceImageResource(ResourceImageRepository resourceImageRepository, ResourceImageMapper resourceImageMapper, ResourceImageSearchRepository resourceImageSearchRepository) {
        this.resourceImageRepository = resourceImageRepository;
        this.resourceImageMapper = resourceImageMapper;
        this.resourceImageSearchRepository = resourceImageSearchRepository;
    }

    /**
     * POST  /resource-images : Create a new resourceImage.
     *
     * @param resourceImageDTO the resourceImageDTO to create
     * @return the ResponseEntity with status 201 (Created) and with body the new resourceImageDTO, or with status 400 (Bad Request) if the resourceImage has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/resource-images")
    @Timed
    public ResponseEntity<ResourceImageDTO> createResourceImage(@Valid @RequestBody ResourceImageDTO resourceImageDTO) throws URISyntaxException {
        log.debug("REST request to save ResourceImage : {}", resourceImageDTO);
        if (resourceImageDTO.getId() != null) {
            throw new BadRequestAlertException("A new resourceImage cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ResourceImage resourceImage = resourceImageMapper.toEntity(resourceImageDTO);
        resourceImage = resourceImageRepository.save(resourceImage);
        ResourceImageDTO result = resourceImageMapper.toDto(resourceImage);
        resourceImageSearchRepository.save(resourceImage);
        return ResponseEntity.created(new URI("/api/resource-images/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /resource-images : Updates an existing resourceImage.
     *
     * @param resourceImageDTO the resourceImageDTO to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated resourceImageDTO,
     * or with status 400 (Bad Request) if the resourceImageDTO is not valid,
     * or with status 500 (Internal Server Error) if the resourceImageDTO couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/resource-images")
    @Timed
    public ResponseEntity<ResourceImageDTO> updateResourceImage(@Valid @RequestBody ResourceImageDTO resourceImageDTO) throws URISyntaxException {
        log.debug("REST request to update ResourceImage : {}", resourceImageDTO);
        if (resourceImageDTO.getId() == null) {
            return createResourceImage(resourceImageDTO);
        }
        ResourceImage resourceImage = resourceImageMapper.toEntity(resourceImageDTO);
        resourceImage = resourceImageRepository.save(resourceImage);
        ResourceImageDTO result = resourceImageMapper.toDto(resourceImage);
        resourceImageSearchRepository.save(resourceImage);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, resourceImageDTO.getId().toString()))
            .body(result);
    }

    /**
     * GET  /resource-images : get all the resourceImages.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of resourceImages in body
     */
    @GetMapping("/resource-images")
    @Timed
    public ResponseEntity<List<ResourceImageDTO>> getAllResourceImages(Pageable pageable) {
        log.debug("REST request to get a page of ResourceImages");
        Page<ResourceImage> page = resourceImageRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/resource-images");
        return new ResponseEntity<>(resourceImageMapper.toDto(page.getContent()), headers, HttpStatus.OK);
    }

    /**
     * GET  /resource-images/:id : get the "id" resourceImage.
     *
     * @param id the id of the resourceImageDTO to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the resourceImageDTO, or with status 404 (Not Found)
     */
    @GetMapping("/resource-images/{id}")
    @Timed
    public ResponseEntity<ResourceImageDTO> getResourceImage(@PathVariable Long id) {
        log.debug("REST request to get ResourceImage : {}", id);
        ResourceImage resourceImage = resourceImageRepository.findOne(id);
        ResourceImageDTO resourceImageDTO = resourceImageMapper.toDto(resourceImage);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(resourceImageDTO));
    }

    /**
     * DELETE  /resource-images/:id : delete the "id" resourceImage.
     *
     * @param id the id of the resourceImageDTO to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/resource-images/{id}")
    @Timed
    public ResponseEntity<Void> deleteResourceImage(@PathVariable Long id) {
        log.debug("REST request to delete ResourceImage : {}", id);
        resourceImageRepository.delete(id);
        resourceImageSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/resource-images?query=:query : search for the resourceImage corresponding
     * to the query.
     *
     * @param query the query of the resourceImage search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/resource-images")
    @Timed
    public ResponseEntity<List<ResourceImageDTO>> searchResourceImages(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of ResourceImages for query {}", query);
        Page<ResourceImage> page = resourceImageSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/resource-images");
        return new ResponseEntity<>(resourceImageMapper.toDto(page.getContent()), headers, HttpStatus.OK);
    }

}
