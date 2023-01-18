package com.training.ncr.mapper.admin;

import com.training.ncr.vo.admin.ExamGrpVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ExamGroupMapper {

    List<ExamGrpVO> getExamGrp();
}
