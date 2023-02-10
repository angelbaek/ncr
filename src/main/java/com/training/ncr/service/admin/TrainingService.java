package com.training.ncr.service.admin;

import com.training.ncr.mapper.admin.TrainingMapper;
import com.training.ncr.vo.TeamCodeVO;
import com.training.ncr.vo.UserVO;
import com.training.ncr.vo.admin.ExamGrpVO;
import com.training.ncr.vo.admin.MgmtVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TrainingService {

    @Autowired
    TrainingMapper trainingMapper;

    // 훈련 설정 불러오기
    public List<ExamGrpVO> getExamGrp(){
        return trainingMapper.getExamGrp();
    }

    // 훈련설정 차시별 확인
    public int insertMgr(MgmtVO mgmtVO){
        return trainingMapper.insertMgr(mgmtVO);
    }

    // 훈련설정 차시별 수정
    public int deleteMgrEdit(MgmtVO mgmtVO){
        return trainingMapper.deleteMgrEdit(mgmtVO);
    }

    //훈련 시작
    public int trainingStart(MgmtVO mgmtVO){
        System.out.println(mgmtVO.getTr_num()+"차시 문제그룹:"+mgmtVO.getTr_exam_grp()+" 훈련시작");
        return trainingMapper.trainingStart(mgmtVO);
    }

    //훈련 정지
    public int trainingPause(){
        return trainingMapper.trainingPause();
    }

    //그룹 view
    public List<UserVO> groupVew(){
        return trainingMapper.groupVew();
    }

    //팀코드 view
    public List<TeamCodeVO> teamcodeView(){
        return trainingMapper.teamcodeView();
    }

    //mgmt 불러오기
    public List<MgmtVO> getTranMgmt() {
    return trainingMapper.getTranMgmt();
    }
}
