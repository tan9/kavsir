package com.tj.kvasir.web.rest;

import com.tj.kvasir.KavsirApp;

import com.tj.kvasir.domain.QuestionTrueFalse;
import com.tj.kvasir.repository.QuestionTrueFalseRepository;
import com.tj.kvasir.repository.search.QuestionTrueFalseSearchRepository;
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
 * Test class for the QuestionTrueFalseResource REST controller.
 *
 * @see QuestionTrueFalseResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = KavsirApp.class)
public class QuestionTrueFalseResourceIntTest {

    private static final Boolean DEFAULT_CORRECT = false;
    private static final Boolean UPDATED_CORRECT = true;

    private static final String DEFAULT_TEXT = "AAAAAAAAAA";
    private static final String UPDATED_TEXT = "BBBBBBBBBB";

    private static final String DEFAULT_MEMO = "AAAAAAAAAA";
    private static final String UPDATED_MEMO = "BBBBBBBBBB";

    private static final Integer DEFAULT_GROUP_POSITION = 1;
    private static final Integer UPDATED_GROUP_POSITION = 2;

    @Autowired
    private QuestionTrueFalseRepository questionTrueFalseRepository;

    @Autowired
    private QuestionTrueFalseSearchRepository questionTrueFalseSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restQuestionTrueFalseMockMvc;

    private QuestionTrueFalse questionTrueFalse;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        QuestionTrueFalseResource questionTrueFalseResource = new QuestionTrueFalseResource(questionTrueFalseRepository, questionTrueFalseSearchRepository);
        this.restQuestionTrueFalseMockMvc = MockMvcBuilders.standaloneSetup(questionTrueFalseResource)
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
    public static QuestionTrueFalse createEntity(EntityManager em) {
        QuestionTrueFalse questionTrueFalse = new QuestionTrueFalse()
            .correct(DEFAULT_CORRECT)
            .text(DEFAULT_TEXT)
            .memo(DEFAULT_MEMO)
            .groupPosition(DEFAULT_GROUP_POSITION);
        return questionTrueFalse;
    }

    @Before
    public void initTest() {
        questionTrueFalseSearchRepository.deleteAll();
        questionTrueFalse = createEntity(em);
    }

    @Test
    @Transactional
    public void createQuestionTrueFalse() throws Exception {
        int databaseSizeBeforeCreate = questionTrueFalseRepository.findAll().size();

        // Create the QuestionTrueFalse
        restQuestionTrueFalseMockMvc.perform(post("/api/question-true-falses")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(questionTrueFalse)))
            .andExpect(status().isCreated());

        // Validate the QuestionTrueFalse in the database
        List<QuestionTrueFalse> questionTrueFalseList = questionTrueFalseRepository.findAll();
        assertThat(questionTrueFalseList).hasSize(databaseSizeBeforeCreate + 1);
        QuestionTrueFalse testQuestionTrueFalse = questionTrueFalseList.get(questionTrueFalseList.size() - 1);
        assertThat(testQuestionTrueFalse.isCorrect()).isEqualTo(DEFAULT_CORRECT);
        assertThat(testQuestionTrueFalse.getText()).isEqualTo(DEFAULT_TEXT);
        assertThat(testQuestionTrueFalse.getMemo()).isEqualTo(DEFAULT_MEMO);
        assertThat(testQuestionTrueFalse.getGroupPosition()).isEqualTo(DEFAULT_GROUP_POSITION);

        // Validate the QuestionTrueFalse in Elasticsearch
        QuestionTrueFalse questionTrueFalseEs = questionTrueFalseSearchRepository.findOne(testQuestionTrueFalse.getId());
        assertThat(questionTrueFalseEs).isEqualToComparingFieldByField(testQuestionTrueFalse);
    }

    @Test
    @Transactional
    public void createQuestionTrueFalseWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = questionTrueFalseRepository.findAll().size();

        // Create the QuestionTrueFalse with an existing ID
        questionTrueFalse.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restQuestionTrueFalseMockMvc.perform(post("/api/question-true-falses")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(questionTrueFalse)))
            .andExpect(status().isBadRequest());

        // Validate the Alice in the database
        List<QuestionTrueFalse> questionTrueFalseList = questionTrueFalseRepository.findAll();
        assertThat(questionTrueFalseList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkCorrectIsRequired() throws Exception {
        int databaseSizeBeforeTest = questionTrueFalseRepository.findAll().size();
        // set the field null
        questionTrueFalse.setCorrect(null);

        // Create the QuestionTrueFalse, which fails.

        restQuestionTrueFalseMockMvc.perform(post("/api/question-true-falses")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(questionTrueFalse)))
            .andExpect(status().isBadRequest());

        List<QuestionTrueFalse> questionTrueFalseList = questionTrueFalseRepository.findAll();
        assertThat(questionTrueFalseList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkTextIsRequired() throws Exception {
        int databaseSizeBeforeTest = questionTrueFalseRepository.findAll().size();
        // set the field null
        questionTrueFalse.setText(null);

        // Create the QuestionTrueFalse, which fails.

        restQuestionTrueFalseMockMvc.perform(post("/api/question-true-falses")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(questionTrueFalse)))
            .andExpect(status().isBadRequest());

        List<QuestionTrueFalse> questionTrueFalseList = questionTrueFalseRepository.findAll();
        assertThat(questionTrueFalseList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllQuestionTrueFalses() throws Exception {
        // Initialize the database
        questionTrueFalseRepository.saveAndFlush(questionTrueFalse);

        // Get all the questionTrueFalseList
        restQuestionTrueFalseMockMvc.perform(get("/api/question-true-falses?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(questionTrueFalse.getId().intValue())))
            .andExpect(jsonPath("$.[*].correct").value(hasItem(DEFAULT_CORRECT.booleanValue())))
            .andExpect(jsonPath("$.[*].text").value(hasItem(DEFAULT_TEXT.toString())))
            .andExpect(jsonPath("$.[*].memo").value(hasItem(DEFAULT_MEMO.toString())))
            .andExpect(jsonPath("$.[*].groupPosition").value(hasItem(DEFAULT_GROUP_POSITION)));
    }

    @Test
    @Transactional
    public void getQuestionTrueFalse() throws Exception {
        // Initialize the database
        questionTrueFalseRepository.saveAndFlush(questionTrueFalse);

        // Get the questionTrueFalse
        restQuestionTrueFalseMockMvc.perform(get("/api/question-true-falses/{id}", questionTrueFalse.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(questionTrueFalse.getId().intValue()))
            .andExpect(jsonPath("$.correct").value(DEFAULT_CORRECT.booleanValue()))
            .andExpect(jsonPath("$.text").value(DEFAULT_TEXT.toString()))
            .andExpect(jsonPath("$.memo").value(DEFAULT_MEMO.toString()))
            .andExpect(jsonPath("$.groupPosition").value(DEFAULT_GROUP_POSITION));
    }

    @Test
    @Transactional
    public void getNonExistingQuestionTrueFalse() throws Exception {
        // Get the questionTrueFalse
        restQuestionTrueFalseMockMvc.perform(get("/api/question-true-falses/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateQuestionTrueFalse() throws Exception {
        // Initialize the database
        questionTrueFalseRepository.saveAndFlush(questionTrueFalse);
        questionTrueFalseSearchRepository.save(questionTrueFalse);
        int databaseSizeBeforeUpdate = questionTrueFalseRepository.findAll().size();

        // Update the questionTrueFalse
        QuestionTrueFalse updatedQuestionTrueFalse = questionTrueFalseRepository.findOne(questionTrueFalse.getId());
        updatedQuestionTrueFalse
            .correct(UPDATED_CORRECT)
            .text(UPDATED_TEXT)
            .memo(UPDATED_MEMO)
            .groupPosition(UPDATED_GROUP_POSITION);

        restQuestionTrueFalseMockMvc.perform(put("/api/question-true-falses")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedQuestionTrueFalse)))
            .andExpect(status().isOk());

        // Validate the QuestionTrueFalse in the database
        List<QuestionTrueFalse> questionTrueFalseList = questionTrueFalseRepository.findAll();
        assertThat(questionTrueFalseList).hasSize(databaseSizeBeforeUpdate);
        QuestionTrueFalse testQuestionTrueFalse = questionTrueFalseList.get(questionTrueFalseList.size() - 1);
        assertThat(testQuestionTrueFalse.isCorrect()).isEqualTo(UPDATED_CORRECT);
        assertThat(testQuestionTrueFalse.getText()).isEqualTo(UPDATED_TEXT);
        assertThat(testQuestionTrueFalse.getMemo()).isEqualTo(UPDATED_MEMO);
        assertThat(testQuestionTrueFalse.getGroupPosition()).isEqualTo(UPDATED_GROUP_POSITION);

        // Validate the QuestionTrueFalse in Elasticsearch
        QuestionTrueFalse questionTrueFalseEs = questionTrueFalseSearchRepository.findOne(testQuestionTrueFalse.getId());
        assertThat(questionTrueFalseEs).isEqualToComparingFieldByField(testQuestionTrueFalse);
    }

    @Test
    @Transactional
    public void updateNonExistingQuestionTrueFalse() throws Exception {
        int databaseSizeBeforeUpdate = questionTrueFalseRepository.findAll().size();

        // Create the QuestionTrueFalse

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restQuestionTrueFalseMockMvc.perform(put("/api/question-true-falses")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(questionTrueFalse)))
            .andExpect(status().isCreated());

        // Validate the QuestionTrueFalse in the database
        List<QuestionTrueFalse> questionTrueFalseList = questionTrueFalseRepository.findAll();
        assertThat(questionTrueFalseList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteQuestionTrueFalse() throws Exception {
        // Initialize the database
        questionTrueFalseRepository.saveAndFlush(questionTrueFalse);
        questionTrueFalseSearchRepository.save(questionTrueFalse);
        int databaseSizeBeforeDelete = questionTrueFalseRepository.findAll().size();

        // Get the questionTrueFalse
        restQuestionTrueFalseMockMvc.perform(delete("/api/question-true-falses/{id}", questionTrueFalse.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean questionTrueFalseExistsInEs = questionTrueFalseSearchRepository.exists(questionTrueFalse.getId());
        assertThat(questionTrueFalseExistsInEs).isFalse();

        // Validate the database is empty
        List<QuestionTrueFalse> questionTrueFalseList = questionTrueFalseRepository.findAll();
        assertThat(questionTrueFalseList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchQuestionTrueFalse() throws Exception {
        // Initialize the database
        questionTrueFalseRepository.saveAndFlush(questionTrueFalse);
        questionTrueFalseSearchRepository.save(questionTrueFalse);

        // Search the questionTrueFalse
        restQuestionTrueFalseMockMvc.perform(get("/api/_search/question-true-falses?query=id:" + questionTrueFalse.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(questionTrueFalse.getId().intValue())))
            .andExpect(jsonPath("$.[*].correct").value(hasItem(DEFAULT_CORRECT.booleanValue())))
            .andExpect(jsonPath("$.[*].text").value(hasItem(DEFAULT_TEXT.toString())))
            .andExpect(jsonPath("$.[*].memo").value(hasItem(DEFAULT_MEMO.toString())))
            .andExpect(jsonPath("$.[*].groupPosition").value(hasItem(DEFAULT_GROUP_POSITION)));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(QuestionTrueFalse.class);
        QuestionTrueFalse questionTrueFalse1 = new QuestionTrueFalse();
        questionTrueFalse1.setId(1L);
        QuestionTrueFalse questionTrueFalse2 = new QuestionTrueFalse();
        questionTrueFalse2.setId(questionTrueFalse1.getId());
        assertThat(questionTrueFalse1).isEqualTo(questionTrueFalse2);
        questionTrueFalse2.setId(2L);
        assertThat(questionTrueFalse1).isNotEqualTo(questionTrueFalse2);
        questionTrueFalse1.setId(null);
        assertThat(questionTrueFalse1).isNotEqualTo(questionTrueFalse2);
    }
}
