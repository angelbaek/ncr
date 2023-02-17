package com.training.ncr.mapper.user;

import com.training.ncr.vo.UserVO;
import com.training.ncr.vo.admin.ExamGrpVO;
import com.training.ncr.vo.admin.ExamHintVO;
import com.training.ncr.vo.admin.ExamVO;
import com.training.ncr.vo.user.*;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Map;

@Mapper
public interface UserStaticsMapper {

    // 개인현황 조회하기
    List<ExamStatVO> selectUser(UserStaticsVO userStaticsVO);

    // 팀현황 조회하기
    List<ExamStatTeamVO> selectTeam(UserStaticsVO userStaticsVO);

    // 훈련자 기관명 가져오기
    UserVO selectUserOrgByUserId(String id);

    // 선택한 훈련자 풀이현황 가져오기
    List<ExamResultVO> selectExamResult(ExamResultVO examResultVO);

    // ExamStat 테이블 stat_id로 유저 아이디 가져오기
    String getUserIdByExamStatId(int stat_id);

    // 선택한 훈련팀별 세부사항 가져오기
    List<ExamStatTeamVO> getExamResultTeam(ExamResultTeamVO examResultTeamVO);

    // 선택한 팀에 해당하는 매트릭스 스탯 가져오기
    List<Map<String,Object>> getMatrixStat(MatrixStatVO matrixStatVO);

    // 선택한 팀에 해당하는 매트릭스, 전술단계 가져오기
    List<Map<String,Object>> getMiterAttackMatrix(int tr_exam_grpid);

    // 매트릭스 id, grp, num, grpid로 최대항수, 실제 항수 구하기
    Map<String, Object> getTotalAnsCorrectTrue(MatrixStatVO matrixStatVO);

    // 해당문제 기본 시간 가져오기
    int getTotalTime(int tr_exam_grpid);
}
