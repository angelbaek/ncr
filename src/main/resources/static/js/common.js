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
