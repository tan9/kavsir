package com.tj.kvasir.web.rest;

import com.tj.kvasir.KavsirApp;
import com.tj.kvasir.domain.QuestionTrueFalse;
import com.tj.kvasir.repository.QuestionTrueFalseRepository;
import com.tj.kvasir.repository.search.QuestionTrueFalseSearchRepository;
import com.tj.kvasir.service.QuestionTrueFalseService;
import com.tj.kvasir.service.dto.QuestionTrueFalseDTO;
import com.tj.kvasir.service.mapper.QuestionTrueFalseMapper;
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
 * Integration tests for the {@Link QuestionTrueFalseResource} REST controller.
 */
@SpringBootTest(classes = KavsirApp.class)
public class QuestionTrueFalseResourceIT {

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

    @Mock
    private QuestionTrueFalseRepository questionTrueFalseRepositoryMock;

    @Autowired
    private QuestionTrueFalseMapper questionTrueFalseMapper;

    @Mock
    private QuestionTrueFalseService questionTrueFalseServiceMock;

    @Autowired
    private QuestionTrueFalseService questionTrueFalseService;

    /**
     * This repository is mocked in the com.tj.kvasir.repository.search test package.
     *
     * @see com.tj.kvasir.repository.search.QuestionTrueFalseSearchRepositoryMockConfiguration
     */
    @Autowired
    private QuestionTrueFalseSearchRepository mockQuestionTrueFalseSearchRepository;

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

    private MockMvc restQuestionTrueFalseMockMvc;

    private QuestionTrueFalse questionTrueFalse;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final QuestionTrueFalseResource questionTrueFalseResource = new QuestionTrueFalseResource(questionTrueFalseService);
        this.restQuestionTrueFalseMockMvc = MockMvcBuilders.standaloneSetup(questionTrueFalseResource)
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
    public static QuestionTrueFalse createEntity(EntityManager em) {
        QuestionTrueFalse questionTrueFalse = new QuestionTrueFalse()
            .correct(DEFAULT_CORRECT)
            .text(DEFAULT_TEXT)
            .memo(DEFAULT_MEMO)
            .groupPosition(DEFAULT_GROUP_POSITION);
        return questionTrueFalse;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static QuestionTrueFalse createUpdatedEntity(EntityManager em) {
        QuestionTrueFalse questionTrueFalse = new QuestionTrueFalse()
            .correct(UPDATED_CORRECT)
            .text(UPDATED_TEXT)
            .memo(UPDATED_MEMO)
            .groupPosition(UPDATED_GROUP_POSITION);
        return questionTrueFalse;
    }

    @BeforeEach
    public void initTest() {
        questionTrueFalse = createEntity(em);
    }

    @Test
    @Transactional
    public void createQuestionTrueFalse() throws Exception {
        int databaseSizeBeforeCreate = questionTrueFalseRepository.findAll().size();

        // Create the QuestionTrueFalse
        QuestionTrueFalseDTO questionTrueFalseDTO = questionTrueFalseMapper.toDto(questionTrueFalse);
        restQuestionTrueFalseMockMvc.perform(post("/api/question-true-falses")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(questionTrueFalseDTO)))
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
        verify(mockQuestionTrueFalseSearchRepository, times(1)).save(testQuestionTrueFalse);
    }

    @Test
    @Transactional
    public void createQuestionTrueFalseWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = questionTrueFalseRepository.findAll().size();

        // Create the QuestionTrueFalse with an existing ID
        questionTrueFalse.setId(1L);
        QuestionTrueFalseDTO questionTrueFalseDTO = questionTrueFalseMapper.toDto(questionTrueFalse);

        // An entity with an existing ID cannot be created, so this API call must fail
        restQuestionTrueFalseMockMvc.perform(post("/api/question-true-falses")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(questionTrueFalseDTO)))
            .andExpect(status().isBadRequest());

        // Validate the QuestionTrueFalse in the database
        List<QuestionTrueFalse> questionTrueFalseList = questionTrueFalseRepository.findAll();
        assertThat(questionTrueFalseList).hasSize(databaseSizeBeforeCreate);

        // Validate the QuestionTrueFalse in Elasticsearch
        verify(mockQuestionTrueFalseSearchRepository, times(0)).save(questionTrueFalse);
    }


    @Test
    @Transactional
    public void checkCorrectIsRequired() throws Exception {
        int databaseSizeBeforeTest = questionTrueFalseRepository.findAll().size();
        // set the field null
        questionTrueFalse.setCorrect(null);

        // Create the QuestionTrueFalse, which fails.
        QuestionTrueFalseDTO questionTrueFalseDTO = questionTrueFalseMapper.toDto(questionTrueFalse);

        restQuestionTrueFalseMockMvc.perform(post("/api/question-true-falses")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(questionTrueFalseDTO)))
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

    @SuppressWarnings({"unchecked"})
    public void getAllQuestionTrueFalsesWithEagerRelationshipsIsEnabled() throws Exception {
        QuestionTrueFalseResource questionTrueFalseResource = new QuestionTrueFalseResource(questionTrueFalseServiceMock);
        when(questionTrueFalseServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        MockMvc restQuestionTrueFalseMockMvc = MockMvcBuilders.standaloneSetup(questionTrueFalseResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();

        restQuestionTrueFalseMockMvc.perform(get("/api/question-true-falses?eagerload=true"))
        .andExpect(status().isOk());

        verify(questionTrueFalseServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({"unchecked"})
    public void getAllQuestionTrueFalsesWithEagerRelationshipsIsNotEnabled() throws Exception {
        QuestionTrueFalseResource questionTrueFalseResource = new QuestionTrueFalseResource(questionTrueFalseServiceMock);
            when(questionTrueFalseServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));
            MockMvc restQuestionTrueFalseMockMvc = MockMvcBuilders.standaloneSetup(questionTrueFalseResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();

        restQuestionTrueFalseMockMvc.perform(get("/api/question-true-falses?eagerload=true"))
        .andExpect(status().isOk());

            verify(questionTrueFalseServiceMock, times(1)).findAllWithEagerRelationships(any());
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

        int databaseSizeBeforeUpdate = questionTrueFalseRepository.findAll().size();

        // Update the questionTrueFalse
        QuestionTrueFalse updatedQuestionTrueFalse = questionTrueFalseRepository.findById(questionTrueFalse.getId()).get();
        // Disconnect from session so that the updates on updatedQuestionTrueFalse are not directly saved in db
        em.detach(updatedQuestionTrueFalse);
        updatedQuestionTrueFalse
            .correct(UPDATED_CORRECT)
            .text(UPDATED_TEXT)
            .memo(UPDATED_MEMO)
            .groupPosition(UPDATED_GROUP_POSITION);
        QuestionTrueFalseDTO questionTrueFalseDTO = questionTrueFalseMapper.toDto(updatedQuestionTrueFalse);

        restQuestionTrueFalseMockMvc.perform(put("/api/question-true-falses")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(questionTrueFalseDTO)))
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
        verify(mockQuestionTrueFalseSearchRepository, times(1)).save(testQuestionTrueFalse);
    }

    @Test
    @Transactional
    public void updateNonExistingQuestionTrueFalse() throws Exception {
        int databaseSizeBeforeUpdate = questionTrueFalseRepository.findAll().size();

        // Create the QuestionTrueFalse
        QuestionTrueFalseDTO questionTrueFalseDTO = questionTrueFalseMapper.toDto(questionTrueFalse);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restQuestionTrueFalseMockMvc.perform(put("/api/question-true-falses")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(questionTrueFalseDTO)))
            .andExpect(status().isBadRequest());

        // Validate the QuestionTrueFalse in the database
        List<QuestionTrueFalse> questionTrueFalseList = questionTrueFalseRepository.findAll();
        assertThat(questionTrueFalseList).hasSize(databaseSizeBeforeUpdate);

        // Validate the QuestionTrueFalse in Elasticsearch
        verify(mockQuestionTrueFalseSearchRepository, times(0)).save(questionTrueFalse);
    }

    @Test
    @Transactional
    public void deleteQuestionTrueFalse() throws Exception {
        // Initialize the database
        questionTrueFalseRepository.saveAndFlush(questionTrueFalse);

        int databaseSizeBeforeDelete = questionTrueFalseRepository.findAll().size();

        // Delete the questionTrueFalse
        restQuestionTrueFalseMockMvc.perform(delete("/api/question-true-falses/{id}", questionTrueFalse.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database is empty
        List<QuestionTrueFalse> questionTrueFalseList = questionTrueFalseRepository.findAll();
        assertThat(questionTrueFalseList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the QuestionTrueFalse in Elasticsearch
        verify(mockQuestionTrueFalseSearchRepository, times(1)).deleteById(questionTrueFalse.getId());
    }

    @Test
    @Transactional
    public void searchQuestionTrueFalse() throws Exception {
        // Initialize the database
        questionTrueFalseRepository.saveAndFlush(questionTrueFalse);
        when(mockQuestionTrueFalseSearchRepository.search(queryStringQuery("id:" + questionTrueFalse.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(questionTrueFalse), PageRequest.of(0, 1), 1));
        // Search the questionTrueFalse
        restQuestionTrueFalseMockMvc.perform(get("/api/_search/question-true-falses?query=id:" + questionTrueFalse.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(questionTrueFalse.getId().intValue())))
            .andExpect(jsonPath("$.[*].correct").value(hasItem(DEFAULT_CORRECT.booleanValue())))
            .andExpect(jsonPath("$.[*].text").value(hasItem(DEFAULT_TEXT.toString())))
            .andExpect(jsonPath("$.[*].memo").value(hasItem(DEFAULT_MEMO)))
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

    @Test
    @Transactional
    public void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(QuestionTrueFalseDTO.class);
        QuestionTrueFalseDTO questionTrueFalseDTO1 = new QuestionTrueFalseDTO();
        questionTrueFalseDTO1.setId(1L);
        QuestionTrueFalseDTO questionTrueFalseDTO2 = new QuestionTrueFalseDTO();
        assertThat(questionTrueFalseDTO1).isNotEqualTo(questionTrueFalseDTO2);
        questionTrueFalseDTO2.setId(questionTrueFalseDTO1.getId());
        assertThat(questionTrueFalseDTO1).isEqualTo(questionTrueFalseDTO2);
        questionTrueFalseDTO2.setId(2L);
        assertThat(questionTrueFalseDTO1).isNotEqualTo(questionTrueFalseDTO2);
        questionTrueFalseDTO1.setId(null);
        assertThat(questionTrueFalseDTO1).isNotEqualTo(questionTrueFalseDTO2);
    }

    @Test
    @Transactional
    public void testEntityFromId() {
        assertThat(questionTrueFalseMapper.fromId(42L).getId()).isEqualTo(42);
        assertThat(questionTrueFalseMapper.fromId(null)).isNull();
    }
}
