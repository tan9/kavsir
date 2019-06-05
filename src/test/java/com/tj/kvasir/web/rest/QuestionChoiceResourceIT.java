package com.tj.kvasir.web.rest;

import com.tj.kvasir.KavsirApp;
import com.tj.kvasir.domain.QuestionChoice;
import com.tj.kvasir.repository.QuestionChoiceRepository;
import com.tj.kvasir.repository.search.QuestionChoiceSearchRepository;
import com.tj.kvasir.service.QuestionChoiceService;
import com.tj.kvasir.service.dto.QuestionChoiceDTO;
import com.tj.kvasir.service.mapper.QuestionChoiceMapper;
import com.tj.kvasir.web.rest.errors.ExceptionTranslator;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Base64Utils;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.util.ArrayList;
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
 * Integration tests for the {@Link QuestionChoiceResource} REST controller.
 */
@SpringBootTest(classes = KavsirApp.class)
public class QuestionChoiceResourceIT {

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

    @Mock
    private QuestionChoiceRepository questionChoiceRepositoryMock;

    @Autowired
    private QuestionChoiceMapper questionChoiceMapper;

    @Mock
    private QuestionChoiceService questionChoiceServiceMock;

    @Autowired
    private QuestionChoiceService questionChoiceService;

    /**
     * This repository is mocked in the com.tj.kvasir.repository.search test package.
     *
     * @see com.tj.kvasir.repository.search.QuestionChoiceSearchRepositoryMockConfiguration
     */
    @Autowired
    private QuestionChoiceSearchRepository mockQuestionChoiceSearchRepository;

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

    private MockMvc restQuestionChoiceMockMvc;

    private QuestionChoice questionChoice;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final QuestionChoiceResource questionChoiceResource = new QuestionChoiceResource(questionChoiceService);
        this.restQuestionChoiceMockMvc = MockMvcBuilders.standaloneSetup(questionChoiceResource)
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
    public static QuestionChoice createEntity(EntityManager em) {
        QuestionChoice questionChoice = new QuestionChoice()
            .multipleResponse(DEFAULT_MULTIPLE_RESPONSE)
            .text(DEFAULT_TEXT)
            .memo(DEFAULT_MEMO)
            .groupPosition(DEFAULT_GROUP_POSITION);
        return questionChoice;
    }

    @BeforeEach
    public void initTest() {
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
        verify(mockQuestionChoiceSearchRepository, times(1)).save(testQuestionChoice);
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

        // Validate the QuestionChoice in the database
        List<QuestionChoice> questionChoiceList = questionChoiceRepository.findAll();
        assertThat(questionChoiceList).hasSize(databaseSizeBeforeCreate);

        // Validate the QuestionChoice in Elasticsearch
        verify(mockQuestionChoiceSearchRepository, times(0)).save(questionChoice);
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

    @SuppressWarnings({"unchecked"})
    public void getAllQuestionChoicesWithEagerRelationshipsIsEnabled() throws Exception {
        QuestionChoiceResource questionChoiceResource = new QuestionChoiceResource(questionChoiceServiceMock);
        when(questionChoiceServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        MockMvc restQuestionChoiceMockMvc = MockMvcBuilders.standaloneSetup(questionChoiceResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();

        restQuestionChoiceMockMvc.perform(get("/api/question-choices?eagerload=true"))
        .andExpect(status().isOk());

        verify(questionChoiceServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({"unchecked"})
    public void getAllQuestionChoicesWithEagerRelationshipsIsNotEnabled() throws Exception {
        QuestionChoiceResource questionChoiceResource = new QuestionChoiceResource(questionChoiceServiceMock);
            when(questionChoiceServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));
            MockMvc restQuestionChoiceMockMvc = MockMvcBuilders.standaloneSetup(questionChoiceResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();

        restQuestionChoiceMockMvc.perform(get("/api/question-choices?eagerload=true"))
        .andExpect(status().isOk());

            verify(questionChoiceServiceMock, times(1)).findAllWithEagerRelationships(any());
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

        int databaseSizeBeforeUpdate = questionChoiceRepository.findAll().size();

        // Update the questionChoice
        QuestionChoice updatedQuestionChoice = questionChoiceRepository.findById(questionChoice.getId()).get();
        // Disconnect from session so that the updates on updatedQuestionChoice are not directly saved in db
        em.detach(updatedQuestionChoice);
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
        verify(mockQuestionChoiceSearchRepository, times(1)).save(testQuestionChoice);
    }

    @Test
    @Transactional
    public void updateNonExistingQuestionChoice() throws Exception {
        int databaseSizeBeforeUpdate = questionChoiceRepository.findAll().size();

        // Create the QuestionChoice
        QuestionChoiceDTO questionChoiceDTO = questionChoiceMapper.toDto(questionChoice);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restQuestionChoiceMockMvc.perform(put("/api/question-choices")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(questionChoiceDTO)))
            .andExpect(status().isBadRequest());

        // Validate the QuestionChoice in the database
        List<QuestionChoice> questionChoiceList = questionChoiceRepository.findAll();
        assertThat(questionChoiceList).hasSize(databaseSizeBeforeUpdate);

        // Validate the QuestionChoice in Elasticsearch
        verify(mockQuestionChoiceSearchRepository, times(0)).save(questionChoice);
    }

    @Test
    @Transactional
    public void deleteQuestionChoice() throws Exception {
        // Initialize the database
        questionChoiceRepository.saveAndFlush(questionChoice);

        int databaseSizeBeforeDelete = questionChoiceRepository.findAll().size();

        // Delete the questionChoice
        restQuestionChoiceMockMvc.perform(delete("/api/question-choices/{id}", questionChoice.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database is empty
        List<QuestionChoice> questionChoiceList = questionChoiceRepository.findAll();
        assertThat(questionChoiceList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the QuestionChoice in Elasticsearch
        verify(mockQuestionChoiceSearchRepository, times(1)).deleteById(questionChoice.getId());
    }

    @Test
    @Transactional
    public void searchQuestionChoice() throws Exception {
        // Initialize the database
        questionChoiceRepository.saveAndFlush(questionChoice);
        when(mockQuestionChoiceSearchRepository.search(queryStringQuery("id:" + questionChoice.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(questionChoice), PageRequest.of(0, 1), 1));
        // Search the questionChoice
        restQuestionChoiceMockMvc.perform(get("/api/_search/question-choices?query=id:" + questionChoice.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(questionChoice.getId().intValue())))
            .andExpect(jsonPath("$.[*].multipleResponse").value(hasItem(DEFAULT_MULTIPLE_RESPONSE.booleanValue())))
            .andExpect(jsonPath("$.[*].text").value(hasItem(DEFAULT_TEXT.toString())))
            .andExpect(jsonPath("$.[*].memo").value(hasItem(DEFAULT_MEMO)))
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
