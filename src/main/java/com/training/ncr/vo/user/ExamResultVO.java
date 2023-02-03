package com.training.ncr.vo.user;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ExamResultVO {
    int stat_id, tr_num, tr_exam_grpid, tr_exam_id, result_score, cnt_try_ans, hint_use, correct_answer;
    String tr_user_id, input_answer;
}
