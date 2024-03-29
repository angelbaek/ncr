package com.training.ncr.controller.user;

import com.training.ncr.service.user.GroupService;
import com.training.ncr.vo.admin.MgmtVO;
import com.training.ncr.vo.TeamCodeVO;
import com.training.ncr.vo.UserVO;
import org.apache.ibatis.binding.BindingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
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
    public int callUserUpdate(@RequestBody UserVO userVO, HttpServletRequest request) {
        HttpSession session = request.getSession();
        String id = (String) session.getAttribute("USERID");
        userVO.setTr_user_id(id);
        return groupService.callUserUpdate(userVO,request);
    }

    //훈련 시작
    @GetMapping("user/training/{tr_num}")
    public List<MgmtVO> callTraining(@PathVariable int tr_num){
        return groupService.callTraining(tr_num);
    }

    // 아이디로 정보 조회
    @GetMapping("user/get_group_info_by_id")
    public List<UserVO> getUserInfo(HttpServletRequest request){
        HttpSession session = request.getSession();
        String id = (String) session.getAttribute("USERID");
        return groupService.getUserInfo(id);
    }

    // 훈련 시작 여부
    @GetMapping("user/get_training_state/{num}")
    public int getTrainingState(@PathVariable int num){
        return groupService.getTrainingState(num);
    }

    // 활성화된 문제그룹이 있는지 가져오기
    @GetMapping("user/get_training_state_active_on")
    public int getTrainingStateActiveOn(){
        try{
            return groupService.getTrainingStateActiveOn();
        }catch (BindingException b){
            System.out.println("활성화 된 문제그룹 없음");
            return 0;
        }
    }


}
