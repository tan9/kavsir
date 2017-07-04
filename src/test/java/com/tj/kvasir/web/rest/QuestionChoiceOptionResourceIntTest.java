package com.tj.kvasir.web.rest;

import com.tj.kvasir.KavsirApp;

import com.tj.kvasir.domain.QuestionChoiceOption;
import com.tj.kvasir.repository.QuestionChoiceOptionRepository;
import com.tj.kvasir.repository.search.QuestionChoiceOptionSearchRepository;
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
import org.springframework.util.Base64Utils;

import javax.persistence.EntityManager;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the QuestionChoiceOptionResource REST controller.
 *
 * @see QuestionChoiceOptionResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = KavsirApp.class)
public class QuestionChoiceOptionResourceIntTest {

    private static final Boolean DEFAULT_CORRECT = false;
    private static final Boolean UPDATED_CORRECT = true;

    private static final String DEFAULT_TEXT = "AAAAAAAAAA";
    private static final String UPDATED_TEXT = "BBBBBBBBBB";

    private static final String DEFAULT_MEMO = "AAAAAAAAAA";
    private static final String UPDATED_MEMO = "BBBBBBBBBB";

    @Autowired
    private QuestionChoiceOptionRepository questionChoiceOptionRepository;

    @Autowired
    private QuestionChoiceOptionSearchRepository questionChoiceOptionSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restQuestionChoiceOptionMockMvc;

    private QuestionChoiceOption questionChoiceOption;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        QuestionChoiceOptionResource questionChoiceOptionResource = new QuestionChoiceOptionResource(questionChoiceOptionRepository, questionChoiceOptionSearchRepository);
        this.restQuestionChoiceOptionMockMvc = MockMvcBuilders.standaloneSetup(questionChoiceOptionResource)
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
    public static QuestionChoiceOption createEntity(EntityManager em) {
        QuestionChoiceOption questionChoiceOption = new QuestionChoiceOption()
            .correct(DEFAULT_CORRECT)
            .text(DEFAULT_TEXT)
            .memo(DEFAULT_MEMO);
        return questionChoiceOption;
    }

    @Before
    public void initTest() {
        questionChoiceOptionSearchRepository.deleteAll();
        questionChoiceOption = createEntity(em);
    }

    @Test
    @Transactional
    public void createQuestionChoiceOption() throws Exception {
        int databaseSizeBeforeCreate = questionChoiceOptionRepository.findAll().size();

        // Create the QuestionChoiceOption
        restQuestionChoiceOptionMockMvc.perform(post("/api/question-choice-options")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(questionChoiceOption)))
            .andExpect(status().isCreated());

        // Validate the QuestionChoiceOption in the database
        List<QuestionChoiceOption> questionChoiceOptionList = questionChoiceOptionRepository.findAll();
        assertThat(questionChoiceOptionList).hasSize(databaseSizeBeforeCreate + 1);
        QuestionChoiceOption testQuestionChoiceOption = questionChoiceOptionList.get(questionChoiceOptionList.size() - 1);
        assertThat(testQuestionChoiceOption.isCorrect()).isEqualTo(DEFAULT_CORRECT);
        assertThat(testQuestionChoiceOption.getText()).isEqualTo(DEFAULT_TEXT);
        assertThat(testQuestionChoiceOption.getMemo()).isEqualTo(DEFAULT_MEMO);

        // Validate the QuestionChoiceOption in Elasticsearch
        QuestionChoiceOption questionChoiceOptionEs = questionChoiceOptionSearchRepository.findOne(testQuestionChoiceOption.getId());
        assertThat(questionChoiceOptionEs).isEqualToComparingFieldByField(testQuestionChoiceOption);
    }

    @Test
    @Transactional
    public void createQuestionChoiceOptionWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = questionChoiceOptionRepository.findAll().size();

        // Create the QuestionChoiceOption with an existing ID
        questionChoiceOption.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restQuestionChoiceOptionMockMvc.perform(post("/api/question-choice-options")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(questionChoiceOption)))
            .andExpect(status().isBadRequest());

        // Validate the Alice in the database
        List<QuestionChoiceOption> questionChoiceOptionList = questionChoiceOptionRepository.findAll();
        assertThat(questionChoiceOptionList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkCorrectIsRequired() throws Exception {
        int databaseSizeBeforeTest = questionChoiceOptionRepository.findAll().size();
        // set the field null
        questionChoiceOption.setCorrect(null);

        // Create the QuestionChoiceOption, which fails.

        restQuestionChoiceOptionMockMvc.perform(post("/api/question-choice-options")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(questionChoiceOption)))
            .andExpect(status().isBadRequest());

        List<QuestionChoiceOption> questionChoiceOptionList = questionChoiceOptionRepository.findAll();
        assertThat(questionChoiceOptionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkTextIsRequired() throws Exception {
        int databaseSizeBeforeTest = questionChoiceOptionRepository.findAll().size();
        // set the field null
        questionChoiceOption.setText(null);

        // Create the QuestionChoiceOption, which fails.

        restQuestionChoiceOptionMockMvc.perform(post("/api/question-choice-options")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(questionChoiceOption)))
            .andExpect(status().isBadRequest());

        List<QuestionChoiceOption> questionChoiceOptionList = questionChoiceOptionRepository.findAll();
        assertThat(questionChoiceOptionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllQuestionChoiceOptions() throws Exception {
        // Initialize the database
        questionChoiceOptionRepository.saveAndFlush(questionChoiceOption);

        // Get all the questionChoiceOptionList
        restQuestionChoiceOptionMockMvc.perform(get("/api/question-choice-options?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(questionChoiceOption.getId().intValue())))
            .andExpect(jsonPath("$.[*].correct").value(hasItem(DEFAULT_CORRECT.booleanValue())))
            .andExpect(jsonPath("$.[*].text").value(hasItem(DEFAULT_TEXT.toString())))
            .andExpect(jsonPath("$.[*].memo").value(hasItem(DEFAULT_MEMO.toString())));
    }

    @Test
    @Transactional
    public void getQuestionChoiceOption() throws Exception {
        // Initialize the database
        questionChoiceOptionRepository.saveAndFlush(questionChoiceOption);

        // Get the questionChoiceOption
        restQuestionChoiceOptionMockMvc.perform(get("/api/question-choice-options/{id}", questionChoiceOption.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(questionChoiceOption.getId().intValue()))
            .andExpect(jsonPath("$.correct").value(DEFAULT_CORRECT.booleanValue()))
            .andExpect(jsonPath("$.text").value(DEFAULT_TEXT.toString()))
            .andExpect(jsonPath("$.memo").value(DEFAULT_MEMO.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingQuestionChoiceOption() throws Exception {
        // Get the questionChoiceOption
        restQuestionChoiceOptionMockMvc.perform(get("/api/question-choice-options/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateQuestionChoiceOption() throws Exception {
        // Initialize the database
        questionChoiceOptionRepository.saveAndFlush(questionChoiceOption);
        questionChoiceOptionSearchRepository.save(questionChoiceOption);
        int databaseSizeBeforeUpdate = questionChoiceOptionRepository.findAll().size();

        // Update the questionChoiceOption
        QuestionChoiceOption updatedQuestionChoiceOption = questionChoiceOptionRepository.findOne(questionChoiceOption.getId());
        updatedQuestionChoiceOption
            .correct(UPDATED_CORRECT)
            .text(UPDATED_TEXT)
            .memo(UPDATED_MEMO);

        restQuestionChoiceOptionMockMvc.perform(put("/api/question-choice-options")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedQuestionChoiceOption)))
            .andExpect(status().isOk());

        // Validate the QuestionChoiceOption in the database
        List<QuestionChoiceOption> questionChoiceOptionList = questionChoiceOptionRepository.findAll();
        assertThat(questionChoiceOptionList).hasSize(databaseSizeBeforeUpdate);
        QuestionChoiceOption testQuestionChoiceOption = questionChoiceOptionList.get(questionChoiceOptionList.size() - 1);
        assertThat(testQuestionChoiceOption.isCorrect()).isEqualTo(UPDATED_CORRECT);
        assertThat(testQuestionChoiceOption.getText()).isEqualTo(UPDATED_TEXT);
        assertThat(testQuestionChoiceOption.getMemo()).isEqualTo(UPDATED_MEMO);

        // Validate the QuestionChoiceOption in Elasticsearch
        QuestionChoiceOption questionChoiceOptionEs = questionChoiceOptionSearchRepository.findOne(testQuestionChoiceOption.getId());
        assertThat(questionChoiceOptionEs).isEqualToComparingFieldByField(testQuestionChoiceOption);
    }

    @Test
    @Transactional
    public void updateNonExistingQuestionChoiceOption() throws Exception {
        int databaseSizeBeforeUpdate = questionChoiceOptionRepository.findAll().size();

        // Create the QuestionChoiceOption

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restQuestionChoiceOptionMockMvc.perform(put("/api/question-choice-options")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(questionChoiceOption)))
            .andExpect(status().isCreated());

        // Validate the QuestionChoiceOption in the database
        List<QuestionChoiceOption> questionChoiceOptionList = questionChoiceOptionRepository.findAll();
        assertThat(questionChoiceOptionList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteQuestionChoiceOption() throws Exception {
        // Initialize the database
        questionChoiceOptionRepository.saveAndFlush(questionChoiceOption);
        questionChoiceOptionSearchRepository.save(questionChoiceOption);
        int databaseSizeBeforeDelete = questionChoiceOptionRepository.findAll().size();

        // Get the questionChoiceOption
        restQuestionChoiceOptionMockMvc.perform(delete("/api/question-choice-options/{id}", questionChoiceOption.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean questionChoiceOptionExistsInEs = questionChoiceOptionSearchRepository.exists(questionChoiceOption.getId());
        assertThat(questionChoiceOptionExistsInEs).isFalse();

        // Validate the database is empty
        List<QuestionChoiceOption> questionChoiceOptionList = questionChoiceOptionRepository.findAll();
        assertThat(questionChoiceOptionList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchQuestionChoiceOption() throws Exception {
        // Initialize the database
        questionChoiceOptionRepository.saveAndFlush(questionChoiceOption);
        questionChoiceOptionSearchRepository.save(questionChoiceOption);

        // Search the questionChoiceOption
        restQuestionChoiceOptionMockMvc.perform(get("/api/_search/question-choice-options?query=id:" + questionChoiceOption.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(questionChoiceOption.getId().intValue())))
            .andExpect(jsonPath("$.[*].correct").value(hasItem(DEFAULT_CORRECT.booleanValue())))
            .andExpect(jsonPath("$.[*].text").value(hasItem(DEFAULT_TEXT.toString())))
            .andExpect(jsonPath("$.[*].memo").value(hasItem(DEFAULT_MEMO.toString())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(QuestionChoiceOption.class);
        QuestionChoiceOption questionChoiceOption1 = new QuestionChoiceOption();
        questionChoiceOption1.setId(1L);
        QuestionChoiceOption questionChoiceOption2 = new QuestionChoiceOption();
        questionChoiceOption2.setId(questionChoiceOption1.getId());
        assertThat(questionChoiceOption1).isEqualTo(questionChoiceOption2);
        questionChoiceOption2.setId(2L);
        assertThat(questionChoiceOption1).isNotEqualTo(questionChoiceOption2);
        questionChoiceOption1.setId(null);
        assertThat(questionChoiceOption1).isNotEqualTo(questionChoiceOption2);
    }
}
