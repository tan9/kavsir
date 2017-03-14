package com.tj.kvasir.web.rest;

import com.tj.kvasir.KavsirApp;

import com.tj.kvasir.domain.QuestionEssay;
import com.tj.kvasir.repository.QuestionEssayRepository;
import com.tj.kvasir.repository.search.QuestionEssaySearchRepository;
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
 * Test class for the QuestionEssayResource REST controller.
 *
 * @see QuestionEssayResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = KavsirApp.class)
public class QuestionEssayResourceIntTest {

    private static final String DEFAULT_TEXT = "AAAAAAAAAA";
    private static final String UPDATED_TEXT = "BBBBBBBBBB";

    private static final String DEFAULT_ANSWER = "AAAAAAAAAA";
    private static final String UPDATED_ANSWER = "BBBBBBBBBB";

    private static final String DEFAULT_MEMO = "AAAAAAAAAA";
    private static final String UPDATED_MEMO = "BBBBBBBBBB";

    private static final Integer DEFAULT_GROUP_POSITION = 1;
    private static final Integer UPDATED_GROUP_POSITION = 2;

    @Autowired
    private QuestionEssayRepository questionEssayRepository;

    @Autowired
    private QuestionEssaySearchRepository questionEssaySearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restQuestionEssayMockMvc;

    private QuestionEssay questionEssay;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
            QuestionEssayResource questionEssayResource = new QuestionEssayResource(questionEssayRepository, questionEssaySearchRepository);
        this.restQuestionEssayMockMvc = MockMvcBuilders.standaloneSetup(questionEssayResource)
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
    public static QuestionEssay createEntity(EntityManager em) {
        QuestionEssay questionEssay = new QuestionEssay()
                .text(DEFAULT_TEXT)
                .answer(DEFAULT_ANSWER)
                .memo(DEFAULT_MEMO)
                .groupPosition(DEFAULT_GROUP_POSITION);
        return questionEssay;
    }

    @Before
    public void initTest() {
        questionEssaySearchRepository.deleteAll();
        questionEssay = createEntity(em);
    }

    @Test
    @Transactional
    public void createQuestionEssay() throws Exception {
        int databaseSizeBeforeCreate = questionEssayRepository.findAll().size();

        // Create the QuestionEssay

        restQuestionEssayMockMvc.perform(post("/api/question-essays")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(questionEssay)))
            .andExpect(status().isCreated());

        // Validate the QuestionEssay in the database
        List<QuestionEssay> questionEssayList = questionEssayRepository.findAll();
        assertThat(questionEssayList).hasSize(databaseSizeBeforeCreate + 1);
        QuestionEssay testQuestionEssay = questionEssayList.get(questionEssayList.size() - 1);
        assertThat(testQuestionEssay.getText()).isEqualTo(DEFAULT_TEXT);
        assertThat(testQuestionEssay.getAnswer()).isEqualTo(DEFAULT_ANSWER);
        assertThat(testQuestionEssay.getMemo()).isEqualTo(DEFAULT_MEMO);
        assertThat(testQuestionEssay.getGroupPosition()).isEqualTo(DEFAULT_GROUP_POSITION);

        // Validate the QuestionEssay in Elasticsearch
        QuestionEssay questionEssayEs = questionEssaySearchRepository.findOne(testQuestionEssay.getId());
        assertThat(questionEssayEs).isEqualToComparingFieldByField(testQuestionEssay);
    }

    @Test
    @Transactional
    public void createQuestionEssayWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = questionEssayRepository.findAll().size();

        // Create the QuestionEssay with an existing ID
        QuestionEssay existingQuestionEssay = new QuestionEssay();
        existingQuestionEssay.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restQuestionEssayMockMvc.perform(post("/api/question-essays")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(existingQuestionEssay)))
            .andExpect(status().isBadRequest());

        // Validate the Alice in the database
        List<QuestionEssay> questionEssayList = questionEssayRepository.findAll();
        assertThat(questionEssayList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkTextIsRequired() throws Exception {
        int databaseSizeBeforeTest = questionEssayRepository.findAll().size();
        // set the field null
        questionEssay.setText(null);

        // Create the QuestionEssay, which fails.

        restQuestionEssayMockMvc.perform(post("/api/question-essays")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(questionEssay)))
            .andExpect(status().isBadRequest());

        List<QuestionEssay> questionEssayList = questionEssayRepository.findAll();
        assertThat(questionEssayList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkAnswerIsRequired() throws Exception {
        int databaseSizeBeforeTest = questionEssayRepository.findAll().size();
        // set the field null
        questionEssay.setAnswer(null);

        // Create the QuestionEssay, which fails.

        restQuestionEssayMockMvc.perform(post("/api/question-essays")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(questionEssay)))
            .andExpect(status().isBadRequest());

        List<QuestionEssay> questionEssayList = questionEssayRepository.findAll();
        assertThat(questionEssayList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllQuestionEssays() throws Exception {
        // Initialize the database
        questionEssayRepository.saveAndFlush(questionEssay);

        // Get all the questionEssayList
        restQuestionEssayMockMvc.perform(get("/api/question-essays?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(questionEssay.getId().intValue())))
            .andExpect(jsonPath("$.[*].text").value(hasItem(DEFAULT_TEXT.toString())))
            .andExpect(jsonPath("$.[*].answer").value(hasItem(DEFAULT_ANSWER.toString())))
            .andExpect(jsonPath("$.[*].memo").value(hasItem(DEFAULT_MEMO.toString())))
            .andExpect(jsonPath("$.[*].groupPosition").value(hasItem(DEFAULT_GROUP_POSITION)));
    }

    @Test
    @Transactional
    public void getQuestionEssay() throws Exception {
        // Initialize the database
        questionEssayRepository.saveAndFlush(questionEssay);

        // Get the questionEssay
        restQuestionEssayMockMvc.perform(get("/api/question-essays/{id}", questionEssay.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(questionEssay.getId().intValue()))
            .andExpect(jsonPath("$.text").value(DEFAULT_TEXT.toString()))
            .andExpect(jsonPath("$.answer").value(DEFAULT_ANSWER.toString()))
            .andExpect(jsonPath("$.memo").value(DEFAULT_MEMO.toString()))
            .andExpect(jsonPath("$.groupPosition").value(DEFAULT_GROUP_POSITION));
    }

    @Test
    @Transactional
    public void getNonExistingQuestionEssay() throws Exception {
        // Get the questionEssay
        restQuestionEssayMockMvc.perform(get("/api/question-essays/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateQuestionEssay() throws Exception {
        // Initialize the database
        questionEssayRepository.saveAndFlush(questionEssay);
        questionEssaySearchRepository.save(questionEssay);
        int databaseSizeBeforeUpdate = questionEssayRepository.findAll().size();

        // Update the questionEssay
        QuestionEssay updatedQuestionEssay = questionEssayRepository.findOne(questionEssay.getId());
        updatedQuestionEssay
                .text(UPDATED_TEXT)
                .answer(UPDATED_ANSWER)
                .memo(UPDATED_MEMO)
                .groupPosition(UPDATED_GROUP_POSITION);

        restQuestionEssayMockMvc.perform(put("/api/question-essays")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedQuestionEssay)))
            .andExpect(status().isOk());

        // Validate the QuestionEssay in the database
        List<QuestionEssay> questionEssayList = questionEssayRepository.findAll();
        assertThat(questionEssayList).hasSize(databaseSizeBeforeUpdate);
        QuestionEssay testQuestionEssay = questionEssayList.get(questionEssayList.size() - 1);
        assertThat(testQuestionEssay.getText()).isEqualTo(UPDATED_TEXT);
        assertThat(testQuestionEssay.getAnswer()).isEqualTo(UPDATED_ANSWER);
        assertThat(testQuestionEssay.getMemo()).isEqualTo(UPDATED_MEMO);
        assertThat(testQuestionEssay.getGroupPosition()).isEqualTo(UPDATED_GROUP_POSITION);

        // Validate the QuestionEssay in Elasticsearch
        QuestionEssay questionEssayEs = questionEssaySearchRepository.findOne(testQuestionEssay.getId());
        assertThat(questionEssayEs).isEqualToComparingFieldByField(testQuestionEssay);
    }

    @Test
    @Transactional
    public void updateNonExistingQuestionEssay() throws Exception {
        int databaseSizeBeforeUpdate = questionEssayRepository.findAll().size();

        // Create the QuestionEssay

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restQuestionEssayMockMvc.perform(put("/api/question-essays")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(questionEssay)))
            .andExpect(status().isCreated());

        // Validate the QuestionEssay in the database
        List<QuestionEssay> questionEssayList = questionEssayRepository.findAll();
        assertThat(questionEssayList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteQuestionEssay() throws Exception {
        // Initialize the database
        questionEssayRepository.saveAndFlush(questionEssay);
        questionEssaySearchRepository.save(questionEssay);
        int databaseSizeBeforeDelete = questionEssayRepository.findAll().size();

        // Get the questionEssay
        restQuestionEssayMockMvc.perform(delete("/api/question-essays/{id}", questionEssay.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean questionEssayExistsInEs = questionEssaySearchRepository.exists(questionEssay.getId());
        assertThat(questionEssayExistsInEs).isFalse();

        // Validate the database is empty
        List<QuestionEssay> questionEssayList = questionEssayRepository.findAll();
        assertThat(questionEssayList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchQuestionEssay() throws Exception {
        // Initialize the database
        questionEssayRepository.saveAndFlush(questionEssay);
        questionEssaySearchRepository.save(questionEssay);

        // Search the questionEssay
        restQuestionEssayMockMvc.perform(get("/api/_search/question-essays?query=id:" + questionEssay.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(questionEssay.getId().intValue())))
            .andExpect(jsonPath("$.[*].text").value(hasItem(DEFAULT_TEXT.toString())))
            .andExpect(jsonPath("$.[*].answer").value(hasItem(DEFAULT_ANSWER.toString())))
            .andExpect(jsonPath("$.[*].memo").value(hasItem(DEFAULT_MEMO.toString())))
            .andExpect(jsonPath("$.[*].groupPosition").value(hasItem(DEFAULT_GROUP_POSITION)));
    }

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(QuestionEssay.class);
    }
}
