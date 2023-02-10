let selectVal = "";
sessionManagementForUser();
getGroupInfoById();
getTeamGroup();

function getGroupInfoById() {
  $.ajax({
    async: false,
    url: "http://192.168.32.44:8080/user/get_group_info_by_id",
    type: "GET",
    dataType: "json",
    success: function (response) {
      console.log(response);
      var grp = response[0].tr_user_grp;
      selectVal = response[0].team_cd;
      var org = response[0].tr_user_org;
      var name = response[0].tr_user_name;
      $("#team_code").text(selectVal);
      $("#agency_name").text(org);
      $("#user_name").text(name);
    },
  });
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
  console.log("팀 정보 실행중...");
  $.ajax({
    async: false,
    url: "http://192.168.32.44:8080/userGRP",
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
      for (var i = 0; i < response.length; i++) {
        if (selectVal == response[i].team_cd) {
          console.log("맞았다");
          $("#team option:eq(" + (i + 1) + ")").prop("selected", true);
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
  console.log(tr_user_grp);
  console.log(team_cd);
  if (tr_user_grp == undefined) {
    alert("팀을 선택하세요.");
    return;
  }
  var jsonData = {
    tr_user_grp: tr_user_grp,
    team_cd: team_cd,
    tr_user_state: 1,
  };
  console.log(jsonData);
  $.ajax({
    url: "http://192.168.32.44:8080/user/update",
    type: "PATCH",
    contentType: "application/json",
    dataType: "json",
    data: JSON.stringify(jsonData),
    success: function (response) {
      console.log(response);
      if (response > 0) {
        alert("훈련준비 상태가 변경되었습니다");
        $("#team_code").text(team_cd);
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
    url: "http://192.168.32.44:8080/user/training/" + num,
    type: "GET",
    dataType: "json",
    success: function (response) {
      console.log(response);
      if (response.length == 0) {
        alert("문제가 활성화 되지 않았습니다");
        return;
      }
      if (response[0].tr_mgmt_state != 1) {
        alert(num + "차시에 진행중인 문제그룹이 없습니다.");
        $("select[name=location_num]").focus();
        return;
      } else if (response[0].tr_mgmt_state == 1) {
        alert("훈련을 시작합니다");
        location.href = "user_exam_explanation";
      }
    },
  });
}
