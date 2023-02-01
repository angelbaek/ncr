package com.training.ncr.service.admin;

import com.training.ncr.mapper.admin.ExamExplanationMapper;
import com.training.ncr.vo.NowExamVO;
import com.training.ncr.vo.admin.ExamHintVO;
import com.training.ncr.vo.admin.MgmtVO;
import org.apache.ibatis.binding.BindingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExamExplanationService {

    @Autowired
    ExamExplanationMapper examExplanationMapper;

    // 문제 풀이 그룹 조회
    public List<MgmtVO> searchMgmtState(){
//        try {
//            examExplanationMapper.searchMgmtState();
            return examExplanationMapper.searchMgmtState();
//        }catch (BindingException bindingException){
//            return null;
//        }
    };

    // 훈련 시작한 문항과 문제그룹정보 가져오기
    public List<NowExamVO> getStartExamAndGrp(String grpName){
        System.out.println(examExplanationMapper.getStartExamAndGrp(grpName));
        return examExplanationMapper.getStartExamAndGrp(grpName);
    }

    // 해당 힌트 가져오기
    public List<ExamHintVO> getHintFunc(ExamHintVO examHintVO){
        return examExplanationMapper.getHintFunc(examHintVO);
    };
}
