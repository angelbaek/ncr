package com.training.ncr.mapper.admin;

import com.training.ncr.vo.admin.ExamGrpVO;
import com.training.ncr.vo.admin.ExamHintVO;
import com.training.ncr.vo.admin.ExamVO;
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

    // 삭제
    int getExamGrpDelete(String name);

    // 그룹명으로 grpid 조회
    List<ExamGrpVO> findByGrpid(String name);

    // TRAIN_EXAM 테이블 INSERT
    int insertTrainExam(ExamGrpVO examGrpVO);

    // GRPID로 EXAMID 조회하기
    List<ExamVO> findExamidByGrpid(int tr_exam_grpid);

    // GrpId, ExamId로 ExamHint insert
    int insertExamhintByGrpIdAndExamId(ExamHintVO examHintVO);

    // 문제그룹 수정(update)
    int updateGrpByGrpName(ExamGrpVO examGrpVO);

    // 문제이름으로 문제그룹의 문제갯수 가져오기
    int getExamCountByGrpName(String tr_exam_grpname);
}
