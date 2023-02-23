package com.training.ncr.service.user;

import com.training.ncr.mapper.user.GroupMapper;
import com.training.ncr.vo.admin.MgmtVO;
import com.training.ncr.vo.TeamCodeVO;
import com.training.ncr.vo.UserVO;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.List;

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
}
