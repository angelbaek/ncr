package com.training.ncr.mapper.user;

import com.training.ncr.vo.admin.MgmtVO;
import com.training.ncr.vo.TeamCodeVO;
import com.training.ncr.vo.UserVO;
import org.apache.catalina.User;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface GroupMapper {

    // 그룹 설정
    List<TeamCodeVO> callTeamCode();

    // 훈련자 팀,팀코드,훈련준비상태 setting
    int callUserUpdate(UserVO userVO);

    // 훈련 시작
    List<MgmtVO> callTraining(int tr_num);

    // 아이디로 정보 조회
    List<UserVO> getUserInfo(String id);
}
