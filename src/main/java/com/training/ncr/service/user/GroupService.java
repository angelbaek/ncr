package com.training.ncr.service.user;

import com.training.ncr.mapper.user.GroupMapper;
import com.training.ncr.vo.admin.MgmtVO;
import com.training.ncr.vo.TeamCodeVO;
import com.training.ncr.vo.UserVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
    public int callUserUpdate(UserVO userVO) {
        System.out.println(userVO.getTr_user_id());
        System.out.println(userVO.getTr_user_org());
        System.out.println(userVO.getTeam_cd());
        System.out.println(userVO.getTr_user_state());
        return groupMapper.callUserUpdate(userVO);
    }

    //훈련 시작 체크
    public List<MgmtVO> callTraining(int tr_num){
        return groupMapper.callTraining(tr_num);
    }
}
