package com.training.ncr.mapper.user;

import com.training.ncr.vo.admin.MgmtVO;
import com.training.ncr.vo.TeamCodeVO;
import com.training.ncr.vo.UserVO;
import org.apache.catalina.User;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.Map;

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

    // 해당 팀에 몇명 있는지 가져오기
    int getGrpCountByGrp(UserVO userVO);

    // 내가 훈련중인지 가져오기
    List<MgmtVO> getTrUserStateByUserid();

    // 훈련 시작 여부
    int getTrainingState(int num);

    // 활성화된 문제그룹이 있는지 가져오기
    int getTrainingStateActiveOn();

    // 현재 훈련자의 훈련진행중인 차시를 이용하여 문제그룹 ID 구해서 grp 구하기
    int userDuplicationExamAnotherTeam(String id);
}
