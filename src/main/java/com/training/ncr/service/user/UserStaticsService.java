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
import java.util.Collections;
import java.util.List;
import java.util.Map;

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
        System.out.println(userStaticsMapper.selectUser(num));

        if(type==1){ // 개인
            return userStaticsMapper.selectUser(num);
        }else if(type==2){ // 팀
            return userStaticsMapper.selectTeam(num);
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
    public ExamStatVO getUserExamStat(ExamStatVO examStatVO){
        return userStaticsMapper.getUserExamStat(examStatVO);
    }
}
