package com.training.ncr.vo.user;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ExamResultTeamVO {
    int stat_id, tr_user_grp, tr_num, tr_exam_grpid, tr_exam_id, result_score, cnt_try_ans, hint_use;
    String team_cd, answer_user_id, input_answer;
}
