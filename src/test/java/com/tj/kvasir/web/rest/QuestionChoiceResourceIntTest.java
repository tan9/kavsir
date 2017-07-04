package com.tj.kvasir.web.rest;

import com.tj.kvasir.KavsirApp;

import com.tj.kvasir.domain.QuestionChoice;
import com.tj.kvasir.repository.QuestionChoiceRepository;
import com.tj.kvasir.service.QuestionChoiceService;
import com.tj.kvasir.repository.search.QuestionChoiceSearchRepository;
import com.tj.kvasir.service.dto.QuestionChoiceDTO;
import com.tj.kvasir.service.mapper.QuestionChoiceMapper;
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
 * Test class for the QuestionChoiceResource REST controller.
 *
 * @see QuestionChoiceResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = KavsirApp.class)
public class QuestionChoiceResourceIntTest {

    private static final Boolean DEFAULT_MULTIPLE_RESPONSE = false;
    private static final Boolean UPDATED_MULTIPLE_RESPONSE = true;

    private static final String DEFAULT_TEXT = "AAAAAAAAAA";
    private static final String UPDATED_TEXT = "BBBBBBBBBB";

    private static final String DEFAULT_MEMO = "AAAAAAAAAA";
    private static final String UPDATED_MEMO = "BBBBBBBBBB";

    private static final Integer DEFAULT_GROUP_POSITION = 1;
    private static final Integer UPDATED_GROUP_POSITION = 2;

    @Autowired
    private QuestionChoiceRepository questionChoiceRepository;

    @Autowired
    private QuestionChoiceSearchRepository questionChoiceSearchRepository;

    @Autowired
    private QuestionChoiceMapper questionChoiceMapper;

    @Autowired
    private QuestionChoiceService questionChoiceService;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restQuestionChoiceMockMvc;

    private QuestionChoice questionChoice;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        QuestionChoiceResource questionChoiceResource = new QuestionChoiceResource(questionChoiceService);
        this.restQuestionChoiceMockMvc = MockMvcBuilders.standaloneSetup(questionChoiceResource)
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
    public static QuestionChoice createEntity(EntityManager em) {
        QuestionChoice questionChoice = new QuestionChoice()
            .multipleResponse(DEFAULT_MULTIPLE_RESPONSE)
            .text(DEFAULT_TEXT)
            .memo(DEFAULT_MEMO)
            .groupPosition(DEFAULT_GROUP_POSITION);
        return questionChoice;
    }

    @Before
    public void initTest() {
        questionChoiceSearchRepository.deleteAll();
        questionChoice = createEntity(em);
    }

    @Test
    @Transactional
    public void createQuestionChoice() throws Exception {
        int databaseSizeBeforeCreate = questionChoiceRepository.findAll().size();

        // Create the QuestionChoice
        QuestionChoiceDTO questionChoiceDTO = questionChoiceMapper.toDto(questionChoice);
        restQuestionChoiceMockMvc.perform(post("/api/question-choices")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(questionChoiceDTO)))
            .andExpect(status().isCreated());

        // Validate the QuestionChoice in the database
        List<QuestionChoice> questionChoiceList = questionChoiceRepository.findAll();
        assertThat(questionChoiceList).hasSize(databaseSizeBeforeCreate + 1);
        QuestionChoice testQuestionChoice = questionChoiceList.get(questionChoiceList.size() - 1);
        assertThat(testQuestionChoice.isMultipleResponse()).isEqualTo(DEFAULT_MULTIPLE_RESPONSE);
        assertThat(testQuestionChoice.getText()).isEqualTo(DEFAULT_TEXT);
        assertThat(testQuestionChoice.getMemo()).isEqualTo(DEFAULT_MEMO);
        assertThat(testQuestionChoice.getGroupPosition()).isEqualTo(DEFAULT_GROUP_POSITION);

        // Validate the QuestionChoice in Elasticsearch
        QuestionChoice questionChoiceEs = questionChoiceSearchRepository.findOne(testQuestionChoice.getId());
        assertThat(questionChoiceEs).isEqualToComparingFieldByField(testQuestionChoice);
    }

    @Test
    @Transactional
    public void createQuestionChoiceWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = questionChoiceRepository.findAll().size();

        // Create the QuestionChoice with an existing ID
        questionChoice.setId(1L);
        QuestionChoiceDTO questionChoiceDTO = questionChoiceMapper.toDto(questionChoice);

        // An entity with an existing ID cannot be created, so this API call must fail
        restQuestionChoiceMockMvc.perform(post("/api/question-choices")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(questionChoiceDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Alice in the database
        List<QuestionChoice> questionChoiceList = questionChoiceRepository.findAll();
        assertThat(questionChoiceList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkMultipleResponseIsRequired() throws Exception {
        int databaseSizeBeforeTest = questionChoiceRepository.findAll().size();
        // set the field null
        questionChoice.setMultipleResponse(null);

        // Create the QuestionChoice, which fails.
        QuestionChoiceDTO questionChoiceDTO = questionChoiceMapper.toDto(questionChoice);

        restQuestionChoiceMockMvc.perform(post("/api/question-choices")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(questionChoiceDTO)))
            .andExpect(status().isBadRequest());

        List<QuestionChoice> questionChoiceList = questionChoiceRepository.findAll();
        assertThat(questionChoiceList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkTextIsRequired() throws Exception {
        int databaseSizeBeforeTest = questionChoiceRepository.findAll().size();
        // set the field null
        questionChoice.setText(null);

        // Create the QuestionChoice, which fails.
        QuestionChoiceDTO questionChoiceDTO = questionChoiceMapper.toDto(questionChoice);

        restQuestionChoiceMockMvc.perform(post("/api/question-choices")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(questionChoiceDTO)))
            .andExpect(status().isBadRequest());

        List<QuestionChoice> questionChoiceList = questionChoiceRepository.findAll();
        assertThat(questionChoiceList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllQuestionChoices() throws Exception {
        // Initialize the database
        questionChoiceRepository.saveAndFlush(questionChoice);

        // Get all the questionChoiceList
        restQuestionChoiceMockMvc.perform(get("/api/question-choices?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(questionChoice.getId().intValue())))
            .andExpect(jsonPath("$.[*].multipleResponse").value(hasItem(DEFAULT_MULTIPLE_RESPONSE.booleanValue())))
            .andExpect(jsonPath("$.[*].text").value(hasItem(DEFAULT_TEXT.toString())))
            .andExpect(jsonPath("$.[*].memo").value(hasItem(DEFAULT_MEMO.toString())))
            .andExpect(jsonPath("$.[*].groupPosition").value(hasItem(DEFAULT_GROUP_POSITION)));
    }

    @Test
    @Transactional
    public void getQuestionChoice() throws Exception {
        // Initialize the database
        questionChoiceRepository.saveAndFlush(questionChoice);

        // Get the questionChoice
        restQuestionChoiceMockMvc.perform(get("/api/question-choices/{id}", questionChoice.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(questionChoice.getId().intValue()))
            .andExpect(jsonPath("$.multipleResponse").value(DEFAULT_MULTIPLE_RESPONSE.booleanValue()))
            .andExpect(jsonPath("$.text").value(DEFAULT_TEXT.toString()))
            .andExpect(jsonPath("$.memo").value(DEFAULT_MEMO.toString()))
            .andExpect(jsonPath("$.groupPosition").value(DEFAULT_GROUP_POSITION));
    }

    @Test
    @Transactional
    public void getNonExistingQuestionChoice() throws Exception {
        // Get the questionChoice
        restQuestionChoiceMockMvc.perform(get("/api/question-choices/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateQuestionChoice() throws Exception {
        // Initialize the database
        questionChoiceRepository.saveAndFlush(questionChoice);
        questionChoiceSearchRepository.save(questionChoice);
        int databaseSizeBeforeUpdate = questionChoiceRepository.findAll().size();

        // Update the questionChoice
        QuestionChoice updatedQuestionChoice = questionChoiceRepository.findOne(questionChoice.getId());
        updatedQuestionChoice
            .multipleResponse(UPDATED_MULTIPLE_RESPONSE)
            .text(UPDATED_TEXT)
            .memo(UPDATED_MEMO)
            .groupPosition(UPDATED_GROUP_POSITION);
        QuestionChoiceDTO questionChoiceDTO = questionChoiceMapper.toDto(updatedQuestionChoice);

        restQuestionChoiceMockMvc.perform(put("/api/question-choices")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(questionChoiceDTO)))
            .andExpect(status().isOk());

        // Validate the QuestionChoice in the database
        List<QuestionChoice> questionChoiceList = questionChoiceRepository.findAll();
        assertThat(questionChoiceList).hasSize(databaseSizeBeforeUpdate);
        QuestionChoice testQuestionChoice = questionChoiceList.get(questionChoiceList.size() - 1);
        assertThat(testQuestionChoice.isMultipleResponse()).isEqualTo(UPDATED_MULTIPLE_RESPONSE);
        assertThat(testQuestionChoice.getText()).isEqualTo(UPDATED_TEXT);
        assertThat(testQuestionChoice.getMemo()).isEqualTo(UPDATED_MEMO);
        assertThat(testQuestionChoice.getGroupPosition()).isEqualTo(UPDATED_GROUP_POSITION);

        // Validate the QuestionChoice in Elasticsearch
        QuestionChoice questionChoiceEs = questionChoiceSearchRepository.findOne(testQuestionChoice.getId());
        assertThat(questionChoiceEs).isEqualToComparingFieldByField(testQuestionChoice);
    }

    @Test
    @Transactional
    public void updateNonExistingQuestionChoice() throws Exception {
        int databaseSizeBeforeUpdate = questionChoiceRepository.findAll().size();

        // Create the QuestionChoice
        QuestionChoiceDTO questionChoiceDTO = questionChoiceMapper.toDto(questionChoice);

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restQuestionChoiceMockMvc.perform(put("/api/question-choices")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(questionChoiceDTO)))
            .andExpect(status().isCreated());

        // Validate the QuestionChoice in the database
        List<QuestionChoice> questionChoiceList = questionChoiceRepository.findAll();
        assertThat(questionChoiceList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteQuestionChoice() throws Exception {
        // Initialize the database
        questionChoiceRepository.saveAndFlush(questionChoice);
        questionChoiceSearchRepository.save(questionChoice);
        int databaseSizeBeforeDelete = questionChoiceRepository.findAll().size();

        // Get the questionChoice
        restQuestionChoiceMockMvc.perform(delete("/api/question-choices/{id}", questionChoice.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean questionChoiceExistsInEs = questionChoiceSearchRepository.exists(questionChoice.getId());
        assertThat(questionChoiceExistsInEs).isFalse();

        // Validate the database is empty
        List<QuestionChoice> questionChoiceList = questionChoiceRepository.findAll();
        assertThat(questionChoiceList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchQuestionChoice() throws Exception {
        // Initialize the database
        questionChoiceRepository.saveAndFlush(questionChoice);
        questionChoiceSearchRepository.save(questionChoice);

        // Search the questionChoice
        restQuestionChoiceMockMvc.perform(get("/api/_search/question-choices?query=id:" + questionChoice.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(questionChoice.getId().intValue())))
            .andExpect(jsonPath("$.[*].multipleResponse").value(hasItem(DEFAULT_MULTIPLE_RESPONSE.booleanValue())))
            .andExpect(jsonPath("$.[*].text").value(hasItem(DEFAULT_TEXT.toString())))
            .andExpect(jsonPath("$.[*].memo").value(hasItem(DEFAULT_MEMO.toString())))
            .andExpect(jsonPath("$.[*].groupPosition").value(hasItem(DEFAULT_GROUP_POSITION)));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(QuestionChoice.class);
        QuestionChoice questionChoice1 = new QuestionChoice();
        questionChoice1.setId(1L);
        QuestionChoice questionChoice2 = new QuestionChoice();
        questionChoice2.setId(questionChoice1.getId());
        assertThat(questionChoice1).isEqualTo(questionChoice2);
        questionChoice2.setId(2L);
        assertThat(questionChoice1).isNotEqualTo(questionChoice2);
        questionChoice1.setId(null);
        assertThat(questionChoice1).isNotEqualTo(questionChoice2);
    }

    @Test
    @Transactional
    public void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(QuestionChoiceDTO.class);
        QuestionChoiceDTO questionChoiceDTO1 = new QuestionChoiceDTO();
        questionChoiceDTO1.setId(1L);
        QuestionChoiceDTO questionChoiceDTO2 = new QuestionChoiceDTO();
        assertThat(questionChoiceDTO1).isNotEqualTo(questionChoiceDTO2);
        questionChoiceDTO2.setId(questionChoiceDTO1.getId());
        assertThat(questionChoiceDTO1).isEqualTo(questionChoiceDTO2);
        questionChoiceDTO2.setId(2L);
        assertThat(questionChoiceDTO1).isNotEqualTo(questionChoiceDTO2);
        questionChoiceDTO1.setId(null);
        assertThat(questionChoiceDTO1).isNotEqualTo(questionChoiceDTO2);
    }

    @Test
    @Transactional
    public void testEntityFromId() {
        assertThat(questionChoiceMapper.fromId(42L).getId()).isEqualTo(42);
        assertThat(questionChoiceMapper.fromId(null)).isNull();
    }
}
