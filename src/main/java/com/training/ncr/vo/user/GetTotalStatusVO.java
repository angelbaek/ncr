package com.training.ncr.vo.user;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GetTotalStatusVO {
    int explanationCount; // 풀이개수
    int resultScore; // 획득점수
    int wrongScore; // 오답감점
    int hintScore; // 힌트감점
}
