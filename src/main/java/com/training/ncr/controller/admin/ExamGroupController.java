package com.training.ncr.controller.admin;

import com.training.ncr.service.admin.ExamGroupService;
import com.training.ncr.vo.admin.ExamGrpVO;
import com.training.ncr.vo.admin.ExamHintVO;
import com.training.ncr.vo.admin.ExamVO;
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

    // 선택한 그룹 보여주기
    @GetMapping("/admin/exam_group_select/{num}")
    public List<ExamGrpVO> getExamGrpSelect(@PathVariable int num){
        return examGroupService.getExamGrpSelect(num);
    }

    //삭제
    @DeleteMapping("/admin/exam_group_delete/{name}")
    public int getExamGrpDelete(@PathVariable String name){
        return examGroupService.getExamGrpDelete(name);
    }

    // 선택한 그룹명으로 grpid 찾기
    @GetMapping("admin/exam_group_find_grpid/{name}")
    public List<ExamGrpVO> findByGrpid(@PathVariable String name){
        return examGroupService.findByGrpid(name);
    }

    // TRAIN_EXAM 테이블 INSERT
    @PostMapping("/admin/add_train_exam")
    public List<ExamVO> insertTrainExam(@RequestBody ExamGrpVO examGrpVO){
        return examGroupService.insertTrainExam(examGrpVO);
    }

    // GrpId, ExamId로 ExamHint insert
    @PostMapping("/admin/add_train_examhint")
    public int insertExamhintByGrpIdAndExamId(@RequestBody ExamHintVO examHintVO){
        return examGroupService.insertExamhintByGrpIdAndExamId(examHintVO);
    }
}
