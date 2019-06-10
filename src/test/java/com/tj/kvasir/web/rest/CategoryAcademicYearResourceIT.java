package com.tj.kvasir.web.rest;

import com.tj.kvasir.KavsirApp;
import com.tj.kvasir.domain.CategoryAcademicYear;
import com.tj.kvasir.repository.CategoryAcademicYearRepository;
import com.tj.kvasir.repository.CategoryNodeRepository;
import com.tj.kvasir.repository.search.CategoryAcademicYearSearchRepository;
import com.tj.kvasir.web.rest.errors.ExceptionTranslator;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
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
 * Integration tests for the {@Link CategoryAcademicYearResource} REST controller.
 */
@SpringBootTest(classes = KavsirApp.class)
public class CategoryAcademicYearResourceIT {

    private static final Integer DEFAULT_POSITION = 1;
    private static final Integer UPDATED_POSITION = 2;

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    @Autowired
    private CategoryAcademicYearRepository categoryAcademicYearRepository;

    /**
     * This repository is mocked in the com.tj.kvasir.repository.search test package.
     *
     * @see com.tj.kvasir.repository.search.CategoryAcademicYearSearchRepositoryMockConfiguration
     */
    @Autowired
    private CategoryAcademicYearSearchRepository mockCategoryAcademicYearSearchRepository;

    @Autowired
    private CategoryNodeRepository mockCategoryNodeRepository;

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

    private MockMvc restCategoryAcademicYearMockMvc;

    private CategoryAcademicYear categoryAcademicYear;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final CategoryAcademicYearResource categoryAcademicYearResource = new CategoryAcademicYearResource(categoryAcademicYearRepository, mockCategoryAcademicYearSearchRepository, mockCategoryNodeRepository);
        this.restCategoryAcademicYearMockMvc = MockMvcBuilders.standaloneSetup(categoryAcademicYearResource)
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
    public static CategoryAcademicYear createEntity(EntityManager em) {
        CategoryAcademicYear categoryAcademicYear = new CategoryAcademicYear()
            .position(DEFAULT_POSITION)
            .name(DEFAULT_NAME);
        return categoryAcademicYear;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CategoryAcademicYear createUpdatedEntity(EntityManager em) {
        CategoryAcademicYear categoryAcademicYear = new CategoryAcademicYear()
            .position(UPDATED_POSITION)
            .name(UPDATED_NAME);
        return categoryAcademicYear;
    }

    @BeforeEach
    public void initTest() {
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
        verify(mockCategoryAcademicYearSearchRepository, times(1)).save(testCategoryAcademicYear);
    }

    @Test
    @Transactional
    public void createCategoryAcademicYearWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = categoryAcademicYearRepository.findAll().size();

        // Create the CategoryAcademicYear with an existing ID
        categoryAcademicYear.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restCategoryAcademicYearMockMvc.perform(post("/api/category-academic-years")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(categoryAcademicYear)))
            .andExpect(status().isBadRequest());

        // Validate the CategoryAcademicYear in the database
        List<CategoryAcademicYear> categoryAcademicYearList = categoryAcademicYearRepository.findAll();
        assertThat(categoryAcademicYearList).hasSize(databaseSizeBeforeCreate);

        // Validate the CategoryAcademicYear in Elasticsearch
        verify(mockCategoryAcademicYearSearchRepository, times(0)).save(categoryAcademicYear);
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

        int databaseSizeBeforeUpdate = categoryAcademicYearRepository.findAll().size();

        // Update the categoryAcademicYear
        CategoryAcademicYear updatedCategoryAcademicYear = categoryAcademicYearRepository.findById(categoryAcademicYear.getId()).get();
        // Disconnect from session so that the updates on updatedCategoryAcademicYear are not directly saved in db
        em.detach(updatedCategoryAcademicYear);
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
        verify(mockCategoryAcademicYearSearchRepository, times(1)).save(testCategoryAcademicYear);
    }

    @Test
    @Transactional
    public void updateNonExistingCategoryAcademicYear() throws Exception {
        int databaseSizeBeforeUpdate = categoryAcademicYearRepository.findAll().size();

        // Create the CategoryAcademicYear

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCategoryAcademicYearMockMvc.perform(put("/api/category-academic-years")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(categoryAcademicYear)))
            .andExpect(status().isBadRequest());

        // Validate the CategoryAcademicYear in the database
        List<CategoryAcademicYear> categoryAcademicYearList = categoryAcademicYearRepository.findAll();
        assertThat(categoryAcademicYearList).hasSize(databaseSizeBeforeUpdate);

        // Validate the CategoryAcademicYear in Elasticsearch
        verify(mockCategoryAcademicYearSearchRepository, times(0)).save(categoryAcademicYear);
    }

    @Test
    @Transactional
    public void deleteCategoryAcademicYear() throws Exception {
        // Initialize the database
        categoryAcademicYearRepository.saveAndFlush(categoryAcademicYear);

        int databaseSizeBeforeDelete = categoryAcademicYearRepository.findAll().size();

        // Delete the categoryAcademicYear
        restCategoryAcademicYearMockMvc.perform(delete("/api/category-academic-years/{id}", categoryAcademicYear.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database is empty
        List<CategoryAcademicYear> categoryAcademicYearList = categoryAcademicYearRepository.findAll();
        assertThat(categoryAcademicYearList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the CategoryAcademicYear in Elasticsearch
        verify(mockCategoryAcademicYearSearchRepository, times(1)).deleteById(categoryAcademicYear.getId());
    }

    @Test
    @Transactional
    public void searchCategoryAcademicYear() throws Exception {
        // Initialize the database
        categoryAcademicYearRepository.saveAndFlush(categoryAcademicYear);
        when(mockCategoryAcademicYearSearchRepository.search(queryStringQuery("id:" + categoryAcademicYear.getId())))
            .thenReturn(Collections.singletonList(categoryAcademicYear));
        // Search the categoryAcademicYear
        restCategoryAcademicYearMockMvc.perform(get("/api/_search/category-academic-years?query=id:" + categoryAcademicYear.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(categoryAcademicYear.getId().intValue())))
            .andExpect(jsonPath("$.[*].position").value(hasItem(DEFAULT_POSITION)))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CategoryAcademicYear.class);
        CategoryAcademicYear categoryAcademicYear1 = new CategoryAcademicYear();
        categoryAcademicYear1.setId(1L);
        CategoryAcademicYear categoryAcademicYear2 = new CategoryAcademicYear();
        categoryAcademicYear2.setId(categoryAcademicYear1.getId());
        assertThat(categoryAcademicYear1).isEqualTo(categoryAcademicYear2);
        categoryAcademicYear2.setId(2L);
        assertThat(categoryAcademicYear1).isNotEqualTo(categoryAcademicYear2);
        categoryAcademicYear1.setId(null);
        assertThat(categoryAcademicYear1).isNotEqualTo(categoryAcademicYear2);
    }
}
