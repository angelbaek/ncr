$(".logout_btn").css("display", "none");

// 드랍다운 메뉴
function dropdownMenu() {
  var show = $(".dropdown").css("display");
  // console.log(show);
  if (show == "none") {
    // $(".common_left_menubar").css("margin-top", "70px");
    $("#dropbox_ic").css("transform", "rotate(180deg)");
    $(".dropdown").css("display", "block");
  } else if (show == "block") {
    // $(".common_left_menubar").css("margin-top", "50px");
    $("#dropbox_ic").css("transform", "rotate(0deg)");
    $(".dropdown").css("display", "none");
  }
}
// 로그아웃 함수
function logOut() {
  $.ajax({
    url: "http://10.30.11.57:8080/logout",
    type: "GET",
    dataType: "json",
    success: function (response) {
      // console.log(response);
      if (response == 1) {
        //로그아웃 성공
        location.replace("/");
      } else if (response == 0) {
        //로그아웃 실패
        alert("로그인이 만료되었습니다.");
        location.replace("/");
      }
    },
  });
}

// 사용자 정보 표출
function showLogOutBtn() {
  $.ajax({
    url: "http://10.30.11.57:8080/get_user_teamcode_view",
    type: "GET",
    dataType: "json",
    success: function (response) {
      // console.log(response);
      var team = response[0];
      if (team == "") {
        $(".user_teamcode_view").text("팀없음");
      } else {
        $(".user_teamcode_view").text(team);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      // console.log(jqXHR); //응답 메시지
      // console.log(textStatus); //"error"로 고정인듯함
      // console.log(errorThrown);
    },
  });
  var show = $(".logout_btn").css("display");
  // console.log(show);
  if (show == "none") {
    $(".logout_btn").css("display", "block");
    $("#logout").css("transform", "rotate(180deg)");
  } else if (show == "block") {
    $(".logout_btn").css("display", "none");
    $("#logout").css("transform", "rotate(0deg)");
  }
}

// 스크롤 막기
function scrollPause() {
  $("body").addClass("no-scroll");
}

// 스크롤 다시 실행
function scrollPlay() {
  $("body").removeClass("no-scroll");
}

// 세션 관리
function sessionManagement() {
  // console.log("세션 체크...");
  $.ajax({
    url: "http://10.30.11.57:8080/sessionCheck",
    type: "GET",
    dataType: "json",
    success: function (response) {
      // 로그인 안한 사용자
      if (response == true) {
        return;
      }
      if (response[0].role == 0) {
        // 관리자임
        location.href = "/admin_training";
      } else if (response[0].role == 1) {
        // 일반 유저임
        location.href = "/user_group_setting";
      }
    },
  });
}

// 세션 관리 (일반 훈련자용)
function sessionManagementForUser() {
  var userInfo = {};
  // console.log("일반 사용자 세션 체크...");
  $.ajax({
    async: false,
    url: "http://10.30.11.57:8080/sessionCheck",
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
    },
  });
  return userInfo;
}

// 세션 관리 (관리자용)
function sessionManagementForAdmin() {
  // // console.log("관리자 사용자 세션 체크...");
  $.ajax({
    url: "http://10.30.11.57:8080/sessionCheck",
    type: "GET",
    dataType: "json",
    success: function (response) {
      // // console.log(response);
      if (response == true) {
        alert("로그인 후 사용가능합니다.");
        location.replace("/");
      }
      if (response[0].role == 0) {
        // 관리자임
        $(".userName").text(response[0].admin_name);
      } else if (response[0].role == 1) {
        // 일반 유저임
        alert("해당 페이지는 관리자 전용입니다.");
        location.replace("/user_group_setting");
      }
    },
  });
}

// vm웨어 연동
function vmwareConnect() {
   $.ajax({
     url: "http://10.30.11.57:8080/getVmConsoleUrl",
     type: "GET",
     contentType: "application/json",
     success: function (response) {
       console.log(response);
     },
   });
}

/**
 * view page
 */

// function adminExamResult() {
//   $.ajax({
//     url: "http://10.30.11.57:8080/admin_exam_result",
//     type: "GET",
//     dataType: "json",
//     success: function (response) {},
//   });
// }
