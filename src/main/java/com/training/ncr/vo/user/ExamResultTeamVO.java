package com.training.ncr.vo.user;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ExamResultTeamVO {
    int stat_id, tr_user_grp, tr_num, tr_exam_grpid, tr_exam_id, cnt_try_ans, hint_use;
    String team_cd, answer_user_id, input_answer;

    // 문제 배점
    int point;
    // 힌트 사용 감점
    int hint;
    // 오답 점수

    int explanationCount; // 풀이개수
    int result_score; // 획득점수
    int wrong_score; // 오답감점
    int hint_score; // 힌트감점

    int secansAllow; // 2차 풀이 활성화 여부
}
