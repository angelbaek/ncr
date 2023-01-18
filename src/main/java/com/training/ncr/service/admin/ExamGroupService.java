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
}
