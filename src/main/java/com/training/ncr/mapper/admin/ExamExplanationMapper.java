package com.training.ncr.mapper.admin;

import com.training.ncr.vo.NowExamVO;
import com.training.ncr.vo.admin.ExamHintVO;
import com.training.ncr.vo.admin.MgmtVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Objects;

@Mapper
public interface ExamExplanationMapper {

    // 문제 풀이 그룹 조회
    List<MgmtVO> searchMgmtState();

    // 훈련 시작한 문항과 문제그룹정보 가져오기
    List<NowExamVO> getStartExamAndGrp(String grpName);

    // 해당 힌트 가져오기
    List<ExamHintVO> getHintFunc(ExamHintVO examHintVO);
}
