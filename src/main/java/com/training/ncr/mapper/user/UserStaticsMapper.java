package com.training.ncr.mapper.user;

import com.training.ncr.vo.UserVO;
import com.training.ncr.vo.admin.ExamGrpVO;
import com.training.ncr.vo.admin.ExamHintVO;
import com.training.ncr.vo.admin.ExamVO;
import com.training.ncr.vo.user.*;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Map;

@Mapper
public interface UserStaticsMapper {

    // 개인현황 조회하기
    List<ExamStatVO> selectUser(int num);

    // 팀현황 조회하기
    List<ExamStatTeamVO> selectTeam(int num);

    // 훈련자 기관명 가져오기
    UserVO selectUserOrgByUserId(String id);

    // 선택한 훈련자 풀이현황 가져오기
    ExamStatVO getUserExamStat(ExamStatVO examStatVO);
}
