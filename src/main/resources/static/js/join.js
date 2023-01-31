function join() {
  // 값 가져오기
  var tr_user_id = $(".user_id").val();
  var tr_user_passwd = $(".user_pw").val();
  var pw2 = $(".user_pw2").val();
  var tr_user_name = $(".user_name").val();
  var tr_user_org = $(".user_id_agency").val();
  // 조건식
  if (tr_user_id == "") {
    alert("아이디를 입력하세요.");
    $(".user_id").focus();
    return;
  }
  if (tr_user_passwd == "") {
    alert("비밀번호를 입력하세요.");
    $(".user_pw").focus();
    return;
  }
  if (pw2 == "") {
    alert("비밀번호 재확인을 입력하세요.");
    $(".user_pw2").focus();
    return;
  }
  if (tr_user_name == "") {
    alert("이름을 입력하세요.");
    $(".user_name").focus();
    return;
  }
  if (tr_user_org == "") {
    alert("기관명을 입력하세요.");
    $(".user_id_agency").focus();
    return;
  }

  // 비밀번호가 서로 다름
  if (tr_user_passwd != pw2) {
    alert("비밀번호를 확인하세요.");
    $(".user_pw2").val("");
    $(".user_pw2").focus();
    return;
  }

  var jsonData = {
    tr_user_id: tr_user_id,
    tr_user_passwd: tr_user_passwd,
    tr_user_name: tr_user_name,
    tr_user_org: tr_user_org,
  };
  console.log(jsonData);
  $.ajax({
    url: "http://192.168.32.44:8080/user/join",
    type: "POST",
    contentType: "application/json",
    dataType: "json",
    data: JSON.stringify(jsonData),
    success: function (response) {
      if (response == 0) {
        alert("중복된 아이디입니다.");
        $(".user_id").val("");
        $(".user_id").focus();
      } else {
        alert("회원 등록 되었습니다.");
        location.replace("/login.html");
      }
    },
  });
}
