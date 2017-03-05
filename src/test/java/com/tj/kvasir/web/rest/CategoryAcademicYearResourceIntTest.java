package com.tj.kvasir.web.rest;

import com.tj.kvasir.KavsirApp;

import com.tj.kvasir.domain.CategoryAcademicYear;
import com.tj.kvasir.repository.CategoryAcademicYearRepository;
import com.tj.kvasir.repository.search.CategoryAcademicYearSearchRepository;
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
 * Test class for the CategoryAcademicYearResource REST controller.
 *
 * @see CategoryAcademicYearResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = KavsirApp.class)
public class CategoryAcademicYearResourceIntTest {

    private static final Integer DEFAULT_POSITION = 1;
    private static final Integer UPDATED_POSITION = 2;

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    @Autowired
    private CategoryAcademicYearRepository categoryAcademicYearRepository;

    @Autowired
    private CategoryAcademicYearSearchRepository categoryAcademicYearSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restCategoryAcademicYearMockMvc;

    private CategoryAcademicYear categoryAcademicYear;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
            CategoryAcademicYearResource categoryAcademicYearResource = new CategoryAcademicYearResource(categoryAcademicYearRepository, categoryAcademicYearSearchRepository);
        this.restCategoryAcademicYearMockMvc = MockMvcBuilders.standaloneSetup(categoryAcademicYearResource)
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
    public static CategoryAcademicYear createEntity(EntityManager em) {
        CategoryAcademicYear categoryAcademicYear = new CategoryAcademicYear()
                .position(DEFAULT_POSITION)
                .name(DEFAULT_NAME);
        return categoryAcademicYear;
    }

    @Before
    public void initTest() {
        categoryAcademicYearSearchRepository.deleteAll();
        categoryAcademicYear = createEntity(em);
    }

    @Test
    @Transactional
    public void createCategoryAcademicYear() throws Exception {
        int databaseSizeBeforeCreate = categoryAcademicYearRepository.findAll().size();

        // Create the CategoryAcademicYear

        restCategoryAcademicYearMockMvc.perform(post("/api/category-academic-years")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(categoryAcademicYear)))
            .andExpect(status().isCreated());

        // Validate the CategoryAcademicYear in the database
        List<CategoryAcademicYear> categoryAcademicYearList = categoryAcademicYearRepository.findAll();
        assertThat(categoryAcademicYearList).hasSize(databaseSizeBeforeCreate + 1);
        CategoryAcademicYear testCategoryAcademicYear = categoryAcademicYearList.get(categoryAcademicYearList.size() - 1);
        assertThat(testCategoryAcademicYear.getPosition()).isEqualTo(DEFAULT_POSITION);
        assertThat(testCategoryAcademicYear.getName()).isEqualTo(DEFAULT_NAME);

        // Validate the CategoryAcademicYear in Elasticsearch
        CategoryAcademicYear categoryAcademicYearEs = categoryAcademicYearSearchRepository.findOne(testCategoryAcademicYear.getId());
        assertThat(categoryAcademicYearEs).isEqualToComparingFieldByField(testCategoryAcademicYear);
    }

    @Test
    @Transactional
    public void createCategoryAcademicYearWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = categoryAcademicYearRepository.findAll().size();

        // Create the CategoryAcademicYear with an existing ID
        CategoryAcademicYear existingCategoryAcademicYear = new CategoryAcademicYear();
        existingCategoryAcademicYear.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restCategoryAcademicYearMockMvc.perform(post("/api/category-academic-years")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(existingCategoryAcademicYear)))
            .andExpect(status().isBadRequest());

        // Validate the Alice in the database
        List<CategoryAcademicYear> categoryAcademicYearList = categoryAcademicYearRepository.findAll();
        assertThat(categoryAcademicYearList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkPositionIsRequired() throws Exception {
        int databaseSizeBeforeTest = categoryAcademicYearRepository.findAll().size();
        // set the field null
        categoryAcademicYear.setPosition(null);

        // Create the CategoryAcademicYear, which fails.

        restCategoryAcademicYearMockMvc.perform(post("/api/category-academic-years")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(categoryAcademicYear)))
            .andExpect(status().isBadRequest());

        List<CategoryAcademicYear> categoryAcademicYearList = categoryAcademicYearRepository.findAll();
        assertThat(categoryAcademicYearList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = categoryAcademicYearRepository.findAll().size();
        // set the field null
        categoryAcademicYear.setName(null);

        // Create the CategoryAcademicYear, which fails.

        restCategoryAcademicYearMockMvc.perform(post("/api/category-academic-years")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(categoryAcademicYear)))
            .andExpect(status().isBadRequest());

        List<CategoryAcademicYear> categoryAcademicYearList = categoryAcademicYearRepository.findAll();
        assertThat(categoryAcademicYearList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllCategoryAcademicYears() throws Exception {
        // Initialize the database
        categoryAcademicYearRepository.saveAndFlush(categoryAcademicYear);

        // Get all the categoryAcademicYearList
        restCategoryAcademicYearMockMvc.perform(get("/api/category-academic-years?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(categoryAcademicYear.getId().intValue())))
            .andExpect(jsonPath("$.[*].position").value(hasItem(DEFAULT_POSITION)))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())));
    }

    @Test
    @Transactional
    public void getCategoryAcademicYear() throws Exception {
        // Initialize the database
        categoryAcademicYearRepository.saveAndFlush(categoryAcademicYear);

        // Get the categoryAcademicYear
        restCategoryAcademicYearMockMvc.perform(get("/api/category-academic-years/{id}", categoryAcademicYear.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(categoryAcademicYear.getId().intValue()))
            .andExpect(jsonPath("$.position").value(DEFAULT_POSITION))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingCategoryAcademicYear() throws Exception {
        // Get the categoryAcademicYear
        restCategoryAcademicYearMockMvc.perform(get("/api/category-academic-years/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateCategoryAcademicYear() throws Exception {
        // Initialize the database
        categoryAcademicYearRepository.saveAndFlush(categoryAcademicYear);
        categoryAcademicYearSearchRepository.save(categoryAcademicYear);
        int databaseSizeBeforeUpdate = categoryAcademicYearRepository.findAll().size();

        // Update the categoryAcademicYear
        CategoryAcademicYear updatedCategoryAcademicYear = categoryAcademicYearRepository.findOne(categoryAcademicYear.getId());
        updatedCategoryAcademicYear
                .position(UPDATED_POSITION)
                .name(UPDATED_NAME);

        restCategoryAcademicYearMockMvc.perform(put("/api/category-academic-years")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedCategoryAcademicYear)))
            .andExpect(status().isOk());

        // Validate the CategoryAcademicYear in the database
        List<CategoryAcademicYear> categoryAcademicYearList = categoryAcademicYearRepository.findAll();
        assertThat(categoryAcademicYearList).hasSize(databaseSizeBeforeUpdate);
        CategoryAcademicYear testCategoryAcademicYear = categoryAcademicYearList.get(categoryAcademicYearList.size() - 1);
        assertThat(testCategoryAcademicYear.getPosition()).isEqualTo(UPDATED_POSITION);
        assertThat(testCategoryAcademicYear.getName()).isEqualTo(UPDATED_NAME);

        // Validate the CategoryAcademicYear in Elasticsearch
        CategoryAcademicYear categoryAcademicYearEs = categoryAcademicYearSearchRepository.findOne(testCategoryAcademicYear.getId());
        assertThat(categoryAcademicYearEs).isEqualToComparingFieldByField(testCategoryAcademicYear);
    }

    @Test
    @Transactional
    public void updateNonExistingCategoryAcademicYear() throws Exception {
        int databaseSizeBeforeUpdate = categoryAcademicYearRepository.findAll().size();

        // Create the CategoryAcademicYear

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restCategoryAcademicYearMockMvc.perform(put("/api/category-academic-years")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(categoryAcademicYear)))
            .andExpect(status().isCreated());

        // Validate the CategoryAcademicYear in the database
        List<CategoryAcademicYear> categoryAcademicYearList = categoryAcademicYearRepository.findAll();
        assertThat(categoryAcademicYearList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteCategoryAcademicYear() throws Exception {
        // Initialize the database
        categoryAcademicYearRepository.saveAndFlush(categoryAcademicYear);
        categoryAcademicYearSearchRepository.save(categoryAcademicYear);
        int databaseSizeBeforeDelete = categoryAcademicYearRepository.findAll().size();

        // Get the categoryAcademicYear
        restCategoryAcademicYearMockMvc.perform(delete("/api/category-academic-years/{id}", categoryAcademicYear.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean categoryAcademicYearExistsInEs = categoryAcademicYearSearchRepository.exists(categoryAcademicYear.getId());
        assertThat(categoryAcademicYearExistsInEs).isFalse();

        // Validate the database is empty
        List<CategoryAcademicYear> categoryAcademicYearList = categoryAcademicYearRepository.findAll();
        assertThat(categoryAcademicYearList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchCategoryAcademicYear() throws Exception {
        // Initialize the database
        categoryAcademicYearRepository.saveAndFlush(categoryAcademicYear);
        categoryAcademicYearSearchRepository.save(categoryAcademicYear);

        // Search the categoryAcademicYear
        restCategoryAcademicYearMockMvc.perform(get("/api/_search/category-academic-years?query=id:" + categoryAcademicYear.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(categoryAcademicYear.getId().intValue())))
            .andExpect(jsonPath("$.[*].position").value(hasItem(DEFAULT_POSITION)))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())));
    }

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CategoryAcademicYear.class);
    }
}
