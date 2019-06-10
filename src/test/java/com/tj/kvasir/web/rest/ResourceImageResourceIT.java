package com.tj.kvasir.web.rest;

import com.tj.kvasir.KavsirApp;
import com.tj.kvasir.domain.ResourceImage;
import com.tj.kvasir.repository.ResourceImageRepository;
import com.tj.kvasir.repository.search.ResourceImageSearchRepository;
import com.tj.kvasir.service.dto.ResourceImageDTO;
import com.tj.kvasir.service.mapper.ResourceImageMapper;
import com.tj.kvasir.web.rest.errors.ExceptionTranslator;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Base64Utils;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.util.Collections;
import java.util.List;

import static com.tj.kvasir.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@Link ResourceImageResource} REST controller.
 */
@SpringBootTest(classes = KavsirApp.class)
public class ResourceImageResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final byte[] DEFAULT_CONTENT = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_CONTENT = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_CONTENT_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_CONTENT_CONTENT_TYPE = "image/png";

    @Autowired
    private ResourceImageRepository resourceImageRepository;

    @Autowired
    private ResourceImageMapper resourceImageMapper;

    /**
     * This repository is mocked in the com.tj.kvasir.repository.search test package.
     *
     * @see com.tj.kvasir.repository.search.ResourceImageSearchRepositoryMockConfiguration
     */
    @Autowired
    private ResourceImageSearchRepository mockResourceImageSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    @Autowired
    private Validator validator;

    private MockMvc restResourceImageMockMvc;

    private ResourceImage resourceImage;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final ResourceImageResource resourceImageResource = new ResourceImageResource(resourceImageRepository, resourceImageMapper, mockResourceImageSearchRepository);
        this.restResourceImageMockMvc = MockMvcBuilders.standaloneSetup(resourceImageResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter)
            .setValidator(validator).build();
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
            .contentContentType(DEFAULT_CONTENT_CONTENT_TYPE);
        return resourceImage;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ResourceImage createUpdatedEntity(EntityManager em) {
        ResourceImage resourceImage = new ResourceImage()
            .name(UPDATED_NAME)
            .content(UPDATED_CONTENT)
            .contentContentType(UPDATED_CONTENT_CONTENT_TYPE);
        return resourceImage;
    }

    @BeforeEach
    public void initTest() {
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

        // Validate the ResourceImage in Elasticsearch
        verify(mockResourceImageSearchRepository, times(1)).save(testResourceImage);
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

        // Validate the ResourceImage in the database
        List<ResourceImage> resourceImageList = resourceImageRepository.findAll();
        assertThat(resourceImageList).hasSize(databaseSizeBeforeCreate);

        // Validate the ResourceImage in Elasticsearch
        verify(mockResourceImageSearchRepository, times(0)).save(resourceImage);
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
            .andExpect(jsonPath("$.[*].content").value(hasItem(Base64Utils.encodeToString(DEFAULT_CONTENT))));
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
            .andExpect(jsonPath("$.content").value(Base64Utils.encodeToString(DEFAULT_CONTENT)));
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

        int databaseSizeBeforeUpdate = resourceImageRepository.findAll().size();

        // Update the resourceImage
        ResourceImage updatedResourceImage = resourceImageRepository.findById(resourceImage.getId()).get();
        // Disconnect from session so that the updates on updatedResourceImage are not directly saved in db
        em.detach(updatedResourceImage);
        updatedResourceImage
            .name(UPDATED_NAME)
            .content(UPDATED_CONTENT)
            .contentContentType(UPDATED_CONTENT_CONTENT_TYPE);
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

        // Validate the ResourceImage in Elasticsearch
        verify(mockResourceImageSearchRepository, times(1)).save(testResourceImage);
    }

    @Test
    @Transactional
    public void updateNonExistingResourceImage() throws Exception {
        int databaseSizeBeforeUpdate = resourceImageRepository.findAll().size();

        // Create the ResourceImage
        ResourceImageDTO resourceImageDTO = resourceImageMapper.toDto(resourceImage);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restResourceImageMockMvc.perform(put("/api/resource-images")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(resourceImageDTO)))
            .andExpect(status().isBadRequest());

        // Validate the ResourceImage in the database
        List<ResourceImage> resourceImageList = resourceImageRepository.findAll();
        assertThat(resourceImageList).hasSize(databaseSizeBeforeUpdate);

        // Validate the ResourceImage in Elasticsearch
        verify(mockResourceImageSearchRepository, times(0)).save(resourceImage);
    }

    @Test
    @Transactional
    public void deleteResourceImage() throws Exception {
        // Initialize the database
        resourceImageRepository.saveAndFlush(resourceImage);

        int databaseSizeBeforeDelete = resourceImageRepository.findAll().size();

        // Delete the resourceImage
        restResourceImageMockMvc.perform(delete("/api/resource-images/{id}", resourceImage.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database is empty
        List<ResourceImage> resourceImageList = resourceImageRepository.findAll();
        assertThat(resourceImageList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the ResourceImage in Elasticsearch
        verify(mockResourceImageSearchRepository, times(1)).deleteById(resourceImage.getId());
    }

    @Test
    @Transactional
    public void searchResourceImage() throws Exception {
        // Initialize the database
        resourceImageRepository.saveAndFlush(resourceImage);
        when(mockResourceImageSearchRepository.search(queryStringQuery("id:" + resourceImage.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(resourceImage), PageRequest.of(0, 1), 1));
        // Search the resourceImage
        restResourceImageMockMvc.perform(get("/api/_search/resource-images?query=id:" + resourceImage.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(resourceImage.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].contentContentType").value(hasItem(DEFAULT_CONTENT_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].content").value(hasItem(Base64Utils.encodeToString(DEFAULT_CONTENT))));
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
