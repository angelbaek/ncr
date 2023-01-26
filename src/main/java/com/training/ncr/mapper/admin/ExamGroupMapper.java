package com.training.ncr.mapper.admin;

import com.training.ncr.vo.admin.ExamGrpVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ExamGroupMapper {

    // 문제 그룹목록 가져오기
    List<ExamGrpVO> getExamGrp();

    // 문제 그룹목록 추가
    int insertExamGrp(ExamGrpVO examGrpVO);

    int insertTrainMgmt(String name, int time);

    // 그룹명 중복 체크
    ExamGrpVO overlapCheck(String name);

    // 삭제를 위한 조회
    int selectMgmtState(String grp);

    public List<ExamGrpVO> getExamGrpSelect(int num);

    //삭제
    int getExamGrpDelete(String name);
}
