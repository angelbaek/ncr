package com.training.ncr.mapper.user;

import com.training.ncr.vo.user.ExamStatVO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserExplanationMapper {
    // 유저 세션id로 userGRP, TEAM_CD 구하기
    int getUserGrpAndTeamCD(ExamStatVO examStatVO);
}
