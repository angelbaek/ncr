package com.training.ncr.service.user;

import com.training.ncr.mapper.user.UserExplanationMapper;
import com.training.ncr.mapper.user.UserStaticsMapper;
import com.training.ncr.vo.UserVO;
import com.training.ncr.vo.admin.ExamGrpVO;
import com.training.ncr.vo.admin.ExamHintVO;
import com.training.ncr.vo.admin.ExamVO;
import com.training.ncr.vo.admin.MatrixVO;
import com.training.ncr.vo.user.*;
import org.apache.ibatis.binding.BindingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class UserStaticsService {

    @Autowired
    UserStaticsMapper userStaticsMapper;

    // 선택한 차시, 유형으로 뿌려주기
    public Object getExamResultByNumAndType(UserStaticsVO userStaticsVO,HttpServletRequest request){
        // 사용자 인지 구별을 위한 세션 받기
        HttpSession session = request.getSession();
        String id = (String) session.getAttribute("USERID");
        if(id!=null) {
            userStaticsVO.setId(id);
            try{
                userStaticsVO.setGrp(userStaticsMapper.getGrpByUserIdAndTrNum(userStaticsVO));
            }catch (BindingException e){
                System.out.println("선택한 차시 유형에 해당하는 데이터가 없습니다");
            }
        }
        // 팀별, 개인 파악하기
        int type = userStaticsVO.getType();
        // 훈련 차시
        int num = userStaticsVO.getNum();

        if(type==1){ // 개인
            return userStaticsMapper.selectUser(userStaticsVO);
        }else if(type==2){ // 팀
            return userStaticsMapper.selectTeam(userStaticsVO);
        }
        return null;
    }

     // 훈련자 기관명 가져오기
    public UserVO selectUserOrgByUserId(Map<String,Object> stringObjectMap){
        String id = (String) stringObjectMap.get("id");
        return userStaticsMapper.selectUserOrgByUserId(id);
    }

    // 선택한 훈련자 풀이현황 가져오기
    public List<ExamResultVO> selectExamResult(ExamResultVO examResultVO){
        // stat id로 유저 id 가져오기
        String userId = userStaticsMapper.getUserIdByExamStatId(examResultVO.getStat_id());
        examResultVO.setTr_user_id(userId);

        return userStaticsMapper.selectExamResult(examResultVO);
    }

    // 선택한 훈련팀별 세부사항 가져오기
    public List<ExamStatTeamVO> getExamResultTeam(ExamResultTeamVO examResultTeamVO){
        return userStaticsMapper.getExamResultTeam(examResultTeamVO);
    }

    // 선택한 팀에 해당하는 매트릭스 스탯 가져오기
    public List<Map<String,Object>> getMatrixStat(MatrixStatVO matrixStatVO){
        List<Map<String, Object>> matrix = userStaticsMapper.getMatrixStat(matrixStatVO);
        return userStaticsMapper.getMatrixStat(matrixStatVO);
    }

    // 선택한 팀에 해당하는 매트릭스, 전술단계 가져오기 실행 후 // 매트릭스 id, grp, num, grpid로 최대항수, 실제 항수, 해당 matrix, 전술단계 구해서 넘겨주기
    public List<Map<String,Object>> getMiterAttackMatrix(MatrixStatVO matrixStatVO){
        List<Map<String,Object>> test = userStaticsMapper.getMiterAttackMatrix(matrixStatVO.getTr_exam_grpid());
        List<Integer> target = new ArrayList<>();
        List<String> target2 = new ArrayList<>();
        List<Map<String,Object>> stringObjectMap = new ArrayList<>();
        for(int i=0; i<test.size(); i++){
            target.add((Integer) test.get(i).get("MA_MATRIX_ID"));
            target2.add((String) test.get(i).get("MA_TACTICS_ID"));
        }
        for(int i=0; i<target.size(); i++){
            matrixStatVO.setMa_matrix_id(target.get(i));
            matrixStatVO.setMa_tactics_id(target2.get(i));
            stringObjectMap.add(userStaticsMapper.getTotalAnsCorrectTrue(matrixStatVO));
        }

        return stringObjectMap;
    }

    // 해당문제 기본 시간 가져오기
    public int getTotalTime(int tr_exam_grpid){
        return userStaticsMapper.getTotalTime(tr_exam_grpid);
    }

    // 활성화된 문제 그룹 가져오기
    public int getGrpidByMgmtStateOn(){
        try{
            return userStaticsMapper.getGrpidByMgmtStateOn();
        }catch (BindingException e){
         return 0;
        }
    }

    // 훈련팀 기관명 가져오기
    public List<String> getTeamOrg(Map<String,Object> map){
        List<String> strings = userStaticsMapper.getUserIdByGrpAndNumAndGrpId(map);
        if(strings.size()>0){
            List<String> resultString = new ArrayList<>();
            for(int i=0; i<strings.size(); i++){
                String id = strings.get(i);
                resultString.add(userStaticsMapper.getTeamOrg(id));
            }
            return resultString;
        }else{
            return null;
        }
    }

    // 선택한 매트릭스 내용 가져오기
    public List<Map<String,String>> popUp(MatrixVO matrixVO){
        return userStaticsMapper.popUp(matrixVO);
    }

    // 오답 정답으로 변환
    public int falseToTrue(Map<String,Object> map){
        int grp = (int) map.get("tr_user_grp");
        int num = (int) map.get("tr_num");
        int grpId = (int) map.get("tr_exam_grpid");
        int examId = (int) map.get("tr_exam_id");
        // 배점 가져오기
        int point = userStaticsMapper.getPointByExamId(examId);
        map.put("point",point);

        int result = userStaticsMapper.updateExamResultTeam(map);
        if(result==1){
            int result2 = userStaticsMapper.updateMatrixStat(map);
            if(result2==1){
                userStaticsMapper.updateInputAnswerResultTeam(map);
                return userStaticsMapper.updateExamStatTeam(map);
            }else{
                return 0;
            }
        }else{
            return 0;
        }
    }

    // 선택한 문항에 대한 세부사항 보여주기
    public Map<String,Object> getSelectDetail(Map<String,Object> map){
        return userStaticsMapper.getSelectDetail(map);
    }

    // 훈련 세부사항 한번 더 뿌려주기(팀)
    public ExamStatTeamVO getExamStatTeam(Map<String,Object> map){
        return userStaticsMapper.getExamStatTeam(map);
    }

    // 훈련 세부사항 한번 더 뿌려주기 (훈련자)
    public ExamStatVO getExamStat(Map<String,Object> map,HttpServletRequest request){
        boolean cont = map.containsKey("tr_user_id");
        if(cont){
          return userStaticsMapper.getExamStat(map);
        }else{
            HttpSession session = request.getSession();
            map.put("tr_user_id",session.getAttribute("USERID"));
            return userStaticsMapper.getExamStat(map);
        }
    }
}
