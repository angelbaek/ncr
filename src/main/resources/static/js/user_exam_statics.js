// 세션 가져오기
// sessionManagementForUser();

// select 감지
// 차시 감지
$("#select_num").on("change", function () {
  //selected value
  $(this).val();
  var num = $("option:selected", this).attr("value");
  //selected option element
  $("option:selected", this);
  $("option:selected", this).text();
  $(this).find("option:selected").text();
  // 유형
  var type = $("#select_type").val();

  console.log("차시:" + num + " /유형:" + type);
  if (num == 0 || type == 0) {
    console.log("아직 미선택...");
    return;
  }
  getExamResultByNumAndType(num, type);
});

// 유형 감지
$("#select_type").on("change", function () {
  //selected value
  $(this).val();
  var type = $("option:selected", this).attr("value");
  //selected option element
  $("option:selected", this);
  $("option:selected", this).text();
  $(this).find("option:selected").text();
  // 차시
  var num = $("#select_num").val();

  console.log("차시:" + num + " /유형:" + type);
  if (num == 0 || type == 0) {
    console.log("아직 미선택...");
    return;
  }
  getExamResultByNumAndType(num, type);
});

// 차시, 유형으로 훈련현황 불러오기
function getExamResultByNumAndType(num, type) {
  toggleStatic();
  var jsonData = {
    num: num,
    type: type,
  };
  $.ajax({
    async: false,
    url: "http://192.168.32.44:8080/user/get_exam_result_by_num_and_type",
    type: "POST",
    dataType: "json",
    contentType: "application/json",
    data: JSON.stringify(jsonData),
    success: function (response) {
      console.log(response);
      if (response.length == 0) {
        alert("해당 조건에 해당하는 데이터가 없습니다");
        location.reload();
        return;
      }
      var id = response[0].tr_user_id;
      var html = "<tr>";
      if (id == undefined) {
        // 팀별 조회
        console.log("팀별 조회임");
      } else if (id != undefined) {
        // 개인 조회
        for (var i = 0; i < response.length; i++) {
          var id = response[i].tr_user_id; // 아이디 대입
          var org = selectUserOrgByUserId(id); // 유저id로 기관명 가져오기
          //훈련자명	기관명	차시	총점수	정답/오답	답안제출	소요시간	시작시간	종료시간
          var targetStartTime = response[i].start_time; // 시작시간
          var startTime = targetStartTime.substr(0, 16); // 시작시간 변환
          var targetEndTime = response[i].end_time; // 종료시간
          var delayTime = 0; // 소요시간
          // 종료시간이 없을때
          if (targetEndTime == null) {
            endTime = "-";
            delayTime = "-";

            // 현재 시각
            let now = new Date();

            var year = now.getFullYear() + now.getDay() + now.getDate(); // 날
            var hours = now.getHours(); // 현재 시간
            console.log("시간 : ", hours);

            var minutes = now.getMinutes(); // 현재 분
            console.log("분 : ", minutes);

            var seconds = now.getSeconds(); // 현재 초
            console.log("초 : ", seconds);

            console.log("년:" + year);
            var target = startTime.substr(0, 4);
            console.log("타겟:" + target + " 이어:" + year);
            target = target - year;
            // 소요시간 계산 로직
            // 시작시간
            var start = startTime.substr(11, 5);
            var startH = startTime.substr(11, 2);
            var startM = startTime.substr(14, 2);
            // 초로 변환
            var startF = startH * 3600 + startM * 60;
            var endF = hours * 3600 + minutes * 60;

            var result = endF - startF;

            var h = parseInt(result / 3600); // 시
            var m = parseInt((result - h * 3600) / 60); // 분
            if (h == 0) {
              delayTime = m + "분";
            } else if (target != 0) {
              delayTime = "시간 초과";
            } else {
              delayTime = h + "시간 " + m + "분";
            }
          } else {
            // 소요시간 계산 로직
            var endTime = targetEndTime.substr(0, 16); // 종료시간 변환
            // 시작시간
            var start = startTime.substr(11, 5);
            var startH = startTime.substr(11, 2);
            var startM = startTime.substr(14, 2);
            // 초로 변환
            var startF = startH * 3600 + startM * 60;
            // 종료시간
            var end = endTime.substr(11, 5);
            var endH = endTime.substr(11, 2);
            var endM = endTime.substr(14, 2);
            // 초로 변환
            var endF = endH * 3600 + endM * 60;

            var result = endF - startF;

            var h = parseInt(result / 3600); // 시
            var m = parseInt((result - h * 3600) / 60); // 분
            if (h == 0) {
              delayTime = m + "분";
            } else {
              delayTime = h + "시간 " + m + "분";
            }

            console.log(result);
          }
          var statId = response[i].stat_id;
          var grp = response[i].tr_user_grp;
          var num = response[i].tr_num;
          var grpId = response[i].tr_exam_grpid;
          var submit = response[i].submit_answer;
          if (submit == 0) {
            submit = "미제출";
          } else if (submit == 1) {
            submit = "제출";
          }
          html +=
            "<td onclick='getUserExamStat(" +
            statId +
            "," +
            grp +
            "," +
            num +
            "," +
            grpId +
            ")'><a>" +
            id +
            "</a></td><td>" +
            org +
            "</td><td>" +
            response[i].tr_num +
            "</td><td>" +
            response[i].result_sum +
            "</td><td>" +
            response[i].cnt_correct_ans +
            "/" +
            response[i].cnt_false_ans +
            "</td><td>" +
            submit +
            "</td><td>" +
            delayTime +
            "</td><td>" +
            startTime +
            "</td><td>" +
            endTime +
            "</td></tr>";
        }
      }
      $(".static_body_total").empty();
      $(".static_body_total").append(html);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR); //응답 메시지
      console.log(textStatus); //"error"로 고정인듯함
      console.log(errorThrown);
      alert("조회된 데이터가 없습니다");
    },
  });
}

// 선택한 훈련자 풀이현황 가져오기
function getUserExamStat(statId, grp, num, grpId) {
  toggleDetail();
  $(".user_body_total").empty();
  let htmlBody = "<tr>";
  let htmlHead = "<tr>";
  var jsonData = {
    // tr_user_id: id,
    stat_id: statId,
    tr_num: num,
    tr_exam_grpid: grpId,
  };
  $.ajax({
    url: "http://192.168.32.44:8080/user/get_user_exam_stat",
    type: "POST",
    dataType: "json",
    contentType: "application/json",
    data: JSON.stringify(jsonData),
    success: function (response) {
      console.log(response);
      for (var i = 0; i < response.length; i++) {
        var answer = response[i].input_answer; // 유저가 입력한 답
        var correct_answer = response[i].correct_answer; // 정답 여부
        var tryAns = response[i].cnt_try_ans; // 정답 입력 횟수
        var score = response[i].result_score; // 획득점수
        if (answer == null) answer = "-";
        if (i % 10 == 0) {
          htmlHead += "</tr>";
          htmlBody += "</tr>";
          $(".user_body_total").append(htmlHead);
          $(".user_body_total").append(htmlBody);
          htmlHead = "";
          htmlBody = "";
          // 정답일때
          if (score > 0) {
            htmlHead += "<tr><th>" + (i + 1) + "번</th>";
            htmlBody += "<tr><td class='ans_true'>" + answer + "</td>";
            // 오답일때
          } else if (score == 0 && tryAns > 0) {
            htmlHead += "<tr><th>" + (i + 1) + "번</th>";
            htmlBody += "<tr><td class='ans_false'>" + answer + "</td>";
            // 입력안했을때
          } else if (answer == "-") {
            htmlHead += "<tr><th>" + (i + 1) + "번</th>";
            htmlBody += "<tr><td>" + answer + "</td>";
          }
          if (i == response.length - 1) {
            htmlHead += "</tr>";
            htmlBody += "</tr>";
          }
        } else {
          // 정답일때
          if (score > 0) {
            htmlHead += "<th>" + (i + 1) + "번</th>";
            htmlBody += "<td class='ans_true'>" + answer + "</td>";
            // 오답일때
          } else if (score == 0 && tryAns > 0) {
            htmlHead += "<th>" + (i + 1) + "번</th>";
            htmlBody += "<td class='ans_false'>" + answer + "</td>";
            // 입력안했을때
          } else if (answer == "-") {
            htmlHead += "<th>" + (i + 1) + "번</th>";
            htmlBody += "<td>" + answer + "</td>";
          }
          if (i == response.length - 1) {
            htmlHead += "</tr>";
            htmlBody += "</tr>";
          }
        }
      }
      $(".user_body_total").append(htmlHead);
      $(".user_body_total").append(htmlBody);
    },
  });
}

// 훈련자 기관명 가져오기
function selectUserOrgByUserId(id) {
  var org = 0;
  var jsonData = {
    id: id,
  };
  $.ajax({
    async: false,
    url: "http://192.168.32.44:8080/user/select_user_org_by_user_id",
    type: "POST",
    dataType: "json",
    contentType: "application/json",
    data: JSON.stringify(jsonData),
    success: function (response) {
      // console.log(response);
      org = response.tr_user_org;
    },
  });
  return org;
}

// 훈련통계 toggle
function toggleStatic() {
  $(".static_title").css("display", "block");
  $(".show_static_body_total").css("display", "table");
}

// 훈련세부사항 toggle
function toggleDetail() {
  $(".static_detail_title").css("display", "block");
  $(".user_body_status").css("display", "table");
}
