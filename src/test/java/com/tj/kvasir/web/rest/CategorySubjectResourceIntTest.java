package com.tj.kvasir.web.rest;

import com.tj.kvasir.KavsirApp;

import com.tj.kvasir.domain.CategorySubject;
import com.tj.kvasir.repository.CategorySubjectRepository;
import com.tj.kvasir.repository.search.CategorySubjectSearchRepository;
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
 * Test class for the CategorySubjectResource REST controller.
 *
 * @see CategorySubjectResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = KavsirApp.class)
public class CategorySubjectResourceIntTest {

    private static final Integer DEFAULT_POSITION = 1;
    private static final Integer UPDATED_POSITION = 2;

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    @Autowired
    private CategorySubjectRepository categorySubjectRepository;

    @Autowired
    private CategorySubjectSearchRepository categorySubjectSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restCategorySubjectMockMvc;

    private CategorySubject categorySubject;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final CategorySubjectResource categorySubjectResource = new CategorySubjectResource(categorySubjectRepository, categorySubjectSearchRepository);
        this.restCategorySubjectMockMvc = MockMvcBuilders.standaloneSetup(categorySubjectResource)
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
    public static CategorySubject createEntity(EntityManager em) {
        CategorySubject categorySubject = new CategorySubject()
            .position(DEFAULT_POSITION)
            .name(DEFAULT_NAME);
        return categorySubject;
    }

    @Before
    public void initTest() {
        categorySubjectSearchRepository.deleteAll();
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
        CategorySubject categorySubjectEs = categorySubjectSearchRepository.findOne(testCategorySubject.getId());
        assertThat(categorySubjectEs).isEqualToComparingFieldByField(testCategorySubject);
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

        // Validate the Alice in the database
        List<CategorySubject> categorySubjectList = categorySubjectRepository.findAll();
        assertThat(categorySubjectList).hasSize(databaseSizeBeforeCreate);
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
        categorySubjectSearchRepository.save(categorySubject);
        int databaseSizeBeforeUpdate = categorySubjectRepository.findAll().size();

        // Update the categorySubject
        CategorySubject updatedCategorySubject = categorySubjectRepository.findOne(categorySubject.getId());
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
        CategorySubject categorySubjectEs = categorySubjectSearchRepository.findOne(testCategorySubject.getId());
        assertThat(categorySubjectEs).isEqualToComparingFieldByField(testCategorySubject);
    }

    @Test
    @Transactional
    public void updateNonExistingCategorySubject() throws Exception {
        int databaseSizeBeforeUpdate = categorySubjectRepository.findAll().size();

        // Create the CategorySubject

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restCategorySubjectMockMvc.perform(put("/api/category-subjects")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(categorySubject)))
            .andExpect(status().isCreated());

        // Validate the CategorySubject in the database
        List<CategorySubject> categorySubjectList = categorySubjectRepository.findAll();
        assertThat(categorySubjectList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteCategorySubject() throws Exception {
        // Initialize the database
        categorySubjectRepository.saveAndFlush(categorySubject);
        categorySubjectSearchRepository.save(categorySubject);
        int databaseSizeBeforeDelete = categorySubjectRepository.findAll().size();

        // Get the categorySubject
        restCategorySubjectMockMvc.perform(delete("/api/category-subjects/{id}", categorySubject.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean categorySubjectExistsInEs = categorySubjectSearchRepository.exists(categorySubject.getId());
        assertThat(categorySubjectExistsInEs).isFalse();

        // Validate the database is empty
        List<CategorySubject> categorySubjectList = categorySubjectRepository.findAll();
        assertThat(categorySubjectList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchCategorySubject() throws Exception {
        // Initialize the database
        categorySubjectRepository.saveAndFlush(categorySubject);
        categorySubjectSearchRepository.save(categorySubject);

        // Search the categorySubject
        restCategorySubjectMockMvc.perform(get("/api/_search/category-subjects?query=id:" + categorySubject.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(categorySubject.getId().intValue())))
            .andExpect(jsonPath("$.[*].position").value(hasItem(DEFAULT_POSITION)))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())));
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
