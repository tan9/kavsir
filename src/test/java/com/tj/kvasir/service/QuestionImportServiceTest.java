package com.tj.kvasir.service;

import com.tj.kvasir.domain.CategoryNode;
import com.tj.kvasir.repository.CategoryNodeRepository;
import com.tj.kvasir.service.dto.CategoryNodeDTO;
import com.tj.kvasir.service.dto.QuestionChoiceAndOptionsDTO;
import com.tj.kvasir.service.dto.QuestionChoiceDTO;
import com.tj.kvasir.service.dto.QuestionChoiceOptionDTO;
import com.tj.kvasir.service.dto.QuestionEssayDTO;
import com.tj.kvasir.service.dto.QuestionTrueFalseDTO;
import com.tj.kvasir.service.mapper.CategoryNodeMapperImpl;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.junit4.SpringRunner;

import java.io.InputStream;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.inOrder;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.when;

@RunWith(SpringRunner.class)
@Import({QuestionImportService.class, CategoryNodeMapperImpl.class})
public class QuestionImportServiceTest {

    @Autowired
    private QuestionImportService service;

    @MockBean
    private QuestionTrueFalseService trueFalseService;

    @MockBean
    private QuestionChoiceAndOptionsService choiceService;

    @MockBean
    private QuestionEssayService essayService;

    @MockBean
    private CategoryNodeRepository categoryNodeRepository;

    @Before
    public void setUp() {
        CategoryNode categoryNode = new CategoryNode();
        categoryNode.setId(78L);
        when(categoryNodeRepository.findOne(78L)).thenReturn(categoryNode);
    }

    @Test
    public void importFromXlsx() throws Exception {
        CategoryNodeDTO categoryNodeDTO = new CategoryNodeDTO();
        categoryNodeDTO.setId(78L);

        ClassLoader contextClassLoader = Thread.currentThread().getContextClassLoader();
        InputStream is = contextClassLoader.getResourceAsStream("KavsirImportSample_V0.2.xlsx");

        XSSFWorkbook workbook = new XSSFWorkbook(is);
        service.importFromXlsl(workbook, 78L, null);

        InOrder inOrder = inOrder(trueFalseService, choiceService, essayService);

        ArgumentCaptor<QuestionTrueFalseDTO> questionTrueFalseCaptor = ArgumentCaptor.forClass(QuestionTrueFalseDTO.class);
        ArgumentCaptor<QuestionChoiceAndOptionsDTO> questionChoiceAndOptionsCaptor = ArgumentCaptor.forClass(QuestionChoiceAndOptionsDTO.class);
        ArgumentCaptor<QuestionEssayDTO> questionEssayCaptor = ArgumentCaptor.forClass(QuestionEssayDTO.class);

        inOrder.verify(trueFalseService, times(2)).save(questionTrueFalseCaptor.capture());
        inOrder.verify(choiceService, times(2)).save(questionChoiceAndOptionsCaptor.capture());
        inOrder.verify(essayService).save(questionEssayCaptor.capture());
        inOrder.verifyNoMoreInteractions();

        List<QuestionTrueFalseDTO> questionTrueFalses = questionTrueFalseCaptor.getAllValues();
        assertThat(questionTrueFalses).hasSize(2);
        QuestionTrueFalseDTO questionTrueFalse1 = questionTrueFalses.get(0);
        assertThat(questionTrueFalse1.getCategories()).containsExactly(categoryNodeDTO);
        assertThat(questionTrueFalse1.getText()).isEqualTo("當 $a \\ne 0$ 時，\\(ax^2 + bx + c = 0\\) 存在兩解且為 \\[x = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}\\]");
        assertThat(questionTrueFalse1.isCorrect()).isFalse();

        QuestionTrueFalseDTO questionTrueFalse2 = questionTrueFalses.get(1);
        assertThat(questionTrueFalse2.isCorrect()).isTrue();
        assertThat(questionTrueFalse2.getCategories()).containsExactly(categoryNodeDTO);
        assertThat(questionTrueFalse2.getText()).isEqualTo("珍珠奶茶的珍珠會被溶解");

        List<QuestionChoiceAndOptionsDTO> questionChoices = questionChoiceAndOptionsCaptor.getAllValues();
        assertThat(questionChoices).hasSize(2);
        QuestionChoiceAndOptionsDTO questionChoice1 = questionChoices.get(0);
        QuestionChoiceDTO questionChoice1Question = questionChoice1.getQuestion();
        assertThat(questionChoice1Question.getCategories()).containsExactly(categoryNodeDTO);
        assertThat(questionChoice1Question.getText()).isEqualTo("三年級分組種的小白菜、空心菜、番茄、油菜四種蔬菜中，有幾種是全年生產的？");
        assertThat(questionChoice1Question.isMultipleResponse()).isFalse();
        assertThat(questionChoice1.getOptions()).hasSize(5);

        QuestionChoiceOptionDTO questionChoice1Option1 = questionChoice1.getOptions().get(0);
        assertThat(questionChoice1Option1.getText()).isEqualTo("1種");
        assertThat(questionChoice1Option1.isCorrect()).isFalse();

        QuestionChoiceOptionDTO questionChoice1Option2 = questionChoice1.getOptions().get(1);
        assertThat(questionChoice1Option2.getText()).isEqualTo("2種");
        assertThat(questionChoice1Option2.isCorrect()).isFalse();

        QuestionChoiceOptionDTO questionChoice1Option3 = questionChoice1.getOptions().get(2);
        assertThat(questionChoice1Option3.getText()).isEqualTo("3種");
        assertThat(questionChoice1Option3.isCorrect()).isFalse();

        QuestionChoiceOptionDTO questionChoice1Option4 = questionChoice1.getOptions().get(3);
        assertThat(questionChoice1Option4.getText()).isEqualTo("4種");
        assertThat(questionChoice1Option4.isCorrect()).isTrue();

        QuestionChoiceOptionDTO questionChoice1Option5 = questionChoice1.getOptions().get(4);
        assertThat(questionChoice1Option5.getText()).isEqualTo("5種");
        assertThat(questionChoice1Option5.isCorrect()).isFalse();

        QuestionChoiceAndOptionsDTO questionChoice2 = questionChoices.get(1);
        QuestionChoiceDTO questionChoice2Question = questionChoice2.getQuestion();
        assertThat(questionChoice2Question.getCategories()).containsExactly(categoryNodeDTO);
        assertThat(questionChoice2Question.getText()).isEqualTo("種植蔬菜時哪些是正確必須注意的事情？");
        assertThat(questionChoice2Question.isMultipleResponse()).isTrue();
        assertThat(questionChoice2.getOptions()).hasSize(5);

        QuestionChoiceOptionDTO questionChoice2Option1 = questionChoice2.getOptions().get(0);
        assertThat(questionChoice2Option1.getText()).isEqualTo("避免中午時間澆水，每天早晚一定要各澆1次。");
        assertThat(questionChoice2Option1.isCorrect()).isFalse();

        QuestionChoiceOptionDTO questionChoice2Option2 = questionChoice2.getOptions().get(1);
        assertThat(questionChoice2Option2.getText()).isEqualTo("間拔或移植後應該要馬上澆水。");
        assertThat(questionChoice2Option2.isCorrect()).isTrue();

        QuestionChoiceOptionDTO questionChoice2Option3 = questionChoice2.getOptions().get(2);
        assertThat(questionChoice2Option3.getText()).isEqualTo("澆水的水柱要細，水不要直接澆在蔬菜上。");
        assertThat(questionChoice2Option3.isCorrect()).isTrue();

        QuestionChoiceOptionDTO questionChoice2Option4 = questionChoice2.getOptions().get(3);
        assertThat(questionChoice2Option4.getText()).isEqualTo("使用肥料時，要盡量靠近根部，讓蔬菜方便吸收，長得更快、更好。");
        assertThat(questionChoice2Option4.isCorrect()).isFalse();

        QuestionChoiceOptionDTO questionChoice2Option5 = questionChoice2.getOptions().get(4);
        assertThat(questionChoice2Option5.getText()).isEqualTo("蔬菜葉子上出現一個一個的小洞，是因為水澆太少了。");
        assertThat(questionChoice2Option5.isCorrect()).isFalse();

        QuestionEssayDTO questionEssay = questionEssayCaptor.getValue();
        assertThat(questionEssay.getCategories()).containsExactly(categoryNodeDTO);
        assertThat(questionEssay.getText()).isEqualTo("請寫出兩種節約用水、珍惜水資源的方法");
        assertThat(questionEssay.getAnswer()).isEqualTo("淋浴；用省水龍頭；不洗澡");
    }

}
