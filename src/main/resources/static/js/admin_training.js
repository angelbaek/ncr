getSessionUserInfo();
getTraining();

// 어드민 정보 가져오기
function getSessionUserInfo() {
  console.log("세션 읽어오기 실행중...");
  $.ajax({
    url: "http://192.168.32.44:8080/user",
    type: "GET",
    dataType: "json",
    success: function (response) {
      console.log(response);
      $(".userName").empty();
      $(".userName").append(response[0].admin_name);
    },
  });
}
// 훈련관리 정보 가져오기
function getTraining() {
  console.log("세션 읽어오기 실행중...");
  $.ajax({
    url: "http://192.168.32.44:8080/admin/mgmt",
    type: "GET",
    dataType: "json",
    success: function (response) {
      console.log(response);
      console.log(response.length);
      // 훈련설정 mgr 셋업을 위한 변수
      var html1 = "";
      var html2 = "";
      // 훈련설정 mgr 셋업
      for (var i = 0; i < response.length; i++) {
        if (response[i].tr_num == 1) {
          html1 +=
            "<option value='" +
            response[i].tr_exam_grp +
            "'>" +
            response[i].tr_exam_grp +
            "</option>";
        } else if (response[i].tr_num == 2) {
          html2 +=
            "<option value='" +
            response[i].tr_exam_grp +
            "'>" +
            response[i].tr_exam_grp +
            "</option>";
        }
      }
      console.log(html1);
      $("#selectOne").append(html1);
      $("#selectTwo").append(html2);
      // 훈련 시작, 훈련 정지 버튼 비활성화를 위한 count
      var count = 0;
      for (var i = 0; i < response.length; i++) {
        // 훈련이 진행중인지 체크
        if (response[i].tr_mgmt_state == 1) {
          console.log("훈련이 진행중...");
          // 훈련 시작 버튼 비활성화
          $("#training_start").attr("disabled", true);
          $("#training_start").css("backgroundColor", "gray");
          //활성화 되어있는 그룹 view에 뿌려주기
          //1차시 활성일때
          if (response[i].tr_num == 1) {
            console.log("1차시 활성");
            response[i].tr_exam_grp;
            $(".check_one").prop("checked", true);
            $("#selectOne").val(response[i].tr_exam_grp).prop("selected", true);
          } else if (response[i].tr_num == 2) {
            console.log("2차시 활성");
            //2차시 활성일떄
            response[i].tr_exam_grp;
            $(".check_two").prop("checked", true);
            $("#selectTwo").val(response[i].tr_exam_grp).prop("selected", true);
          }
          return;
        }

        // 훈련 설정이 되있을때
        if (response[i].tr_exam_grp_act == 1) {
          // 훈련 시작 버튼 활성화
          $("#training_start").attr("disabled", false);
          $("#training_start").hover(
            function () {
              $(this).css("backgroundColor", "#394eea");
            },
            function () {
              $(this).css("backgroundColor", "#6777ef");
            }
          );
          // 훈련 정지 버튼 비활성화
          $("#training_pause").attr("disabled", true);
          $("#training_pause").css("backgroundColor", "gray");

          //활성화 되어있는 그룹 view에 뿌려주기
          //1차시 활성일때
          if (response[i].tr_num == 1) {
            console.log("1차시 활성");
            response[i].tr_exam_grp;
            $(".check_one").prop("checked", true);
            $("#selectOne").val(response[i].tr_exam_grp).prop("selected", true);
          } else if (response[i].tr_num == 2) {
            console.log("2차시 활성");
            //2차시 활성일떄
            response[i].tr_exam_grp;
            $(".check_two").prop("checked", true);
            $("#selectTwo").val(response[i].tr_exam_grp).prop("selected", true);
          }
          count++;
        }
      }
      if (count == 0) {
        $("#training_start").attr("disabled", true);
        $("#training_start").css("backgroundColor", "gray");
        $("#training_pause").attr("disabled", true);
        $("#training_pause").css("backgroundColor", "gray");
      }
    },
  });
}

// 훈련 시작
function trainingStart() {
  $.ajax({
    url: "http://192.168.32.44:8080/admin/trainingStart",
    type: "PATCH",
    contentType: "application/json",
    dataType: "json",
    success: function (response) {
      console.log(response);
      if (response == 0) {
        alert("설정된 훈련이 없습니다");
        return;
      }
      alert("훈련을 시작합니다");
      // 훈련 시작 버튼 비활성화
      $("#training_start").attr("disabled", true);
      $("#training_start").css("backgroundColor", "gray");
      // 훈련 정지 버튼 활성화
      $("#training_pause").attr("disabled", false);
      $("#training_pause").css("backgroundColor", "#6777ef");
      $("#training_pause").hover(
        function () {
          $(this).css("backgroundColor", "#394eea");
        },
        function () {
          $(this).css("backgroundColor", "#6777ef");
        }
      );
    },
  });
}

// 훈련 설정 차시별 함수
function grpActive() {
  var one = $(".check_one").is(":checked");
  var two = $(".check_two").is(":checked");
  if (one == true) {
    var test = $("select[name=location1] option:selected").text();
    if (test == "직접 선택") {
      alert("1차시 문제 그룹을 선택하세요");
      return;
    }
    var jsonData = {
      tr_num: 1,
      tr_exam_grp: test,
    };
    console.log(jsonData);
    $.ajax({
      url: "http://192.168.32.44:8080/admin/gprAct",
      type: "PATCH",
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify(jsonData),
      success: function (response) {
        console.log(response);
        if (response > 0) {
          alert("1차 문제 그룹: " + test + " <활성화>");
          location.reload();
        }
      },
    });
  } else if (two == true) {
    var test = $("select[name=location2] option:selected").text();
    if (test == "직접 선택") {
      alert("2차시 문제 그룹을 선택하세요");
      return;
    }
    var jsonData = {
      tr_num: 2,
      tr_exam_grp: test,
    };
    console.log(jsonData);
    $.ajax({
      url: "http://192.168.32.44:8080/admin/gprAct",
      type: "PATCH",
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify(jsonData),
      success: function (response) {
        console.log(response);
        if (response > 0) {
          alert("2차 문제 그룹: " + test + " <활성화>");
          location.reload();
        }
      },
    });
  } else {
    alert("체크박스를 활성화 해주세요");
  }
}

// 훈련 정지
function trainingPause() {
  $.ajax({
    url: "http://192.168.32.44:8080/admin/trainingPause",
    type: "PATCH",
    contentType: "application/json",
    dataType: "json",
    success: function (response) {
      console.log(response);
      alert("훈련을 정지합니다");
      // 훈련 정지 버튼 활성화
      $("#training_pause").attr("disabled", true);
      $("#training_pause").css("backgroundColor", "gray");
      // 훈련 시작 버튼 비활성화
      $("#training_start").attr("disabled", false);
      $("#training_start").css("backgroundColor", "#6777ef");
      $("#training_start").hover(
        function () {
          $(this).css("backgroundColor", "#394eea");
        },
        function () {
          $(this).css("backgroundColor", "#6777ef");
        }
      );
    },
  });
}

// 그룹 view
function groupView() {
  $(".group_view").css("display", "block");
  $(".group_view_title").css("display", "block");
  $.ajax({
    url: "http://192.168.32.44:8080/admin/groupView",
    type: "GET",
    dataType: "json",
    success: function (response) {
      console.log(response);
      var html = "";
      $(".group_view_body").empty();
      for (var i = 0; i < response.length; i++) {
        if (i % 2 == 0) {
          html +=
            "<tr class='tr_even'><td>" +
            response[i].tr_user_name +
            "</td><td>" +
            response[i].tr_user_org +
            "</td><td>" +
            response[i].team_cd +
            "</td><td>" +
            response[i].tr_user_grp +
            "</td></tr>";
        } else {
          html +=
            "<tr class='tr_odd'><td>" +
            response[i].tr_user_name +
            "</td><td>" +
            response[i].tr_user_org +
            "</td><td>" +
            response[i].team_cd +
            "</td><td>" +
            response[i].tr_user_grp +
            "</td></tr>";
        }
      }
      $(".group_view_body").append(html);
    },
  });
}

//팀코드 view
function teamcodeView() {
  $(".teamcode_view").css("display", "block");
  $.ajax({
    url: "http://192.168.32.44:8080/admin/teamcodeView",
    type: "GET",
    dataType: "json",
    success: function (response) {
      console.log(response);
      var html = "";
      $(".teamcode_view_body").empty();
      for (var i = 0; i < response.length; i++) {
        if (i % 2 == 0) {
          html +=
            "<tr class='teamcode_tr_even'><td>" +
            response[i].tr_user_grp +
            "</td><td>" +
            response[i].team_cd +
            "</td><td>" +
            response[i].vm_id +
            "</td></tr>";
        } else {
          html +=
            "<tr class='teamcode_tr_odd'><td>" +
            response[i].tr_user_grp +
            "</td><td>" +
            response[i].team_cd +
            "</td><td>" +
            response[i].vm_id +
            "</td></tr>";
        }
      }
      console.log("추가");
      console.log(html);
      $(".teamcode_view_body").append(html);
    },
  });
}

// 팀코드 뷰 닫기
function teamcode_view_btn() {
  $(".teamcode_view").css("display", "none");
}
