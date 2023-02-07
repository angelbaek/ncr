package com.training.ncr.mapper.user;

import com.training.ncr.vo.UserVO;
import com.training.ncr.vo.admin.ExamGrpVO;
import com.training.ncr.vo.admin.ExamVO;
import com.training.ncr.vo.user.ExamResultTeamVO;
import com.training.ncr.vo.user.ExamResultVO;
import com.training.ncr.vo.user.ExamStatTeamVO;
import com.training.ncr.vo.user.ExamStatVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface UserExplanationMapper {
    // 첫 사용자 훈련 진입 시 db insert
    int insertUserTrainExamStat(ExamStatVO examStatVO);

    // 나의 id로 훈련자별 풀이 현황 db조회
    List<ExamStatVO> selectByUserID(String id);

    // 나의 id로 팀코드 구하기
    String getTeamcodeByUserid(String id);

    // 첫 훈련팀별 풀이현황 db insert
    int insertExamstatTeam(ExamStatTeamVO examStatTeamVO);

    // // 첫 훈련자별, 훈련팀별 풀이 상세정보 insert를 하기위한 사전 check (db가 있는지)
    List<ExamResultVO> checkExamResultVO(ExamResultVO examResultVO);
    List<ExamResultTeamVO> checkExamResultTeamVO(ExamResultTeamVO examResultTeamVO);

    // 첫 훈련자별, 훈련팀별 풀이 상세정보 insert
    int insertTrainExamResult(ExamResultVO examResultVO);
    int insertTrainExamResultTeam(ExamResultTeamVO examResultTeamVO);

    // 힌트 사용여부 check
    int checkHintUsing(ExamResultTeamVO examResultTeamVO);

    // 힌트 첫 사용 update (훈련팀별)
    int firstHintUsingTeam(ExamResultTeamVO examResultTeamVO);
    // 힌트 첫 사용 update (훈련자별)
    int firstHintUsingUser(ExamResultVO examResultVO);

    // 문제그룹id로 정보 가져오기 (2차 풀이여부, 2차 풀이 감점)
    ExamGrpVO getExamGrpInfo(int tr_exam_grpid);
    // 문제id로 정보 가져오기(정답, 배점)
    ExamVO getExamInfo(int tr_exam_id);

    // 나의 id로 훈련팀별 풀이 현황 db조회
    List<ExamStatVO> selectByTeamcd(String team_cd);

    // 나의 id로 내 정보 가져오기
    UserVO getMyInfoByUserId(String tr_user_id);

    // 문제 그룹정보 가져오기
    ExamGrpVO getExamGrpVO(int tr_exam_grpid);

    // 정답 입력 횟수 남아있는지 check
    int checkTryAns(ExamResultTeamVO examResultTeamVO);

    // 2차 풀이 활성화인데 1차에서 오답일때(객관식)
    int firstAnsNotAnsMulti(ExamResultTeamVO examResultTeamVO);

    // 2차 풀이 활성화인데 1차에서 정답일때(객관식)
    int firstAnsEqualsAnsMulti(ExamResultTeamVO examResultTeamVO);

    // 2차 풀이에서 정답일때(객관식)
    int secondAnsEqualsAnsMulti(ExamResultTeamVO examResultTeamVO);

    // 2차 풀이에서 오답일때(객관식)
    int secondAnsNotAnsMulti(ExamResultTeamVO examResultTeamVO);

}
