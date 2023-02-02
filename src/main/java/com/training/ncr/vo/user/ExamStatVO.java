package com.training.ncr.vo.user;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ExamStatVO {

    int stat_id, tr_user_grp, tr_num, tr_exam_grpid, cnt_correct_ans, cnt_false_ans, result_sum, submit_answer;
    String tr_user_id, start_time, end_time;
}
