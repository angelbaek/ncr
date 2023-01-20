package com.training.ncr.service.admin;

import com.training.ncr.mapper.admin.ExamGroupMapper;
import com.training.ncr.mapper.admin.ExamManagementMapper;
import com.training.ncr.vo.admin.ExamGrpVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExamManagementService {

    @Autowired
    ExamManagementMapper examManagementMapper;

    // 문제 그룹 불러오기
    public List<ExamGrpVO> getExamGrp(){
        return examManagementMapper.getExamGrp();
    }

    // 선택된 문제그룹 문항 수 가져오기
    public List<ExamGrpVO> getExamGrpCount(int grpId){
        return examManagementMapper.getExamGrpCount(grpId);
    }
}
