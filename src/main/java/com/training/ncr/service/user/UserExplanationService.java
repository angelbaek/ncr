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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.List;

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
        UserVO userVO = userExplanationMapper.getMyInfoByUserId(userId);
        // vo에 아이디 저장, grp 저장
        examStatVO.setTr_user_id(userId);
        examStatVO.setTr_user_grp(userVO.getTr_user_grp());
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
        UserVO userVO = userExplanationMapper.getMyInfoByUserId(userId);
        examStatTeamVO.setTr_user_grp(userVO.getTr_user_grp());
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

    // 첫 훈련자별, 훈련팀별 풀이 상세정보 insert
    public int insertTrainExamResultAndTeam(ExamResultVO examResultVO, HttpServletRequest request){
        HttpSession session = request.getSession();
        String userId = (String) session.getAttribute("USERID");
        examResultVO.setTr_user_id(userId);

        UserVO userVO = userExplanationMapper.getMyInfoByUserId(userId);

        ExamResultTeamVO examResultTeamVO = new ExamResultTeamVO();

        // examResultTeamVO 셋업
        examResultTeamVO.setTr_user_grp(userVO.getTr_user_grp());
        examResultTeamVO.setTeam_cd(userVO.getTeam_cd());
        examResultTeamVO.setTr_num(examResultVO.getTr_num());
        examResultTeamVO.setTr_exam_grpid(examResultVO.getTr_exam_grpid());
        examResultTeamVO.setTr_exam_id(examResultVO.getTr_exam_id());

        // 사전 체크 db (훈련자)
        List<ExamResultVO> examResultVO1 = userExplanationMapper.checkExamResultVO(examResultVO);
        List<ExamResultTeamVO> examResultTeamVOS = userExplanationMapper.checkExamResultTeamVO(examResultTeamVO);
        if(examResultVO1.size()==0){ // 첫 db
            userExplanationMapper.insertTrainExamResult(examResultVO); // 훈련자 insert

        }
        if(examResultTeamVOS.size()==0){ // 첫 db
            userExplanationMapper.insertTrainExamResultTeam(examResultTeamVO); // 훈련팀별 insert
            return 1;
        }
        return 0;
    }

    // 힌트 메소드
    public int hintUsing(ExamResultVO examResultVO, HttpServletRequest request){
        ExamResultTeamVO examResultTeamVO = new ExamResultTeamVO();
        HttpSession session = request.getSession();
        String userId = (String) session.getAttribute("USERID");
        UserVO userVO = userExplanationMapper.getMyInfoByUserId(userId);
        // 인자값 set
        examResultVO.setTr_user_id(userId);
        examResultTeamVO.setTr_exam_grpid(examResultVO.getTr_exam_grpid());
        examResultTeamVO.setTr_num(examResultVO.getTr_num());
        examResultTeamVO.setTr_exam_id(examResultVO.getTr_exam_id());
        examResultTeamVO.setTr_user_grp(userVO.getTr_user_grp());
        examResultTeamVO.setTeam_cd(userVO.getTeam_cd());
        examResultTeamVO.setResult_score(examResultVO.getResult_score());
        // 힌트 사용여부 check
        int check = userExplanationMapper.checkHintUsing(examResultTeamVO);
        System.out.println("힌트사용"+check);
        if(check==1){ // 사용

        }else if(check==0){ // 미사용
            System.out.println("감점:"+examResultTeamVO.getResult_score());
            System.out.println("감점:"+examResultVO.getResult_score());
            userExplanationMapper.firstHintUsingTeam(examResultTeamVO);
            userExplanationMapper.firstHintUsingUser(examResultVO);
            return 0;
        }
        return 1;
    }

    // 정답확인 메소드( 객관식{복수정답 포함} )
    public int inputAnswerMuiltiple(@RequestBody ExamResultTeamVO examResultTeamVO, HttpServletRequest request){
        HttpSession session = request.getSession();
        // 유저 기입 답
        String userAns = examResultTeamVO.getInput_answer();
        // 유저 id로 정보 가져오기(grp, team_cd)
        String userId = (String) session.getAttribute("USERID");
        UserVO userVO = userExplanationMapper.getMyInfoByUserId(userId);

        // examResultTeamVO에 set(grp, team_cd)
        examResultTeamVO.setTr_user_grp(userVO.getTr_user_grp());
        examResultTeamVO.setTeam_cd(userVO.getTeam_cd());
        examResultTeamVO.setAnswer_user_id(userId);

        // 문제그룹id로 정보 가져오기 (2차 풀이여부, 2차 풀이 감점)
        ExamGrpVO examGrpVO = userExplanationMapper.getExamGrpInfo(examResultTeamVO.getTr_exam_grpid());
        int allow = examGrpVO.getTr_allow_secans();
        int deduct = examGrpVO.getTr_secans_deduct();
        System.out.println("2차 풀이여부:"+allow+" 감점:"+deduct);

        // 문제id로 정보 가져오기(정답, 배점)
        ExamVO examVO = userExplanationMapper.getExamInfo(examResultTeamVO.getTr_exam_id());
        String ans = examVO.getTr_exam_ans();
        int point = examVO.getTr_exam_point();

        examResultTeamVO.setResult_score(deduct); // 2차 풀이 감점
        examResultTeamVO.setPoint(point); // 배점
        // 정답 입력횟수 받아오기
        int tryAns = userExplanationMapper.checkTryAns(examResultTeamVO);
        System.out.println("남아 있는 횟수:"+tryAns);
        if(allow==1){ // 2차 풀이 활성화
            //정답 입력횟수가 남아있는지 check
            if(tryAns==0){
                if(userAns.equals(ans)){ // 정답일때
                    userExplanationMapper.firstAnsEqualsAnsMulti(examResultTeamVO);
                    return 9;
                }else{ // 오답
                    userExplanationMapper.firstAnsNotAnsMulti(examResultTeamVO);
                    return 8;
                }
            }else if(tryAns==1){ // 남아있음 (1번 품)
                if(userAns.equals(ans)){ // 정답일때
                    userExplanationMapper.secondAnsEqualsAnsMulti(examResultTeamVO);
                    return 9;
                }else{ // 오답
                    userExplanationMapper.secondAnsNotAnsMulti(examResultTeamVO);
                    return 8;
                }
            }else if(tryAns==2){ // 없음
                return 0;
            }
        }else{ // 비활성화
            //정답 입력횟수가 남아있는지 check
            if(tryAns==0){ // 남아있음 (1번 품)
                if(userAns.equals(ans)){ // 정답일때
                    userExplanationMapper.secondAnsEqualsAnsMulti(examResultTeamVO);
                    return 9;
                }else{ // 오답
                    userExplanationMapper.secondAnsNotAnsMulti(examResultTeamVO);
                    return 8;
                }
            }else if(tryAns==1){ // 없음
                return 0;
            }
        }
        return 3;
    }

    // 정답확인 메소드( 주관식 )
    public int inputAnswerShortForm(@RequestBody ExamResultTeamVO examResultTeamVO, HttpServletRequest request) {
        System.out.println("주관식 실행중...");
        HttpSession session = request.getSession();
        // 유저 기입 답
        String userAns = examResultTeamVO.getInput_answer();
        // 공백 제거
        userAns = userAns.trim();
        userAns = userAns.replace(" ", "");
        // 유저 id로 정보 가져오기(grp, team_cd)
        String userId = (String) session.getAttribute("USERID");
        UserVO userVO = userExplanationMapper.getMyInfoByUserId(userId);

        // examResultTeamVO에 set(grp, team_cd)
        examResultTeamVO.setTr_user_grp(userVO.getTr_user_grp());
        examResultTeamVO.setTeam_cd(userVO.getTeam_cd());
        examResultTeamVO.setAnswer_user_id(userId);

        // 문제그룹id로 정보 가져오기 (2차 풀이여부, 2차 풀이 감점)
        ExamGrpVO examGrpVO = userExplanationMapper.getExamGrpInfo(examResultTeamVO.getTr_exam_grpid());
        int allow = examGrpVO.getTr_allow_secans();
        int deduct = examGrpVO.getTr_secans_deduct();
        System.out.println("2차 풀이여부:"+allow+" 감점:"+deduct);

        // 문제id로 정보 가져오기(정답, 배점)
        ExamVO examVO = userExplanationMapper.getExamInfo(examResultTeamVO.getTr_exam_id());
        String ans = examVO.getTr_exam_ans();
        // 공백 제거
        ans = ans.trim();
        ans = ans.replace(" ", "");

        int point = examVO.getTr_exam_point();

        examResultTeamVO.setResult_score(deduct); // 2차 풀이 감점
        examResultTeamVO.setPoint(point); // 배점

        // 정답 입력횟수 받아오기
        int tryAns = userExplanationMapper.checkTryAns(examResultTeamVO);
        System.out.println("남아 있는 횟수:"+tryAns);

        if(allow==1){ // 2차 풀이 활성화
            //정답 입력횟수가 남아있는지 check
            if(tryAns==0){
                if(userAns.equals(ans)){ // 정답일때
                    userExplanationMapper.firstAnsEqualsAnsMulti(examResultTeamVO);
                    return 9;
                }else{ // 오답
                    userExplanationMapper.firstAnsNotAnsMulti(examResultTeamVO);
                    return 8;
                }
            }else if(tryAns==1){ // 남아있음 (1번 품)
                if(userAns.equals(ans)){ // 정답일때
                    userExplanationMapper.secondAnsEqualsAnsMulti(examResultTeamVO);
                    return 9;
                }else{ // 오답
                    userExplanationMapper.secondAnsNotAnsMulti(examResultTeamVO);
                    return 8;
                }
            }else if(tryAns==2){ // 없음
                return 0;
            }
        }else{ // 비활성화
            //정답 입력횟수가 남아있는지 check
            if(tryAns==0){ // 남아있음 (1번 품)
                if(userAns.equals(ans)){ // 정답일때
                    userExplanationMapper.secondAnsEqualsAnsMulti(examResultTeamVO);
                    return 9;
                }else{ // 오답
                    userExplanationMapper.secondAnsNotAnsMulti(examResultTeamVO);
                    return 8;
                }
            }else if(tryAns==1){ // 없음
                return 0;
            }
        }
        return 3;
    }

    // 문제 그룹 정보 가져오기
    public ExamGrpVO getExamGrpVO(int tr_exam_grpid){
        return userExplanationMapper.getExamGrpVO(tr_exam_grpid);
    }
}
