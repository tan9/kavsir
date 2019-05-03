package com.tj.kvasir.web.rest;

import com.tj.kvasir.KavsirApp;
import com.tj.kvasir.domain.QuestionEssay;
import com.tj.kvasir.repository.QuestionEssayRepository;
import com.tj.kvasir.repository.search.QuestionEssaySearchRepository;
import com.tj.kvasir.service.QuestionEssayService;
import com.tj.kvasir.service.dto.QuestionEssayDTO;
import com.tj.kvasir.service.mapper.QuestionEssayMapper;
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
 * Integration tests for the {@Link QuestionEssayResource} REST controller.
 */
@SpringBootTest(classes = KavsirApp.class)
public class QuestionEssayResourceIT {

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

    @Mock
    private QuestionEssayRepository questionEssayRepositoryMock;

    @Autowired
    private QuestionEssayMapper questionEssayMapper;

    @Mock
    private QuestionEssayService questionEssayServiceMock;

    @Autowired
    private QuestionEssayService questionEssayService;

    /**
     * This repository is mocked in the com.tj.kvasir.repository.search test package.
     *
     * @see com.tj.kvasir.repository.search.QuestionEssaySearchRepositoryMockConfiguration
     */
    @Autowired
    private QuestionEssaySearchRepository mockQuestionEssaySearchRepository;

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

    private MockMvc restQuestionEssayMockMvc;

    private QuestionEssay questionEssay;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final QuestionEssayResource questionEssayResource = new QuestionEssayResource(questionEssayService);
        this.restQuestionEssayMockMvc = MockMvcBuilders.standaloneSetup(questionEssayResource)
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
    public static QuestionEssay createEntity(EntityManager em) {
        QuestionEssay questionEssay = new QuestionEssay()
            .text(DEFAULT_TEXT)
            .answer(DEFAULT_ANSWER)
            .memo(DEFAULT_MEMO)
            .groupPosition(DEFAULT_GROUP_POSITION);
        return questionEssay;
    }

    @BeforeEach
    public void initTest() {
        questionEssay = createEntity(em);
    }

    @Test
    @Transactional
    public void createQuestionEssay() throws Exception {
        int databaseSizeBeforeCreate = questionEssayRepository.findAll().size();

        // Create the QuestionEssay
        QuestionEssayDTO questionEssayDTO = questionEssayMapper.toDto(questionEssay);
        restQuestionEssayMockMvc.perform(post("/api/question-essays")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(questionEssayDTO)))
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
        verify(mockQuestionEssaySearchRepository, times(1)).save(testQuestionEssay);
    }

    @Test
    @Transactional
    public void createQuestionEssayWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = questionEssayRepository.findAll().size();

        // Create the QuestionEssay with an existing ID
        questionEssay.setId(1L);
        QuestionEssayDTO questionEssayDTO = questionEssayMapper.toDto(questionEssay);

        // An entity with an existing ID cannot be created, so this API call must fail
        restQuestionEssayMockMvc.perform(post("/api/question-essays")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(questionEssayDTO)))
            .andExpect(status().isBadRequest());

        // Validate the QuestionEssay in the database
        List<QuestionEssay> questionEssayList = questionEssayRepository.findAll();
        assertThat(questionEssayList).hasSize(databaseSizeBeforeCreate);

        // Validate the QuestionEssay in Elasticsearch
        verify(mockQuestionEssaySearchRepository, times(0)).save(questionEssay);
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
    
    @SuppressWarnings({"unchecked"})
    public void getAllQuestionEssaysWithEagerRelationshipsIsEnabled() throws Exception {
        QuestionEssayResource questionEssayResource = new QuestionEssayResource(questionEssayServiceMock);
        when(questionEssayServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        MockMvc restQuestionEssayMockMvc = MockMvcBuilders.standaloneSetup(questionEssayResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();

        restQuestionEssayMockMvc.perform(get("/api/question-essays?eagerload=true"))
        .andExpect(status().isOk());

        verify(questionEssayServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({"unchecked"})
    public void getAllQuestionEssaysWithEagerRelationshipsIsNotEnabled() throws Exception {
        QuestionEssayResource questionEssayResource = new QuestionEssayResource(questionEssayServiceMock);
            when(questionEssayServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));
            MockMvc restQuestionEssayMockMvc = MockMvcBuilders.standaloneSetup(questionEssayResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();

        restQuestionEssayMockMvc.perform(get("/api/question-essays?eagerload=true"))
        .andExpect(status().isOk());

            verify(questionEssayServiceMock, times(1)).findAllWithEagerRelationships(any());
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

        int databaseSizeBeforeUpdate = questionEssayRepository.findAll().size();

        // Update the questionEssay
        QuestionEssay updatedQuestionEssay = questionEssayRepository.findById(questionEssay.getId()).get();
        // Disconnect from session so that the updates on updatedQuestionEssay are not directly saved in db
        em.detach(updatedQuestionEssay);
        updatedQuestionEssay
            .text(UPDATED_TEXT)
            .answer(UPDATED_ANSWER)
            .memo(UPDATED_MEMO)
            .groupPosition(UPDATED_GROUP_POSITION);
        QuestionEssayDTO questionEssayDTO = questionEssayMapper.toDto(updatedQuestionEssay);

        restQuestionEssayMockMvc.perform(put("/api/question-essays")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(questionEssayDTO)))
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
        verify(mockQuestionEssaySearchRepository, times(1)).save(testQuestionEssay);
    }

    @Test
    @Transactional
    public void updateNonExistingQuestionEssay() throws Exception {
        int databaseSizeBeforeUpdate = questionEssayRepository.findAll().size();

        // Create the QuestionEssay
        QuestionEssayDTO questionEssayDTO = questionEssayMapper.toDto(questionEssay);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restQuestionEssayMockMvc.perform(put("/api/question-essays")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(questionEssayDTO)))
            .andExpect(status().isBadRequest());

        // Validate the QuestionEssay in the database
        List<QuestionEssay> questionEssayList = questionEssayRepository.findAll();
        assertThat(questionEssayList).hasSize(databaseSizeBeforeUpdate);

        // Validate the QuestionEssay in Elasticsearch
        verify(mockQuestionEssaySearchRepository, times(0)).save(questionEssay);
    }

    @Test
    @Transactional
    public void deleteQuestionEssay() throws Exception {
        // Initialize the database
        questionEssayRepository.saveAndFlush(questionEssay);

        int databaseSizeBeforeDelete = questionEssayRepository.findAll().size();

        // Delete the questionEssay
        restQuestionEssayMockMvc.perform(delete("/api/question-essays/{id}", questionEssay.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database is empty
        List<QuestionEssay> questionEssayList = questionEssayRepository.findAll();
        assertThat(questionEssayList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the QuestionEssay in Elasticsearch
        verify(mockQuestionEssaySearchRepository, times(1)).deleteById(questionEssay.getId());
    }

    @Test
    @Transactional
    public void searchQuestionEssay() throws Exception {
        // Initialize the database
        questionEssayRepository.saveAndFlush(questionEssay);
        when(mockQuestionEssaySearchRepository.search(queryStringQuery("id:" + questionEssay.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(questionEssay), PageRequest.of(0, 1), 1));
        // Search the questionEssay
        restQuestionEssayMockMvc.perform(get("/api/_search/question-essays?query=id:" + questionEssay.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(questionEssay.getId().intValue())))
            .andExpect(jsonPath("$.[*].text").value(hasItem(DEFAULT_TEXT.toString())))
            .andExpect(jsonPath("$.[*].answer").value(hasItem(DEFAULT_ANSWER.toString())))
            .andExpect(jsonPath("$.[*].memo").value(hasItem(DEFAULT_MEMO)))
            .andExpect(jsonPath("$.[*].groupPosition").value(hasItem(DEFAULT_GROUP_POSITION)));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(QuestionEssay.class);
        QuestionEssay questionEssay1 = new QuestionEssay();
        questionEssay1.setId(1L);
        QuestionEssay questionEssay2 = new QuestionEssay();
        questionEssay2.setId(questionEssay1.getId());
        assertThat(questionEssay1).isEqualTo(questionEssay2);
        questionEssay2.setId(2L);
        assertThat(questionEssay1).isNotEqualTo(questionEssay2);
        questionEssay1.setId(null);
        assertThat(questionEssay1).isNotEqualTo(questionEssay2);
    }

    @Test
    @Transactional
    public void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(QuestionEssayDTO.class);
        QuestionEssayDTO questionEssayDTO1 = new QuestionEssayDTO();
        questionEssayDTO1.setId(1L);
        QuestionEssayDTO questionEssayDTO2 = new QuestionEssayDTO();
        assertThat(questionEssayDTO1).isNotEqualTo(questionEssayDTO2);
        questionEssayDTO2.setId(questionEssayDTO1.getId());
        assertThat(questionEssayDTO1).isEqualTo(questionEssayDTO2);
        questionEssayDTO2.setId(2L);
        assertThat(questionEssayDTO1).isNotEqualTo(questionEssayDTO2);
        questionEssayDTO1.setId(null);
        assertThat(questionEssayDTO1).isNotEqualTo(questionEssayDTO2);
    }

    @Test
    @Transactional
    public void testEntityFromId() {
        assertThat(questionEssayMapper.fromId(42L).getId()).isEqualTo(42);
        assertThat(questionEssayMapper.fromId(null)).isNull();
    }
}
