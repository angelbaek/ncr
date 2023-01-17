getSessionUserInfo();
getTeamGroup();

let tr_user_id;
// 훈련자 정보 가져오기
function getSessionUserInfo() {
  console.log("세션 읽어오기 실행중...");
  $.ajax({
    url: "http://localhost:8080/user",
    type: "GET",
    dataType: "json",
    success: function (response) {
      var tr_user_org = response[0].tr_user_org;
      var tr_user_name = response[0].tr_user_name;
      console.log(response);
      $("#agency_name").empty();
      $("#agency_name").append(tr_user_org);
      $("#user_name").empty();
      $("#user_name").append(tr_user_name);
      tr_user_id = response[0].tr_user_id;
      $(".userName").empty();
      $(".userName").append(tr_user_name);
    },
  });
}

// 팀(조) 정보 가져오기
function getTeamGroup() {
  console.log("세션 읽어오기 실행중...");
  $.ajax({
    url: "http://localhost:8080/userGRP",
    type: "GET",
    dataType: "json",
    success: function (response) {
      console.log(response);
      console.log(response.length);
      var html;
      for (var i = 0; i < response.length; i++) {
        html +=
          "<option value=" +
          response[i].team_cd +
          ">" +
          response[i].tr_user_grp +
          "조" +
          "</option>";
      }
      $("#team").append(html);
    },
  });
}
// 팀(조), 팀 코드 변수
let tr_user_grp;
let team_cd;

// 팀 코드 세팅
function userGroupSave() {
  console.log(tr_user_grp);
  console.log(team_cd);

  var jsonData = {
    tr_user_grp: tr_user_grp,
    team_cd: team_cd,
    tr_user_state: 1,
    tr_user_id: tr_user_id,
  };
  console.log(jsonData);
  $.ajax({
    url: "http://localhost:8080/user/update",
    type: "PATCH",
    contentType: "application/json",
    dataType: "json",
    data: JSON.stringify(jsonData),
    success: function (response) {
      console.log(response);
      if (response > 0) {
        alert("훈련준비 상태가 변경되었습니다");
        // location.reload();
      }
    },
  });
}

$("select[name=location]").change(function () {
  console.log($(this).val()); //value값 가져오기
  console.log($("select[name=location] option:selected").text()); //text값 가져오기
  team_cd = $(this).val();
  var test = $("select[name=location] option:selected").text();
  var regex = /[^0-9]/g; // 숫자가 아닌 문자열을 선택하는 정규식
  tr_user_grp = test.replace(regex, ""); // 원래 문자열에서 숫자가 아닌 모든 문자열을 빈 문자로 변경
  $("#team_code").empty();
  $("#team_code").append(team_cd);
});

//훈련 시작
function training() {
  var num = $("select[name=location_num]").val();
  console.log("훈련 함수 실행중...");
  console.log(tr_user_grp);
  $.ajax({
    url: "http://localhost:8080/user/training/" + num,
    type: "GET",
    dataType: "json",
    success: function (response) {
      console.log(response);
      if (response[0].tr_exam_grp_act != 1) {
        alert("문제가 활성화 되지 않았습니다");
        return;
      } else if (response[0].tr_mgmt_state != 1) {
        alert("문제가 활성화 되지 않았습니다");
        return;
      } else {
        alert("훈련을 시작합니다");
      }
    },
  });
}
