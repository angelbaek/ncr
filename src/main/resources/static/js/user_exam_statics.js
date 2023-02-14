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

          // 기능 테스트
          var endTime = targetEndTime.substr(11, 16); // 종료시간 변환
          console.log("형식확인:" + endTime);
          // 종료시간이 없을때
          if (targetEndTime == null) {
            endTime = "-";
            delayTime = "-";
          } else {
            // 소요시간 계산 로직 (미구현)
            var endTime = parseInt(targetEndTime.substr(0, 16)); // 종료시간 변환
            delayTime = endTime - startTime;
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
  let html = "";
  var jsonData = {
    // tr_user_id: id,
    stat_id: statId,
    tr_user_grp: grp,
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
      var id = response.tr_user_id; // 아이디 대입
      var org = selectUserOrgByUserId(id); // 유저id로 기관명 가져오기
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
