package com.training.ncr.service.user;

import com.training.ncr.mapper.user.UserExplanationMapper;
import com.training.ncr.vo.UserVO;
import com.training.ncr.vo.admin.*;
import com.training.ncr.vo.user.*;
import org.apache.catalina.User;
import org.apache.ibatis.binding.BindingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
public class UserExplanationService {

    @Autowired
    UserExplanationMapper userExplanationMapper;

    // 첫 사용자 훈련 진입 시 db insert
    public int insertUserTrainExamStat(ExamStatVO examStatVO, HttpServletRequest request){
        HttpSession session = request.getSession();
        // 유저 아이디
        String userId = (String) session.getAttribute("USERID");
        UserVO userVO = userExplanationMapper.getMyInfoByUserId(userId);

        // vo에 아이디 저장, grp 저장
        examStatVO.setTr_user_id(userId);
        examStatVO.setTr_user_grp(userVO.getTr_user_grp());

        System.out.println("세션에 저장된 아이디:"+userId);
        // 뒤늦게 시작한 훈련자의 훈련팀 시작 시간 가져오기 위한 객체 대입
        ExamStatTeamVO examStatTeamVO = new ExamStatTeamVO();
        examStatTeamVO.setTr_user_grp(userVO.getTr_user_grp());
        examStatTeamVO.setTeam_cd(userVO.getTeam_cd());
        examStatTeamVO.setTr_num(examStatVO.getTr_num());
        // 뒤늦게 시작한 훈련자의 훈련팀 시작 시간 가져오기
        examStatTeamVO.setTr_exam_grpid(examStatVO.getTr_exam_grpid());

        String time = userExplanationMapper.laterUserGetTeamStartTime(examStatTeamVO);
        System.out.println("시작한 시간: "+time);

        if(time!=null){ // 이미 시작한 팀
            // 훈련자 풀이현황에 내가 있는지 확인하기
            if(userExplanationMapper.selectByUserID(examStatVO).size()!=0){ // 내가 시작했는지
                System.out.println("훈련 진행중...");
                return 0;
            }else{ // 다른 훈련자가 같은팀으로 시작
                examStatVO.setStart_time(time);
                System.out.println("다른 훈련자가 같은팀으로 시작!!");
                userExplanationMapper.laterInsertUserTrainExamStat(examStatVO);
            }
        }else{ // 신규 시작
            userExplanationMapper.insertUserTrainExamStat(examStatVO);
        }
        return 1;
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
        setMatrixStat(request);
        return userExplanationMapper.insertExamstatTeam(examStatTeamVO);
    }

    public void setMatrixStat(HttpServletRequest request){
        HttpSession session = request.getSession();
        // 유저 아이디
        String userId = (String) session.getAttribute("USERID");
        UserVO userVO = userExplanationMapper.getMyInfoByUserId(userId);

        MatrixStatVO matrixStatVO = new MatrixStatVO(); // ioc
        MgmtVO mgmtVO =userExplanationMapper.getGrpNameByMgmtStateOn(); // 활성화된 grpname, tr_num get
        String tr_exam_grpname = mgmtVO.getTr_exam_grp(); // grp이름
        int num = mgmtVO.getTr_num(); // 차시
        int grpId = userExplanationMapper.getGrpIdByGrpName(tr_exam_grpname); // 활성화된 grpid get
        List<Map<String,Object>> stringObjectMap =userExplanationMapper.getGrpidAndMatrixAndTactics(grpId); // 문제그룹id로 문제id, 전술단계, 매트릭스 가져오기

        // setup
        matrixStatVO.setTr_user_grp(userVO.getTr_user_grp());
        matrixStatVO.setTeam_cd(userVO.getTeam_cd());
        matrixStatVO.setTr_num(num);
        matrixStatVO.setTr_exam_grpid(grpId);

        for(int i=0; i<stringObjectMap.size(); i++){
            int tr_exam_id = (int) stringObjectMap.get(i).get("TR_EXAM_ID");
            String ma_tactics_id = (String) stringObjectMap.get(i).get("MA_TACTICS_ID");
            int ma_matrix_id= (int) stringObjectMap.get(i).get("MA_MATRIX_ID");
            // setup
            matrixStatVO.setTr_exam_id(tr_exam_id);
            matrixStatVO.setMa_tactics_id(ma_tactics_id);
            matrixStatVO.setMa_matrix_id(ma_matrix_id);
            userExplanationMapper.insertMatrixStat(matrixStatVO);
        }
        System.out.println(stringObjectMap.size());
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

    // 해당 힌트 가져오기
    public List<ExamHintVO> getHint(ExamHintVO examHintVO){
        return userExplanationMapper.getHint(examHintVO);
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

        // 문제그룹id로 정보 가져오기 (2차 풀이여부, 2차 풀이 감점, 힌트감점)
        ExamGrpVO examGrpVO = userExplanationMapper.getExamGrpInfo(examResultTeamVO.getTr_exam_grpid());
        int allow = examGrpVO.getTr_allow_secans();
        int deduct = examGrpVO.getTr_secans_deduct();
        int hintDeduct = examGrpVO.getTr_hint_deduct();
        System.out.println("2차 풀이여부:"+allow+" 감점:"+deduct+" 힌트감점:"+hintDeduct);

        // 문제id로 정보 가져오기(정답, 배점)
        ExamVO examVO = userExplanationMapper.getExamInfo(examResultTeamVO.getTr_exam_id());
        String ans = examVO.getTr_exam_ans();
        int point = examVO.getTr_exam_point();

        examResultTeamVO.setResult_score(deduct); // 2차 풀이 감점
        examResultTeamVO.setPoint(point); // 배점
        examResultTeamVO.setHint(hintDeduct);

        // 정답 입력횟수 받아오기
        int tryAns = userExplanationMapper.checkTryAns(examResultTeamVO);
        System.out.println("남아 있는 횟수:"+tryAns);

        // 힌트 사용여부 check
        int check = userExplanationMapper.checkHintUsing(examResultTeamVO);
        System.out.println("힌트 사용 여부:"+check);

        // 훈련자 클래스 대입
        ExamResultVO examResultVO = new ExamResultVO();
        examResultVO.setInput_answer(userAns); // 입력 답
        examResultVO.setTr_user_id(userId); // 유저 id
        examResultVO.setTr_num(examResultTeamVO.getTr_num()); // 훈련 차시
        examResultVO.setTr_exam_grpid(examResultTeamVO.getTr_exam_grpid()); // grpid
        examResultVO.setTr_exam_id(examResultTeamVO.getTr_exam_id()); // 문제id

        // 훈련자 풀이현황 정보 set
        ExamStatVO examStatVO = new ExamStatVO();
        examStatVO.setTr_user_id(userId);
        examStatVO.setTr_user_grp(examResultTeamVO.getTr_user_grp());
        examStatVO.setTr_num(examResultTeamVO.getTr_num());
        examStatVO.setTr_exam_grpid(examResultTeamVO.getTr_exam_grpid());

        // 해당 문제에 대한 훈련팀 획득점수 가져오기
        int resultScore = userExplanationMapper.getTeamResultSore(examResultTeamVO);

        if(resultScore>0){ // 이미 정답을 맞춤
            return 0;
        }
        if(allow==1){ // 2차 풀이 활성화
            //정답 입력횟수가 남아있는지 check
            if(tryAns==0){ // 첫 정답확인
                if(userAns.equals(ans)){ // 정답일때
                    // 매트릭스 스탯 정답체크
                    userExplanationMapper.updateAnsToMatrixStat(examResultTeamVO);
                    if(check==1){ // 힌트 사용
                        userExplanationMapper.firstAnsEqualsAnsMultiAndHintUse(examResultTeamVO);
                    }else{ // 힌트 미사용
                        userExplanationMapper.firstAnsEqualsAnsMulti(examResultTeamVO);
                    }
                    // 오답 점수 set
                    examResultTeamVO.setWrong_score(deduct);
                    userExplanationMapper.wrongScoreUpdate(examResultTeamVO); // 오답점수 update
                    // 총 점 가져오기
                    int score = userExplanationMapper.getResultScoreForUser(examResultTeamVO);
                    examResultVO.setResult_score(score); // 점수 대입
                    // 훈련팀, 훈련자 update
                    userExplanationMapper.examResultAnsEqualsAns(examResultVO); // 훈련자 풀이 상세 db update
                    userExplanationMapper.updateCntCorrectAnsTeam(examResultTeamVO); // 정답수 update
                    userExplanationMapper.updateResultSumTeam(examResultTeamVO); // 총점 update
                    userExplanationMapper.updateCntCorrectAnsUser(examStatVO);
                    userExplanationMapper.updateResultSumUser(examStatVO);
                    return 9;
                }else{ // 오답
                    userExplanationMapper.examResultAnsNotAns(examResultVO); // 훈련자
                    userExplanationMapper.firstAnsNotAnsMulti(examResultTeamVO); // 훈련팀
                    return 8;
                }
            }else if(tryAns==1){ // 두번째 정답확인
                if(userAns.equals(ans)){ // 정답일때
                    // 매트릭스 스탯 정답체크
                    userExplanationMapper.updateAnsToMatrixStat(examResultTeamVO);
                    if(check==1){ // 힌트 사용
                        userExplanationMapper.secondAnsEqualsAnsMultiAndHintUser(examResultTeamVO);
                    }else{ // 힌트 미사용
                        userExplanationMapper.secondAnsEqualsAnsMulti(examResultTeamVO);
                    }
                    // 오답 점수 set
                    examResultTeamVO.setWrong_score(deduct);
                    userExplanationMapper.wrongScoreUpdate(examResultTeamVO); // 오답점수 update
                    // 총 점 가져오기
                    int score = userExplanationMapper.getResultScoreForUser(examResultTeamVO);
                    examResultVO.setResult_score(score); // 점수 대입
                    userExplanationMapper.examResultAnsEqualsAns(examResultVO); // 훈련자 풀이 상세 db update
                    userExplanationMapper.updateCntCorrectAnsTeam(examResultTeamVO); // 정답수 update
                    userExplanationMapper.updateResultSumTeam(examResultTeamVO); // 총점 update
                    userExplanationMapper.updateCntCorrectAnsUser(examStatVO);
                    userExplanationMapper.updateResultSumUser(examStatVO);
                    return 9;
                }else{ // 오답
                    userExplanationMapper.updateCntFalseAnsTeam(examResultTeamVO); // 오답수 update
                    userExplanationMapper.updateCntFalseAnsUser(examStatVO); // 오답수 update
                    userExplanationMapper.examResultAnsNotAns(examResultVO); // 훈련자
                    userExplanationMapper.secondAnsNotAnsMulti(examResultTeamVO); // 훈련팀
                    return 8;
                }
            }else if(tryAns==2){ // 정답확인 다 사용
                return 0;
            }
        }else{ // 비활성화
            //정답 입력횟수가 남아있는지 check
            if(tryAns==0){ // 남아있음 (1번 품)
                if(userAns.equals(ans)){ // 정답일때
                    if(check==1){ // 힌트 사용
                        userExplanationMapper.secondAnsEqualsAnsMultiAndHintUser(examResultTeamVO);
                    }else{ // 힌트 미사용
                        userExplanationMapper.secondAnsEqualsAnsMulti(examResultTeamVO);
                    }
                    // 오답 점수 set
                    examResultTeamVO.setWrong_score(deduct);
                    userExplanationMapper.wrongScoreUpdate(examResultTeamVO); // 오답점수 update
                    // 총 점 가져오기
                    int score = userExplanationMapper.getResultScoreForUser(examResultTeamVO);
                    examResultVO.setResult_score(score); // 점수 대입
                    userExplanationMapper.examResultAnsEqualsAns(examResultVO); // 훈련자 풀이 상세 db update
                    userExplanationMapper.updateCntCorrectAnsTeam(examResultTeamVO); // 정답수 update
                    userExplanationMapper.updateResultSumTeam(examResultTeamVO); // 총점 update
                    userExplanationMapper.updateCntCorrectAnsUser(examStatVO);
                    userExplanationMapper.updateResultSumUser(examStatVO);
                    return 9;
                }else{ // 오답
                    userExplanationMapper.updateCntFalseAnsTeam(examResultTeamVO); // 오답수 update
                    userExplanationMapper.updateCntFalseAnsUser(examStatVO); // 오답수 update
                    userExplanationMapper.examResultAnsNotAns(examResultVO); // 훈련자
                    userExplanationMapper.secondAnsNotAnsMulti(examResultTeamVO); // 훈련팀
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

        // 힌트 사용여부 check
        int check = userExplanationMapper.checkHintUsing(examResultTeamVO);
        System.out.println("힌트 사용 여부:"+check);

        // 정답 입력횟수 받아오기
        int tryAns = userExplanationMapper.checkTryAns(examResultTeamVO);
        System.out.println("남아 있는 횟수:"+tryAns);

        // 훈련자 클래스 대입
        ExamResultVO examResultVO = new ExamResultVO();
        examResultVO.setInput_answer(userAns); // 입력 답
        examResultVO.setTr_user_id(userId); // 유저 id
        examResultVO.setTr_num(examResultTeamVO.getTr_num()); // 훈련 차시
        examResultVO.setTr_exam_grpid(examResultTeamVO.getTr_exam_grpid()); // grpid
        examResultVO.setTr_exam_id(examResultTeamVO.getTr_exam_id()); // 문제id

        // 훈련자 풀이현황 정보 set
        ExamStatVO examStatVO = new ExamStatVO();
        examStatVO.setTr_user_id(userId);
        examStatVO.setTr_user_grp(examResultTeamVO.getTr_user_grp());
        examStatVO.setTr_num(examResultTeamVO.getTr_num());
        examStatVO.setTr_exam_grpid(examResultTeamVO.getTr_exam_grpid());

        // 해당 문제에 대한 훈련팀 획득점수 가져오기
        int resultScore = userExplanationMapper.getTeamResultSore(examResultTeamVO);

        if(resultScore>0){ // 이미 정답을 맞춤
            return 0;
        }
        if(allow==1){ // 2차 풀이 활성화
            //정답 입력횟수가 남아있는지 check
            if(tryAns==0){
                if(userAns.equals(ans)){ // 정답일때
                    // 매트릭스 스탯 정답체크
                    userExplanationMapper.updateAnsToMatrixStat(examResultTeamVO);
                    if(check==1){ // 힌트 사용
                        userExplanationMapper.firstAnsEqualsAnsMultiAndHintUse(examResultTeamVO);
                    }else{ // 힌트 미사용
                        userExplanationMapper.firstAnsEqualsAnsMulti(examResultTeamVO);
                    }
                    // 총 점 가져오기
                    int score = userExplanationMapper.getResultScoreForUser(examResultTeamVO);
                    examResultVO.setResult_score(score); // 점수 대입
                    userExplanationMapper.examResultAnsEqualsAns(examResultVO); // 훈련자 풀이 상세 db update
                    userExplanationMapper.updateCntCorrectAnsTeam(examResultTeamVO); // 정답수 update
                    userExplanationMapper.updateResultSumTeam(examResultTeamVO); // 총점 update
                    userExplanationMapper.updateCntCorrectAnsUser(examStatVO);
                    userExplanationMapper.updateResultSumUser(examStatVO);
                    return 9;
                }else{ // 오답
                    userExplanationMapper.firstAnsNotAnsMulti(examResultTeamVO);
                    return 8;
                }
            }else if(tryAns==1){ // 남아있음 (1번 품)
                if(userAns.equals(ans)){ // 정답일때
                    // 매트릭스 스탯 정답체크
                    userExplanationMapper.updateAnsToMatrixStat(examResultTeamVO);
                    if(check==1){ // 힌트 사용
                        userExplanationMapper.secondAnsEqualsAnsMultiAndHintUser(examResultTeamVO);
                    }else{ // 힌트 미사용
                        userExplanationMapper.secondAnsEqualsAnsMulti(examResultTeamVO);
                    }
                    // 오답 점수 set
                    examResultTeamVO.setWrong_score(deduct);
                    userExplanationMapper.wrongScoreUpdate(examResultTeamVO); // 오답점수 update
                    // 총 점 가져오기
                    int score = userExplanationMapper.getResultScoreForUser(examResultTeamVO);
                    examResultVO.setResult_score(score); // 점수 대입
                    userExplanationMapper.examResultAnsEqualsAns(examResultVO); // 훈련자 풀이 상세 db update
                    userExplanationMapper.updateCntCorrectAnsTeam(examResultTeamVO); // 정답수 update
                    userExplanationMapper.updateResultSumTeam(examResultTeamVO); // 총점 update
                    userExplanationMapper.updateCntCorrectAnsUser(examStatVO);
                    userExplanationMapper.updateResultSumUser(examStatVO);
                    return 9;
                }else{ // 오답
                    userExplanationMapper.updateCntFalseAnsTeam(examResultTeamVO); // 오답수 update
                    userExplanationMapper.updateCntFalseAnsUser(examStatVO); // 오답수 update
                    userExplanationMapper.examResultAnsNotAns(examResultVO); // 훈련자
                    userExplanationMapper.secondAnsNotAnsMulti(examResultTeamVO); // 훈련팀
                    return 8;
                }
            }else if(tryAns==2){ // 없음
                return 0;
            }
        }else{ // 비활성화
            //정답 입력횟수가 남아있는지 check
            if(tryAns==0){ // 남아있음 (1번 품)
                if(userAns.equals(ans)){ // 정답일때
                    // 매트릭스 스탯 정답체크
                    userExplanationMapper.updateAnsToMatrixStat(examResultTeamVO);
                    if(check==1){ // 힌트 사용
                        userExplanationMapper.secondAnsEqualsAnsMultiAndHintUser(examResultTeamVO);
                    }else{ // 힌트 미사용
                        userExplanationMapper.secondAnsEqualsAnsMulti(examResultTeamVO);
                    }
                    // 오답 점수 set
                    examResultTeamVO.setWrong_score(deduct);
                    userExplanationMapper.wrongScoreUpdate(examResultTeamVO); // 오답점수 update
                    // 총 점 가져오기
                    int score = userExplanationMapper.getResultScoreForUser(examResultTeamVO);
                    examResultVO.setResult_score(score); // 점수 대입
                    userExplanationMapper.examResultAnsEqualsAns(examResultVO); // 훈련자 풀이 상세 db update
                    userExplanationMapper.updateCntCorrectAnsTeam(examResultTeamVO); // 정답수 update
                    userExplanationMapper.updateResultSumTeam(examResultTeamVO); // 총점 update
                    userExplanationMapper.updateCntCorrectAnsUser(examStatVO);
                    userExplanationMapper.updateResultSumUser(examStatVO);
                    return 9;
                }else{ // 오답
                    userExplanationMapper.updateCntFalseAnsTeam(examResultTeamVO); // 오답수 update
                    userExplanationMapper.updateCntFalseAnsUser(examStatVO); // 오답수 update
                    userExplanationMapper.examResultAnsNotAns(examResultVO); // 훈련자
                    userExplanationMapper.secondAnsNotAnsMulti(examResultTeamVO); // 훈련팀
                    return 8;
                }
            }else if(tryAns==1){ // 없음
                return 0;
            }
        }
        return 3;
    }

    // 풀이 중인 훈련자 팀 가져오기
    public List<ExamResultTeamVO> getExamResultTeamInfo(ExamResultTeamVO examResultTeamVO, HttpServletRequest request){
        HttpSession session = request.getSession();
        // 유저 id로 정보 가져오기(grp, team_cd)
        String userId = (String) session.getAttribute("USERID");
        UserVO userVO = userExplanationMapper.getMyInfoByUserId(userId);

        // examResultTeamVO에 set(grp, team_cd)
        examResultTeamVO.setTr_user_grp(userVO.getTr_user_grp());
        examResultTeamVO.setTeam_cd(userVO.getTeam_cd());
        examResultTeamVO.setAnswer_user_id(userId);

        System.out.println("팀:"+examResultTeamVO.getTeam_cd()+"grp:"+examResultTeamVO.getTr_user_grp()+"num"+examResultTeamVO.getTr_num()+"grpid:"+examResultTeamVO.getTr_exam_grpid());

        return userExplanationMapper.getExamResultTeamInfo(examResultTeamVO);
    };

    // 문제 그룹 정보 가져오기
    public ExamGrpVO getExamGrpVO(int tr_exam_grpid){
        return userExplanationMapper.getExamGrpVO(tr_exam_grpid);
    }

    // 훈련 시작한 시간 가져오기
    public List<String> startTrainingGetTime(ExamStatTeamVO examStatTeamVO, HttpServletRequest request){
        HttpSession session = request.getSession();
        // 유저 id로 정보 가져오기(grp, team_cd)
        String userId = (String) session.getAttribute("USERID");
        UserVO userVO = userExplanationMapper.getMyInfoByUserId(userId);

        // set
        examStatTeamVO.setTr_user_grp(userVO.getTr_user_grp());
        examStatTeamVO.setTeam_cd(userVO.getTeam_cd());

        System.out.println("팀코드:"+examStatTeamVO.getTeam_cd()+" 차시:"+examStatTeamVO.getTr_num()+" grp:"+examStatTeamVO.getTr_user_grp()+" grpid:"+examStatTeamVO.getTr_exam_grpid());

        System.out.println("기존 훈련팀 시작한 시간: "+userExplanationMapper.startTrainingGetTime(examStatTeamVO));
        String time = userExplanationMapper.startTrainingGetTime(examStatTeamVO);
        try{
            List<String> subTime = Collections.singletonList(time);
            return subTime;
        }catch (NullPointerException n){
            System.out.println("첫 훈련이 시작되어 감소할 시간이 없습니다.");
            return null;
        }
//        List<String> subTime = Collections.singletonList(time.substring(11, 18));
//        return subTime;
    }

    // 훈련팀별 풀이 현황정보 정답 수 update
    public int countAnsExamResultTeam(ExamResultTeamVO examResultTeamVO, HttpServletRequest request){
        HttpSession session = request.getSession();

        // 유저 id로 정보 가져오기(grp, team_cd)
        String userId = (String) session.getAttribute("USERID");
        UserVO userVO = userExplanationMapper.getMyInfoByUserId(userId);

        // set
        examResultTeamVO.setTr_user_grp(userVO.getTr_user_grp());
        examResultTeamVO.setTeam_cd(userVO.getTeam_cd());

        return userExplanationMapper.countAnsExamResultTeam(examResultTeamVO);
    }

    // 풀이 개수, 정답점수, 오답점수, 힌트점수 가져오기
    public Map<String,Object> getTotalStatus(ExamResultTeamVO examResultTeamVO, HttpServletRequest request){
        HttpSession session = request.getSession();
        // 유저 id로 정보 가져오기(grp, team_cd)
        String userId = (String) session.getAttribute("USERID");
        UserVO userVO = userExplanationMapper.getMyInfoByUserId(userId);

        // set grp, teamcd
        examResultTeamVO.setTr_user_grp(userVO.getTr_user_grp());
        examResultTeamVO.setTeam_cd(userVO.getTeam_cd());

        int secansAllow = examResultTeamVO.getSecansAllow();// 2차풀이 활성화 여부

        System.out.println("팀:"+examResultTeamVO.getTeam_cd()+" grp:"+examResultTeamVO.getTr_user_grp()+" grpid:"+examResultTeamVO.getTr_exam_grpid());
        if (secansAllow==1){ // 활성화
            return userExplanationMapper.getTotalStatus(examResultTeamVO);
        }else if(secansAllow==0){ // 비활성화
            return userExplanationMapper.getTotalStatusNoneAllow(examResultTeamVO);
        }
        return null;
    }

    // 제출하기 event
    public int updateSubmit(ExamStatTeamVO examStatTeamVO, HttpServletRequest request){
        HttpSession session = request.getSession();
        // 유저 id로 정보 가져오기
        String userId = (String) session.getAttribute("USERID");
        UserVO userVO = userExplanationMapper.getMyInfoByUserId(userId);
        // 훈련자 제출을 위한 set
        ExamStatVO examStatVO = new ExamStatVO(); // 선언
        examStatVO.setTr_user_id(userId);
        examStatVO.setTr_user_grp(userVO.getTr_user_grp());
        examStatVO.setTr_num(examStatTeamVO.getTr_num());
        examStatVO.setTr_exam_grpid(examStatTeamVO.getTr_exam_grpid());
        // 훈련팀 팀코드,grp set
        examStatTeamVO.setTr_user_grp(userVO.getTr_user_grp());
        examStatTeamVO.setTeam_cd(userVO.getTeam_cd());

        int grp = examStatTeamVO.getTr_user_grp();
        String team  = examStatTeamVO.getTeam_cd();
        int num = examStatTeamVO.getTr_num();
        int grpid = examStatTeamVO.getTr_exam_grpid();
        System.out.println("grp:"+grp+" team:"+team+" num"+num+" grpid:"+grpid);
        int submit = userExplanationMapper.checkSubmitTeam(examStatTeamVO);
        if(submit==1){ // 이미 제출했을때
            return 0;
        }
        // 미제출이면 update
        userExplanationMapper.updateSubmitTeam(examStatTeamVO); // 훈련팀 제출
        userExplanationMapper.updateSubmitUser(examStatVO); // 훈련자 제출
        return 1;
    }

    // 제출여부 event
    public int checkSubmit(@RequestBody ExamStatTeamVO examStatTeamVO, HttpServletRequest request){
        HttpSession session = request.getSession();
        // 유저 id로 정보 가져오기
        String userId = (String) session.getAttribute("USERID");
        UserVO userVO = userExplanationMapper.getMyInfoByUserId(userId);

        // 훈련팀 팀코드,grp set
        examStatTeamVO.setTr_user_grp(userVO.getTr_user_grp());
        examStatTeamVO.setTeam_cd(userVO.getTeam_cd());
        try{
            int submit = userExplanationMapper.checkSubmitTeam(examStatTeamVO);
            if(submit==1){ // 이미 제출했을때
                return 0;
            }
            return 1;
        }catch (BindingException e){
            return 1;
        }
    }

    // 전술단계 id 가져오기
    public Map<String,Object> getMaTacticsId(){
        return userExplanationMapper.getMaTacticsId();
    }

    // 제한시간 경과 시 완료 시간 업데이트
    public int endTimeUpdateTime(ExamStatVO examStatVO,HttpServletRequest request){
        HttpSession session = request.getSession();
        // 유저 id로 정보 가져오기
        String userId = (String) session.getAttribute("USERID");
        UserVO userVO = userExplanationMapper.getMyInfoByUserId(userId);

        examStatVO.setTr_user_grp(userVO.getTr_user_grp());
        examStatVO.setTr_user_id(userVO.getTr_user_id());
        examStatVO.setTr_user_grp(userVO.getTr_user_grp());

        //나의 종료시간이 있는지 체크하기 로직
        String endTime = userExplanationMapper.checkMyEndTime(examStatVO);
        System.out.println("해당 유저의 종료시간: "+endTime);
        if(endTime==null){ // 종료시간이 없음
            return userExplanationMapper.endTimeUpdateTime(examStatVO);
        }else{
            return 0;
        }
    }
}
