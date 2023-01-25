package com.training.ncr.mapper.admin;

import com.training.ncr.vo.admin.ExamGrpVO;
import com.training.ncr.vo.admin.ExamVO;
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
}
