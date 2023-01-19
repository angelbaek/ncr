package com.training.ncr.service.admin;

import com.training.ncr.mapper.admin.ExamGroupMapper;
import com.training.ncr.vo.admin.ExamGrpVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExamGroupService {

    @Autowired
    ExamGroupMapper examGroupMapper;

    public List<ExamGrpVO> getExamGrp(){
        return examGroupMapper.getExamGrp();
    };

    public int insertExamGrp(ExamGrpVO examGrpVO){
        // 문제 그룹명
        String name = examGrpVO.getTr_exam_grpname();

        // 중복된 그룹명이 존재할 경우
        if(examGroupMapper.overlapCheck(name)!=null){
            return 0;
        }else{
            examGroupMapper.insertExamGrp(examGrpVO);
            return 1;
        }
    }
    //삭제를 위한 조회
    public int selectMgmtState(String mgr){
        return examGroupMapper.selectMgmtState(mgr);
    }
}
