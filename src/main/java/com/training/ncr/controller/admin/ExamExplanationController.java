package com.training.ncr.controller.admin;

import com.training.ncr.mapper.admin.ExamExplanationMapper;
import com.training.ncr.service.admin.ExamExplanationService;
import com.training.ncr.vo.admin.MgmtVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/admin")
public class ExamExplanationController {

    @Autowired
    ExamExplanationService examExplanationService;

    // 문제 풀이 그룹 조회
    @GetMapping("/exam_explanation")
    public List<MgmtVO> searchMgmtState(){
        return examExplanationService.searchMgmtState();
    };

    // 훈련 시작한 문항과 문제그룹정보 가져오기
    @GetMapping("")
    public List<Object> getStartExamAndGrp(@PathVariable String grpName){
        return examExplanationService.getStartExamAndGrp(grpName);
    }
}
