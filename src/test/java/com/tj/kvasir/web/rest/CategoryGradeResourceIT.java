package com.tj.kvasir.web.rest;

import com.tj.kvasir.KavsirApp;
import com.tj.kvasir.domain.CategoryGrade;
import com.tj.kvasir.repository.CategoryGradeRepository;
import com.tj.kvasir.repository.CategoryNodeRepository;
import com.tj.kvasir.repository.search.CategoryGradeSearchRepository;
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
 * Integration tests for the {@Link CategoryGradeResource} REST controller.
 */
@SpringBootTest(classes = KavsirApp.class)
public class CategoryGradeResourceIT {

    private static final Integer DEFAULT_POSITION = 1;
    private static final Integer UPDATED_POSITION = 2;

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    @Autowired
    private CategoryGradeRepository categoryGradeRepository;

    /**
     * This repository is mocked in the com.tj.kvasir.repository.search test package.
     *
     * @see com.tj.kvasir.repository.search.CategoryGradeSearchRepositoryMockConfiguration
     */
    @Autowired
    private CategoryGradeSearchRepository mockCategoryGradeSearchRepository;

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

    private MockMvc restCategoryGradeMockMvc;

    private CategoryGrade categoryGrade;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final CategoryGradeResource categoryGradeResource = new CategoryGradeResource(categoryGradeRepository, mockCategoryGradeSearchRepository, mockCategoryNodeRepository);
        this.restCategoryGradeMockMvc = MockMvcBuilders.standaloneSetup(categoryGradeResource)
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
    public static CategoryGrade createEntity(EntityManager em) {
        CategoryGrade categoryGrade = new CategoryGrade()
            .position(DEFAULT_POSITION)
            .name(DEFAULT_NAME);
        return categoryGrade;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CategoryGrade createUpdatedEntity(EntityManager em) {
        CategoryGrade categoryGrade = new CategoryGrade()
            .position(UPDATED_POSITION)
            .name(UPDATED_NAME);
        return categoryGrade;
    }

    @BeforeEach
    public void initTest() {
        categoryGrade = createEntity(em);
    }

    @Test
    @Transactional
    public void createCategoryGrade() throws Exception {
        int databaseSizeBeforeCreate = categoryGradeRepository.findAll().size();

        // Create the CategoryGrade
        restCategoryGradeMockMvc.perform(post("/api/category-grades")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(categoryGrade)))
            .andExpect(status().isCreated());

        // Validate the CategoryGrade in the database
        List<CategoryGrade> categoryGradeList = categoryGradeRepository.findAll();
        assertThat(categoryGradeList).hasSize(databaseSizeBeforeCreate + 1);
        CategoryGrade testCategoryGrade = categoryGradeList.get(categoryGradeList.size() - 1);
        assertThat(testCategoryGrade.getPosition()).isEqualTo(DEFAULT_POSITION);
        assertThat(testCategoryGrade.getName()).isEqualTo(DEFAULT_NAME);

        // Validate the CategoryGrade in Elasticsearch
        verify(mockCategoryGradeSearchRepository, times(1)).save(testCategoryGrade);
    }

    @Test
    @Transactional
    public void createCategoryGradeWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = categoryGradeRepository.findAll().size();

        // Create the CategoryGrade with an existing ID
        categoryGrade.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restCategoryGradeMockMvc.perform(post("/api/category-grades")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(categoryGrade)))
            .andExpect(status().isBadRequest());

        // Validate the CategoryGrade in the database
        List<CategoryGrade> categoryGradeList = categoryGradeRepository.findAll();
        assertThat(categoryGradeList).hasSize(databaseSizeBeforeCreate);

        // Validate the CategoryGrade in Elasticsearch
        verify(mockCategoryGradeSearchRepository, times(0)).save(categoryGrade);
    }


    @Test
    @Transactional
    public void checkPositionIsRequired() throws Exception {
        int databaseSizeBeforeTest = categoryGradeRepository.findAll().size();
        // set the field null
        categoryGrade.setPosition(null);

        // Create the CategoryGrade, which fails.

        restCategoryGradeMockMvc.perform(post("/api/category-grades")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(categoryGrade)))
            .andExpect(status().isBadRequest());

        List<CategoryGrade> categoryGradeList = categoryGradeRepository.findAll();
        assertThat(categoryGradeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = categoryGradeRepository.findAll().size();
        // set the field null
        categoryGrade.setName(null);

        // Create the CategoryGrade, which fails.

        restCategoryGradeMockMvc.perform(post("/api/category-grades")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(categoryGrade)))
            .andExpect(status().isBadRequest());

        List<CategoryGrade> categoryGradeList = categoryGradeRepository.findAll();
        assertThat(categoryGradeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllCategoryGrades() throws Exception {
        // Initialize the database
        categoryGradeRepository.saveAndFlush(categoryGrade);

        // Get all the categoryGradeList
        restCategoryGradeMockMvc.perform(get("/api/category-grades?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(categoryGrade.getId().intValue())))
            .andExpect(jsonPath("$.[*].position").value(hasItem(DEFAULT_POSITION)))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())));
    }

    @Test
    @Transactional
    public void getCategoryGrade() throws Exception {
        // Initialize the database
        categoryGradeRepository.saveAndFlush(categoryGrade);

        // Get the categoryGrade
        restCategoryGradeMockMvc.perform(get("/api/category-grades/{id}", categoryGrade.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(categoryGrade.getId().intValue()))
            .andExpect(jsonPath("$.position").value(DEFAULT_POSITION))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingCategoryGrade() throws Exception {
        // Get the categoryGrade
        restCategoryGradeMockMvc.perform(get("/api/category-grades/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateCategoryGrade() throws Exception {
        // Initialize the database
        categoryGradeRepository.saveAndFlush(categoryGrade);

        int databaseSizeBeforeUpdate = categoryGradeRepository.findAll().size();

        // Update the categoryGrade
        CategoryGrade updatedCategoryGrade = categoryGradeRepository.findById(categoryGrade.getId()).get();
        // Disconnect from session so that the updates on updatedCategoryGrade are not directly saved in db
        em.detach(updatedCategoryGrade);
        updatedCategoryGrade
            .position(UPDATED_POSITION)
            .name(UPDATED_NAME);

        restCategoryGradeMockMvc.perform(put("/api/category-grades")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedCategoryGrade)))
            .andExpect(status().isOk());

        // Validate the CategoryGrade in the database
        List<CategoryGrade> categoryGradeList = categoryGradeRepository.findAll();
        assertThat(categoryGradeList).hasSize(databaseSizeBeforeUpdate);
        CategoryGrade testCategoryGrade = categoryGradeList.get(categoryGradeList.size() - 1);
        assertThat(testCategoryGrade.getPosition()).isEqualTo(UPDATED_POSITION);
        assertThat(testCategoryGrade.getName()).isEqualTo(UPDATED_NAME);

        // Validate the CategoryGrade in Elasticsearch
        verify(mockCategoryGradeSearchRepository, times(1)).save(testCategoryGrade);
    }

    @Test
    @Transactional
    public void updateNonExistingCategoryGrade() throws Exception {
        int databaseSizeBeforeUpdate = categoryGradeRepository.findAll().size();

        // Create the CategoryGrade

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCategoryGradeMockMvc.perform(put("/api/category-grades")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(categoryGrade)))
            .andExpect(status().isBadRequest());

        // Validate the CategoryGrade in the database
        List<CategoryGrade> categoryGradeList = categoryGradeRepository.findAll();
        assertThat(categoryGradeList).hasSize(databaseSizeBeforeUpdate);

        // Validate the CategoryGrade in Elasticsearch
        verify(mockCategoryGradeSearchRepository, times(0)).save(categoryGrade);
    }

    @Test
    @Transactional
    public void deleteCategoryGrade() throws Exception {
        // Initialize the database
        categoryGradeRepository.saveAndFlush(categoryGrade);

        int databaseSizeBeforeDelete = categoryGradeRepository.findAll().size();

        // Delete the categoryGrade
        restCategoryGradeMockMvc.perform(delete("/api/category-grades/{id}", categoryGrade.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database is empty
        List<CategoryGrade> categoryGradeList = categoryGradeRepository.findAll();
        assertThat(categoryGradeList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the CategoryGrade in Elasticsearch
        verify(mockCategoryGradeSearchRepository, times(1)).deleteById(categoryGrade.getId());
    }

    @Test
    @Transactional
    public void searchCategoryGrade() throws Exception {
        // Initialize the database
        categoryGradeRepository.saveAndFlush(categoryGrade);
        when(mockCategoryGradeSearchRepository.search(queryStringQuery("id:" + categoryGrade.getId())))
            .thenReturn(Collections.singletonList(categoryGrade));
        // Search the categoryGrade
        restCategoryGradeMockMvc.perform(get("/api/_search/category-grades?query=id:" + categoryGrade.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(categoryGrade.getId().intValue())))
            .andExpect(jsonPath("$.[*].position").value(hasItem(DEFAULT_POSITION)))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CategoryGrade.class);
        CategoryGrade categoryGrade1 = new CategoryGrade();
        categoryGrade1.setId(1L);
        CategoryGrade categoryGrade2 = new CategoryGrade();
        categoryGrade2.setId(categoryGrade1.getId());
        assertThat(categoryGrade1).isEqualTo(categoryGrade2);
        categoryGrade2.setId(2L);
        assertThat(categoryGrade1).isNotEqualTo(categoryGrade2);
        categoryGrade1.setId(null);
        assertThat(categoryGrade1).isNotEqualTo(categoryGrade2);
    }
}
