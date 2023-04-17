package com.training.ncr.service.user;

import com.training.ncr.mapper.user.GroupMapper;
import com.training.ncr.vo.admin.MgmtVO;
import com.training.ncr.vo.TeamCodeVO;
import com.training.ncr.vo.UserVO;
import org.apache.catalina.User;
import org.apache.ibatis.binding.BindingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.List;
import java.util.Map;

@Service
public class GroupService {

    @Autowired
    GroupMapper groupMapper;

    //팀(조) 정보 가져오기
    public List<TeamCodeVO> callTeamCode(){
        return groupMapper.callTeamCode();
    }

    //훈련자 팀,팀코드,훈련준비상태 setting
    public int callUserUpdate(UserVO userVO, HttpServletRequest request) {
        // 훈련중인지 가져오기
        HttpSession session = request.getSession();
        String id = (String) session.getAttribute("USERID");
        List<MgmtVO> mgmtVOS = groupMapper.getTrUserStateByUserid();
        for (int i=0; i<mgmtVOS.size(); i++){
            int state = mgmtVOS.get(i).getTr_mgmt_state();
            if(state==1) return 2;
        }

        // 해당 팀에 몇명 있는지 가져오기
        int count = groupMapper.getGrpCountByGrp(userVO);
        if(count>1){
            System.out.println("해당 팀은 인원초과!");
            return 0;
        }
        System.out.println("훈련중이 아님...");
        return groupMapper.callUserUpdate(userVO);
    }

    //훈련 시작 체크
    public List<MgmtVO> callTraining(int tr_num){
        System.out.println("훈련 시작 체크!!");
        return groupMapper.callTraining(tr_num);
    }

    // 아이디로 정보 조회
    public List<UserVO> getUserInfo(String id){
        return groupMapper.getUserInfo(id);
    }

    // 훈련 시작 여부
    public int getTrainingState(@PathVariable int num){
        return groupMapper.getTrainingState(num);
    }

    // 활성화된 문제그룹이 있는지 가져오기
    public int getTrainingStateActiveOn(){
        return groupMapper.getTrainingStateActiveOn();
    }

    // 현재 훈련자의 훈련진행중인 차시를 이용하여 문제그룹 ID 구해서 grp 구하기
    public int userDuplicationExamAnotherTeam(HttpServletRequest request){
        HttpSession session = request.getSession();
        String id = (String) session.getAttribute("USERID");

        try{
            // 기존에 훈련했던 grp
            int targetGrp = groupMapper.userDuplicationExamAnotherTeam(id);
            // 현재 세팅된 grp
            List<UserVO> userVO = (List<UserVO>) groupMapper.getUserInfo(id);
            int userGrp = userVO.get(0).getTr_user_grp();
            // 다를 경우
            if(targetGrp != userGrp){
                return 1;
            }
            return 0;
        }catch (BindingException bindingException){
            return 0;
        }
    };
}
