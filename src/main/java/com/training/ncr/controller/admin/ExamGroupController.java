package com.training.ncr.controller.admin;

import com.training.ncr.service.admin.ExamGroupService;
import com.training.ncr.vo.admin.ExamGrpVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
public class ExamGroupController {

    @Autowired
    ExamGroupService examGroupService;
    @GetMapping("/admin/exam_group")
    public List<ExamGrpVO> getExamGrp(){
        return examGroupService.getExamGrp();
    }

    @PostMapping("/admin/add_exam_grp")
    public int insertExamGrp(@RequestBody ExamGrpVO examGrpVO){
        return examGroupService.insertExamGrp(examGrpVO);
    }

    // 삭제를 위한 조회
    @GetMapping("/admin/add_exam_grp/{mgr}")
    public int selectMgmtState(@PathVariable String mgr){
        return examGroupService.selectMgmtState(mgr);
    }
}
