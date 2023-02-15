package com.training.ncr.mapper.user;

import com.training.ncr.vo.UserVO;
import com.training.ncr.vo.admin.ExamGrpVO;
import com.training.ncr.vo.admin.ExamHintVO;
import com.training.ncr.vo.admin.ExamVO;
import com.training.ncr.vo.admin.MgmtVO;
import com.training.ncr.vo.user.*;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface UserExplanationMapper {
    // 첫 사용자 훈련 진입 시 db insert
    int insertUserTrainExamStat(ExamStatVO examStatVO);

    // 뒤늦은 사용자 훈련 진입 시 db insert
    int laterInsertUserTrainExamStat(ExamStatVO examStatVO);

    // 나의 id로 훈련자별 풀이 현황 db조회
    List<ExamStatVO> selectByUserID(ExamStatVO examStatVO);

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

    // 해당 힌트 가져오기
    List<ExamHintVO> getHint(ExamHintVO examHintVO);

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

    // 2차 풀이 활성화인데 1차에서 정답일때(객관식,주관식) and 힌트사용
    int firstAnsEqualsAnsMultiAndHintUse(ExamResultTeamVO examResultTeamVO);

    // 2차 풀이에서 정답일때(객관식,주관식) and 힌트사용
    int secondAnsEqualsAnsMultiAndHintUser(ExamResultTeamVO examResultTeamVO);

    // 오답 점수 update
    int wrongScoreUpdate(ExamResultTeamVO examResultTeamVO);

    // 2차 풀이에서 정답일때(객관식)
    int secondAnsEqualsAnsMulti(ExamResultTeamVO examResultTeamVO);

    // 2차 풀이에서 오답일때(객관식)
    int secondAnsNotAnsMulti(ExamResultTeamVO examResultTeamVO);

    // 풀이 중인 훈련자 팀 가져오기
    List<ExamResultTeamVO> getExamResultTeamInfo(ExamResultTeamVO examResultTeamVO);

    // 정답일때 획득한 점수 가져오기(훈련팀별 점수) 훈련자에 뿌려주기 위함
    int getResultScoreForUser(ExamResultTeamVO examResultTeamVO);

    // 훈련자 풀이 상세 정보(정답)
    int examResultAnsEqualsAns(ExamResultVO examResultVO);

    // 훈련자 풀이 상세 정보(오답)
    int examResultAnsNotAns(ExamResultVO examResultVO);

    // 뒤늦게 시작한 훈련자의 훈련팀 시작 시간 가져오기
    String laterUserGetTeamStartTime(ExamStatTeamVO examStatTeamVO);

    // 훈련 시작한 시간 가져오기
    String startTrainingGetTime(ExamStatTeamVO examStatTeamVO);

    // 훈련팀별 풀이 현황정보 정답 수 update
    int countAnsExamResultTeam(ExamResultTeamVO examResultTeamVO);

    // 풀이 개수, 정답점수, 오답점수, 힌트점수 가져오기
    Map<String,Object> getTotalStatus(ExamResultTeamVO examResultTeamVO);

    // 풀이 개수, 정답점수, 오답점수, 힌트점수 가져오기(2차 풀이 비활성화)
    Map<String,Object> getTotalStatusNoneAllow(ExamResultTeamVO examResultTeamVO);

    // 정답 수 UPDATE (훈련팀별)
    int updateCntCorrectAnsTeam(ExamResultTeamVO examResultTeamVO);

    // 오답 수 UPDATE (훈련팀별)
    int updateCntFalseAnsTeam(ExamResultTeamVO examResultTeamVO);

    // 총 점수 UPDATE (훈련팀별)
    int updateResultSumTeam(ExamResultTeamVO examResultTeamVO);

    // 정답 수 UPDATE (훈련자별)
    int updateCntCorrectAnsUser(ExamStatVO examStatVO);

    // 오답 수 UPDATE (훈련자별)
    int updateCntFalseAnsUser(ExamStatVO examStatVO);

    // 총 점수 UPDATE (훈련자별)
    int updateResultSumUser(ExamStatVO examStatVO);

    // 제출하기 이벤트 (훈련팀별)
    int updateSubmitTeam(ExamStatTeamVO examStatTeamVO);

    // 제출하기 이벤트 (훈련자별)
    int updateSubmitUser(ExamStatVO examStatVO);

    // 제출여부 check
    int checkSubmitTeam(ExamStatTeamVO examStatTeamVO);

    // 전술단계 id 가져오기
    Map<String,Object> getMaTacticsId();

    // 해당 문제에 대한 훈련팀 획득점수 가져오기
    int getTeamResultSore(ExamResultTeamVO examResultTeamVO);

    // 활성화된 문제그룹 이름 가져오기
    MgmtVO getGrpNameByMgmtStateOn();

    // 활성화된 문제그룹이름으로 문제그룹id 가져오기
    int getGrpIdByGrpName(String tr_exam_grpname);

    // 문제그룹id로 문제id, 전술단계, 매트릭스 가져오기
    List<Map<String,Object>> getGrpidAndMatrixAndTactics(int tr_exam_grpid);

    // 매트릭스 스탯 통계정보 저장
    int insertMatrixStat(MatrixStatVO matrixStatVO);

    // 매트릭스 스탯 정답체크
    int updateAnsToMatrixStat(ExamResultTeamVO examResultTeamVO);

}
