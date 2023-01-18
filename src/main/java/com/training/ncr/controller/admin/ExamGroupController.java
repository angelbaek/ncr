package com.training.ncr.controller.admin;

import com.training.ncr.service.admin.ExamGroupService;
import com.training.ncr.vo.admin.ExamGrpVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
