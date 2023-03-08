var selectVal = "";
$(".back").css("display", "none");
$(".common_msg_popup").css("display", "none");
//세션
sessionManagementForUserGroup();
//그룹 정보
getGroupInfoById();
getTeamGroup();
// getTrainingState();
getTrainingStateActiveOn();
function getGroupInfoById() {
  $.ajax({
    async: false,
    url: "http://192.168.32.44:8080/user/get_group_info_by_id",
    type: "GET",
    dataType: "json",
    success: function (response) {
      // console.log(response);
      var grp = response[0].tr_user_grp;
      selectVal = response[0].team_cd;
      var org = response[0].tr_user_org;
      var name = response[0].tr_user_name;
      $("#team_code").text(selectVal);
      $("#agency_name").text(org);
      $("#user_name").text(name);
      if (selectVal == null) {
        trainingStartBtnOff();
      }
    },
  });
  // console.log(selectVal);
}

// 세션 관리 (일반 훈련자용)
function sessionManagementForUserGroup() {
  var userInfo = {};
  // console.log("일반 사용자 세션 체크...");
  $.ajax({
    async: false,
    url: "http://192.168.32.44:8080/sessionCheck",
    type: "GET",
    dataType: "json",
    success: function (response) {
      // console.log(response);
      if (response == true) {
        alert("로그인 후 사용가능합니다.");
        location.replace("/");
      }
      userInfo = response;
      $(".userName").text(response[0].tr_user_name);
      if (response[0].team_cd == null) {
        // console.log("어 널이다");
        $("#team_code").text("위의 팀(조)를 선택하여 팀 코드를 배정받으세요");

        trainingStartBtnOff();
      }
    },
  });
  return userInfo;
}
// 훈련 시작 버튼 활성화(클릭됨) 함수 css
function trainingStartBtnOn() {
  $(".tn_start_btn").attr("disabled", false);
  $(".tn_start_btn").css("backgroundColor", "#6777ef");
  $(".tn_start_btn").hover(
    function () {
      $(this).css("backgroundColor", "#394eea");
    },
    function () {
      $(this).css("backgroundColor", "#6777ef");
    }
  );
}
// 훈련 시작 버튼 비활성화(클릭안됨) 함수 css
function trainingStartBtnOff() {
  $(".tn_start_btn").attr("disabled", true);
  $(".tn_start_btn").css("backgroundColor", "gray");
}

// 팀(조) 정보 가져오기
function getTeamGroup() {
  // console.log("팀 정보 실행중...");
  $.ajax({
    async: false,
    url: "http://192.168.32.44:8080/userGRP",
    type: "GET",
    dataType: "json",
    success: function (response) {
      // console.log(response);
      // console.log(response.length);
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
      $("#team").empty();
      $("#team").append(html);
      for (var i = 0; i < response.length; i++) {
        if (selectVal == response[i].team_cd) {
          // console.log("맞았다");
          $("#team option:eq(" + i + ")").prop("selected", true);
          $("#team_code").text(selectVal);
          trainingStartBtnOn();
          break;
        } else {
          $("#team_code").text("위의 팀(조)를 선택하여 팀 코드를 배정받으세요");
          trainingStartBtnOff();
        }
      }
    },
  });
}
// 팀(조), 팀 코드 변수
let tr_user_grp;
let team_cd;

// 팀 코드 세팅
function userGroupSave() {
  var result = confirm(
    "훈련이 시작되면 팀그룹을 변경할 수 없습니다.\r\n변경 하시겠습니까?"
  );
  if (!result) {
    return;
  }
  // console.log(tr_user_grp);
  // console.log(team_cd);
  if (tr_user_grp == undefined) {
    alert("팀을 선택하세요.");
    return;
  }
  var jsonData = {
    tr_user_grp: tr_user_grp,
    team_cd: team_cd,
    tr_user_state: 1,
  };
  // console.log(jsonData);
  $.ajax({
    url: "http://192.168.32.44:8080/user/update",
    type: "PATCH",
    contentType: "application/json",
    dataType: "json",
    data: JSON.stringify(jsonData),
    success: function (response) {
      // console.log(response);

      if (response == 1) {
        alert("훈련준비 상태가 변경되었습니다");
        $("#team_code").text(team_cd);
        location.reload();
      } else if (response == 0) {
        alert("해당팀은 인원이 마감되었습니다");
      } else if (response == 2) {
        alert("훈련도중 그룹을 변경할 수 없습니다");
        getGroupInfoById();
        location.reload();
      }
    },
  });
}

$("select[name=location]").change(function () {
  // console.log($(this).val()); //value값 가져오기
  // console.log($("select[name=location] option:selected").text()); //text값 가져오기
  team_cd = $(this).val();
  var test = $("select[name=location] option:selected").text();
  var regex = /[^0-9]/g; // 숫자가 아닌 문자열을 선택하는 정규식
  tr_user_grp = test.replace(regex, ""); // 원래 문자열에서 숫자가 아닌 모든 문자열을 빈 문자로 변경
  $("#team_code").empty();
  $("#team_code").append(team_cd);
});

// 이미 훈련한
function findUserForStarted() {}

//훈련 시작
function training() {
  var num = $("select[name=location_num]").val();
  var text = $("#team_code").text();
  // console.log("훈련 함수 실행중...");
  // console.log(tr_user_grp);
  $.ajax({
    url: "http://192.168.32.44:8080/user/training/" + num,
    type: "GET",
    dataType: "json",
    success: function (response) {
      console.log(response);
      if (response.length == 0) {
        $(".common_msg_popup_contents").text(
          num + "차시에 진행중인 문제그룹이 없습니다."
        );
        popupMsg();
        $("select[name=location_num]").focus();
        return;
      }
      if (response[0].tr_mgmt_state != 1) {
        // 이곳에 팝업창 넣을거임
        // alert(num + "차시에 진행중인 문제그룹이 없습니다.");
        $(".common_msg_popup_contents").text(
          num + "차시에 진행중인 문제그룹이 없습니다."
        );
        popupMsg();
        $("select[name=location_num]").focus();
        return;
      } else if (
        response[0].tr_mgmt_state == 1 ||
        response[0].tr_mgmt_state == 2
      ) {
        location.href = "user_exam_explanation";
      }
    },
  });
}

// 해당 차시 훈련 시작여부
function getTrainingState() {
  var num = $("select[name=location_num]").val();
  $.ajax({
    url: "http://192.168.32.44:8080/user/get_training_state/" + num,
    type: "GET",
    dataType: "json",
    success: function (response) {
      // console.log(response);
      if (response == 1) {
        if (selectVal != null) {
          trainingStartBtnOn();
        }
      } else {
        trainingStartBtnOff();
      }
    },
  });
}

// 활성화된 문제그룹이 있는지 가져오기
function getTrainingStateActiveOn() {
  $.ajax({
    url: "http://192.168.32.44:8080/user/get_training_state_active_on",
    type: "GET",
    dataType: "json",
    success: function (response) {
      // console.log(response);
      if (response == 1) {
        $(".saveButton").prop("disabled", true);
        $(".saveButton").css("backgroundColor", "gray");
      } else {
        $(".saveButton").prop("disabled", false);
        $(".saveButton").css("backgroundColor", "#6777ef");
      }
    },
  });
}

$(document).ready(function () {
  $("select[name=location_num]").change(function () {
    // getTrainingState();
  });
});

function popupMsg() {
  $(".common_msg_popup").toggle();
  $(".back").toggle();
}
