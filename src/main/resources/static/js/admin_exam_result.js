matrixOff();
// 세션 가져오기
sessionManagementForAdmin();
// 해당하는 매트릭스id를 저장할 배열
let matrixArray = new Array();
// 훈련중인 팀별, 개인별 현황 보여주기
var turn = 1;
var bg = 0;
var on = false;
// 현재 상태
let nowStat = 0;
let nowNum = 0;
let nowGrpId = 0;
let nowGrp = 0;
// 기본셋 실행
defaultSet();
// 기본셋 실행함수
function defaultSet() {
  let num = $("#select_num").val();
  $("#select_type").val(2).prop("checked", true);
  let type = $("#select_type").val();
  getExamResultByNumAndType(num, type);
}
// select 감지
// 차시 감지
$("#select_num").on("change", function () {
  $(".common_detail_div_border").css("display", "none");
  $(".common_detail_div_css").css("display", "none");
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

  // console.log("차시:" + num + " /유형:" + type);
  if (num == 0 || type == 0) {
    // console.log("아직 미선택...");
    return;
  }
  getExamResultByNumAndType(num, type);
});

// 유형 감지
$("#select_type").on("change", function () {
  $(".common_detail_div_border").css("display", "none");
  $(".common_detail_div_css").css("display", "none");
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

  // console.log("차시:" + num + " /유형:" + type);
  if (num == 0 || type == 0) {
    // console.log("아직 미선택...");
    return;
  }
  getExamResultByNumAndType(num, type);
});

// 차시, 유형으로 훈련현황 불러오기
function getExamResultByNumAndType(num, type, grpId) {
  // // console.log(num + "/" + type);
  if (on == false) {
    grpId = 0;
  }
  // // console.log(grpId);
  matrixOff();
  toggleStatic();
  var jsonData = {
    num: num,
    type: type,
    tr_exam_grpid: grpId,
  };
  $.ajax({
    async: false,
    url: "https://192.168.32.44:8444/user/get_exam_result_by_num_and_type",
    type: "POST",
    dataType: "json",
    contentType: "application/json",
    data: JSON.stringify(jsonData),
    success: function (response) {
      // // console.log(response);
      if (response.length == 0) {
        $(".common_msg_popup_contents").text("해당 조건에 데이터가 없습니다");
        popupMsg();
        // alert("해당 조건에 데이터가 없습니다");
        $(".static_title").css("display", "none");
        $(".show_static_body_total").css("display", "none");
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
          "<tr><th>팀코드</th><th>기관명</th><th>차시</th><th><score>총 점수</score></th><th>정답/오답</th><th>답안제출</th><th>소요시간</th><th>시작시간</th><th>종료시간</th></tr>";

        // // console.log("팀별 조회...");
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
          // 로직 기관명 구하기
          var targetOrg = getTeamOrg(num, grpId, grp);
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
            var a = now.getFullYear();
            var b = now.getDay();
            var c = now.getDate();
            var hours = now.getHours(); // 현재 시간

            var minutes = now.getMinutes(); // 현재 분

            var seconds = now.getSeconds(); // 현재 초

            var target =
              parseInt(startTime.substr(0, 4)) +
              parseInt(startTime.substr(5, 2)) +
              parseInt(startTime.substr(8, 2));

            // 현재 연월일을 합친값으로 비교분석 구문
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
            var h,
              m = 0;
            h = parseInt(result / 3600); // 시
            m = parseInt((result - h * 3600) / 60); // 분
            if (h == 0) {
              delayTime = m + "분";
            } else if (target != 0) {
              var h,
                m = 0;
              h = parseInt(examTime / 3600); // 시
              m = parseInt((examTime - h * 3600) / 60); // 분
              delayTime = h + "시간 " + m + "분";
            } else {
              delayTime = h + "시간 " + m + "분";
            }

            // 종료 시간이 있을때
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
            var h,
              m = 0;
            h = parseInt(result / 3600); // 시
            m = parseInt((result - h * 3600) / 60); // 분

            if (h == 0) {
              delayTime = m + "분";
            } else if (target != 0) {
              var h,
                m = 0;
              h = parseInt(examTime / 3600); // 시
              m = parseInt((examTime - h * 3600) / 60); // 분
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
            "</a></td><td class='org_" +
            num +
            "_" +
            grpId +
            "_" +
            grp +
            "'>" +
            targetOrg +
            "</td><td>" +
            num +
            "</td><td>" +
            resultPoint +
            "</td><td>" +
            ans +
            "/" +
            falseAns +
            "</td><td>" +
            submit +
            "</td><td class='delay_" +
            num +
            "_" +
            grpId +
            "_" +
            grp +
            "'>" +
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
        // console.log("개인별 조회...");
        $(".static_title").text("훈련자별 통계");
        htmlHead =
          "<tr><th>훈련자명</th><th>기관명</th><th>차시</th><th><score>총 점수</score></th><th>정답/오답</th><th>답안제출</th><th>소요시간</th><th>시작시간</th><th>종료시간</th></tr>";
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

            var target =
              parseInt(startTime.substr(0, 4)) +
              parseInt(startTime.substr(5, 2)) +
              parseInt(startTime.substr(8, 2));

            // 현재 연월일을 합친값으로 비교분석 구문
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
            var h,
              m = 0;
            h = parseInt(result / 3600); // 시
            m = parseInt((result - h * 3600) / 60); // 분
            if (h == 0) {
              delayTime = m + "분";
            } else if (target != 0) {
              var h,
                m = 0;
              h = parseInt(examTime / 3600); // 시
              m = parseInt((examTime - h * 3600) / 60); // 분
              delayTime = h + "시간 " + m + "분";
            } else {
              delayTime = h + "시간 " + m + "분";
            }

            // 종료 시간이 있을때
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
            var h,
              m = 0;
            h = parseInt(result / 3600); // 시
            m = parseInt((result - h * 3600) / 60); // 분

            if (h == 0) {
              delayTime = m + "분";
            } else if (target != 0) {
              var h,
                m = 0;
              h = parseInt(examTime / 3600); // 시
              m = parseInt((examTime - h * 3600) / 60); // 분
              delayTime = h + "시간 " + m + "분";
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
            "<td class='" +
            id +
            "' onclick='getUserExamStat(" +
            statId +
            "," +
            grp +
            "," +
            num +
            "," +
            grpId +
            ")'><a class='user_name_" +
            statId +
            "' id='target_name_" +
            statId +
            "_" +
            num +
            "_" +
            grpId +
            "_" +
            grp +
            "'>" +
            id +
            "</a></td><td class='org_" +
            num +
            "_" +
            grpId +
            "_" +
            grp +
            "'>" +
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
            "</td><td class='delay_" +
            num +
            "_" +
            grpId +
            "_" +
            grp +
            "'>" +
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
      // console.log(jqXHR); //응답 메시지
      // console.log(textStatus); //"error"로 고정인듯함
      // console.log(errorThrown);
      $(".common_msg_popup_contents").text("조회된 데이터가 없습니다");
      popupMsg();
      // alert("조회된 데이터가 없습니다");
      $(".static_title").css("display", "none");
      $(".show_static_body_total").css("display", "none");
    },
  });
}
// 해당문제 기본 시간 가져오기
function getTotalTime(grpid) {
  var time = 0;
  $.ajax({
    async: false,
    url: "https://192.168.32.44:8444/user/static/get_time/" + grpid,
    type: "GET",
    dataType: "json",
    contentType: "application/json",
    success: function (response) {
      time = response * 60;
    },
  });
  return time;
}

// 활성화된 grpid 가져오기
function getGrpid() {
  var grpid = 0;
  $.ajax({
    async: false,
    url: "https://192.168.32.44:8444/user/static/get_grpid",
    type: "GET",
    dataType: "json",
    contentType: "application/json",
    success: function (response) {
      if (response == 0) {
        $(".common_msg_popup_contents").text("훈련중인 데이터가 없습니다");
        popupMsg();
        // alert("훈련중인 데이터가 없습니다");
        location.reload();
        return;
      }
      grpid = response;
    },
  });
  return grpid;
}
// 선택한 훈련자 풀이현황 가져오기
function getUserExamStat(statId, grp, num, grpId) {
  // $(".static_body_total tr td a").css("backgroundColor", "white");
  // $(".static_body_total tr td a").css("color", "blue");
  // $(".user_name_" + statId).css("backgroundColor", "#6777ef");
  // $(".user_name_" + statId).css("padding", "10px 15px");
  // $(".user_name_" + statId).css("color", "#fafbfc");
  // $(".user_name_" + statId).css("border-radius", "5px");
  $(".common_detail_div_border").css("display", "block");
  nowStat = statId;
  nowNum = num;
  nowGrpId = grpId;
  nowGrp = grp;
  $(".static_body_total tr").css("backgroundColor", "#fafbfc");
  $(".static_body_total tr").css("color", "black");
  $(".static_body_total tr a").css("color", "blue");
  $(".user_name_" + statId)
    .parent()
    .parent()
    .css("backgroundColor", "#6777ef");
  $(".user_name_" + statId)
    .parent()
    .parent()
    .css("color", "#fafbfc");
  $(".user_name_" + statId).css("color", "#fafbfc");
  var name = $(".user_name_" + statId).text(); // 훈련자 이름
  $(".static_detail_title").text("훈련자 세부사항");
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
    url: "https://192.168.32.44:8444/user/get_user_exam_stat",
    type: "POST",
    dataType: "json",
    contentType: "application/json",
    data: JSON.stringify(jsonData),
    success: function (response) {
      // console.log(response);
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
            htmlBody += "<tr><td class='ans_false' >" + answer + "</td>";
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
      getExamStat(statId, num, grpId, grp);
    },
  });
}

// 선택한 훈련팀별 세부사항 가져오기
function getExamResultTeam(statId, num, grpId, grp) {
  $(".common_detail_div_border").css("display", "block");
  nowStat = statId;
  nowNum = num;
  nowGrpId = grpId;
  nowGrp = grp;
  $(".static_body_total tr").css("backgroundColor", "#fafbfc");
  $(".static_body_total tr").css("color", "black");
  $(".static_body_total tr a").css("color", "blue");
  $(".team_name_" + statId)
    .parent()
    .parent()
    .css("backgroundColor", "#6777ef");
  $(".team_name_" + statId)
    .parent()
    .parent()
    .css("color", "#fafbfc");
  $(".team_name_" + statId).css("color", "#fafbfc");
  // $(".static_body_total tr td a").css("backgroundColor", "white");
  // $(".static_body_total tr td a").css("color", "blue");
  // $(".team_name_" + statId).css("padding", "10px 15px");
  // $(".team_name_" + statId).css("color", "#fafbfc");
  // $(".team_name_" + statId).css("border-radius", "5px");
  // $(".team_name_" + statId).css("border-radius", "5px");
  var name = $(".team_name_" + statId).text(); // 선택한 팀 이름
  $(".static_detail_title").text("팀 훈련 세부사항");
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
    url: "https://192.168.32.44:8444/user/static/get_exam_result_team",
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
        // 오답 td에 넣을 id값을 위한 변수 대입
        var grp = response[i].tr_user_grp;
        var num = response[i].tr_num;
        var grpId = response[i].tr_exam_grpid;
        var examId = response[i].tr_exam_id;
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
            htmlBody +=
              "<tr><td class='ans_true' onclick='popUpFalseToTrue(" +
              grp +
              "," +
              num +
              "," +
              grpId +
              "," +
              examId +
              "," +
              1 +
              ")'>" +
              answer +
              "</td>";
            // 오답일때
          } else if (score == 0 && tryAns > 0) {
            htmlHead += "<tr><th>" + (i + 1) + "번</th>";
            htmlBody +=
              "<tr><td class='ans_false' id='false_" +
              (i + 1) +
              "' onclick='popUpFalseToTrue(" +
              grp +
              "," +
              num +
              "," +
              grpId +
              "," +
              examId +
              "," +
              0 +
              ")'>" +
              answer +
              "</td>";
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
            htmlBody +=
              "<td class='ans_true' onclick='popUpFalseToTrue(" +
              grp +
              "," +
              num +
              "," +
              grpId +
              "," +
              examId +
              "," +
              1 +
              ")'>" +
              answer +
              "</td>";
            // 오답일때
          } else if (score == 0 && tryAns > 0) {
            htmlHead += "<th>" + (i + 1) + "번</th>";
            htmlBody +=
              "<td class='ans_false' id='false_" +
              (i + 1) +
              "' onclick='popUpFalseToTrue(" +
              grp +
              "," +
              num +
              "," +
              grpId +
              "," +
              examId +
              "," +
              0 +
              ")'>" +
              answer +
              "</td>";
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
      getExamStatTeam(num, grpId, grp);
    },
  });
}
// 훈련 세부사항 한번 더 뿌려주기 (훈련자)
function getExamStat(statId, num, grpId, grp) {
  $(".common_detail_div_css").css("display", "inline-block");
  var name = $(
    "#target_name_" + statId + "_" + num + "_" + grpId + "_" + grp
  ).text();
  // var htmlHead = "";
  // var htmlBody = "";
  var jsonData = {
    tr_user_grp: grp,
    tr_num: num,
    tr_exam_grpid: grpId,
    tr_user_id: name,
  };
  // console.log(jsonData);
  $.ajax({
    url: "https://192.168.32.44:8444/user/static/get_exam_stat",
    type: "POST",
    dataType: "json",
    contentType: "application/json",
    data: JSON.stringify(jsonData),
    success: function (response) {
      $(".common_detail_head").empty();
      $(".common_detail_body").empty();
      // console.log(response);
      var name = response.tr_user_id;
      var num = response.tr_num;
      var submit = response.submit_answer;
      if (submit == 1) {
        submit = "제출";
      } else {
        submit = "미제출";
      }
      var result = response.result_sum;
      var cntAns = response.cnt_correct_ans;
      var cntFalseAns = response.cnt_false_ans;
      var org = $(".org_" + num + "_" + grpId + "_" + grp).text();
      org = org.replace(/(.+)(\1)+/g, "$1");
      var delay = $(".delay_" + num + "_" + grpId + "_" + grp).text();
      delay = delay.replace(/(.+)(\1)+/g, "$1");
      var start = response.start_time;
      if (start == null) {
        start = "-";
      } else {
        start = response.start_time.substr(0, 16);
      }
      var end = response.end_time;
      if (end == null) {
        end = "-";
      } else {
        end = response.end_time.substr(0, 16);
      }
      $("#detail_teamcode").text("훈련자명: " + name);
      $("#detail_org").text("기관명: " + org);
      $("#detail_num").text("차시: " + num);
      $("#detail_submit").text("점수제출: " + submit);
      $("#detail_total").text("총 점수: " + result);
      $("#detail_ans").text("정답: " + cntAns);
      $("#detail_fail_ans").text("오답: " + cntFalseAns);
      $("#detail_use_time").text("소요 시간: " + delay);
      $("#detail_start_time").text("시작 시간: " + start);
      $("#detail_end_time").text("종료 시간: " + end);
      // // console.log(org);
      // htmlHead =
      //   "<tr><th>훈련자명</th><th>기관명</th><th>차시</th><th>점수 제출</th><th>총 점수</th><th>정답</th><th>오답</th><th>소요시간</th><th>시작시간</th><th>종료시간</th></tr>";
      // htmlBody =
      //   "<tr><td>" +
      //   name +
      //   "</td><td>" +
      //   org +
      //   "</td><td>" +
      //   num +
      //   "</td><td>" +
      //   submit +
      //   "</td><td>" +
      //   result +
      //   "</td><td>" +
      //   cntAns +
      //   "</td><td>" +
      //   cntFalseAns +
      //   "</td><td>" +
      //   delay +
      //   "</td><td>" +
      //   start +
      //   "</td><td>" +
      //   end +
      //   "</td></tr>";
      // $(".common_detail_head").append(htmlHead);
      // $(".common_detail_body").append(htmlBody);
    },
  });
}

// 훈련 세부사항 한번 더 뿌려주기 (팀)
function getExamStatTeam(num, grpId, grp) {
  $(".common_detail_div_css").css("display", "inline-block");
  var htmlHead = "";
  var htmlBody = "";
  var jsonData = {
    tr_user_grp: grp,
    tr_num: num,
    tr_exam_grpid: grpId,
  };
  // console.log(jsonData);
  $.ajax({
    url: "https://192.168.32.44:8444/user/static/get_exam_stat_team",
    type: "POST",
    dataType: "json",
    contentType: "application/json",
    data: JSON.stringify(jsonData),
    success: function (response) {
      $(".common_detail_head").empty();
      $(".common_detail_body").empty();
      // console.log(response);
      var team = response.team_cd;
      var num = response.tr_num;
      var submit = response.submit_answer;
      if (submit == 1) {
        submit = "제출";
      } else {
        submit = "미제출";
      }
      var result = response.result_sum;
      var cntAns = response.cnt_correct_ans;
      var cntFalseAns = response.cnt_false_ans;
      var org = $(".org_" + num + "_" + grpId + "_" + grp).text();
      var delay = $(".delay_" + num + "_" + grpId + "_" + grp).text();
      var start = response.start_time;
      if (start == null) {
        start = "-";
      } else {
        start = response.start_time.substr(0, 16);
      }
      var end = response.end_time;
      if (end == null) {
        end = "-";
      } else {
        end = response.end_time.substr(0, 16);
      }
      $("#detail_teamcode").text("팀코드: " + team);
      $("#detail_org").text("기관명: " + org);
      $("#detail_num").text("차시: " + num);
      $("#detail_submit").text("점수제출: " + submit);
      $("#detail_total").text("총 점수: " + result);
      $("#detail_ans").text("정답: " + cntAns);
      $("#detail_fail_ans").text("오답: " + cntFalseAns);
      $("#detail_use_time").text("소요 시간: " + delay);
      $("#detail_start_time").text("시작 시간: " + start);
      $("#detail_end_time").text("종료 시간: " + end);
      // // console.log(org);
      // htmlHead =
      //   "<tr><th>팀코드</th><th>기관명</th><th>차시</th><th>점수 제출</th><th>총 점수</th><th>정답</th><th>오답</th><th>소요시간</th><th>시작시간</th><th>종료시간</th></tr>";
      // htmlBody =
      //   "<tr><td>" +
      //   team +
      //   "</td><td>" +
      //   org +
      //   "</td><td>" +
      //   num +
      //   "</td><td>" +
      //   submit +
      //   "</td><td>" +
      //   result +
      //   "</td><td>" +
      //   cntAns +
      //   "</td><td>" +
      //   cntFalseAns +
      //   "</td><td>" +
      //   delay +
      //   "</td><td>" +
      //   start +
      //   "</td><td>" +
      //   end +
      //   "</td></tr>";
      // $(".common_detail_head").append(htmlHead);
      // $(".common_detail_body").append(htmlBody);
    },
  });
}

function popUpFalseToTrue(grp, num, grpId, examId, ansTrue) {
  scrollPause();
  // $(".false_exam_num").text("문항: " + i + "번");
  // var txt = $("#false_" + i).text();
  // $(".false_exam_ans").text("기입답안: " + txt);
  // 정답일때
  $(".false_ans_change_true_div").css("display", "block");
  if (ansTrue == 1) {
    $(".false_ans_change_true_div_warn").css("display", "none");
    $(".ok_false_to_true").css("display", "none");
    $(".false_ans_change_true_div_btn_change").text("확인");
  } else {
    $(".false_ans_change_true_div_warn").css("display", "block");
    $(".ok_false_to_true").css("display", "inline-block");
    $(".false_ans_change_true_div_btn_change").text("취소");
    $(".ok_false_to_true").attr(
      "onclick",
      "falseToTrue(" + grp + "," + num + "," + grpId + "," + examId + ")"
    );
  }
  // 답안
  $(".false_exam_ans").text("정답: -");
  // 힌트 여부
  $(".false_exam_hint").text("힌트: -");
  // 배점
  $(".false_exam_point").text("배점: -");
  // 유저 기입 답안
  $(".back").css("display", "block");

  var jsonData = {
    tr_user_grp: grp,
    tr_num: num,
    tr_exam_grpid: grpId,
    tr_exam_id: examId,
  };
  $.ajax({
    url: "https://192.168.32.44:8444/user/static/get_select_detail",
    type: "POST",
    dataType: "json",
    contentType: "application/json",
    data: JSON.stringify(jsonData),
    success: function (response) {
      console.log(response);
      // $(".false_ans_change_true_div div").css("display", "block");
      // 답안
      $(".false_exam_ans").text("정답: " + response.TR_EXAM_ANS);
      // 힌트 여부
      var hint = response.TR_EXAM_HINT_FLG;
      if (hint == 1) {
        hint = "Y";
      } else {
        hint = "N";
      }
      $(".false_exam_hint").text("힌트: " + hint);
      // 배점
      $(".false_exam_point").text("배점: " + response.TR_EXAM_POINT);
      // 유저 기입 답안
      $(".false_exam_user_ans").val(response.user_answer);
    },
  });
}

function canclePopUpFalseToTrue() {
  scrollPlay();
  $(".false_ans_change_true_div").css("display", "none");
  $(".back").css("display", "none");
}

// 오답 정답으로 변환
function falseToTrue(grp, num, grpId, examId) {
  var input_answer = $(".false_exam_user_ans").val();
  var jsonData = {
    tr_user_grp: grp,
    tr_num: num,
    tr_exam_grpid: grpId,
    tr_exam_id: examId,
    input_answer: input_answer,
  };
  $.ajax({
    async: false,
    url: "https://192.168.32.44:8444/user/static/false_change_true",
    type: "POST",
    dataType: "json",
    contentType: "application/json",
    data: JSON.stringify(jsonData),
    success: function (response) {
      // console.log(response);
      if (response == 1) {
        $(".common_msg_popup_contents").text("업데이트 완료");
        popupMsg();
        // alert("업데이트 성공!");
        var num = $("#select_num").prop("checked", true).val();
        var type = $("#select_type").prop("checked", true).val();
        $(".false_ans_change_true_div").toggle();
        $(".back").toggle();
        scrollPlay();
        getExamResultByNumAndType(num, type);
        getExamResultTeam(nowStat, nowNum, nowGrpId, nowGrp);
      } else {
        $(".common_msg_popup_contents").text("업데이트 실패");
        popupMsg();
        // alert("업데이트 실패...");
      }
    },
  });
}

// 선택한 훈련팀 매트릭스스탯 가져오기
function getMatrixStat(grpid, grp, num) {
  // // console.log(grpid + "/" + grp + "/" + num);
  var jsonData = {
    tr_user_grp: grp,
    tr_num: num,
    tr_exam_grpid: grpid,
  };
  $.ajax({
    async: false,
    url: "https://192.168.32.44:8444/user/static/get_matrix_stat",
    type: "POST",
    dataType: "json",
    contentType: "application/json",
    data: JSON.stringify(jsonData),
    success: function (response) {
      // // console.log(response);
    },
  });
}

function matrixOn() {
  $(".matrix_title").css("display", "block");
  $(".matrix_div").css("display", "flex");
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
  // // console.log(grpid);
  var jsonData = {
    tr_user_grp: grp,
    tr_num: num,
    tr_exam_grpid: grpid,
  };
  $.ajax({
    async: false,
    url: "https://192.168.32.44:8444/user/static/get_matrix",
    type: "POST",
    dataType: "json",
    contentType: "application/json",
    data: JSON.stringify(jsonData),
    success: function (response) {
      // console.log(response);
      var empty = "";
      for (var i = 0; i < response.length; i++) {
        if (response[i] == null) {
          continue;
        } else if (empty != response[i].MA_TACTICS_ID) {
          var kor = extractKorean(response[i].ma_tactics_name);
          // // console.log(response[i].MA_TACTICS_ID);
          var test = '"' + response[i].MA_TACTICS_ID + '"';
          empty = response[i].MA_TACTICS_ID;
          // // console.log(empty);
          // // console.log("전술단계 뿌려주기 로직 실행");
          htmlHead =
            "<div class='test_" +
            response[i].MA_TACTICS_ID +
            "'><div class='common_matrix_title'>" +
            kor +
            "</div></div>";
          $(".matrix_div").append(htmlHead);
          htmlBody =
            "<div class='common_tactics' onclick='popUp(" +
            test +
            "," +
            response[i].MA_MATRIX_ID +
            ")'><a>" +
            response[i].ma_tactics_tech +
            "<br/>(" +
            response[i].real +
            "/" +
            response[i].total +
            ")</a></div>";
          $(".test_" + response[i].MA_TACTICS_ID).append(htmlBody);
          continue;
        }
        if (response[i] != null) {
          htmlBody =
            "<div class='common_tactics_nth' onclick='popUp(" +
            test +
            "," +
            response[i].MA_MATRIX_ID +
            ")'><a>" +
            response[i].ma_tactics_tech +
            "<br/>(" +
            response[i].real +
            "/" +
            response[i].total +
            ")</a></div>";
          $(".test_" + response[i].MA_TACTICS_ID).append(htmlBody);
          // // // console.log("그냥 매트릭스 뿌려주기실행");
        }
      }
    },
  });
}
function popUp(MA_TACTICS_ID, MA_MATRIX_ID) {
  // console.log(MA_TACTICS_ID + "/" + MA_MATRIX_ID);
  var jsonData = {
    ma_matrix_id: MA_MATRIX_ID,
    ma_tactics_id: MA_TACTICS_ID,
  };
  $.ajax({
    async: false,
    url: "https://192.168.32.44:8444/user/get_tech_and_mit",
    type: "POST",
    dataType: "json",
    contentType: "application/json",
    data: JSON.stringify(jsonData),
    success: function (response) {
      popUpMatrix();
      // console.log(response);
      $(".matrix_mit_tech .title").empty();
      $(".matrix_mit_tech .title").text(response[0].MA_TACTICS_TECH);
      $(".matrix_mit_tech .contents").empty();
      $(".matrix_mit_tech .contents").text(response[0].MA_TACTICS_MITIG);
    },
  });
}

function popUpMatrix() {
  scrollPause();
  $(".matrix_mit_tech").css("display", "block");
  $(".back").css("display", "block");
}
function togglePopUpMat() {
  scrollPlay();
  $(".matrix_mit_tech").css("display", "none");
  $(".back").css("display", "none");
}
// 한글만 추출
function extractKorean(str) {
  // 정규식 패턴으로 한글만 추출
  const koreanPattern = /[ㄱ-ㅎㅏ-ㅣ가-힣]+/g;

  // 정규식에 매칭되는 부분을 배열로 반환
  const matches = str.match(koreanPattern);

  // 배열의 모든 요소를 합쳐서 반환
  return matches ? matches.join("") : "";
}
// 훈련자 기관명 가져오기
function selectUserOrgByUserId(id) {
  var org = 0;
  var jsonData = {
    id: id,
  };
  $.ajax({
    async: false,
    url: "https://192.168.32.44:8444/user/select_user_org_by_user_id",
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

function refresh() {
  var type = $("select[name=type_check] option:selected").val();
  if (type == 0) {
    $(".common_msg_popup_contents").text("유형을 선택 후 사용하세요");
    popupMsg();
    // alert("유형을 선택 후 사용하세요");
    return;
  }
  // 버튼 로직
  if (on == false) {
    on = true;
  } else if (on == true) {
    on = false;
  }
  // console.log(on);
  // 배경 css
  bg++;
  if (bg % 2 != 0) {
    $(".ratate_btn").css("backgroundColor", "green");
    $(".ratate_btn").css("box-shadow", "none");
    $(".rotate_div").css("left", "3px");
    $(".rotate_div").css("top", "23px");
    $("#select_num").prop("disabled", true);
  } else {
    $(".ratate_btn").css("backgroundColor", "#6777ef");
    $(".ratate_btn").css("box-shadow", "3px 3px 3px gray");
    $(".rotate_div").css("left", "0px");
    $(".rotate_div").css("top", "20px");
    $("#select_num").prop("disabled", false);
  }
  // 활성화 여부
  if (on == true) {
    // console.log("활성화댐");
    refreshAuto();
  }
}

// 재귀함수
function refreshAuto() {
  var type = $("select[name=type_check] option:selected").val();
  if (type == 0) {
    $(".common_msg_popup_contents").text("유형을 선택 후 사용하세요");
    popupMsg();
    // alert("유형을 선택 후 사용하세요");
    return;
  }
  // // console.log("재귀함수 실행...");
  $(".rotate_ic").css("transform", "rotate(" + turn + "turn)");
  turn++;
  // // console.log("on의 상태:" + on);
  if (on) {
    setTimeout(function () {
      grpId = getGrpid();
      // console.log("타입:" + type + " grpId:" + grpId);
      getExamResultByNumAndType(0, type, grpId);
      refreshAuto();
    }, 1500);
  } else {
  }
}

// 팀 org 가져오기
function getTeamOrg(num, grpId, grp) {
  let returnVal = "";
  if (grp == 99) {
    return "관리자";
  }
  var jsonData = {
    num: num,
    grpId: grpId,
    grp: grp,
  };
  $.ajax({
    async: false,
    url: "https://192.168.32.44:8444/user/static/get_org",
    type: "POST",
    dataType: "json",
    contentType: "application/json",
    data: JSON.stringify(jsonData),
    success: function (response) {
      // // console.log(response);
      if (response.length > 1) {
        if (response[0] != response[1]) {
          returnVal = "-";
        } else {
          returnVal = response[0];
        }
      } else if (response[0] == undefined) {
        returnVal = "-";
      } else {
        returnVal = response[0];
      }
    },
  });
  return returnVal;
}
setTimeout(function () {
  $("body").css("display", "block");
}, 500);

function popupMsg() {
  $(".common_msg_popup").toggle();
  $(".back").toggle();
}
