package com.training.ncr.controller.user;

import com.training.ncr.service.user.GroupService;
import com.training.ncr.vo.admin.MgmtVO;
import com.training.ncr.vo.TeamCodeVO;
import com.training.ncr.vo.UserVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 훈련자 (그룹 설정) 컨트롤러
 */

@RestController
@CrossOrigin
public class GroupController {

    @Autowired
    GroupService groupService;

    //팀(조) 조회하기
    @GetMapping("/userGRP")
    public List<TeamCodeVO> callTeamCode(){
        return groupService.callTeamCode();
    }

    //팀 코드 업데이트
    @PatchMapping("user/update")
    public int callUserUpdate(@RequestBody UserVO userVO) {
        return groupService.callUserUpdate(userVO);
    }

    //훈련 시작
    @GetMapping("user/training/{tr_num}")
    public List<MgmtVO> callTraining(@PathVariable int tr_num){
        return groupService.callTraining(tr_num);
    }
}