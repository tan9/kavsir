package com.tj.kvasir.web.rest;

import com.tj.kvasir.KavsirApp;
import com.tj.kvasir.domain.CategorySubject;
import com.tj.kvasir.repository.CategoryNodeRepository;
import com.tj.kvasir.repository.CategorySubjectRepository;
import com.tj.kvasir.repository.search.CategorySubjectSearchRepository;
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
 * Integration tests for the {@Link CategorySubjectResource} REST controller.
 */
@SpringBootTest(classes = KavsirApp.class)
public class CategorySubjectResourceIT {

    private static final Integer DEFAULT_POSITION = 1;
    private static final Integer UPDATED_POSITION = 2;

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    @Autowired
    private CategorySubjectRepository categorySubjectRepository;

    /**
     * This repository is mocked in the com.tj.kvasir.repository.search test package.
     *
     * @see com.tj.kvasir.repository.search.CategorySubjectSearchRepositoryMockConfiguration
     */
    @Autowired
    private CategorySubjectSearchRepository mockCategorySubjectSearchRepository;

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

    private MockMvc restCategorySubjectMockMvc;

    private CategorySubject categorySubject;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final CategorySubjectResource categorySubjectResource = new CategorySubjectResource(categorySubjectRepository, mockCategorySubjectSearchRepository, mockCategoryNodeRepository);
        this.restCategorySubjectMockMvc = MockMvcBuilders.standaloneSetup(categorySubjectResource)
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
    public static CategorySubject createEntity(EntityManager em) {
        CategorySubject categorySubject = new CategorySubject()
            .position(DEFAULT_POSITION)
            .name(DEFAULT_NAME);
        return categorySubject;
    }

    @BeforeEach
    public void initTest() {
        categorySubject = createEntity(em);
    }

    @Test
    @Transactional
    public void createCategorySubject() throws Exception {
        int databaseSizeBeforeCreate = categorySubjectRepository.findAll().size();

        // Create the CategorySubject
        restCategorySubjectMockMvc.perform(post("/api/category-subjects")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(categorySubject)))
            .andExpect(status().isCreated());

        // Validate the CategorySubject in the database
        List<CategorySubject> categorySubjectList = categorySubjectRepository.findAll();
        assertThat(categorySubjectList).hasSize(databaseSizeBeforeCreate + 1);
        CategorySubject testCategorySubject = categorySubjectList.get(categorySubjectList.size() - 1);
        assertThat(testCategorySubject.getPosition()).isEqualTo(DEFAULT_POSITION);
        assertThat(testCategorySubject.getName()).isEqualTo(DEFAULT_NAME);

        // Validate the CategorySubject in Elasticsearch
        verify(mockCategorySubjectSearchRepository, times(1)).save(testCategorySubject);
    }

    @Test
    @Transactional
    public void createCategorySubjectWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = categorySubjectRepository.findAll().size();

        // Create the CategorySubject with an existing ID
        categorySubject.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restCategorySubjectMockMvc.perform(post("/api/category-subjects")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(categorySubject)))
            .andExpect(status().isBadRequest());

        // Validate the CategorySubject in the database
        List<CategorySubject> categorySubjectList = categorySubjectRepository.findAll();
        assertThat(categorySubjectList).hasSize(databaseSizeBeforeCreate);

        // Validate the CategorySubject in Elasticsearch
        verify(mockCategorySubjectSearchRepository, times(0)).save(categorySubject);
    }


    @Test
    @Transactional
    public void checkPositionIsRequired() throws Exception {
        int databaseSizeBeforeTest = categorySubjectRepository.findAll().size();
        // set the field null
        categorySubject.setPosition(null);

        // Create the CategorySubject, which fails.

        restCategorySubjectMockMvc.perform(post("/api/category-subjects")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(categorySubject)))
            .andExpect(status().isBadRequest());

        List<CategorySubject> categorySubjectList = categorySubjectRepository.findAll();
        assertThat(categorySubjectList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = categorySubjectRepository.findAll().size();
        // set the field null
        categorySubject.setName(null);

        // Create the CategorySubject, which fails.

        restCategorySubjectMockMvc.perform(post("/api/category-subjects")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(categorySubject)))
            .andExpect(status().isBadRequest());

        List<CategorySubject> categorySubjectList = categorySubjectRepository.findAll();
        assertThat(categorySubjectList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllCategorySubjects() throws Exception {
        // Initialize the database
        categorySubjectRepository.saveAndFlush(categorySubject);

        // Get all the categorySubjectList
        restCategorySubjectMockMvc.perform(get("/api/category-subjects?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(categorySubject.getId().intValue())))
            .andExpect(jsonPath("$.[*].position").value(hasItem(DEFAULT_POSITION)))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())));
    }

    @Test
    @Transactional
    public void getCategorySubject() throws Exception {
        // Initialize the database
        categorySubjectRepository.saveAndFlush(categorySubject);

        // Get the categorySubject
        restCategorySubjectMockMvc.perform(get("/api/category-subjects/{id}", categorySubject.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(categorySubject.getId().intValue()))
            .andExpect(jsonPath("$.position").value(DEFAULT_POSITION))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingCategorySubject() throws Exception {
        // Get the categorySubject
        restCategorySubjectMockMvc.perform(get("/api/category-subjects/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateCategorySubject() throws Exception {
        // Initialize the database
        categorySubjectRepository.saveAndFlush(categorySubject);

        int databaseSizeBeforeUpdate = categorySubjectRepository.findAll().size();

        // Update the categorySubject
        CategorySubject updatedCategorySubject = categorySubjectRepository.findById(categorySubject.getId()).get();
        // Disconnect from session so that the updates on updatedCategorySubject are not directly saved in db
        em.detach(updatedCategorySubject);
        updatedCategorySubject
            .position(UPDATED_POSITION)
            .name(UPDATED_NAME);

        restCategorySubjectMockMvc.perform(put("/api/category-subjects")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedCategorySubject)))
            .andExpect(status().isOk());

        // Validate the CategorySubject in the database
        List<CategorySubject> categorySubjectList = categorySubjectRepository.findAll();
        assertThat(categorySubjectList).hasSize(databaseSizeBeforeUpdate);
        CategorySubject testCategorySubject = categorySubjectList.get(categorySubjectList.size() - 1);
        assertThat(testCategorySubject.getPosition()).isEqualTo(UPDATED_POSITION);
        assertThat(testCategorySubject.getName()).isEqualTo(UPDATED_NAME);

        // Validate the CategorySubject in Elasticsearch
        verify(mockCategorySubjectSearchRepository, times(1)).save(testCategorySubject);
    }

    @Test
    @Transactional
    public void updateNonExistingCategorySubject() throws Exception {
        int databaseSizeBeforeUpdate = categorySubjectRepository.findAll().size();

        // Create the CategorySubject

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCategorySubjectMockMvc.perform(put("/api/category-subjects")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(categorySubject)))
            .andExpect(status().isBadRequest());

        // Validate the CategorySubject in the database
        List<CategorySubject> categorySubjectList = categorySubjectRepository.findAll();
        assertThat(categorySubjectList).hasSize(databaseSizeBeforeUpdate);

        // Validate the CategorySubject in Elasticsearch
        verify(mockCategorySubjectSearchRepository, times(0)).save(categorySubject);
    }

    @Test
    @Transactional
    public void deleteCategorySubject() throws Exception {
        // Initialize the database
        categorySubjectRepository.saveAndFlush(categorySubject);

        int databaseSizeBeforeDelete = categorySubjectRepository.findAll().size();

        // Delete the categorySubject
        restCategorySubjectMockMvc.perform(delete("/api/category-subjects/{id}", categorySubject.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database is empty
        List<CategorySubject> categorySubjectList = categorySubjectRepository.findAll();
        assertThat(categorySubjectList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the CategorySubject in Elasticsearch
        verify(mockCategorySubjectSearchRepository, times(1)).deleteById(categorySubject.getId());
    }

    @Test
    @Transactional
    public void searchCategorySubject() throws Exception {
        // Initialize the database
        categorySubjectRepository.saveAndFlush(categorySubject);
        when(mockCategorySubjectSearchRepository.search(queryStringQuery("id:" + categorySubject.getId())))
            .thenReturn(Collections.singletonList(categorySubject));
        // Search the categorySubject
        restCategorySubjectMockMvc.perform(get("/api/_search/category-subjects?query=id:" + categorySubject.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(categorySubject.getId().intValue())))
            .andExpect(jsonPath("$.[*].position").value(hasItem(DEFAULT_POSITION)))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CategorySubject.class);
        CategorySubject categorySubject1 = new CategorySubject();
        categorySubject1.setId(1L);
        CategorySubject categorySubject2 = new CategorySubject();
        categorySubject2.setId(categorySubject1.getId());
        assertThat(categorySubject1).isEqualTo(categorySubject2);
        categorySubject2.setId(2L);
        assertThat(categorySubject1).isNotEqualTo(categorySubject2);
        categorySubject1.setId(null);
        assertThat(categorySubject1).isNotEqualTo(categorySubject2);
    }
}
