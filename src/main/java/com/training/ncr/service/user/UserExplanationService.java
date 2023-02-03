package com.training.ncr.service.user;

import com.training.ncr.mapper.user.UserExplanationMapper;
import com.training.ncr.vo.UserVO;
import com.training.ncr.vo.user.ExamResultTeamVO;
import com.training.ncr.vo.user.ExamResultVO;
import com.training.ncr.vo.user.ExamStatTeamVO;
import com.training.ncr.vo.user.ExamStatVO;
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

    // hint 사용 메소드
    public int hintUsing(ExamResultVO examResultVO, HttpServletRequest request){
        HttpSession session = request.getSession();
        // 유저 아이디
        String userId = (String) session.getAttribute("USERID");
        examResultVO.setTr_user_id(userId);
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
        // 나의 아이디로 내 정보값 대입
        UserVO userVO = userExplanationMapper.getMyInfoByUserId(userId);
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
            // 훈려님별 풀이 상세 정보 저장
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
}
