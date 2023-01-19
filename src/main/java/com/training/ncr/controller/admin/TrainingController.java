package com.training.ncr.controller.admin;

import com.training.ncr.service.admin.TrainingService;
import com.training.ncr.vo.TeamCodeVO;
import com.training.ncr.vo.UserVO;
import com.training.ncr.vo.admin.ExamGrpVO;
import com.training.ncr.vo.admin.MgmtVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
public class TrainingController {

    @Autowired
    TrainingService trainingService;

    @GetMapping("/admin/mgmt")
    public List<ExamGrpVO> getExamGrp(){
        return trainingService.getExamGrp();
    }

    // 훈련 차시별 확인
    @PostMapping("/admin/gprAct")
    public int insertMgr(@RequestBody MgmtVO mgmtVO){
        return trainingService.insertMgr(mgmtVO);
    }

    // 훈련 차시별 수정
    @DeleteMapping("/admin/gpract_edit")
    public int deleteMgrEdit(@RequestBody MgmtVO mgmtVO){
        return trainingService.deleteMgrEdit(mgmtVO);
    }

    // 훈련 시작
    @PatchMapping("/admin/trainingStart")
    public int trainingStart(@RequestBody MgmtVO mgmtVO){
        return trainingService.trainingStart(mgmtVO);
    }

    // 훈련 정지
    @PatchMapping("/admin/trainingPause")
    public int trainingPause(){
        return trainingService.trainingPause();
    }

    // 그룹 view
    @GetMapping("/admin/groupView")
    public List<UserVO> groupVew(){
        return trainingService.groupVew();
    }

    // 팀코드 view
    @GetMapping("/admin/teamcodeView")
    public List<TeamCodeVO> teamcodeView(){
        return trainingService.teamcodeView();
    }

    // mgmt table get
    @GetMapping("/admin/get_train_mgmt")
    public List<MgmtVO> getTranMgmt(){
        return trainingService.getTranMgmt();
    }
}
