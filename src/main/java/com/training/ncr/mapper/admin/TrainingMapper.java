package com.training.ncr.mapper.admin;

import com.training.ncr.vo.TeamCodeVO;
import com.training.ncr.vo.UserVO;
import com.training.ncr.vo.admin.MgmtVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface TrainingMapper {

    // 훈련 설정 현재 상태 불러오기
    List<MgmtVO> callMgmt();

    // 훈련설정 차시별 확인
    int updateMgr(MgmtVO mgmtVO);

    // 훈련설정 차시별 수정
    int updateMgrEdit(MgmtVO mgmtVO);

    // 훈련시작
    int trainingStart(MgmtVO mgmtVO);

    // 훈련중지
    int trainingPause();

    // 그룹 View
    List<UserVO> groupVew();

    // 팀코드 view
    List<TeamCodeVO> teamcodeView();
}
