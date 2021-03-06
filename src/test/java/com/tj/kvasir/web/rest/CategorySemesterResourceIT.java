package com.tj.kvasir.web.rest;

import com.tj.kvasir.KavsirApp;
import com.tj.kvasir.domain.CategorySemester;
import com.tj.kvasir.repository.CategoryNodeRepository;
import com.tj.kvasir.repository.CategorySemesterRepository;
import com.tj.kvasir.repository.search.CategorySemesterSearchRepository;
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
 * Integration tests for the {@Link CategorySemesterResource} REST controller.
 */
@SpringBootTest(classes = KavsirApp.class)
public class CategorySemesterResourceIT {

    private static final Integer DEFAULT_POSITION = 1;
    private static final Integer UPDATED_POSITION = 2;

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    @Autowired
    private CategorySemesterRepository categorySemesterRepository;

    /**
     * This repository is mocked in the com.tj.kvasir.repository.search test package.
     *
     * @see com.tj.kvasir.repository.search.CategorySemesterSearchRepositoryMockConfiguration
     */
    @Autowired
    private CategorySemesterSearchRepository mockCategorySemesterSearchRepository;

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

    private MockMvc restCategorySemesterMockMvc;

    private CategorySemester categorySemester;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final CategorySemesterResource categorySemesterResource = new CategorySemesterResource(categorySemesterRepository, mockCategorySemesterSearchRepository, mockCategoryNodeRepository);
        this.restCategorySemesterMockMvc = MockMvcBuilders.standaloneSetup(categorySemesterResource)
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
    public static CategorySemester createEntity(EntityManager em) {
        CategorySemester categorySemester = new CategorySemester()
            .position(DEFAULT_POSITION)
            .name(DEFAULT_NAME);
        return categorySemester;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CategorySemester createUpdatedEntity(EntityManager em) {
        CategorySemester categorySemester = new CategorySemester()
            .position(UPDATED_POSITION)
            .name(UPDATED_NAME);
        return categorySemester;
    }

    @BeforeEach
    public void initTest() {
        categorySemester = createEntity(em);
    }

    @Test
    @Transactional
    public void createCategorySemester() throws Exception {
        int databaseSizeBeforeCreate = categorySemesterRepository.findAll().size();

        // Create the CategorySemester
        restCategorySemesterMockMvc.perform(post("/api/category-semesters")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(categorySemester)))
            .andExpect(status().isCreated());

        // Validate the CategorySemester in the database
        List<CategorySemester> categorySemesterList = categorySemesterRepository.findAll();
        assertThat(categorySemesterList).hasSize(databaseSizeBeforeCreate + 1);
        CategorySemester testCategorySemester = categorySemesterList.get(categorySemesterList.size() - 1);
        assertThat(testCategorySemester.getPosition()).isEqualTo(DEFAULT_POSITION);
        assertThat(testCategorySemester.getName()).isEqualTo(DEFAULT_NAME);

        // Validate the CategorySemester in Elasticsearch
        verify(mockCategorySemesterSearchRepository, times(1)).save(testCategorySemester);
    }

    @Test
    @Transactional
    public void createCategorySemesterWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = categorySemesterRepository.findAll().size();

        // Create the CategorySemester with an existing ID
        categorySemester.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restCategorySemesterMockMvc.perform(post("/api/category-semesters")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(categorySemester)))
            .andExpect(status().isBadRequest());

        // Validate the CategorySemester in the database
        List<CategorySemester> categorySemesterList = categorySemesterRepository.findAll();
        assertThat(categorySemesterList).hasSize(databaseSizeBeforeCreate);

        // Validate the CategorySemester in Elasticsearch
        verify(mockCategorySemesterSearchRepository, times(0)).save(categorySemester);
    }


    @Test
    @Transactional
    public void checkPositionIsRequired() throws Exception {
        int databaseSizeBeforeTest = categorySemesterRepository.findAll().size();
        // set the field null
        categorySemester.setPosition(null);

        // Create the CategorySemester, which fails.

        restCategorySemesterMockMvc.perform(post("/api/category-semesters")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(categorySemester)))
            .andExpect(status().isBadRequest());

        List<CategorySemester> categorySemesterList = categorySemesterRepository.findAll();
        assertThat(categorySemesterList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = categorySemesterRepository.findAll().size();
        // set the field null
        categorySemester.setName(null);

        // Create the CategorySemester, which fails.

        restCategorySemesterMockMvc.perform(post("/api/category-semesters")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(categorySemester)))
            .andExpect(status().isBadRequest());

        List<CategorySemester> categorySemesterList = categorySemesterRepository.findAll();
        assertThat(categorySemesterList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllCategorySemesters() throws Exception {
        // Initialize the database
        categorySemesterRepository.saveAndFlush(categorySemester);

        // Get all the categorySemesterList
        restCategorySemesterMockMvc.perform(get("/api/category-semesters?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(categorySemester.getId().intValue())))
            .andExpect(jsonPath("$.[*].position").value(hasItem(DEFAULT_POSITION)))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())));
    }

    @Test
    @Transactional
    public void getCategorySemester() throws Exception {
        // Initialize the database
        categorySemesterRepository.saveAndFlush(categorySemester);

        // Get the categorySemester
        restCategorySemesterMockMvc.perform(get("/api/category-semesters/{id}", categorySemester.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(categorySemester.getId().intValue()))
            .andExpect(jsonPath("$.position").value(DEFAULT_POSITION))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingCategorySemester() throws Exception {
        // Get the categorySemester
        restCategorySemesterMockMvc.perform(get("/api/category-semesters/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateCategorySemester() throws Exception {
        // Initialize the database
        categorySemesterRepository.saveAndFlush(categorySemester);

        int databaseSizeBeforeUpdate = categorySemesterRepository.findAll().size();

        // Update the categorySemester
        CategorySemester updatedCategorySemester = categorySemesterRepository.findById(categorySemester.getId()).get();
        // Disconnect from session so that the updates on updatedCategorySemester are not directly saved in db
        em.detach(updatedCategorySemester);
        updatedCategorySemester
            .position(UPDATED_POSITION)
            .name(UPDATED_NAME);

        restCategorySemesterMockMvc.perform(put("/api/category-semesters")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedCategorySemester)))
            .andExpect(status().isOk());

        // Validate the CategorySemester in the database
        List<CategorySemester> categorySemesterList = categorySemesterRepository.findAll();
        assertThat(categorySemesterList).hasSize(databaseSizeBeforeUpdate);
        CategorySemester testCategorySemester = categorySemesterList.get(categorySemesterList.size() - 1);
        assertThat(testCategorySemester.getPosition()).isEqualTo(UPDATED_POSITION);
        assertThat(testCategorySemester.getName()).isEqualTo(UPDATED_NAME);

        // Validate the CategorySemester in Elasticsearch
        verify(mockCategorySemesterSearchRepository, times(1)).save(testCategorySemester);
    }

    @Test
    @Transactional
    public void updateNonExistingCategorySemester() throws Exception {
        int databaseSizeBeforeUpdate = categorySemesterRepository.findAll().size();

        // Create the CategorySemester

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCategorySemesterMockMvc.perform(put("/api/category-semesters")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(categorySemester)))
            .andExpect(status().isBadRequest());

        // Validate the CategorySemester in the database
        List<CategorySemester> categorySemesterList = categorySemesterRepository.findAll();
        assertThat(categorySemesterList).hasSize(databaseSizeBeforeUpdate);

        // Validate the CategorySemester in Elasticsearch
        verify(mockCategorySemesterSearchRepository, times(0)).save(categorySemester);
    }

    @Test
    @Transactional
    public void deleteCategorySemester() throws Exception {
        // Initialize the database
        categorySemesterRepository.saveAndFlush(categorySemester);

        int databaseSizeBeforeDelete = categorySemesterRepository.findAll().size();

        // Delete the categorySemester
        restCategorySemesterMockMvc.perform(delete("/api/category-semesters/{id}", categorySemester.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database is empty
        List<CategorySemester> categorySemesterList = categorySemesterRepository.findAll();
        assertThat(categorySemesterList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the CategorySemester in Elasticsearch
        verify(mockCategorySemesterSearchRepository, times(1)).deleteById(categorySemester.getId());
    }

    @Test
    @Transactional
    public void searchCategorySemester() throws Exception {
        // Initialize the database
        categorySemesterRepository.saveAndFlush(categorySemester);
        when(mockCategorySemesterSearchRepository.search(queryStringQuery("id:" + categorySemester.getId())))
            .thenReturn(Collections.singletonList(categorySemester));
        // Search the categorySemester
        restCategorySemesterMockMvc.perform(get("/api/_search/category-semesters?query=id:" + categorySemester.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(categorySemester.getId().intValue())))
            .andExpect(jsonPath("$.[*].position").value(hasItem(DEFAULT_POSITION)))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CategorySemester.class);
        CategorySemester categorySemester1 = new CategorySemester();
        categorySemester1.setId(1L);
        CategorySemester categorySemester2 = new CategorySemester();
        categorySemester2.setId(categorySemester1.getId());
        assertThat(categorySemester1).isEqualTo(categorySemester2);
        categorySemester2.setId(2L);
        assertThat(categorySemester1).isNotEqualTo(categorySemester2);
        categorySemester1.setId(null);
        assertThat(categorySemester1).isNotEqualTo(categorySemester2);
    }
}
