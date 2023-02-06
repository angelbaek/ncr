package com.training.ncr.service.user;

import com.training.ncr.mapper.user.UserExplanationMapper;
import com.training.ncr.vo.UserVO;
import com.training.ncr.vo.admin.ExamGrpVO;
import com.training.ncr.vo.admin.ExamVO;
import com.training.ncr.vo.user.ExamResultTeamVO;
import com.training.ncr.vo.user.ExamResultVO;
import com.training.ncr.vo.user.ExamStatTeamVO;
import com.training.ncr.vo.user.ExamStatVO;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

@Service
public class UserExplanationService {

    @Autowired
    UserExplanationMapper userExplanationMapper;

    // 첫 사용자 훈련 진입 시 db insert
    public int insertUserTrainExamStat(ExamStatVO examStatVO, HttpServletRequest request){
        HttpSession session = request.getSession();
        // 유저 정보
        Object Object = session.getAttribute("USER");
        // 유저 아이디
        String userId = (String) session.getAttribute("USERID");
        // vo에 아이디 저장
        examStatVO.setTr_user_id(userId);
        System.out.println("세션에 저장된 아이디:"+userId);
        // 훈련자 풀이현황에 내가 있는지 확인하기
        if(userExplanationMapper.selectByUserID(examStatVO.getTr_user_id()).size()!=0){
            System.out.println("훈련 진행중...");
            return 0;
        }
        // 없으면 insert
        return userExplanationMapper.insertUserTrainExamStat(examStatVO);
    }

    // 첫 훈련팀별 풀이 현황 정보 db insert
    public int insertExamstatTeam(ExamStatTeamVO examStatTeamVO, HttpServletRequest request){
        HttpSession session = request.getSession();
        // 유저 아이디
        String userId = (String) session.getAttribute("USERID");
        // 나의 아이디로 훈련팀코드 받아서 setting
        String teamCd = userExplanationMapper.getTeamcodeByUserid(userId);
        examStatTeamVO.setTeam_cd(teamCd);
        System.out.println("팀코드:"+examStatTeamVO.getTeam_cd());
        // 훈련자 풀이현황에 내가 있는지 확인하기
        if(userExplanationMapper.selectByTeamcd(examStatTeamVO.getTeam_cd()).size()!=0){
            System.out.println("훈련 팀별 진행중...");
            return 0;
        }
        // db insert
        return userExplanationMapper.insertExamstatTeam(examStatTeamVO);
    }

    // 힌트 사용 메소드
    public int hintUsing(ExamResultVO examResultVO, HttpServletRequest request){
        HttpSession session = request.getSession();
        // 유저 아이디
        String userId = (String) session.getAttribute("USERID");
        examResultVO.setTr_user_id(userId);
        // 나의 아이디로 내 정보값 대입
        UserVO userVO = userExplanationMapper.getMyInfoByUserId(userId);
        // 힌트 사용 시 훈련자별 풀이 현황 점수를 위한 메소드 실행 후 매핑
        userExplanationMapper.updateResultSumUser(usingHintReturnExamStatForResultSum(examResultVO,userId));
        // 힌트 사용 시 훈련팀별 풀이 현황 점수를 위한 메소드 실행 후 매핑
        userExplanationMapper.updateResultSumTeam(usingHintReturnExamStatTeamForResultSum(examResultVO,userId));
        // vo 선언
        ExamResultTeamVO examResultTeamVO = new ExamResultTeamVO();
        // 힌트 값 -로 치환 첫 힌트 사용시에만
        int deduct = -(examResultVO.getResult_score());
        // 변환된 값 저장
        examResultVO.setResult_score(deduct);
        examResultTeamVO.setResult_score(deduct);
        // grp 대입
        examResultTeamVO.setTr_user_grp(userVO.getTr_user_grp());
        // team_cd 대입
        examResultTeamVO.setTeam_cd(userVO.getTeam_cd());
        // tr_num 대입
        examResultTeamVO.setTr_num(examResultVO.getTr_num());
        // grp id 대입
        examResultTeamVO.setTr_exam_grpid(examResultVO.getTr_exam_grpid());
        // exam id 대입
        examResultTeamVO.setTr_exam_id(examResultVO.getTr_exam_id());
        // 힌트 첫 입력
        if(userExplanationMapper.hintUpdate(examResultVO)==0){
            // 훈련팀별 풀이 상세 정보 저장
            userExplanationMapper.hintInsertTeam(examResultTeamVO);
            return userExplanationMapper.hintInsert(examResultVO);
        }
        // 힌트 업데이트 (팀별) - 위의 if문에서 이미 훈련자별 hint update했으므로 팀별만 update 후 리턴
        return userExplanationMapper.hintUpdateTeam(examResultTeamVO);
    }

    // 힌트 사용 시 훈련자별 풀이 현황 점수를 위한 메소드
    public ExamStatVO usingHintReturnExamStatForResultSum(ExamResultVO examResultVO, String userId){
        ExamStatVO examStatVO = new ExamStatVO();
        // 힌트 값 -로 치환 첫 힌트 사용시에만
        int deduct = -(examResultVO.getResult_score());
        // 힌트점수 저장
        examStatVO.setResult_sum(deduct);
        // tr num
        examStatVO.setTr_num(examResultVO.getTr_num());
        System.out.println("훈련자 별 tr_num:"+examStatVO.getTr_num());
        // grpid
        examStatVO.setTr_exam_grpid(examResultVO.getTr_exam_grpid());
        System.out.println("훈련자 grpId:"+examStatVO.getTr_exam_grpid());
        // userid
        examStatVO.setTr_user_id(userId);
        System.out.println("훈련자별 userid:"+examStatVO.getTr_user_id());
        return examStatVO;
    }
    // 힌트 사용 시 훈련팀별 풀이 현황 점수를 위한 메소드
    public ExamStatTeamVO usingHintReturnExamStatTeamForResultSum(ExamResultVO examResultVO, String userId){
        ExamStatTeamVO examStatTeamVO = new ExamStatTeamVO();
        // 나의 아이디로 내 정보값 대입
        UserVO userVO = userExplanationMapper.getMyInfoByUserId(userId);
        // team_Cd
        examStatTeamVO.setTeam_cd(userVO.getTeam_cd());
        // 힌트 값 -로 치환 첫 힌트 사용시에만
        int deduct = -(examResultVO.getResult_score());
        // 힌트점수 저장
        examStatTeamVO.setResult_sum(deduct);
        // tr num
        examStatTeamVO.setTr_num(examResultVO.getTr_num());
        // grpid
        examStatTeamVO.setTr_exam_grpid(examResultVO.getTr_exam_grpid());
        System.out.println("훈련팀별 감점:"+examStatTeamVO.getResult_sum());
        return examStatTeamVO;
    }

    // 정답확인 메소드( 객관식{복수정답 포함} )
    public int inputAnswerMuiltiple(ExamResultTeamVO examResultTeamVO, HttpServletRequest request){
        HttpSession session = request.getSession();

        // 유저 아이디
        String userId = (String) session.getAttribute("USERID");

        // 나의 아이디로 내 정보값 대입
        UserVO userVO = userExplanationMapper.getMyInfoByUserId(userId);

        // 팀코드
        examResultTeamVO.setTeam_cd(userVO.getTeam_cd());

        // 해당하는 문제 답안,배점 가져오기
        ExamVO examVO = new ExamVO();
        examVO.setTr_exam_id(examResultTeamVO.getTr_exam_id());
        examVO.setTr_exam_grpid(examResultTeamVO.getTr_exam_grpid());
        examVO = userExplanationMapper.getExamAnsAndPoint(examVO);

        // grp 셋업
        examResultTeamVO.setTr_user_grp(userVO.getTr_user_grp());
        // 유저가 기입한 정답
        String userAnswer = examResultTeamVO.getInput_answer();

        // 정답, 배점
        String answer = examVO.getTr_exam_ans();
        int point = examVO.getTr_exam_point();

        // 문제 그룹정보 가져오기
        ExamGrpVO examGrpVO = getExamGrpVO(examResultTeamVO.getTr_exam_grpid());

        // 2차 풀이 여부
        int allowSecans = examGrpVO.getTr_allow_secans();
        System.out.println("2차 풀이여부: "+allowSecans);
        System.out.println("유저 입력 답:"+userAnswer+" 실제 답:"+answer);
        // 2차 풀이 활성화
        if (allowSecans==1){
            // 정답 입력횟수 남아있는지 check
            try {
                ExamResultTeamVO examResultTeamVO1 = new ExamResultTeamVO();
                examResultTeamVO1 = userExplanationMapper.checkCntTryAns(settingExamResultTeamVOForGetExamGrpVO(userVO, examResultTeamVO));
                int checkCntTryAns =examResultTeamVO1.getCnt_try_ans();
                System.out.println("정답 입력횟수:"+examResultTeamVO1.getCnt_try_ans());
                // 2차 풀이 다 씀
                if(checkCntTryAns==2){
                    return 2;
                }
                // 정답인지 check
                if(userAnswer.equals(answer)){
                    examResultTeamVO.setAnswer_user_id(userId);
                    examResultTeamVO.setResult_score(point);
                    System.out.println("배점:"+examResultTeamVO.getResult_score());
                    userExplanationMapper.userInputAnswerEqualsAnswer(examResultTeamVO);
                }
                // 정답이 아닐때

            }catch (NullPointerException e){
                // 첫 정답 입력일때 훈련팀별 풀이 상세 정보 insert
                userExplanationMapper.insertFirstUserAnswer(examResultTeamVO);
                return 3;
            }
        }
        return 0;
    }
    // 정답 입력횟수 남아있는지 check하기 위한 훈련팀별 풀이 상세정보 셋업
    public ExamResultTeamVO settingExamResultTeamVOForGetExamGrpVO(UserVO userVO, ExamResultTeamVO examResultTeamVO){
        ExamResultTeamVO examResultTeamVO1 = new ExamResultTeamVO();
        // 훈련자 지정그룹 setup
        examResultTeamVO1.setTr_user_grp(userVO.getTr_user_grp());
        // 훈련자 팀코드
        examResultTeamVO1.setTeam_cd(userVO.getTeam_cd());
        // 훈련 차시
        examResultTeamVO1.setTr_num(examResultTeamVO.getTr_num());
        // 문제 그룹id
        examResultTeamVO1.setTr_exam_grpid(examResultTeamVO.getTr_exam_grpid());
        // 문제 id
        examResultTeamVO1.setTr_exam_id(examResultTeamVO.getTr_exam_id());
        return examResultTeamVO1;
    }

    // 문제 그룹 정보 가져오기
    public ExamGrpVO getExamGrpVO(int tr_exam_grpid){
        return userExplanationMapper.getExamGrpVO(tr_exam_grpid);
    }
}
