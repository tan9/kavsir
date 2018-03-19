package com.tj.kvasir.service;

import com.google.common.base.Joiner;
import com.google.common.collect.*;
import com.tj.kvasir.domain.CategoryNode;
import com.tj.kvasir.repository.CategoryNodeRepository;
import com.tj.kvasir.service.dto.*;
import com.tj.kvasir.service.dto.QuestionImportDTO.HeaderColumn;
import com.tj.kvasir.service.dto.QuestionImportDTO.QuestionType;
import com.tj.kvasir.service.mapper.CategoryNodeMapper;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import javax.annotation.Nullable;
import javax.validation.constraints.Null;
import java.util.ArrayList;
import java.util.EnumSet;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class QuestionImportService {

    private ImmutableSet<String> validAnswers = ImmutableSet.of("X", "O");

    private final QuestionTrueFalseService trueFalseService;
    private final QuestionChoiceAndOptionsService choiceService;
    private final QuestionEssayService essayService;
    private final CategoryNodeRepository categoryNodeRepository;
    private final CategoryNodeMapper categoryNodeMapper;

    public QuestionImportService(QuestionTrueFalseService trueFalseService, QuestionChoiceAndOptionsService choiceService, QuestionEssayService essayService, CategoryNodeRepository categoryNodeRepository, CategoryNodeMapper categoryNodeMapper) {
        this.trueFalseService = trueFalseService;
        this.choiceService = choiceService;
        this.essayService = essayService;
        this.categoryNodeRepository = categoryNodeRepository;
        this.categoryNodeMapper = categoryNodeMapper;
    }

    public void importFromXlsl(XSSFWorkbook workbook, @Nullable Long defaultCategoryId, @Nullable QuestionType defaultQuestionType) {
        parseQuestions(workbook, defaultCategoryId, defaultQuestionType)
            .stream()
            .forEachOrdered(q -> {
                if (q instanceof QuestionTrueFalseDTO) {
                    trueFalseService.save((QuestionTrueFalseDTO) q);
                }

                if (q instanceof QuestionChoiceAndOptionsDTO) {
                    choiceService.save((QuestionChoiceAndOptionsDTO) q);
                }

                if (q instanceof QuestionEssayDTO) {
                    essayService.save((QuestionEssayDTO) q);
                }
            });
    }

    protected List<QuestionDTO> parseQuestions(XSSFWorkbook workbook, @Nullable Long defaultCategoryId, @Nullable QuestionType defaultQuestionType) {
        BiMap<HeaderColumn, Integer> columnIndexMap = HashBiMap.create();
        List<QuestionDTO> questions = new ArrayList<>();

        XSSFSheet sheet = workbook.getSheetAt(0);
        Iterator<Row> rowIterator = sheet.iterator();
        while (rowIterator.hasNext()) {
            Row row = rowIterator.next();
            Iterator<Cell> cellIterator = row.cellIterator();
            if (columnIndexMap.isEmpty()) {
                while (cellIterator.hasNext()) {
                    Cell cell = cellIterator.next();
                    for (HeaderColumn column : HeaderColumn.values()) {
                        if (column.getAlias().contains(cell.getStringCellValue())) {
                            columnIndexMap.put(column, cell.getColumnIndex());
                        }
                    }
                }

                EnumSet<HeaderColumn> requiredColumns = EnumSet.of(HeaderColumn.ANSWER, HeaderColumn.TEXT);
                if (defaultCategoryId == null) {
                    requiredColumns.add(HeaderColumn.CATEGORY);
                }
                if (defaultQuestionType == null) {
                    requiredColumns.add(HeaderColumn.TYPE);
                }

                if (!columnIndexMap.keySet().containsAll(requiredColumns)) {
                    Sets.SetView<HeaderColumn> difference = Sets.difference(requiredColumns, columnIndexMap.keySet());
                    if (difference.size() == 1) {
                        throw new IllegalArgumentException("Required column is not specified: " + difference);
                    } else {
                        throw new IllegalArgumentException("Required columns are not specified: " + difference);
                    }
                }

            } else {
                // 題型
                QuestionType type = defaultQuestionType;
                Integer typeColumnIndex = columnIndexMap.get(HeaderColumn.TYPE);
                if (typeColumnIndex != null) {
                    String typeString = row.getCell(typeColumnIndex).getStringCellValue();
                    for (QuestionType questionType : QuestionType.values()) {
                        if (questionType.getAlias().contains(typeString)) {
                            type = questionType;
                            break;
                        }
                    }
                }
                if (type == null) {
                    throw new IllegalArgumentException("No type specified for row: " + row);
                }

                // 類別
                Long categoryId = defaultCategoryId;
                Integer categoryColumnIndex = columnIndexMap.get(HeaderColumn.CATEGORY);
                if (categoryColumnIndex != null) {
                    String categoryString = row.getCell(categoryColumnIndex).getStringCellValue();
                    categoryId = Long.parseLong(categoryString);
                }
                if (type == null) {
                    throw new IllegalArgumentException("No category specified for row: " + row);
                }
                CategoryNode category = categoryNodeRepository.findOne(categoryId);
                CategoryNodeDTO categoryNodeDTO = categoryNodeMapper.toDto(category);
                Set<CategoryNodeDTO> categories = ImmutableSet.of(categoryNodeDTO);

                // 題目
                String text = getStringCellValue(columnIndexMap, row, HeaderColumn.TEXT);

                // 答案
                String answer = getStringCellValue(columnIndexMap, row, HeaderColumn.ANSWER);

                // 備註
                String memo = getStringCellValue(columnIndexMap, row, HeaderColumn.MEMO);

                switch (type) {
                    case TRUE_FALSE: {
                        QuestionTrueFalseDTO question = new QuestionTrueFalseDTO();
                        question.setCategories(categories);
                        question.setText(text);
                        question.setMemo(memo);
                        if (validAnswers.contains(answer)) {
                            question.setCorrect("O".equals(answer));
                        } else {
                            throw new IllegalArgumentException("Unsupported answer text for row: " + render(row));
                        }
                        questions.add(question);
                    }
                    break;

                    case CHOICE:
                    case MULTIPLE_RESPONE: {
                        QuestionChoiceDTO question = new QuestionChoiceDTO();
                        question.setCategories(categories);
                        question.setText(text);
                        question.setMultipleResponse(type == QuestionType.MULTIPLE_RESPONE);
                        question.setMemo(memo);
                        int qRowNum = row.getRowNum();
                        int optionsCount = 0;
                        int correctOptionsCount = 0;
                        List<QuestionChoiceOptionDTO> options = new ArrayList<>();
                        do {
                            rowIterator.next();
                            QuestionChoiceOptionDTO option = new QuestionChoiceOptionDTO();
                            XSSFRow optionRow = sheet.getRow(qRowNum + ++optionsCount);

                            // 題目
                            String optionText = getStringCellValue(columnIndexMap, optionRow, HeaderColumn.TEXT);
                            option.setText(optionText);

                            // 答案
                            String optionCorrect = getStringCellValue(columnIndexMap, optionRow, HeaderColumn.ANSWER);
                            if (validAnswers.contains(optionCorrect)) {
                                boolean correct = "O".equals(optionCorrect);
                                if (correct) {
                                    correctOptionsCount++;
                                }
                                option.setCorrect(correct);

                            } else {
                                throw new RuntimeException("Unsupported answer text for option row: " + optionRow);
                            }

                            // 備註
                            String optionMemo = getStringCellValue(columnIndexMap, optionRow, HeaderColumn.MEMO);
                            option.setMemo(optionMemo);

                            options.add(option);
                        }
                        while (rowIterator.hasNext() && rowColumnIsEmpty(columnIndexMap, sheet.getRow(qRowNum + optionsCount + 1), HeaderColumn.TYPE)
                            && !rowColumnIsEmpty(columnIndexMap, sheet.getRow(qRowNum + optionsCount + 1), HeaderColumn.ANSWER));

                        if (type == QuestionType.MULTIPLE_RESPONE && correctOptionsCount == 0) {
                            throw new RuntimeException("Multiple response question should have at least one correct option: " + question);
                        } else if (type == QuestionType.CHOICE && correctOptionsCount != 1) {
                            throw new RuntimeException("Choice question must have exact one correct answer: " + question);
                        }

                        questions.add(new QuestionChoiceAndOptionsDTO(question, options));
                    }
                    break;

                    case ESSAY: {
                        QuestionEssayDTO question = new QuestionEssayDTO();
                        question.setCategories(categories);
                        question.setText(text);
                        question.setAnswer(answer);
                        question.setMemo(memo);

                        questions.add(question);
                    }
                }
            }
        }
        return questions;
    }

    private String render(Row row) {
        if (row == null) {
            return "null row";
        } else {
            return row.getRowNum() + ": " + Joiner.on(" ").join(row.cellIterator());
        }
    }

    private String getStringCellValue(BiMap<HeaderColumn, Integer> columnIndexMap, Row row, HeaderColumn column) {
        Integer cellNum = columnIndexMap.get(column);
        if (cellNum == null) {
            return null;
        }
        Cell cell = row.getCell(cellNum);
        if (cell == null) {
            return null;
        }
        String value = cell.getStringCellValue();
        if (value == null) {
            return null;
        }
        return value.trim();
    }

    private boolean rowColumnIsEmpty(BiMap<HeaderColumn, Integer> columnIndexMap, Row row, HeaderColumn type) {
        String cellValue = getStringCellValue(columnIndexMap, row, type);
        return cellValue == null || cellValue.isEmpty();
    }
}
