package com.training.ncr.service.user;

import com.training.ncr.mapper.user.UserExplanationMapper;
import com.training.ncr.mapper.user.UserStaticsMapper;
import com.training.ncr.vo.UserVO;
import com.training.ncr.vo.admin.ExamGrpVO;
import com.training.ncr.vo.admin.ExamHintVO;
import com.training.ncr.vo.admin.ExamVO;
import com.training.ncr.vo.user.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.*;

@Service
public class UserStaticsService {

    @Autowired
    UserStaticsMapper userStaticsMapper;

    // 선택한 차시, 유형으로 뿌려주기
    public Object getExamResultByNumAndType(UserStaticsVO userStaticsVO){

        // 팀별, 개인 파악하기
        int type = userStaticsVO.getType();
        // 훈련 차시
        int num = userStaticsVO.getNum();

        System.out.println("팀:"+type+"차시:"+num);
        System.out.println("테스트다:"+userStaticsVO.getTr_exam_grpid());

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
        System.out.println("org:"+userStaticsMapper.selectUserOrgByUserId(id));
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
        System.out.println(matrix.size());
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
        //테스트 코드
        Map<String,List<Object>> a = new HashMap<>();
        List<Object> l1 = new ArrayList<>();
        l1.add(1);
        List<Object> l2 = new ArrayList<>();
        l2.add(2);

        return stringObjectMap;
    }

    // 해당문제 기본 시간 가져오기
    public int getTotalTime(int tr_exam_grpid){
        return userStaticsMapper.getTotalTime(tr_exam_grpid);
    }
}
