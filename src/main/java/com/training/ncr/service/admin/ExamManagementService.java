package com.training.ncr.service.admin;

import com.training.ncr.mapper.admin.ExamGroupMapper;
import com.training.ncr.mapper.admin.ExamManagementMapper;
import com.training.ncr.vo.admin.*;
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

    // 선택한 문제 내용 가져오기
    public List<ExamVO> getExam(ExamVO examVO){
        return examManagementMapper.getExam(examVO);
    }

    // 선택한 문항이 설정되지 않았을때
    public int insertNoneExam(ExamVO examVO){
        return examManagementMapper.insertNoneExam(examVO);
    }

    // 선택한 문항 문제id 가져오기
    public List<ExamVO> examIdGet(ExamVO examVO){
        return examManagementMapper.examIdGet(examVO);
    }

    // 힌트 db 추가
    public int hintInsert(ExamHintVO examHintVO){
        return examManagementMapper.hintInsert(examHintVO);
    }

    // 힌트 업데이트
    public int hintUpdate(ExamHintVO examHintVO){
        examManagementMapper.hintUpdateExam(examHintVO);
        return examManagementMapper.hintUpdate(examHintVO);
    }

    // 문제id만 가져오기
    public String getExamId(ExamVO examVO){
        return examManagementMapper.getExamId(examVO);
    }

    // 전술단계 가져오기
    public List<TacticsVO> getTactics(){
        return examManagementMapper.getTactics();
    }

    // 전술단계 저장
    public int updateTactics(ExamVO examVO){
        return examManagementMapper.updateTactics(examVO);
    }

    // 문제 최종저장
    public int updateExamFinal(ExamVO examVO){
        return examManagementMapper.updateExamFinal(examVO);
    }

    // 문제 그룹id로 matrix 가져오기
    public List<MatrixVO> getMiterMatrixByGrpid(int grpId){
        return examManagementMapper.getMiterMatrixByGrpid(grpId);
    }

    // csv 읽어서 문제 업로드
    public int examUpdateByCsv(ExamVO examVO){
        System.out.println("정답"+examVO.getTr_exam_ans());
        return examManagementMapper.examUpdateByCsv(examVO);
    };
}
