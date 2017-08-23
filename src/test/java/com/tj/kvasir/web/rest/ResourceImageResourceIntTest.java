package com.tj.kvasir.web.rest;

import com.tj.kvasir.KavsirApp;

import com.tj.kvasir.domain.ResourceImage;
import com.tj.kvasir.repository.ResourceImageRepository;
import com.tj.kvasir.repository.search.ResourceImageSearchRepository;
import com.tj.kvasir.service.dto.ResourceImageDTO;
import com.tj.kvasir.service.mapper.ResourceImageMapper;
import com.tj.kvasir.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Base64Utils;

import javax.persistence.EntityManager;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the ResourceImageResource REST controller.
 *
 * @see ResourceImageResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = KavsirApp.class)
public class ResourceImageResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final byte[] DEFAULT_CONTENT = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_CONTENT = TestUtil.createByteArray(2, "1");
    private static final String DEFAULT_CONTENT_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_CONTENT_CONTENT_TYPE = "image/png";

    private static final String DEFAULT_HASH = "AAAAAAAAAA";
    private static final String UPDATED_HASH = "BBBBBBBBBB";

    @Autowired
    private ResourceImageRepository resourceImageRepository;

    @Autowired
    private ResourceImageMapper resourceImageMapper;

    @Autowired
    private ResourceImageSearchRepository resourceImageSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restResourceImageMockMvc;

    private ResourceImage resourceImage;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final ResourceImageResource resourceImageResource = new ResourceImageResource(resourceImageRepository, resourceImageMapper, resourceImageSearchRepository);
        this.restResourceImageMockMvc = MockMvcBuilders.standaloneSetup(resourceImageResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ResourceImage createEntity(EntityManager em) {
        ResourceImage resourceImage = new ResourceImage()
            .name(DEFAULT_NAME)
            .content(DEFAULT_CONTENT)
            .contentContentType(DEFAULT_CONTENT_CONTENT_TYPE)
            .hash(DEFAULT_HASH);
        return resourceImage;
    }

    @Before
    public void initTest() {
        resourceImageSearchRepository.deleteAll();
        resourceImage = createEntity(em);
    }

    @Test
    @Transactional
    public void createResourceImage() throws Exception {
        int databaseSizeBeforeCreate = resourceImageRepository.findAll().size();

        // Create the ResourceImage
        ResourceImageDTO resourceImageDTO = resourceImageMapper.toDto(resourceImage);
        restResourceImageMockMvc.perform(post("/api/resource-images")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(resourceImageDTO)))
            .andExpect(status().isCreated());

        // Validate the ResourceImage in the database
        List<ResourceImage> resourceImageList = resourceImageRepository.findAll();
        assertThat(resourceImageList).hasSize(databaseSizeBeforeCreate + 1);
        ResourceImage testResourceImage = resourceImageList.get(resourceImageList.size() - 1);
        assertThat(testResourceImage.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testResourceImage.getContent()).isEqualTo(DEFAULT_CONTENT);
        assertThat(testResourceImage.getContentContentType()).isEqualTo(DEFAULT_CONTENT_CONTENT_TYPE);
        assertThat(testResourceImage.getHash()).isEqualTo(DEFAULT_HASH);

        // Validate the ResourceImage in Elasticsearch
        ResourceImage resourceImageEs = resourceImageSearchRepository.findOne(testResourceImage.getId());
        assertThat(resourceImageEs).isEqualToComparingFieldByField(testResourceImage);
    }

    @Test
    @Transactional
    public void createResourceImageWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = resourceImageRepository.findAll().size();

        // Create the ResourceImage with an existing ID
        resourceImage.setId(1L);
        ResourceImageDTO resourceImageDTO = resourceImageMapper.toDto(resourceImage);

        // An entity with an existing ID cannot be created, so this API call must fail
        restResourceImageMockMvc.perform(post("/api/resource-images")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(resourceImageDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Alice in the database
        List<ResourceImage> resourceImageList = resourceImageRepository.findAll();
        assertThat(resourceImageList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = resourceImageRepository.findAll().size();
        // set the field null
        resourceImage.setName(null);

        // Create the ResourceImage, which fails.
        ResourceImageDTO resourceImageDTO = resourceImageMapper.toDto(resourceImage);

        restResourceImageMockMvc.perform(post("/api/resource-images")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(resourceImageDTO)))
            .andExpect(status().isBadRequest());

        List<ResourceImage> resourceImageList = resourceImageRepository.findAll();
        assertThat(resourceImageList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkContentIsRequired() throws Exception {
        int databaseSizeBeforeTest = resourceImageRepository.findAll().size();
        // set the field null
        resourceImage.setContent(null);

        // Create the ResourceImage, which fails.
        ResourceImageDTO resourceImageDTO = resourceImageMapper.toDto(resourceImage);

        restResourceImageMockMvc.perform(post("/api/resource-images")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(resourceImageDTO)))
            .andExpect(status().isBadRequest());

        List<ResourceImage> resourceImageList = resourceImageRepository.findAll();
        assertThat(resourceImageList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkHashIsRequired() throws Exception {
        int databaseSizeBeforeTest = resourceImageRepository.findAll().size();
        // set the field null
        resourceImage.setHash(null);

        // Create the ResourceImage, which fails.
        ResourceImageDTO resourceImageDTO = resourceImageMapper.toDto(resourceImage);

        restResourceImageMockMvc.perform(post("/api/resource-images")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(resourceImageDTO)))
            .andExpect(status().isBadRequest());

        List<ResourceImage> resourceImageList = resourceImageRepository.findAll();
        assertThat(resourceImageList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllResourceImages() throws Exception {
        // Initialize the database
        resourceImageRepository.saveAndFlush(resourceImage);

        // Get all the resourceImageList
        restResourceImageMockMvc.perform(get("/api/resource-images?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(resourceImage.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].contentContentType").value(hasItem(DEFAULT_CONTENT_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].content").value(hasItem(Base64Utils.encodeToString(DEFAULT_CONTENT))))
            .andExpect(jsonPath("$.[*].hash").value(hasItem(DEFAULT_HASH.toString())));
    }

    @Test
    @Transactional
    public void getResourceImage() throws Exception {
        // Initialize the database
        resourceImageRepository.saveAndFlush(resourceImage);

        // Get the resourceImage
        restResourceImageMockMvc.perform(get("/api/resource-images/{id}", resourceImage.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(resourceImage.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.contentContentType").value(DEFAULT_CONTENT_CONTENT_TYPE))
            .andExpect(jsonPath("$.content").value(Base64Utils.encodeToString(DEFAULT_CONTENT)))
            .andExpect(jsonPath("$.hash").value(DEFAULT_HASH.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingResourceImage() throws Exception {
        // Get the resourceImage
        restResourceImageMockMvc.perform(get("/api/resource-images/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateResourceImage() throws Exception {
        // Initialize the database
        resourceImageRepository.saveAndFlush(resourceImage);
        resourceImageSearchRepository.save(resourceImage);
        int databaseSizeBeforeUpdate = resourceImageRepository.findAll().size();

        // Update the resourceImage
        ResourceImage updatedResourceImage = resourceImageRepository.findOne(resourceImage.getId());
        updatedResourceImage
            .name(UPDATED_NAME)
            .content(UPDATED_CONTENT)
            .contentContentType(UPDATED_CONTENT_CONTENT_TYPE)
            .hash(UPDATED_HASH);
        ResourceImageDTO resourceImageDTO = resourceImageMapper.toDto(updatedResourceImage);

        restResourceImageMockMvc.perform(put("/api/resource-images")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(resourceImageDTO)))
            .andExpect(status().isOk());

        // Validate the ResourceImage in the database
        List<ResourceImage> resourceImageList = resourceImageRepository.findAll();
        assertThat(resourceImageList).hasSize(databaseSizeBeforeUpdate);
        ResourceImage testResourceImage = resourceImageList.get(resourceImageList.size() - 1);
        assertThat(testResourceImage.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testResourceImage.getContent()).isEqualTo(UPDATED_CONTENT);
        assertThat(testResourceImage.getContentContentType()).isEqualTo(UPDATED_CONTENT_CONTENT_TYPE);
        assertThat(testResourceImage.getHash()).isEqualTo(UPDATED_HASH);

        // Validate the ResourceImage in Elasticsearch
        ResourceImage resourceImageEs = resourceImageSearchRepository.findOne(testResourceImage.getId());
        assertThat(resourceImageEs).isEqualToComparingFieldByField(testResourceImage);
    }

    @Test
    @Transactional
    public void updateNonExistingResourceImage() throws Exception {
        int databaseSizeBeforeUpdate = resourceImageRepository.findAll().size();

        // Create the ResourceImage
        ResourceImageDTO resourceImageDTO = resourceImageMapper.toDto(resourceImage);

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restResourceImageMockMvc.perform(put("/api/resource-images")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(resourceImageDTO)))
            .andExpect(status().isCreated());

        // Validate the ResourceImage in the database
        List<ResourceImage> resourceImageList = resourceImageRepository.findAll();
        assertThat(resourceImageList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteResourceImage() throws Exception {
        // Initialize the database
        resourceImageRepository.saveAndFlush(resourceImage);
        resourceImageSearchRepository.save(resourceImage);
        int databaseSizeBeforeDelete = resourceImageRepository.findAll().size();

        // Get the resourceImage
        restResourceImageMockMvc.perform(delete("/api/resource-images/{id}", resourceImage.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean resourceImageExistsInEs = resourceImageSearchRepository.exists(resourceImage.getId());
        assertThat(resourceImageExistsInEs).isFalse();

        // Validate the database is empty
        List<ResourceImage> resourceImageList = resourceImageRepository.findAll();
        assertThat(resourceImageList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchResourceImage() throws Exception {
        // Initialize the database
        resourceImageRepository.saveAndFlush(resourceImage);
        resourceImageSearchRepository.save(resourceImage);

        // Search the resourceImage
        restResourceImageMockMvc.perform(get("/api/_search/resource-images?query=id:" + resourceImage.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(resourceImage.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].contentContentType").value(hasItem(DEFAULT_CONTENT_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].content").value(hasItem(Base64Utils.encodeToString(DEFAULT_CONTENT))))
            .andExpect(jsonPath("$.[*].hash").value(hasItem(DEFAULT_HASH.toString())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ResourceImage.class);
        ResourceImage resourceImage1 = new ResourceImage();
        resourceImage1.setId(1L);
        ResourceImage resourceImage2 = new ResourceImage();
        resourceImage2.setId(resourceImage1.getId());
        assertThat(resourceImage1).isEqualTo(resourceImage2);
        resourceImage2.setId(2L);
        assertThat(resourceImage1).isNotEqualTo(resourceImage2);
        resourceImage1.setId(null);
        assertThat(resourceImage1).isNotEqualTo(resourceImage2);
    }

    @Test
    @Transactional
    public void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(ResourceImageDTO.class);
        ResourceImageDTO resourceImageDTO1 = new ResourceImageDTO();
        resourceImageDTO1.setId(1L);
        ResourceImageDTO resourceImageDTO2 = new ResourceImageDTO();
        assertThat(resourceImageDTO1).isNotEqualTo(resourceImageDTO2);
        resourceImageDTO2.setId(resourceImageDTO1.getId());
        assertThat(resourceImageDTO1).isEqualTo(resourceImageDTO2);
        resourceImageDTO2.setId(2L);
        assertThat(resourceImageDTO1).isNotEqualTo(resourceImageDTO2);
        resourceImageDTO1.setId(null);
        assertThat(resourceImageDTO1).isNotEqualTo(resourceImageDTO2);
    }

    @Test
    @Transactional
    public void testEntityFromId() {
        assertThat(resourceImageMapper.fromId(42L).getId()).isEqualTo(42);
        assertThat(resourceImageMapper.fromId(null)).isNull();
    }
}
