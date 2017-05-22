package com.tj.kvasir.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.tj.kvasir.domain.ResourceImage;

import com.tj.kvasir.repository.ResourceImageRepository;
import com.tj.kvasir.repository.search.ResourceImageSearchRepository;
import com.tj.kvasir.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

    private final ResourceImageSearchRepository resourceImageSearchRepository;

    public ResourceImageResource(ResourceImageRepository resourceImageRepository, ResourceImageSearchRepository resourceImageSearchRepository) {
        this.resourceImageRepository = resourceImageRepository;
        this.resourceImageSearchRepository = resourceImageSearchRepository;
    }

    /**
     * POST  /resource-images : Create a new resourceImage.
     *
     * @param resourceImage the resourceImage to create
     * @return the ResponseEntity with status 201 (Created) and with body the new resourceImage, or with status 400 (Bad Request) if the resourceImage has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/resource-images")
    @Timed
    public ResponseEntity<ResourceImage> createResourceImage(@Valid @RequestBody ResourceImage resourceImage) throws URISyntaxException {
        log.debug("REST request to save ResourceImage : {}", resourceImage);
        if (resourceImage.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new resourceImage cannot already have an ID")).body(null);
        }
        ResourceImage result = resourceImageRepository.save(resourceImage);
        resourceImageSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/resource-images/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /resource-images : Updates an existing resourceImage.
     *
     * @param resourceImage the resourceImage to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated resourceImage,
     * or with status 400 (Bad Request) if the resourceImage is not valid,
     * or with status 500 (Internal Server Error) if the resourceImage couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/resource-images")
    @Timed
    public ResponseEntity<ResourceImage> updateResourceImage(@Valid @RequestBody ResourceImage resourceImage) throws URISyntaxException {
        log.debug("REST request to update ResourceImage : {}", resourceImage);
        if (resourceImage.getId() == null) {
            return createResourceImage(resourceImage);
        }
        ResourceImage result = resourceImageRepository.save(resourceImage);
        resourceImageSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, resourceImage.getId().toString()))
            .body(result);
    }

    /**
     * GET  /resource-images : get all the resourceImages.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of resourceImages in body
     */
    @GetMapping("/resource-images")
    @Timed
    public List<ResourceImage> getAllResourceImages() {
        log.debug("REST request to get all ResourceImages");
        List<ResourceImage> resourceImages = resourceImageRepository.findAll();
        return resourceImages;
    }

    /**
     * GET  /resource-images/:id : get the "id" resourceImage.
     *
     * @param id the id of the resourceImage to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the resourceImage, or with status 404 (Not Found)
     */
    @GetMapping("/resource-images/{id}")
    @Timed
    public ResponseEntity<ResourceImage> getResourceImage(@PathVariable Long id) {
        log.debug("REST request to get ResourceImage : {}", id);
        ResourceImage resourceImage = resourceImageRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(resourceImage));
    }

    /**
     * DELETE  /resource-images/:id : delete the "id" resourceImage.
     *
     * @param id the id of the resourceImage to delete
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
     * @return the result of the search
     */
    @GetMapping("/_search/resource-images")
    @Timed
    public List<ResourceImage> searchResourceImages(@RequestParam String query) {
        log.debug("REST request to search ResourceImages for query {}", query);
        return StreamSupport
            .stream(resourceImageSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }


}
