package com.tj.kvasir.web.rest;

import com.tj.kvasir.KavsirApp;

import com.tj.kvasir.domain.CategoryNode;
import com.tj.kvasir.repository.CategoryNodeRepository;
import com.tj.kvasir.repository.search.CategoryNodeSearchRepository;
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

import com.tj.kvasir.domain.enumeration.CategoryType;
/**
 * Test class for the CategoryNodeResource REST controller.
 *
 * @see CategoryNodeResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = KavsirApp.class)
public class CategoryNodeResourceIntTest {

    private static final CategoryType DEFAULT_TYPE = CategoryType.ACADEMIC_YEAR;
    private static final CategoryType UPDATED_TYPE = CategoryType.GRADE;

    private static final Long DEFAULT_TYPE_ID = 1L;
    private static final Long UPDATED_TYPE_ID = 2L;

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final Integer DEFAULT_POSITION = 1;
    private static final Integer UPDATED_POSITION = 2;

    @Autowired
    private CategoryNodeRepository categoryNodeRepository;

    @Autowired
    private CategoryNodeSearchRepository categoryNodeSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restCategoryNodeMockMvc;

    private CategoryNode categoryNode;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        CategoryNodeResource categoryNodeResource = new CategoryNodeResource(categoryNodeRepository, categoryNodeSearchRepository);
        this.restCategoryNodeMockMvc = MockMvcBuilders.standaloneSetup(categoryNodeResource)
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
    public static CategoryNode createEntity(EntityManager em) {
        CategoryNode categoryNode = new CategoryNode()
            .type(DEFAULT_TYPE)
            .typeId(DEFAULT_TYPE_ID)
            .name(DEFAULT_NAME)
            .position(DEFAULT_POSITION);
        return categoryNode;
    }

    @Before
    public void initTest() {
        categoryNodeSearchRepository.deleteAll();
        categoryNode = createEntity(em);
    }

    @Test
    @Transactional
    public void createCategoryNode() throws Exception {
        int databaseSizeBeforeCreate = categoryNodeRepository.findAll().size();

        // Create the CategoryNode
        restCategoryNodeMockMvc.perform(post("/api/category-nodes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(categoryNode)))
            .andExpect(status().isCreated());

        // Validate the CategoryNode in the database
        List<CategoryNode> categoryNodeList = categoryNodeRepository.findAll();
        assertThat(categoryNodeList).hasSize(databaseSizeBeforeCreate + 1);
        CategoryNode testCategoryNode = categoryNodeList.get(categoryNodeList.size() - 1);
        assertThat(testCategoryNode.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testCategoryNode.getTypeId()).isEqualTo(DEFAULT_TYPE_ID);
        assertThat(testCategoryNode.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testCategoryNode.getPosition()).isEqualTo(DEFAULT_POSITION);

        // Validate the CategoryNode in Elasticsearch
        CategoryNode categoryNodeEs = categoryNodeSearchRepository.findOne(testCategoryNode.getId());
        assertThat(categoryNodeEs).isEqualToComparingFieldByField(testCategoryNode);
    }

    @Test
    @Transactional
    public void createCategoryNodeWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = categoryNodeRepository.findAll().size();

        // Create the CategoryNode with an existing ID
        categoryNode.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restCategoryNodeMockMvc.perform(post("/api/category-nodes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(categoryNode)))
            .andExpect(status().isBadRequest());

        // Validate the Alice in the database
        List<CategoryNode> categoryNodeList = categoryNodeRepository.findAll();
        assertThat(categoryNodeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkTypeIsRequired() throws Exception {
        int databaseSizeBeforeTest = categoryNodeRepository.findAll().size();
        // set the field null
        categoryNode.setType(null);

        // Create the CategoryNode, which fails.

        restCategoryNodeMockMvc.perform(post("/api/category-nodes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(categoryNode)))
            .andExpect(status().isBadRequest());

        List<CategoryNode> categoryNodeList = categoryNodeRepository.findAll();
        assertThat(categoryNodeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllCategoryNodes() throws Exception {
        // Initialize the database
        categoryNodeRepository.saveAndFlush(categoryNode);

        // Get all the categoryNodeList
        restCategoryNodeMockMvc.perform(get("/api/category-nodes?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(categoryNode.getId().intValue())))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE.toString())))
            .andExpect(jsonPath("$.[*].typeId").value(hasItem(DEFAULT_TYPE_ID.intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].position").value(hasItem(DEFAULT_POSITION)));
    }

    @Test
    @Transactional
    public void getCategoryNode() throws Exception {
        // Initialize the database
        categoryNodeRepository.saveAndFlush(categoryNode);

        // Get the categoryNode
        restCategoryNodeMockMvc.perform(get("/api/category-nodes/{id}", categoryNode.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(categoryNode.getId().intValue()))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE.toString()))
            .andExpect(jsonPath("$.typeId").value(DEFAULT_TYPE_ID.intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.position").value(DEFAULT_POSITION));
    }

    @Test
    @Transactional
    public void getNonExistingCategoryNode() throws Exception {
        // Get the categoryNode
        restCategoryNodeMockMvc.perform(get("/api/category-nodes/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateCategoryNode() throws Exception {
        // Initialize the database
        categoryNodeRepository.saveAndFlush(categoryNode);
        categoryNodeSearchRepository.save(categoryNode);
        int databaseSizeBeforeUpdate = categoryNodeRepository.findAll().size();

        // Update the categoryNode
        CategoryNode updatedCategoryNode = categoryNodeRepository.findOne(categoryNode.getId());
        updatedCategoryNode
            .type(UPDATED_TYPE)
            .typeId(UPDATED_TYPE_ID)
            .name(UPDATED_NAME)
            .position(UPDATED_POSITION);

        restCategoryNodeMockMvc.perform(put("/api/category-nodes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedCategoryNode)))
            .andExpect(status().isOk());

        // Validate the CategoryNode in the database
        List<CategoryNode> categoryNodeList = categoryNodeRepository.findAll();
        assertThat(categoryNodeList).hasSize(databaseSizeBeforeUpdate);
        CategoryNode testCategoryNode = categoryNodeList.get(categoryNodeList.size() - 1);
        assertThat(testCategoryNode.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testCategoryNode.getTypeId()).isEqualTo(UPDATED_TYPE_ID);
        assertThat(testCategoryNode.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testCategoryNode.getPosition()).isEqualTo(UPDATED_POSITION);

        // Validate the CategoryNode in Elasticsearch
        CategoryNode categoryNodeEs = categoryNodeSearchRepository.findOne(testCategoryNode.getId());
        assertThat(categoryNodeEs).isEqualToComparingFieldByField(testCategoryNode);
    }

    @Test
    @Transactional
    public void updateNonExistingCategoryNode() throws Exception {
        int databaseSizeBeforeUpdate = categoryNodeRepository.findAll().size();

        // Create the CategoryNode

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restCategoryNodeMockMvc.perform(put("/api/category-nodes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(categoryNode)))
            .andExpect(status().isCreated());

        // Validate the CategoryNode in the database
        List<CategoryNode> categoryNodeList = categoryNodeRepository.findAll();
        assertThat(categoryNodeList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteCategoryNode() throws Exception {
        // Initialize the database
        categoryNodeRepository.saveAndFlush(categoryNode);
        categoryNodeSearchRepository.save(categoryNode);
        int databaseSizeBeforeDelete = categoryNodeRepository.findAll().size();

        // Get the categoryNode
        restCategoryNodeMockMvc.perform(delete("/api/category-nodes/{id}", categoryNode.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean categoryNodeExistsInEs = categoryNodeSearchRepository.exists(categoryNode.getId());
        assertThat(categoryNodeExistsInEs).isFalse();

        // Validate the database is empty
        List<CategoryNode> categoryNodeList = categoryNodeRepository.findAll();
        assertThat(categoryNodeList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchCategoryNode() throws Exception {
        // Initialize the database
        categoryNodeRepository.saveAndFlush(categoryNode);
        categoryNodeSearchRepository.save(categoryNode);

        // Search the categoryNode
        restCategoryNodeMockMvc.perform(get("/api/_search/category-nodes?query=id:" + categoryNode.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(categoryNode.getId().intValue())))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE.toString())))
            .andExpect(jsonPath("$.[*].typeId").value(hasItem(DEFAULT_TYPE_ID.intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].position").value(hasItem(DEFAULT_POSITION)));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CategoryNode.class);
        CategoryNode categoryNode1 = new CategoryNode();
        categoryNode1.setId(1L);
        CategoryNode categoryNode2 = new CategoryNode();
        categoryNode2.setId(categoryNode1.getId());
        assertThat(categoryNode1).isEqualTo(categoryNode2);
        categoryNode2.setId(2L);
        assertThat(categoryNode1).isNotEqualTo(categoryNode2);
        categoryNode1.setId(null);
        assertThat(categoryNode1).isNotEqualTo(categoryNode2);
    }
}
