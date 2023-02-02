package com.training.ncr.service.user;

import com.training.ncr.mapper.user.UserExplanationMapper;
import com.training.ncr.vo.user.ExamStatVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.swing.plaf.PanelUI;

@Service
public class UserExplanationService {

    @Autowired
    UserExplanationMapper userExplanationMapper;

    // 유저 세션id로 userGRP, TEAM_CD 구하기
    public int getUserGrpAndTeamCD(ExamStatVO examStatVO){
        return userExplanationMapper.getUserGrpAndTeamCD(examStatVO);
    }
}
