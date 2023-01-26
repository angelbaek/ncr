$(".logout_btn").css("display", "none");
// 로그아웃 함수
function logOut() {
  alert("로그아웃 합니다");
  location.replace("/");
}

function showLogOutBtn() {
  var show = $(".logout_btn").css("display");
  console.log(show);
  if (show == "none") {
    $(".logout_btn").css("display", "block");
  } else if (show == "block") {
    $(".logout_btn").css("display", "none");
  }
}

// 사용자 정보 가져오기
function getSessionUserInfo() {
  console.log("세션 읽어오기 실행중...");
  $.ajax({
    url: "http://localhost:8080/user",
    type: "GET",
    dataType: "json",
    error: function (error) {
      // alert("세션이 만료");
      // location.replace("/login.html");
    },
    success: function (response) {
      $(".userName").empty();
      $(".userName").append(response[0].admin_name);
    },
  });
}
