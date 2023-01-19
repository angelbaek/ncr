package com.training.ncr.mapper.admin;

import com.training.ncr.vo.TeamCodeVO;
import com.training.ncr.vo.UserVO;
import com.training.ncr.vo.admin.ExamGrpVO;
import com.training.ncr.vo.admin.MgmtVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface TrainingMapper {

    // 훈련 설정 현재 상태 불러오기
    List<ExamGrpVO> getExamGrp();

    // 훈련설정 차시별 확인
    int insertMgr(MgmtVO mgmtVO);

    // 훈련설정 수정버튼
    int deleteMgrEdit(MgmtVO mgmtVO);

    // 훈련시작
    int trainingStart(MgmtVO mgmtVO);

    // 훈련중지
    int trainingPause();

    // 그룹 View
    List<UserVO> groupVew();

    // 팀코드 view
    List<TeamCodeVO> teamcodeView();

    // mgmt 불러오기
    List<MgmtVO> getTranMgmt();
}
