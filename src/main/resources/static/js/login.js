function user_login() {
  var id = $(".user_login_id").val();
  var pw = $(".user_login_pw").val();
  $.ajax({
    url: "http://192.168.32.44:8080/login/" + id,
    type: "GET",
    dataType: "json",
    success: function (response) {
      console.log(response);
      if (response.length == 0) {
        alert("등록되지 않은 계정입니다");
        $(".user_login_id").val("");
        $(".user_login_pw").val("");
        $(".user_login_id").focus();
        return;
      } else {
        var checkAdmin = response[0].admin_passwd;
        console.log(checkAdmin);
        if (checkAdmin != null) {
          if (response[0].admin_passwd != pw) {
            $(".user_login_pw").val("");
            $(".user_login_pw").focus();
            alert("비밀번호를 확인하세요");
            return;
          } else {
            alert("관리자님 환영합니다");
            location.replace("admin_training.html");
            return;
          }
        } else {
          if (response[0].tr_user_passwd != pw) {
            $(".user_login_pw").val("");
            $(".user_login_pw").focus();
            alert("비밀번호를 확인하세요");
            return;
          } else {
            alert(id + "님 환영합니다");
            // location.href = "user_group_setting.html";
            location.href = "user_group_setting.html";
            return;
          }
        }
      }
    },
  });
}
