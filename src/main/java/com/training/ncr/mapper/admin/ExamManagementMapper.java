package com.training.ncr.mapper.admin;

import com.training.ncr.vo.admin.ExamGrpVO;
import com.training.ncr.vo.admin.ExamHintVO;
import com.training.ncr.vo.admin.ExamVO;
import com.training.ncr.vo.admin.TacticsVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ExamManagementMapper {

    // 문제 그룹목록 가져오기
    List<ExamGrpVO> getExamGrp();

    // 선택된 그룹명 문항수 가져오기
    List<ExamGrpVO> getExamGrpCount(int grpId);

    // 선택한 문제 내용 가져오기
    List<ExamVO> getExam(ExamVO examVO);

    // 선택한 문항이 설정되지 않았을때
    int insertNoneExam(ExamVO examVO);

    // 선택한 문항 문제id 가져오기
    List<ExamVO> examIdGet(ExamVO examVO);

    // 힌트 db 추가
    int hintInsert(ExamHintVO examHintVO);

    // 힌트 업데이트
    int hintUpdate(ExamHintVO examHintVO);

    // 그룹에 힌트 업데이트
    int hintUpdateExam(ExamHintVO examHintVO);

    // 문제id만 가져오기
    String getExamId(ExamVO examVO);

    // 전술단계 가져오기
    List<TacticsVO> getTactics();

    // 전술단계 저장
    int updateTactics(ExamVO examVO);

    // 문제 최종저장
    int updateExamFinal(ExamVO examVO);
}
