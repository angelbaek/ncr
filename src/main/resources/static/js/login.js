function user_login() {
  var id = $(".user_login_id").val();
  var pw = $(".user_login_pw").val();
  var jsonData = {
    id: id,
    pw: pw,
  };
  $.ajax({
    url: "https://192.168.32.22:8443/login",
    type: "POST",
    contentType: "application/json",
    dataType: "json",
    data: JSON.stringify(jsonData),
    success: function (response) {
      // console.log(response);
      if (response == 1) {
        // 관리자
        location.href = "/admin_training";
      } else if (response == 2) {
        // 사용자
        location.href = "/user_group_setting";
      } else {
        alert("계정을 확인해주세요.");
        $(".user_login_id").empty();
        $(".user_login_pw").empty();
        $(".user_login_id").focus();
      }
    },
  });
}
