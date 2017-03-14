package com.tj.kvasir.web.rest;

import com.tj.kvasir.KavsirApp;

import com.tj.kvasir.domain.CategoryPublisher;
import com.tj.kvasir.repository.CategoryPublisherRepository;
import com.tj.kvasir.repository.search.CategoryPublisherSearchRepository;
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
 * Test class for the CategoryPublisherResource REST controller.
 *
 * @see CategoryPublisherResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = KavsirApp.class)
public class CategoryPublisherResourceIntTest {

    private static final Integer DEFAULT_POSITION = 1;
    private static final Integer UPDATED_POSITION = 2;

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    @Autowired
    private CategoryPublisherRepository categoryPublisherRepository;

    @Autowired
    private CategoryPublisherSearchRepository categoryPublisherSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restCategoryPublisherMockMvc;

    private CategoryPublisher categoryPublisher;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
            CategoryPublisherResource categoryPublisherResource = new CategoryPublisherResource(categoryPublisherRepository, categoryPublisherSearchRepository);
        this.restCategoryPublisherMockMvc = MockMvcBuilders.standaloneSetup(categoryPublisherResource)
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
    public static CategoryPublisher createEntity(EntityManager em) {
        CategoryPublisher categoryPublisher = new CategoryPublisher()
                .position(DEFAULT_POSITION)
                .name(DEFAULT_NAME);
        return categoryPublisher;
    }

    @Before
    public void initTest() {
        categoryPublisherSearchRepository.deleteAll();
        categoryPublisher = createEntity(em);
    }

    @Test
    @Transactional
    public void createCategoryPublisher() throws Exception {
        int databaseSizeBeforeCreate = categoryPublisherRepository.findAll().size();

        // Create the CategoryPublisher

        restCategoryPublisherMockMvc.perform(post("/api/category-publishers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(categoryPublisher)))
            .andExpect(status().isCreated());

        // Validate the CategoryPublisher in the database
        List<CategoryPublisher> categoryPublisherList = categoryPublisherRepository.findAll();
        assertThat(categoryPublisherList).hasSize(databaseSizeBeforeCreate + 1);
        CategoryPublisher testCategoryPublisher = categoryPublisherList.get(categoryPublisherList.size() - 1);
        assertThat(testCategoryPublisher.getPosition()).isEqualTo(DEFAULT_POSITION);
        assertThat(testCategoryPublisher.getName()).isEqualTo(DEFAULT_NAME);

        // Validate the CategoryPublisher in Elasticsearch
        CategoryPublisher categoryPublisherEs = categoryPublisherSearchRepository.findOne(testCategoryPublisher.getId());
        assertThat(categoryPublisherEs).isEqualToComparingFieldByField(testCategoryPublisher);
    }

    @Test
    @Transactional
    public void createCategoryPublisherWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = categoryPublisherRepository.findAll().size();

        // Create the CategoryPublisher with an existing ID
        CategoryPublisher existingCategoryPublisher = new CategoryPublisher();
        existingCategoryPublisher.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restCategoryPublisherMockMvc.perform(post("/api/category-publishers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(existingCategoryPublisher)))
            .andExpect(status().isBadRequest());

        // Validate the Alice in the database
        List<CategoryPublisher> categoryPublisherList = categoryPublisherRepository.findAll();
        assertThat(categoryPublisherList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkPositionIsRequired() throws Exception {
        int databaseSizeBeforeTest = categoryPublisherRepository.findAll().size();
        // set the field null
        categoryPublisher.setPosition(null);

        // Create the CategoryPublisher, which fails.

        restCategoryPublisherMockMvc.perform(post("/api/category-publishers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(categoryPublisher)))
            .andExpect(status().isBadRequest());

        List<CategoryPublisher> categoryPublisherList = categoryPublisherRepository.findAll();
        assertThat(categoryPublisherList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = categoryPublisherRepository.findAll().size();
        // set the field null
        categoryPublisher.setName(null);

        // Create the CategoryPublisher, which fails.

        restCategoryPublisherMockMvc.perform(post("/api/category-publishers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(categoryPublisher)))
            .andExpect(status().isBadRequest());

        List<CategoryPublisher> categoryPublisherList = categoryPublisherRepository.findAll();
        assertThat(categoryPublisherList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllCategoryPublishers() throws Exception {
        // Initialize the database
        categoryPublisherRepository.saveAndFlush(categoryPublisher);

        // Get all the categoryPublisherList
        restCategoryPublisherMockMvc.perform(get("/api/category-publishers?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(categoryPublisher.getId().intValue())))
            .andExpect(jsonPath("$.[*].position").value(hasItem(DEFAULT_POSITION)))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())));
    }

    @Test
    @Transactional
    public void getCategoryPublisher() throws Exception {
        // Initialize the database
        categoryPublisherRepository.saveAndFlush(categoryPublisher);

        // Get the categoryPublisher
        restCategoryPublisherMockMvc.perform(get("/api/category-publishers/{id}", categoryPublisher.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(categoryPublisher.getId().intValue()))
            .andExpect(jsonPath("$.position").value(DEFAULT_POSITION))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingCategoryPublisher() throws Exception {
        // Get the categoryPublisher
        restCategoryPublisherMockMvc.perform(get("/api/category-publishers/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateCategoryPublisher() throws Exception {
        // Initialize the database
        categoryPublisherRepository.saveAndFlush(categoryPublisher);
        categoryPublisherSearchRepository.save(categoryPublisher);
        int databaseSizeBeforeUpdate = categoryPublisherRepository.findAll().size();

        // Update the categoryPublisher
        CategoryPublisher updatedCategoryPublisher = categoryPublisherRepository.findOne(categoryPublisher.getId());
        updatedCategoryPublisher
                .position(UPDATED_POSITION)
                .name(UPDATED_NAME);

        restCategoryPublisherMockMvc.perform(put("/api/category-publishers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedCategoryPublisher)))
            .andExpect(status().isOk());

        // Validate the CategoryPublisher in the database
        List<CategoryPublisher> categoryPublisherList = categoryPublisherRepository.findAll();
        assertThat(categoryPublisherList).hasSize(databaseSizeBeforeUpdate);
        CategoryPublisher testCategoryPublisher = categoryPublisherList.get(categoryPublisherList.size() - 1);
        assertThat(testCategoryPublisher.getPosition()).isEqualTo(UPDATED_POSITION);
        assertThat(testCategoryPublisher.getName()).isEqualTo(UPDATED_NAME);

        // Validate the CategoryPublisher in Elasticsearch
        CategoryPublisher categoryPublisherEs = categoryPublisherSearchRepository.findOne(testCategoryPublisher.getId());
        assertThat(categoryPublisherEs).isEqualToComparingFieldByField(testCategoryPublisher);
    }

    @Test
    @Transactional
    public void updateNonExistingCategoryPublisher() throws Exception {
        int databaseSizeBeforeUpdate = categoryPublisherRepository.findAll().size();

        // Create the CategoryPublisher

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restCategoryPublisherMockMvc.perform(put("/api/category-publishers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(categoryPublisher)))
            .andExpect(status().isCreated());

        // Validate the CategoryPublisher in the database
        List<CategoryPublisher> categoryPublisherList = categoryPublisherRepository.findAll();
        assertThat(categoryPublisherList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteCategoryPublisher() throws Exception {
        // Initialize the database
        categoryPublisherRepository.saveAndFlush(categoryPublisher);
        categoryPublisherSearchRepository.save(categoryPublisher);
        int databaseSizeBeforeDelete = categoryPublisherRepository.findAll().size();

        // Get the categoryPublisher
        restCategoryPublisherMockMvc.perform(delete("/api/category-publishers/{id}", categoryPublisher.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean categoryPublisherExistsInEs = categoryPublisherSearchRepository.exists(categoryPublisher.getId());
        assertThat(categoryPublisherExistsInEs).isFalse();

        // Validate the database is empty
        List<CategoryPublisher> categoryPublisherList = categoryPublisherRepository.findAll();
        assertThat(categoryPublisherList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchCategoryPublisher() throws Exception {
        // Initialize the database
        categoryPublisherRepository.saveAndFlush(categoryPublisher);
        categoryPublisherSearchRepository.save(categoryPublisher);

        // Search the categoryPublisher
        restCategoryPublisherMockMvc.perform(get("/api/_search/category-publishers?query=id:" + categoryPublisher.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(categoryPublisher.getId().intValue())))
            .andExpect(jsonPath("$.[*].position").value(hasItem(DEFAULT_POSITION)))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())));
    }

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CategoryPublisher.class);
    }
}
