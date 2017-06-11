package com.tj.kvasir.web.rest;

import com.tj.kvasir.KavsirApp;

import com.tj.kvasir.domain.QuestionGroup;
import com.tj.kvasir.repository.QuestionGroupRepository;
import com.tj.kvasir.repository.search.QuestionGroupSearchRepository;
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
 * Test class for the QuestionGroupResource REST controller.
 *
 * @see QuestionGroupResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = KavsirApp.class)
public class QuestionGroupResourceIntTest {

    private static final String DEFAULT_TEXT = "AAAAAAAAAA";
    private static final String UPDATED_TEXT = "BBBBBBBBBB";

    private static final String DEFAULT_MEMO = "AAAAAAAAAA";
    private static final String UPDATED_MEMO = "BBBBBBBBBB";

    @Autowired
    private QuestionGroupRepository questionGroupRepository;

    @Autowired
    private QuestionGroupSearchRepository questionGroupSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restQuestionGroupMockMvc;

    private QuestionGroup questionGroup;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        QuestionGroupResource questionGroupResource = new QuestionGroupResource(questionGroupRepository, questionGroupSearchRepository);
        this.restQuestionGroupMockMvc = MockMvcBuilders.standaloneSetup(questionGroupResource)
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
    public static QuestionGroup createEntity(EntityManager em) {
        QuestionGroup questionGroup = new QuestionGroup()
            .text(DEFAULT_TEXT)
            .memo(DEFAULT_MEMO);
        return questionGroup;
    }

    @Before
    public void initTest() {
        questionGroupSearchRepository.deleteAll();
        questionGroup = createEntity(em);
    }

    @Test
    @Transactional
    public void createQuestionGroup() throws Exception {
        int databaseSizeBeforeCreate = questionGroupRepository.findAll().size();

        // Create the QuestionGroup
        restQuestionGroupMockMvc.perform(post("/api/question-groups")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(questionGroup)))
            .andExpect(status().isCreated());

        // Validate the QuestionGroup in the database
        List<QuestionGroup> questionGroupList = questionGroupRepository.findAll();
        assertThat(questionGroupList).hasSize(databaseSizeBeforeCreate + 1);
        QuestionGroup testQuestionGroup = questionGroupList.get(questionGroupList.size() - 1);
        assertThat(testQuestionGroup.getText()).isEqualTo(DEFAULT_TEXT);
        assertThat(testQuestionGroup.getMemo()).isEqualTo(DEFAULT_MEMO);

        // Validate the QuestionGroup in Elasticsearch
        QuestionGroup questionGroupEs = questionGroupSearchRepository.findOne(testQuestionGroup.getId());
        assertThat(questionGroupEs).isEqualToComparingFieldByField(testQuestionGroup);
    }

    @Test
    @Transactional
    public void createQuestionGroupWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = questionGroupRepository.findAll().size();

        // Create the QuestionGroup with an existing ID
        questionGroup.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restQuestionGroupMockMvc.perform(post("/api/question-groups")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(questionGroup)))
            .andExpect(status().isBadRequest());

        // Validate the Alice in the database
        List<QuestionGroup> questionGroupList = questionGroupRepository.findAll();
        assertThat(questionGroupList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkTextIsRequired() throws Exception {
        int databaseSizeBeforeTest = questionGroupRepository.findAll().size();
        // set the field null
        questionGroup.setText(null);

        // Create the QuestionGroup, which fails.

        restQuestionGroupMockMvc.perform(post("/api/question-groups")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(questionGroup)))
            .andExpect(status().isBadRequest());

        List<QuestionGroup> questionGroupList = questionGroupRepository.findAll();
        assertThat(questionGroupList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllQuestionGroups() throws Exception {
        // Initialize the database
        questionGroupRepository.saveAndFlush(questionGroup);

        // Get all the questionGroupList
        restQuestionGroupMockMvc.perform(get("/api/question-groups?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(questionGroup.getId().intValue())))
            .andExpect(jsonPath("$.[*].text").value(hasItem(DEFAULT_TEXT.toString())))
            .andExpect(jsonPath("$.[*].memo").value(hasItem(DEFAULT_MEMO.toString())));
    }

    @Test
    @Transactional
    public void getQuestionGroup() throws Exception {
        // Initialize the database
        questionGroupRepository.saveAndFlush(questionGroup);

        // Get the questionGroup
        restQuestionGroupMockMvc.perform(get("/api/question-groups/{id}", questionGroup.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(questionGroup.getId().intValue()))
            .andExpect(jsonPath("$.text").value(DEFAULT_TEXT.toString()))
            .andExpect(jsonPath("$.memo").value(DEFAULT_MEMO.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingQuestionGroup() throws Exception {
        // Get the questionGroup
        restQuestionGroupMockMvc.perform(get("/api/question-groups/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateQuestionGroup() throws Exception {
        // Initialize the database
        questionGroupRepository.saveAndFlush(questionGroup);
        questionGroupSearchRepository.save(questionGroup);
        int databaseSizeBeforeUpdate = questionGroupRepository.findAll().size();

        // Update the questionGroup
        QuestionGroup updatedQuestionGroup = questionGroupRepository.findOne(questionGroup.getId());
        updatedQuestionGroup
            .text(UPDATED_TEXT)
            .memo(UPDATED_MEMO);

        restQuestionGroupMockMvc.perform(put("/api/question-groups")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedQuestionGroup)))
            .andExpect(status().isOk());

        // Validate the QuestionGroup in the database
        List<QuestionGroup> questionGroupList = questionGroupRepository.findAll();
        assertThat(questionGroupList).hasSize(databaseSizeBeforeUpdate);
        QuestionGroup testQuestionGroup = questionGroupList.get(questionGroupList.size() - 1);
        assertThat(testQuestionGroup.getText()).isEqualTo(UPDATED_TEXT);
        assertThat(testQuestionGroup.getMemo()).isEqualTo(UPDATED_MEMO);

        // Validate the QuestionGroup in Elasticsearch
        QuestionGroup questionGroupEs = questionGroupSearchRepository.findOne(testQuestionGroup.getId());
        assertThat(questionGroupEs).isEqualToComparingFieldByField(testQuestionGroup);
    }

    @Test
    @Transactional
    public void updateNonExistingQuestionGroup() throws Exception {
        int databaseSizeBeforeUpdate = questionGroupRepository.findAll().size();

        // Create the QuestionGroup

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restQuestionGroupMockMvc.perform(put("/api/question-groups")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(questionGroup)))
            .andExpect(status().isCreated());

        // Validate the QuestionGroup in the database
        List<QuestionGroup> questionGroupList = questionGroupRepository.findAll();
        assertThat(questionGroupList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteQuestionGroup() throws Exception {
        // Initialize the database
        questionGroupRepository.saveAndFlush(questionGroup);
        questionGroupSearchRepository.save(questionGroup);
        int databaseSizeBeforeDelete = questionGroupRepository.findAll().size();

        // Get the questionGroup
        restQuestionGroupMockMvc.perform(delete("/api/question-groups/{id}", questionGroup.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean questionGroupExistsInEs = questionGroupSearchRepository.exists(questionGroup.getId());
        assertThat(questionGroupExistsInEs).isFalse();

        // Validate the database is empty
        List<QuestionGroup> questionGroupList = questionGroupRepository.findAll();
        assertThat(questionGroupList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchQuestionGroup() throws Exception {
        // Initialize the database
        questionGroupRepository.saveAndFlush(questionGroup);
        questionGroupSearchRepository.save(questionGroup);

        // Search the questionGroup
        restQuestionGroupMockMvc.perform(get("/api/_search/question-groups?query=id:" + questionGroup.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(questionGroup.getId().intValue())))
            .andExpect(jsonPath("$.[*].text").value(hasItem(DEFAULT_TEXT.toString())))
            .andExpect(jsonPath("$.[*].memo").value(hasItem(DEFAULT_MEMO.toString())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(QuestionGroup.class);
        QuestionGroup questionGroup1 = new QuestionGroup();
        questionGroup1.setId(1L);
        QuestionGroup questionGroup2 = new QuestionGroup();
        questionGroup2.setId(questionGroup1.getId());
        assertThat(questionGroup1).isEqualTo(questionGroup2);
        questionGroup2.setId(2L);
        assertThat(questionGroup1).isNotEqualTo(questionGroup2);
        questionGroup1.setId(null);
        assertThat(questionGroup1).isNotEqualTo(questionGroup2);
    }
}
