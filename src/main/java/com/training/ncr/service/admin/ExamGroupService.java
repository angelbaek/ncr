package com.training.ncr.service.admin;

import com.training.ncr.mapper.admin.ExamGroupMapper;
import com.training.ncr.vo.admin.ExamGrpVO;
import com.training.ncr.vo.admin.ExamHintVO;
import com.training.ncr.vo.admin.ExamVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

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

    public List<ExamGrpVO> getExamGrpSelect(int num) {
        return examGroupMapper.getExamGrpSelect(num);
    }

    //삭제
    public int getExamGrpDelete(String name){
        // mgmt 에 있으면 같이 삭제시키기
        examGroupMapper.deleteMgmt(name);
        return examGroupMapper.getExamGrpDelete(name);
    }

    // 선택한 그룹명으로 grpid 찾기
    public List<ExamGrpVO> findByGrpid(String name){
        return examGroupMapper.findByGrpid(name);
    }

    // TRAIN_EXAM 테이블 INSERT
    public List<ExamVO> insertTrainExam(ExamGrpVO examGrpVO){
        int grpid = examGrpVO.getTr_exam_grpid();
        int grpCount = examGrpVO.getTr_exam_count();
        for(int i=1; i<=grpCount; i++){
            examGrpVO.setTr_exam_count(i);
            examGroupMapper.insertTrainExam(examGrpVO);
        }
        return examGroupMapper.findExamidByGrpid(grpid);
    }

    // GrpId, ExamId로 ExamHint insert
    public int insertExamhintByGrpIdAndExamId(ExamHintVO examHintVO){
        return examGroupMapper.insertExamhintByGrpIdAndExamId(examHintVO);
    }

    // 문제그룹 수정(update)
    public int updateGrpByGrpName(ExamGrpVO examGrpVO){
        return examGroupMapper.updateGrpByGrpName(examGrpVO);
    }

    // 문제이름으로 문제그룹의 문제갯수 가져오기
    public int getExamCountByGrpName(String tr_exam_grpname){
        return examGroupMapper.getExamCountByGrpName(tr_exam_grpname);
    }
}
