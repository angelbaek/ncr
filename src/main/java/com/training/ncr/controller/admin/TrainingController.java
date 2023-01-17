package com.training.ncr.controller.admin;

import com.training.ncr.service.admin.TrainingService;
import com.training.ncr.vo.TeamCodeVO;
import com.training.ncr.vo.UserVO;
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
    public List<MgmtVO> callMgmt(){
        return trainingService.callMgmtVOList();
    }

    @PatchMapping("/admin/gprAct")
    public int updateMgr(@RequestBody MgmtVO mgmtVO){
        return trainingService.updateMgr(mgmtVO);
    }

    // 훈련 시작
    @PatchMapping("/admin/trainingStart")
    public int trainingStart(){
        return trainingService.trainingStart();
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
}
