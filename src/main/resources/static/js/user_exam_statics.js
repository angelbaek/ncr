// 세션 가져오기
// sessionManagementForUser();
// 해당하는 매트릭스id를 저장할 배열
let matrixArray = new Array();
// select 감지
// 차시 감지
$("#select_num").on("change", function () {
  $(".static_detail_title").css("display", "none");
  $(".user_body_status").css("display", "none");
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
  $(".static_detail_title").css("display", "none");
  $(".user_body_status").css("display", "none");
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
      var grpid = response[0].tr_exam_grpid;
      var id = response[0].tr_user_id;
      var htmlHead = "";
      var html = "<tr>";
      var examTime = getTotalTime(grpid);
      if (id == undefined) {
        // 팀별 조회
        $(".static_title").text("훈련팀별 통계");
        htmlHead =
          "<tr><th>팀코드</th><th>기관명</th><th>차시</th><th>총 점수</th><th>정답/오답</th><th>답안제출</th><th>소요시간</th><th>시작시간</th><th>종료시간</th></tr>";

        console.log("팀별 조회...");
        for (var i = 0; i < response.length; i++) {
          var team = response[i].team_cd; // 팀코드
          var org; // 기관명
          var num = response[i].tr_num; // 차시
          var grpId = response[i].tr_exam_grpid; // grp id
          var grp = response[i].tr_user_grp; // grp
          var resultPoint = response[i].result_sum; // 총 점수
          var ans = response[i].cnt_correct_ans; // 정답수
          var falseAns = response[i].cnt_false_ans; // 오답수
          var submit = response[i].submit_answer; // 답안제출
          if (submit == 1) {
            submit = "제출";
          } else {
            submit = "미제출";
          }
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

            var minutes = now.getMinutes(); // 현재 분

            var seconds = now.getSeconds(); // 현재 초

            var target = startTime.substr(0, 4);
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
              var h = parseInt(examTime / 3600); // 시
              var m = parseInt((examTime - h * 3600) / 60); // 분
              delayTime = h + "시간 " + m + "분";
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
            } else if (target != 0) {
              var h = parseInt(examTime / 3600); // 시
              var m = parseInt((examTime - h * 3600) / 60); // 분
              delayTime = h + "시간 " + m + "분";
            } else {
              delayTime = h + "시간 " + m + "분";
            }
          }
          html +=
            "<tr><td onclick='getExamResultTeam(" +
            response[i].stat_id +
            "," +
            num +
            "," +
            grpId +
            "," +
            grp +
            ")'><a class='team_name_" +
            response[i].stat_id +
            "'>" +
            team +
            "</a></td><td>기관명</td><td>" +
            num +
            "</td><td>" +
            resultPoint +
            "</td><td>" +
            ans +
            "/" +
            falseAns +
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
        $(".static_body_total").empty();
        $(".static_body_total").append(html);
      } else if (id != undefined) {
        // 개인 조회
        console.log("개인별 조회...");
        $(".static_title").text("훈련자별 통계");
        htmlHead =
          "<tr><th>훈련자명</th><th>기관명</th><th>차시</th><th>총 점수</th><th>정답/오답</th><th>답안제출</th><th>소요시간</th><th>시작시간</th><th>종료시간</th></tr>";
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

            var minutes = now.getMinutes(); // 현재 분

            var seconds = now.getSeconds(); // 현재 초

            var target = startTime.substr(0, 4);
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
              var h = parseInt(examTime / 3600); // 시
              var m = parseInt((examTime - h * 3600) / 60); // 분
              delayTime = h + "시간 " + m + "분";
            } else {
              delayTime = h + "시간 " + m + "분";
            }
          } else {
            // // 현재 시각
            // let now = new Date();

            // var year = now.getFullYear() + now.getDay() + now.getDate(); // 날
            // var hours = now.getHours(); // 현재 시간

            // var minutes = now.getMinutes(); // 현재 분

            // var seconds = now.getSeconds(); // 현재 초

            // var target = parseInt(startTime.substr(0, 4));
            // console.log("중간찍기:" + target + "/" + year);
            // console.log(startTime);
            // console.log(startTime.substr(5, 2));
            // console.log(startTime.substr(8, 2));
            // target +=
            //   parseInt(startTime.substr(5, 2)) +
            //   parseInt(startTime.substr(8, 2));
            // console.log("타겟게산결과:" + target);
            // target = target - year;
            // 소요시간 계산 로직
            var endTime = targetEndTime.substr(0, 16); // 종료시간 변환
            // 시작시간
            // 날 계산
            var startY =
              parseInt(startTime.substr(0, 4)) +
              parseInt(startTime.substr(5, 2)) +
              parseInt(startTime.substr(8, 2));
            var start = startTime.substr(11, 5);
            var startH = startTime.substr(11, 2);
            var startM = startTime.substr(14, 2);
            // 초로 변환
            var startF = startH * 3600 + startM * 60;
            // 종료시간
            var endY =
              parseInt(endTime.substr(0, 4)) +
              parseInt(endTime.substr(5, 2)) +
              parseInt(endTime.substr(8, 2));
            var resultY = startY - endY;

            var end = endTime.substr(11, 5);
            var endH = endTime.substr(11, 2);
            var endM = endTime.substr(14, 2);
            // 초로 변환
            var endF = endH * 3600 + endM * 60;

            var result = endF - startF;

            var h = parseInt(result / 3600); // 시
            var m = parseInt((result - h * 3600) / 60); // 분
            if (resultY != 0) {
              var h = parseInt(examTime / 3600); // 시
              var m = parseInt((examTime - h * 3600) / 60); // 분
              delayTime = h + "시간 " + m + "분";
            } else if (h == 0) {
              delayTime = m + "분";
            } else {
              delayTime = h + "시간 " + m + "분";
            }
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
            ")'><a class='user_name_" +
            statId +
            "'>" +
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
      $(".static_head_total").empty();
      $(".static_head_total").append(htmlHead);
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
// 해당문제 기본 시간 가져오기
function getTotalTime(grpid) {
  var time = 0;
  $.ajax({
    async: false,
    url: "http://192.168.32.44:8080/user/static/get_time/" + grpid,
    type: "GET",
    dataType: "json",
    contentType: "application/json",
    success: function (response) {
      time = response * 60;
    },
  });
  return time;
}
// 선택한 훈련자 풀이현황 가져오기
function getUserExamStat(statId, grp, num, grpId) {
  var name = $(".user_name_" + statId).text(); // 훈련자 이름
  $(".static_detail_title").text(name + " 훈련자 세부사항");
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

// 선택한 훈련팀별 세부사항 가져오기
function getExamResultTeam(statId, num, grpId, grp) {
  var name = $(".team_name_" + statId).text(); // 선택한 팀 이름
  $(".static_detail_title").text(name + " 팀 훈련 세부사항");
  toggleDetail();
  $(".user_body_total").empty();
  let htmlBody = "<tr>";
  let htmlHead = "<tr>";
  var jsonData = {
    tr_num: num,
    tr_exam_grpid: grpId,
    tr_user_grp: grp,
  };
  $.ajax({
    url: "http://192.168.32.44:8080/user/static/get_exam_result_team",
    type: "POST",
    dataType: "json",
    contentType: "application/json",
    data: JSON.stringify(jsonData),
    success: function (response) {
      // console.log(response);
      var grpid = response[0].tr_exam_grpid; // grpid
      var grp = response[0].tr_user_grp; // grp
      var num = response[0].tr_num; // num
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
      getMatrixStat(grpid, grp, num);
      getMiterAttackMatrix(grpid, grp, num);
    },
  });
}
// 선택한 훈련팀 매트릭스스탯 가져오기
function getMatrixStat(grpid, grp, num) {
  console.log(grpid + "/" + grp + "/" + num);
  var jsonData = {
    tr_user_grp: grp,
    tr_num: num,
    tr_exam_grpid: grpid,
  };
  $.ajax({
    async: false,
    url: "http://192.168.32.44:8080/user/static/get_matrix_stat",
    type: "POST",
    dataType: "json",
    contentType: "application/json",
    data: JSON.stringify(jsonData),
    success: function (response) {
      console.log(response);
    },
  });
}

function matrixOn() {
  $(".matrix_title").css("display", "block");
  $(".matrix_div").css("display", "block");
}
function matrixOff() {
  $(".matrix_title").css("display", "none");
  $(".matrix_div").css("display", "none");
}

// 선택한 훈련팀 매트릭스 가져오기
function getMiterAttackMatrix(grpid, grp, num) {
  $(".matrix_div").empty();
  matrixOn();
  var htmlHead = "";
  var htmlBody = "";
  console.log(grpid);
  var jsonData = {
    tr_user_grp: grp,
    tr_num: num,
    tr_exam_grpid: grpid,
  };
  $.ajax({
    async: false,
    url: "http://192.168.32.44:8080/user/static/get_matrix",
    type: "POST",
    dataType: "json",
    contentType: "application/json",
    data: JSON.stringify(jsonData),
    success: function (response) {
      console.log(response);
      var empty = "";
      for (var i = 0; i < response.length; i++) {
        if (response[i] == null) {
          continue;
        } else if (empty != response[i].MA_TACTICS_ID) {
          empty = response[i].MA_TACTICS_ID;
          console.log(empty);
          console.log("전술단계 뿌려주기 로직 실행");
          htmlHead =
            "<div class='test_" +
            response[i].MA_TACTICS_ID +
            "'><div class='common_matrix_title'>" +
            response[i].ma_tactics_name +
            "</div></div>";
          $(".matrix_div").append(htmlHead);
          htmlBody =
            "<div>" +
            response[i].ma_tactics_tech +
            "(" +
            response[i].real +
            "/" +
            response[i].total +
            ")</div>";
          $(".test_" + response[i].MA_TACTICS_ID).append(htmlBody);
          continue;
        }
        if (response[i] != null) {
          htmlBody =
            "<div>" +
            response[i].ma_tactics_tech +
            "(" +
            response[i].real +
            "/" +
            response[i].total +
            ")</div>";
          $(".test_" + response[i].MA_TACTICS_ID).append(htmlBody);
          // console.log("그냥 매트릭스 뿌려주기실행");
        }
      }
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
      console.log(response);

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
