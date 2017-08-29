package com.tj.kvasir.web.rest;

import com.tj.kvasir.KavsirApp;

import com.tj.kvasir.domain.CategorySource;
import com.tj.kvasir.repository.CategoryNodeRepository;
import com.tj.kvasir.repository.CategorySourceRepository;
import com.tj.kvasir.repository.search.CategorySourceSearchRepository;
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

import javax.persistence.EntityManager;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the CategorySourceResource REST controller.
 *
 * @see CategorySourceResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = KavsirApp.class)
public class CategorySourceResourceIntTest {

    private static final Integer DEFAULT_POSITION = 1;
    private static final Integer UPDATED_POSITION = 2;

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    @Autowired
    private CategorySourceRepository categorySourceRepository;

    @Autowired
    private CategorySourceSearchRepository categorySourceSearchRepository;

    @Autowired
    private CategoryNodeRepository categoryNodeRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restCategorySourceMockMvc;

    private CategorySource categorySource;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final CategorySourceResource categorySourceResource = new CategorySourceResource(categorySourceRepository, categorySourceSearchRepository, categoryNodeRepository);
        this.restCategorySourceMockMvc = MockMvcBuilders.standaloneSetup(categorySourceResource)
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
    public static CategorySource createEntity(EntityManager em) {
        CategorySource categorySource = new CategorySource()
            .position(DEFAULT_POSITION)
            .name(DEFAULT_NAME);
        return categorySource;
    }

    @Before
    public void initTest() {
        categorySourceSearchRepository.deleteAll();
        categorySource = createEntity(em);
    }

    @Test
    @Transactional
    public void createCategorySource() throws Exception {
        int databaseSizeBeforeCreate = categorySourceRepository.findAll().size();

        // Create the CategorySource
        restCategorySourceMockMvc.perform(post("/api/category-sources")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(categorySource)))
            .andExpect(status().isCreated());

        // Validate the CategorySource in the database
        List<CategorySource> categorySourceList = categorySourceRepository.findAll();
        assertThat(categorySourceList).hasSize(databaseSizeBeforeCreate + 1);
        CategorySource testCategorySource = categorySourceList.get(categorySourceList.size() - 1);
        assertThat(testCategorySource.getPosition()).isEqualTo(DEFAULT_POSITION);
        assertThat(testCategorySource.getName()).isEqualTo(DEFAULT_NAME);

        // Validate the CategorySource in Elasticsearch
        CategorySource categorySourceEs = categorySourceSearchRepository.findOne(testCategorySource.getId());
        assertThat(categorySourceEs).isEqualToComparingFieldByField(testCategorySource);
    }

    @Test
    @Transactional
    public void createCategorySourceWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = categorySourceRepository.findAll().size();

        // Create the CategorySource with an existing ID
        categorySource.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restCategorySourceMockMvc.perform(post("/api/category-sources")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(categorySource)))
            .andExpect(status().isBadRequest());

        // Validate the Alice in the database
        List<CategorySource> categorySourceList = categorySourceRepository.findAll();
        assertThat(categorySourceList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkPositionIsRequired() throws Exception {
        int databaseSizeBeforeTest = categorySourceRepository.findAll().size();
        // set the field null
        categorySource.setPosition(null);

        // Create the CategorySource, which fails.

        restCategorySourceMockMvc.perform(post("/api/category-sources")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(categorySource)))
            .andExpect(status().isBadRequest());

        List<CategorySource> categorySourceList = categorySourceRepository.findAll();
        assertThat(categorySourceList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = categorySourceRepository.findAll().size();
        // set the field null
        categorySource.setName(null);

        // Create the CategorySource, which fails.

        restCategorySourceMockMvc.perform(post("/api/category-sources")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(categorySource)))
            .andExpect(status().isBadRequest());

        List<CategorySource> categorySourceList = categorySourceRepository.findAll();
        assertThat(categorySourceList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllCategorySources() throws Exception {
        // Initialize the database
        categorySourceRepository.saveAndFlush(categorySource);

        // Get all the categorySourceList
        restCategorySourceMockMvc.perform(get("/api/category-sources?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(categorySource.getId().intValue())))
            .andExpect(jsonPath("$.[*].position").value(hasItem(DEFAULT_POSITION)))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())));
    }

    @Test
    @Transactional
    public void getCategorySource() throws Exception {
        // Initialize the database
        categorySourceRepository.saveAndFlush(categorySource);

        // Get the categorySource
        restCategorySourceMockMvc.perform(get("/api/category-sources/{id}", categorySource.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(categorySource.getId().intValue()))
            .andExpect(jsonPath("$.position").value(DEFAULT_POSITION))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingCategorySource() throws Exception {
        // Get the categorySource
        restCategorySourceMockMvc.perform(get("/api/category-sources/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateCategorySource() throws Exception {
        // Initialize the database
        categorySourceRepository.saveAndFlush(categorySource);
        categorySourceSearchRepository.save(categorySource);
        int databaseSizeBeforeUpdate = categorySourceRepository.findAll().size();

        // Update the categorySource
        CategorySource updatedCategorySource = categorySourceRepository.findOne(categorySource.getId());
        updatedCategorySource
            .position(UPDATED_POSITION)
            .name(UPDATED_NAME);

        restCategorySourceMockMvc.perform(put("/api/category-sources")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedCategorySource)))
            .andExpect(status().isOk());

        // Validate the CategorySource in the database
        List<CategorySource> categorySourceList = categorySourceRepository.findAll();
        assertThat(categorySourceList).hasSize(databaseSizeBeforeUpdate);
        CategorySource testCategorySource = categorySourceList.get(categorySourceList.size() - 1);
        assertThat(testCategorySource.getPosition()).isEqualTo(UPDATED_POSITION);
        assertThat(testCategorySource.getName()).isEqualTo(UPDATED_NAME);

        // Validate the CategorySource in Elasticsearch
        CategorySource categorySourceEs = categorySourceSearchRepository.findOne(testCategorySource.getId());
        assertThat(categorySourceEs).isEqualToComparingFieldByField(testCategorySource);
    }

    @Test
    @Transactional
    public void updateNonExistingCategorySource() throws Exception {
        int databaseSizeBeforeUpdate = categorySourceRepository.findAll().size();

        // Create the CategorySource

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restCategorySourceMockMvc.perform(put("/api/category-sources")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(categorySource)))
            .andExpect(status().isCreated());

        // Validate the CategorySource in the database
        List<CategorySource> categorySourceList = categorySourceRepository.findAll();
        assertThat(categorySourceList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteCategorySource() throws Exception {
        // Initialize the database
        categorySourceRepository.saveAndFlush(categorySource);
        categorySourceSearchRepository.save(categorySource);
        int databaseSizeBeforeDelete = categorySourceRepository.findAll().size();

        // Get the categorySource
        restCategorySourceMockMvc.perform(delete("/api/category-sources/{id}", categorySource.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean categorySourceExistsInEs = categorySourceSearchRepository.exists(categorySource.getId());
        assertThat(categorySourceExistsInEs).isFalse();

        // Validate the database is empty
        List<CategorySource> categorySourceList = categorySourceRepository.findAll();
        assertThat(categorySourceList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchCategorySource() throws Exception {
        // Initialize the database
        categorySourceRepository.saveAndFlush(categorySource);
        categorySourceSearchRepository.save(categorySource);

        // Search the categorySource
        restCategorySourceMockMvc.perform(get("/api/_search/category-sources?query=id:" + categorySource.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(categorySource.getId().intValue())))
            .andExpect(jsonPath("$.[*].position").value(hasItem(DEFAULT_POSITION)))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CategorySource.class);
        CategorySource categorySource1 = new CategorySource();
        categorySource1.setId(1L);
        CategorySource categorySource2 = new CategorySource();
        categorySource2.setId(categorySource1.getId());
        assertThat(categorySource1).isEqualTo(categorySource2);
        categorySource2.setId(2L);
        assertThat(categorySource1).isNotEqualTo(categorySource2);
        categorySource1.setId(null);
        assertThat(categorySource1).isNotEqualTo(categorySource2);
    }
}
