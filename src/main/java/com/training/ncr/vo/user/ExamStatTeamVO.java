package com.training.ncr.vo.user;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ExamStatTeamVO {
    int stat_id, tr_user_grp, tr_num, tr_exam_grpid, cnt_correct_ans, result_sum, submit_answer;
    String team_cd, start_time, end_time;
}
