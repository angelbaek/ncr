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

    // 나의 id로 훈련팀별 풀이 현황 db조회
    List<ExamStatVO> selectByTeamcd(String team_cd);

    // hint update (훈련자)
    int hintUpdate(ExamResultVO examResultVO);

    // hint update (훈련팀)
    int hintUpdateTeam(ExamResultTeamVO examResultTeamVO);

    // hint insert (훈련자)
    int hintInsert(ExamResultVO examResultVO);

    // hint insert (훈련팀)
    int hintInsertTeam(ExamResultTeamVO examResultTeamVO);

    // 나의 id로 내 정보 가져오기
    UserVO getMyInfoByUserId(String tr_user_id);

    // 훈련자 힌트 사용 점수
    int updateResultSumUser(ExamStatVO examStatVO);

    // 훈련팀별 힌트 사용 점수
    int updateResultSumTeam(ExamStatTeamVO examStatTeamVO);

    // 해당하는 문제 답안,배점 가져오기
    ExamVO getExamAnsAndPoint(ExamVO examVO);

    // 문제 그룹정보 가져오기
    ExamGrpVO getExamGrpVO(int tr_exam_grpid);

    // 정답 입력횟수 남아있는지 가져오기
    ExamResultTeamVO checkCntTryAns(ExamResultTeamVO examResultTeamVO);

    // 첫 정답입력
    int insertFirstUserAnswer(ExamResultTeamVO examResultTeamVO);

    // 유저가 입력한 답이 정답일때
    int userInputAnswerEqualsAnswer(ExamResultTeamVO examResultTeamVO);
}
