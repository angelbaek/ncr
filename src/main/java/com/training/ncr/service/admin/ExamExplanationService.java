package com.training.ncr.service.admin;

import com.training.ncr.mapper.admin.ExamExplanationMapper;
import com.training.ncr.mapper.user.UserExplanationMapper;
import com.training.ncr.vo.NowExamVO;
import com.training.ncr.vo.UserVO;
import com.training.ncr.vo.admin.ExamGrpVO;
import com.training.ncr.vo.admin.ExamHintVO;
import com.training.ncr.vo.admin.ExamVO;
import com.training.ncr.vo.admin.MgmtVO;
import com.training.ncr.vo.user.*;
import org.apache.ibatis.binding.BindingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
public class ExamExplanationService {

    @Autowired
    ExamExplanationMapper examExplanationMapper;

    @Autowired
    UserExplanationMapper userExplanationMapper;

    // 문제 풀이 그룹 조회
    public List<MgmtVO> searchMgmtState(){
//        try {
//            examExplanationMapper.searchMgmtState();
            return examExplanationMapper.searchMgmtState();
//        }catch (BindingException bindingException){
//            return null;
//        }
    };

    // 훈련 시작한 문항과 문제그룹정보 가져오기
    public List<NowExamVO> getStartExamAndGrp(String grpName){
        System.out.println(examExplanationMapper.getStartExamAndGrp(grpName));
        return examExplanationMapper.getStartExamAndGrp(grpName);
    }

    // 해당 힌트 가져오기
    public List<ExamHintVO> getHintFunc(ExamHintVO examHintVO){
        return examExplanationMapper.getHintFunc(examHintVO);
    };

    // 첫 훈련팀별 풀이 현황 정보 db insert
    public int insertExamstatTeam(ExamStatTeamVO examStatTeamVO, HttpServletRequest request){
        HttpSession session = request.getSession();
        // 유저 아이디
        String userId = (String) session.getAttribute("ADMINID");
        examStatTeamVO.setTr_user_grp(99);
        examStatTeamVO.setTeam_cd("TEAM099");
        // 훈련자 풀이현황에 내가 있는지 확인하기
        if(examExplanationMapper.selectByTeamcd(examStatTeamVO).size()!=0){
            System.out.println("훈련 팀별 진행중...");
            return 0;
        }
        // db insert
        setMatrixStat(request);
        return examExplanationMapper.insertExamstatTeam(examStatTeamVO);
    }

    public void setMatrixStat(HttpServletRequest request){
        HttpSession session = request.getSession();
        // 유저 아이디
        String userId = (String) session.getAttribute("ADMINID");

        MatrixStatVO matrixStatVO = new MatrixStatVO(); // ioc
        MgmtVO mgmtVO =examExplanationMapper.getGrpNameByMgmtStateOn(); // 활성화된 grpname, tr_num get
        String tr_exam_grpname = mgmtVO.getTr_exam_grp(); // grp이름
        int num = mgmtVO.getTr_num(); // 차시
        int grpId = examExplanationMapper.getGrpIdByGrpName(tr_exam_grpname); // 활성화된 grpid get
        List<Map<String,Object>> stringObjectMap =examExplanationMapper.getGrpidAndMatrixAndTactics(grpId); // 문제그룹id로 문제id, 전술단계, 매트릭스 가져오기

        // setup
        matrixStatVO.setTr_user_grp(99);
        matrixStatVO.setTeam_cd("TEAM099");
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
            examExplanationMapper.insertMatrixStat(matrixStatVO);
        }
        System.out.println(stringObjectMap.size());
    }

    // 첫 훈련자별, 훈련팀별 풀이 상세정보 insert
    public int insertTrainExamResultAndTeam(ExamResultVO examResultVO, HttpServletRequest request){
        HttpSession session = request.getSession();
        String userId = (String) session.getAttribute("ADMINID");
        examResultVO.setTr_user_id(userId);

        ExamResultTeamVO examResultTeamVO = new ExamResultTeamVO();

        // examResultTeamVO 셋업
        examResultTeamVO.setTr_user_grp(99);
        examResultTeamVO.setTeam_cd("TEAM099");
        examResultTeamVO.setTr_num(examResultVO.getTr_num());
        examResultTeamVO.setTr_exam_grpid(examResultVO.getTr_exam_grpid());
        examResultTeamVO.setTr_exam_id(examResultVO.getTr_exam_id());

        // 사전 체크 db (훈련자)
        List<ExamResultTeamVO> examResultTeamVOS = examExplanationMapper.checkExamResultTeamVO(examResultTeamVO);
        if(examResultTeamVOS.size()==0){ // 첫 db
            examExplanationMapper.insertTrainExamResultTeam(examResultTeamVO); // 훈련팀별 insert
            return 1;
        }
        return 0;
    }

    // 해당 힌트 가져오기
    public List<ExamHintVO> getHint(ExamHintVO examHintVO){
        return examExplanationMapper.getHint(examHintVO);
    }

    // 힌트 메소드
    public int hintUsing(ExamResultVO examResultVO, HttpServletRequest request){
        ExamResultTeamVO examResultTeamVO = new ExamResultTeamVO();
        HttpSession session = request.getSession();
        String userId = (String) session.getAttribute("ADMINID");
        // 인자값 set
        examResultVO.setTr_user_id(userId);
        examResultTeamVO.setTr_exam_grpid(examResultVO.getTr_exam_grpid());
        examResultTeamVO.setTr_num(examResultVO.getTr_num());
        examResultTeamVO.setTr_exam_id(examResultVO.getTr_exam_id());
        examResultTeamVO.setTr_user_grp(99);
        examResultTeamVO.setTeam_cd("TEAM099");
        examResultTeamVO.setResult_score(examResultVO.getResult_score());

        // 문제그룹id로 정보 가져오기 (2차 풀이여부, 2차 풀이 감점)
        ExamGrpVO examGrpVO = examExplanationMapper.getExamGrpInfo(examResultTeamVO.getTr_exam_grpid());
        int allow = examGrpVO.getTr_allow_secans();
        int deduct = examGrpVO.getTr_secans_deduct();

        //set
        examResultTeamVO.setHint_score(deduct);

        // 힌트 사용여부 check
        int check = examExplanationMapper.checkHintUsing(examResultTeamVO);

        if(check==1){ // 사용

        }else if(check==0){ // 미사용
            examExplanationMapper.firstHintUsingTeam(examResultTeamVO);
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
        String userId = (String) session.getAttribute("ADMINID");

        // examResultTeamVO에 set(grp, team_cd)
        examResultTeamVO.setTr_user_grp(99);
        examResultTeamVO.setTeam_cd("TEAM099");
        examResultTeamVO.setAnswer_user_id(userId);

        // 문제그룹id로 정보 가져오기 (2차 풀이여부, 2차 풀이 감점, 힌트감점)
        ExamGrpVO examGrpVO = examExplanationMapper.getExamGrpInfo(examResultTeamVO.getTr_exam_grpid());
        int allow = examGrpVO.getTr_allow_secans();
        int deduct = examGrpVO.getTr_secans_deduct();
        int hintDeduct = examGrpVO.getTr_hint_deduct();

        // 문제id로 정보 가져오기(정답, 배점)
        ExamVO examVO = examExplanationMapper.getExamInfo(examResultTeamVO.getTr_exam_id());
        String ans = examVO.getTr_exam_ans();
        int point = examVO.getTr_exam_point();

        examResultTeamVO.setResult_score(deduct); // 2차 풀이 감점
        examResultTeamVO.setPoint(point); // 배점
        examResultTeamVO.setHint(hintDeduct);

        // 정답 입력횟수 받아오기
        int tryAns = examExplanationMapper.checkTryAns(examResultTeamVO);

        // 힌트 사용여부 check
        int check = examExplanationMapper.checkHintUsing(examResultTeamVO);

        // 훈련자 클래스 대입
        ExamResultVO examResultVO = new ExamResultVO();
        examResultVO.setInput_answer(userAns); // 입력 답
        examResultVO.setTr_user_id(userId); // 유저 id
        examResultVO.setTr_num(examResultTeamVO.getTr_num()); // 훈련 차시
        examResultVO.setTr_exam_grpid(examResultTeamVO.getTr_exam_grpid()); // grpid
        examResultVO.setTr_exam_id(examResultTeamVO.getTr_exam_id()); // 문제id
        examResultTeamVO.setWrong_score(deduct); // 2차풀이 감점

        // 훈련자 풀이현황 정보 set
        ExamStatVO examStatVO = new ExamStatVO();
        examStatVO.setTr_user_id(userId);
        examStatVO.setTr_user_grp(examResultTeamVO.getTr_user_grp());
        examStatVO.setTr_num(examResultTeamVO.getTr_num());
        examStatVO.setTr_exam_grpid(examResultTeamVO.getTr_exam_grpid());

        // 해당 문제에 대한 훈련팀 획득점수 가져오기
        int resultScore = examExplanationMapper.getTeamResultSore(examResultTeamVO);

        if(resultScore>0){ // 이미 정답을 맞춤
            return 0;
        }
        if(allow==1){ // 2차 풀이 활성화
            //정답 입력횟수가 남아있는지 check
            if(tryAns==0){ // 첫 정답확인
                if(userAns.equals(ans)){ // 정답일때
                    // 매트릭스 스탯 정답체크
                    examExplanationMapper.updateAnsToMatrixStat(examResultTeamVO);
                    if(check==1){ // 힌트 사용
                        examExplanationMapper.firstAnsEqualsAnsMultiAndHintUse(examResultTeamVO);
                    }else{ // 힌트 미사용
                        examExplanationMapper.firstAnsEqualsAnsMulti(examResultTeamVO);
                    }
                    // 오답 점수 set
//                    examResultTeamVO.setWrong_score(deduct);
//                    examExplanationMapper.wrongScoreUpdate(examResultTeamVO); // 오답점수 update
                    // 총 점 가져오기
                    int score = examExplanationMapper.getResultScoreForUser(examResultTeamVO);
                    examResultVO.setResult_score(score); // 점수 대입
                    // 훈련팀, 훈련자 update
                    examExplanationMapper.updateCntCorrectAnsTeam(examResultTeamVO); // 정답수 update
                    examExplanationMapper.updateResultSumTeam(examResultTeamVO); // 총점 update
                    return 9;
                }else{ // 오답
                    userExplanationMapper.updateWrongScore(examResultTeamVO); // 2차풀이 오답점수 넣기
                    examExplanationMapper.firstAnsNotAnsMulti(examResultTeamVO); // 훈련팀
                    return 8;
                }
            }else if(tryAns==1){ // 두번째 정답확인
                if(userAns.equals(ans)){ // 정답일때
                    // 매트릭스 스탯 정답체크
                    examExplanationMapper.updateAnsToMatrixStat(examResultTeamVO);
                    if(check==1){ // 힌트 사용
                        examExplanationMapper.secondAnsEqualsAnsMultiAndHintUser(examResultTeamVO);
                    }else{ // 힌트 미사용
                        examExplanationMapper.secondAnsEqualsAnsMulti(examResultTeamVO);
                    }
                    // 오답 점수 set
                    examResultTeamVO.setWrong_score(deduct);
                    examExplanationMapper.wrongScoreUpdate(examResultTeamVO); // 오답점수 update
                    // 총 점 가져오기
                    int score = examExplanationMapper.getResultScoreForUser(examResultTeamVO);
                    examResultVO.setResult_score(score); // 점수 대입

                    examExplanationMapper.updateCntCorrectAnsTeam(examResultTeamVO); // 정답수 update
                    examExplanationMapper.updateResultSumTeam(examResultTeamVO); // 총점 update

                    return 9;
                }else{ // 오답
                    examExplanationMapper.updateCntFalseAnsTeam(examResultTeamVO); // 오답수 update
                    examExplanationMapper.secondAnsNotAnsMulti(examResultTeamVO); // 훈련팀
                    return 8;
                }
            }else if(tryAns==2){ // 정답확인 다 사용
                return 0;
            }
        }else{ // 비활성화
            //정답 입력횟수가 남아있는지 check
            System.out.println("입력횟수:"+tryAns+" 유저입력:"+userAns+" 답:"+ans);
            if(tryAns==0){ // 남아있음 (1번 품)
                if(userAns.equals(ans)){ // 정답일때
                    // 매트릭스 스탯 정답체크
                    userExplanationMapper.updateAnsToMatrixStat(examResultTeamVO);
                    if(check==1){ // 힌트 사용
                        examExplanationMapper.secondAnsEqualsAnsMultiAndHintUser(examResultTeamVO);
                    }else{ // 힌트 미사용
                        examExplanationMapper.secondAnsEqualsAnsMulti(examResultTeamVO);
                    }
                    // 오답 점수 set
//                    examResultTeamVO.setWrong_score(deduct);
//                    examExplanationMapper.wrongScoreUpdate(examResultTeamVO); // 오답점수 update
                    // 총 점 가져오기
                    int score = examExplanationMapper.getResultScoreForUser(examResultTeamVO);
                    examResultVO.setResult_score(score); // 점수 대입
                    examExplanationMapper.updateCntCorrectAnsTeam(examResultTeamVO); // 정답수 update
                    examExplanationMapper.updateResultSumTeam(examResultTeamVO); // 총점 update
                    return 9;
                }else{ // 오답
                    examExplanationMapper.updateCntFalseAnsTeam(examResultTeamVO); // 오답수 update
                    examExplanationMapper.secondAnsNotAnsMulti(examResultTeamVO); // 훈련팀
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
        HttpSession session = request.getSession();
        // 유저 기입 답
        String userAns = examResultTeamVO.getInput_answer();
        // 공백 제거
        userAns = userAns.trim();
        userAns = userAns.replace(" ", "");
        // 유저 id로 정보 가져오기(grp, team_cd)
        String userId = (String) session.getAttribute("ADMINID");

        // examResultTeamVO에 set(grp, team_cd)
        examResultTeamVO.setTr_user_grp(99);
        examResultTeamVO.setTeam_cd("TEAM099");
        examResultTeamVO.setAnswer_user_id(userId);

        // 문제그룹id로 정보 가져오기 (2차 풀이여부, 2차 풀이 감점)
        ExamGrpVO examGrpVO = examExplanationMapper.getExamGrpInfo(examResultTeamVO.getTr_exam_grpid());
        int allow = examGrpVO.getTr_allow_secans();
        int deduct = examGrpVO.getTr_secans_deduct();
        int hintDeduct = examGrpVO.getTr_hint_deduct();

        // 문제id로 정보 가져오기(정답, 배점)
        ExamVO examVO = examExplanationMapper.getExamInfo(examResultTeamVO.getTr_exam_id());
        String ans = examVO.getTr_exam_ans();
        // 공백 제거
        ans = ans.trim();
        ans = ans.replace(" ", "");

        int point = examVO.getTr_exam_point();

        examResultTeamVO.setResult_score(deduct); // 2차 풀이 감점
        examResultTeamVO.setPoint(point); // 배점
        examResultTeamVO.setWrong_score(deduct); // 2차풀이 감점
        examResultTeamVO.setHint(hintDeduct);

        // 힌트 사용여부 check
        int check = examExplanationMapper.checkHintUsing(examResultTeamVO);

        // 정답 입력횟수 받아오기
        int tryAns = examExplanationMapper.checkTryAns(examResultTeamVO);

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
        int resultScore = examExplanationMapper.getTeamResultSore(examResultTeamVO);

        if(resultScore>0){ // 이미 정답을 맞춤
            return 0;
        }
        if(allow==1){ // 2차 풀이 활성화
            //정답 입력횟수가 남아있는지 check
            if(tryAns==0){
                if(userAns.equals(ans)){ // 정답일때
                    // 매트릭스 스탯 정답체크
                    examExplanationMapper.updateAnsToMatrixStat(examResultTeamVO);
                    if(check==1){ // 힌트 사용
                        examExplanationMapper.firstAnsEqualsAnsMultiAndHintUse(examResultTeamVO);
                    }else{ // 힌트 미사용
                        examExplanationMapper.firstAnsEqualsAnsMulti(examResultTeamVO);
                    }
                    // 총 점 가져오기
                    int score = examExplanationMapper.getResultScoreForUser(examResultTeamVO);
                    examResultVO.setResult_score(score); // 점수 대입
                    examExplanationMapper.updateCntCorrectAnsTeam(examResultTeamVO); // 정답수 update
                    examExplanationMapper.updateResultSumTeam(examResultTeamVO); // 총점 update
                    return 9;
                }else{ // 오답
                    userExplanationMapper.updateWrongScore(examResultTeamVO); // 2차풀이 오답점수 넣기
                    examExplanationMapper.firstAnsNotAnsMulti(examResultTeamVO);
                    return 8;
                }
            }else if(tryAns==1){ // 남아있음 (1번 품)
                if(userAns.equals(ans)){ // 정답일때
                    // 매트릭스 스탯 정답체크
                    examExplanationMapper.updateAnsToMatrixStat(examResultTeamVO);
                    if(check==1){ // 힌트 사용
                        examExplanationMapper.secondAnsEqualsAnsMultiAndHintUser(examResultTeamVO);
                    }else{ // 힌트 미사용
                        examExplanationMapper.secondAnsEqualsAnsMulti(examResultTeamVO);
                    }
                    // 오답 점수 set
                    examResultTeamVO.setWrong_score(deduct);
                    examExplanationMapper.wrongScoreUpdate(examResultTeamVO); // 오답점수 update
                    // 총 점 가져오기
                    int score = examExplanationMapper.getResultScoreForUser(examResultTeamVO);
                    examResultVO.setResult_score(score); // 점수 대입
                    examExplanationMapper.updateCntCorrectAnsTeam(examResultTeamVO); // 정답수 update
                    examExplanationMapper.updateResultSumTeam(examResultTeamVO); // 총점 update
                    return 9;
                }else{ // 오답
                    examExplanationMapper.updateCntFalseAnsTeam(examResultTeamVO); // 오답수 update
                    examExplanationMapper.secondAnsNotAnsMulti(examResultTeamVO); // 훈련팀
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
                    examExplanationMapper.updateAnsToMatrixStat(examResultTeamVO);
                    if(check==1){ // 힌트 사용
                        examExplanationMapper.secondAnsEqualsAnsMultiAndHintUser(examResultTeamVO);
                    }else{ // 힌트 미사용
                        examExplanationMapper.secondAnsEqualsAnsMulti(examResultTeamVO);
                    }
                    // 오답 점수 set
//                    examResultTeamVO.setWrong_score(deduct);
//                    examExplanationMapper.wrongScoreUpdate(examResultTeamVO); // 오답점수 update
                    // 총 점 가져오기
                    int score = examExplanationMapper.getResultScoreForUser(examResultTeamVO);
                    examResultVO.setResult_score(score); // 점수 대입
                    examExplanationMapper.updateCntCorrectAnsTeam(examResultTeamVO); // 정답수 update
                    examExplanationMapper.updateResultSumTeam(examResultTeamVO); // 총점 update
                    return 9;
                }else{ // 오답
                    examExplanationMapper.updateCntFalseAnsTeam(examResultTeamVO); // 오답수 update
                    examExplanationMapper.secondAnsNotAnsMulti(examResultTeamVO); // 훈련팀
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
        String userId = (String) session.getAttribute("ADMINID");

        // examResultTeamVO에 set(grp, team_cd)
        examResultTeamVO.setTr_user_grp(99);
        examResultTeamVO.setTeam_cd("TEAM099");
        examResultTeamVO.setAnswer_user_id(userId);

        return examExplanationMapper.getExamResultTeamInfo(examResultTeamVO);
    };

    // 문제 그룹 정보 가져오기
    public ExamGrpVO getExamGrpVO(int tr_exam_grpid){
        return examExplanationMapper.getExamGrpVO(tr_exam_grpid);
    }

    // 훈련 시작한 시간 가져오기
    public List<String> startTrainingGetTime(ExamStatTeamVO examStatTeamVO, HttpServletRequest request){
        HttpSession session = request.getSession();
        // 유저 id로 정보 가져오기(grp, team_cd)
        String userId = (String) session.getAttribute("ADMINID");

        // set
        examStatTeamVO.setTr_user_grp(99);
        examStatTeamVO.setTeam_cd("TEAM099");

        System.out.println("팀코드:"+examStatTeamVO.getTeam_cd()+" 차시:"+examStatTeamVO.getTr_num()+" grp:"+examStatTeamVO.getTr_user_grp()+" grpid:"+examStatTeamVO.getTr_exam_grpid());

        System.out.println("기존 훈련팀 시작한 시간: "+examExplanationMapper.startTrainingGetTime(examStatTeamVO));
        String time = examExplanationMapper.startTrainingGetTime(examStatTeamVO);
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
        String userId = (String) session.getAttribute("ADMINID");

        // set
        examResultTeamVO.setTr_user_grp(99);
        examResultTeamVO.setTeam_cd("TEAM099");

        return examExplanationMapper.countAnsExamResultTeam(examResultTeamVO);
    }

    // 풀이 개수, 정답점수, 오답점수, 힌트점수 가져오기
    public Map<String,Object> getTotalStatus(ExamResultTeamVO examResultTeamVO, HttpServletRequest request){
        HttpSession session = request.getSession();
        // 유저 id로 정보 가져오기(grp, team_cd)
        String userId = (String) session.getAttribute("ADMINID");

        // set grp, teamcd
        examResultTeamVO.setTr_user_grp(99);
        examResultTeamVO.setTeam_cd("TEAM099");

        int secansAllow = examResultTeamVO.getSecansAllow();// 2차풀이 활성화 여부

        if (secansAllow==1){ // 활성화
            return examExplanationMapper.getTotalStatus(examResultTeamVO);
        }else if(secansAllow==0){ // 비활성화
            return examExplanationMapper.getTotalStatusNoneAllow(examResultTeamVO);
        }
        return null;
    }

    // 제출하기 event
    public int updateSubmit(ExamStatTeamVO examStatTeamVO, HttpServletRequest request){
        HttpSession session = request.getSession();
        // 유저 id로 정보 가져오기
        String userId = (String) session.getAttribute("ADMINID");

        // 훈련자 제출을 위한 set
        ExamStatVO examStatVO = new ExamStatVO(); // 선언
        examStatVO.setTr_user_id(userId);
        examStatVO.setTr_user_grp(99);
        examStatVO.setTr_num(examStatTeamVO.getTr_num());
        examStatVO.setTr_exam_grpid(examStatTeamVO.getTr_exam_grpid());
        // 훈련팀 팀코드,grp set
        examStatTeamVO.setTr_user_grp(99);
        examStatTeamVO.setTeam_cd("TEAM099");

        int grp = examStatTeamVO.getTr_user_grp();
        String team  = examStatTeamVO.getTeam_cd();
        int num = examStatTeamVO.getTr_num();
        int grpid = examStatTeamVO.getTr_exam_grpid();
        System.out.println("제출하기 시도 grp:"+grp+" team:"+team+" num"+num+" grpid:"+grpid);
        int submit = examExplanationMapper.checkSubmitTeam(examStatTeamVO);
        if(submit==1){ // 이미 제출했을때
            System.out.println("이미 제출한 관리자");
            return 0;
        }
        System.out.println("관리자 제출 완료!");
        // 미제출이면 update
        examExplanationMapper.updateSubmitTeam(examStatTeamVO); // 훈련팀 제출
        return 1;
    }

    // 제출여부 event
    public int checkSubmit(@RequestBody ExamStatTeamVO examStatTeamVO, HttpServletRequest request){
        HttpSession session = request.getSession();
        // 유저 id로 정보 가져오기
        String userId = (String) session.getAttribute("ADMINID");

        // 훈련팀 팀코드,grp set
        examStatTeamVO.setTr_user_grp(99);
        examStatTeamVO.setTeam_cd("TEAM099");
        try{
            int submit = examExplanationMapper.checkSubmitTeam(examStatTeamVO);
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
        return examExplanationMapper.getMaTacticsId();
    }

    // 제한시간 경과 시 완료 시간 업데이트
    public int endTimeUpdateTime(ExamStatVO examStatVO,HttpServletRequest request){
        HttpSession session = request.getSession();
        // 유저 id로 정보 가져오기
        String userId = (String) session.getAttribute("ADMINID");

        examStatVO.setTr_user_grp(99);
        examStatVO.setTr_user_id(userId);

        //나의 종료시간이 있는지 체크하기 로직 (관리자 전용)
        String endTime = examExplanationMapper.getAdminEndTime(examStatVO);
        System.out.println("해당 유저의 종료시간: "+endTime);
        if(endTime==null){ // 종료시간이 없음
            return examExplanationMapper.endTimeUpdateTime(examStatVO);
        }else{
            return 0;
        }
    }
}
