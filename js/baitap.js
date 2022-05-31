// Định nghĩa lớp đối tượng
function  Personnel(user, name, email, password, day, basicSalary, office, workTime){
    this.user = user;
    this.name = name;
    this.email = email;
    this.password = password;
    this.day = day;
    this.basicSalary = basicSalary;
    this.office = office;
    this.workTime = workTime;
}

// Phương thức tính lương
Personnel.prototype.totaLasary = function(){
    // kiểm tra chức vụ
    var totaLasary = this.basicSalary ;
    if(this.office === "Sếp"){
        return this.basicSalary * 3;
    }else if(this.office === "Trưởng phòng"){
        return  this.basicSalary * 2;
    }else{
        return totaLasary ;
    }
    
}

// phương thức sếp loại nhân viên
Personnel.prototype.classification = function(){
    if(this.workTime < 160){
        return "Nhân viên trung bình";
    }else if(this.workTime < 176){
        return "Nhân viên khá";
    }else if(this.workTime < 192){
        return "Nhân viên giỏi"
    }else{
        return "Nhân viên xuất sắc"
    }
}
 

// tạo mảng chứa danh sách nhân viên
var peoples = [];

// gọi hàm khi chương trình được chạy
init();

// hàm này sẽ được gọi đầu tiên khi chương trình được chạy
function init(){
    // B1 : Lấy data từ local storage

    // khi ta lấy data từ local lên,  data là array/object (đã bị strongify) thì cần dùng hàm JSON.parse để chuyển data về lại array/object.
    peoples = JSON.parse(localStorage.getItem("peoples")) || [] ;

    // Bởi vì local storage tự động loại bỏ các phương thức bên trong object => nên ta dùng vòng lặp để gán lại các phương thức cho object đó
    for(var i = 0; i < peoples.length ; i++){
        var nhanVien = peoples[i];
        peoples[i] = new Personnel(nhanVien.user, nhanVien.name, nhanVien.email, nhanVien.password, nhanVien.day, nhanVien.basicSalary, nhanVien.office, nhanVien.workTime )
    }

    display(peoples);
    
}

// Hàm thêm sinh viên
function addUser(){
    // B1 : DOM lấy value từ input
    var user = document.getElementById("tknv").value ;
    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var day = document.getElementById("datepicker").value;
    var basicSalary = +document.getElementById("luongCB").value ;
    var office = document.getElementById("chucvu").value ;
    var workTime = +document.getElementById("gioLam").value ;

    // kiểm tra các input
    var valid = validation();

    if(!valid){
        alert("vui lòng nhập các giá trị");
        return ;
    }
    

    var nhanVien = new Personnel(user, name, email, password, day, basicSalary, office, workTime);

    peoples.push(nhanVien);

    // B3: hiển thị ra giao diện

    display(peoples);
// console.log(Personnel.payRoll());

    // reser formt
    resetFormt();

    // B4: lưu biến peoples xuống loca storage
    localStorage.setItem("peoples" , JSON.stringify(peoples));
}

// hàm hiển thị
function display(peoples){
    var tBody = document.getElementById("tableDanhSach");
    var manHinh = "";

    // kiểm tra trong mảng Personnel để tìm và hiển thị ra giao diện từng nhân viên
    for(var i = 0; i < peoples.length ; i++ ){
        var nhanVien = peoples[i];

        // Với mội nhân viên tạo ra một tr chứa nội dung thông tin của nhân viên đó
        manHinh +=`
            <tr>
                <td>${nhanVien.user}</td>
                <td>${nhanVien.name}</td>
                <td>${nhanVien.email}</td>
                <td>${nhanVien.day}</td>
                <td>${nhanVien.office}</td>
                <td>${nhanVien.totaLasary()}</td>
                <td>${nhanVien.classification()}</td>
                <td>
                    <button class="btn btn-danger" 
                    onclick="detele('${nhanVien.user}')">Delete</button>
                   
                    <button class="btn btn-success" id="btnThem"
					onclick="edit('${nhanVien.user}')"data-toggle="modal"
					data-target="#myModal">Edit</button>
                </td>
            </tr>
        `
    }
    tBody.innerHTML = manHinh ;

    // console.log(nhanVien.taiKhoanNV)
}


// Hàm xóa nhân viên
function detele(IDNhanVien){
    // alert(IDNhanVien);
    var index = maNV(IDNhanVien);
    // kiểm tra index
    // alert(index);
    if(index !== -1){
        // thực hiện xóa một nhân viên 
        peoples.splice(index , 1);

        // hiển thị peoples mới sau khi xóa
        display(peoples);
    }
    // sau khi xóa nhân viên ta ccaafn cập nhật peoples mới xuống local storage
    localStorage.setItem("peoples" , JSON.stringify(peoples));


}


// hàm tìm mã nhân viên
function maNV(IDNhanVien){
    var index = -1 ;
    // dùng vòng lặp để tìm maNV cần xóa
    for(var i = 0 ; i < peoples.length ; i++ ){
        // kiểm tra phần tử tỏng mảng peoples có mã khớp với mã nhân viên không;
        if(peoples[i].user === IDNhanVien){
            index = i ;
            break;
        }
    }
    return index;
    // console.log(index);
}

// hàm reset formt
function resetFormt(){
    document.getElementById("tknv").value = "" ;
    document.getElementById("name").value = "" ;
    document.getElementById("email").value = "" ;
    document.getElementById("password").value = "" ;
    document.getElementById("datepicker").value= "" ;
    document.getElementById("luongCB").value = ""  ;
    document.getElementById("chucvu").value= ""  ;
    document.getElementById("gioLam").value= ""  ;

    document.getElementById("btnThemNV").disabled = false ;
    document.getElementById("tknv").disabled = false ;
    
}

// hàm cập nhật lên formt
function edit(IDNhanVien){
    var index = maNV(IDNhanVien);
    // dùng mã nhân viên để tìm nhân viên muốn cập nhật
    var nhanVien1 = peoples[index];

    // console.log(nhanVien1);
    // đưa thông tin của nhân viên lên lại formt
    document.getElementById("tknv").value = nhanVien1.user;
    document.getElementById("name").value = nhanVien1.name;
    document.getElementById("email").value = nhanVien1.email; 
    document.getElementById("password").value = nhanVien1.password;
    document.getElementById("datepicker").value= nhanVien1.day;
    document.getElementById("luongCB").value = nhanVien1.basicSalary;
    document.getElementById("chucvu").value= nhanVien1.office;
    document.getElementById("gioLam").value= nhanVien1.workTime;

    document.getElementById("btnThemNV").disabled = true ;
    document.getElementById("tknv").disabled = true ;
}

// Cập nhật lại nhân viên đã chỉnh sửa
function upDate(){
    // B1 : DOM lấy input
    var user = document.getElementById("tknv").value ;
    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var day = document.getElementById("datepicker").value;
    var basicSalary = +document.getElementById("luongCB").value ;
    var office = document.getElementById("chucvu").value ;
    var workTime = +document.getElementById("gioLam").value ;

    var nhanVien2 = new Personnel(user, name, email, password, day, basicSalary, office, workTime);

    // tìm nhân viên muốn chỉnh sửa
    var index = maNV(nhanVien2.user);
    // console.log(index);
    peoples[index] = nhanVien2 ;
    
    // hiển thị nhân viên đã chỉnh sửa ra giao diện
    display(peoples);
    resetFormt();   

    // sau khi cập nhật ta cân fluuw thông tin xuống local storage
    localStorage.setItem("peoples" , JSON.stringify(peoples));

}


// Hàm search

function search(){
    var searchValue = document.getElementById("searchName").value ;
    var searchValue = searchValue.toLowerCase();
    // console.log(searchValue);
    var newPeoples = [];
    // Dùng vòng lập để tìm ta nhân viên
    for(var i = 0 ; i < peoples.length ; i++){
        var nhanVien = peoples[i];
        var nhanVienXepLoai = nhanVien.classification().toLowerCase();

        if(nhanVienXepLoai.indexOf(searchValue) !== -1){
            newPeoples.push(nhanVien);
        }
    }
    display(newPeoples);
}

// hàm kiểm tra điều kiện các input
function validation(){
    // B1 : DOM lấy value từ inout
    var user = document.getElementById("tknv").value ;
    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var day = document.getElementById("datepicker").value;
    var basicSalary = +document.getElementById("luongCB").value ;
    var office = document.getElementById("chucvu").value ;
    var workTime = +document.getElementById("gioLam").value ;

    // alert(taiKhoanNV);
    var valid = true ;
   
    // Kiểm tra tên tài khoản nhân viên
    if(!checkInput(user)){
        valid = false ;
        document.getElementById("tbTKNV").innerHTML = 
       "Tài khoản không được để trống"
    }else{

        document.getElementById("tbTKNV").innerHTML = "";
    }
    if(!length( user , 6 , 4)){
        valid = false;
        document.getElementById("tbTKNV").innerHTML = 
        "Tài khoản có tối thiểu 4-6 kí tự"
    }
    


    var checkName= new RegExp ("^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s\W| ]+$") ;
	
    // kiểm tra tên nhân viên
    if(!checkInput(name)){
        valid = false ;
        document.getElementById("tbTen").innerHTML =
         "Tên không được để trống"
    }else if(!checkName.test(name)){
        valid = false;
        document.getElementById("tbTen").innerHTML = 
        "Tên người dùng không đúng kí tự"
    }
    else{
        document.getElementById("tbTen").innerHTML ="";

    }
    
    // kiểm tra email 

    var emailPattern = new RegExp("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$")
    if(!checkInput(email)){
        valid = false ;
        document.getElementById("tbEmail").innerHTML = 
        "Điền Email không được để trống"
    }else if(!emailPattern.test(email)){
        valid = false ;
        document.getElementById("tbEmail").innerHTML =
        "Email không đúng định dạng"
    }
    else{
        document.getElementById("tbEmail").innerHTML = "";

    }


    // kiểm tra password
    var pwPattern = new RegExp 
     ("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$")
    // var pwPattern = new RegExp ("^[A-Za-z]+$")
    if(!checkInput(password)){
        valid = false ;
        document.getElementById("tbMatKhau").innerHTML = 
        "Nhập mật khẩu"
    }else if(!length (password ,10) ){
        valid = false ;
        document.getElementById("tbMatKhau").innerHTML = 
        "Mật khẩu phải từ 6 - 10 kí tự"
    
    }else if(!pwPattern.test(password)){
        valid = false;
        document.getElementById("tbMatKhau").innerHTML = 
        "mật khẩu phải có số, chữ thường và chữ in hoa"
    }
    else{
        document.getElementById("tbMatKhau").innerHTML = "";

    }

    // kiểm tra ngày làm
    var dayPattern = new RegExp("^((0?[1-9]|1[012])[- /.](0?[1-9]|[12][0-9]|3[01])[- /.](19|20)?[0-9]{2})*$")
    if(!checkInput(day)){
        valid = false;
        document.getElementById("tbNgay").innerHTML = 
        "Ngày làm không được để trống"
    
    }else if(!dayPattern.test(day)){
        valid = false;
        document.getElementById("tbNgay").innerHTML = 
        "Nhập tháng ngày năm"
    }
    else{
        document.getElementById("tbNgay").innerHTML = "";

    }

    // kiểm tra lương cơ bản
    if(!checkInput(basicSalary)){
        valid = false ;
        document.getElementById("tbLuongCB").innerHTML = 
        "Nhập lương cơ bản"
    }else if((basicSalary > 20e6 || 10e6 >basicSalary )){
        valid = false;
        document.getElementById("tbLuongCB").innerHTML = 
        "Nhập đúng mức lương 10000000-20000000"
    }
    else{
        document.getElementById("tbLuongCB").innerHTML = "";

    }

    // kiểm tra chức vụ
    if(!checkInput(office)){
        valid = false;
        document.getElementById("tbChucVu").innerHTML = 
        "Chọn chức vụ"
    }else if (office === "Chọn chức vụ"){
        valid = false ;
        document.getElementById("tbChucVu").innerHTML = 
        "Chọn chức vụ"
    }
    else{
        document.getElementById("tbChucVu").innerHTML = "" ;

    }

    // kiểm tra giờ làm
    if(!checkInput(workTime)){
        valid = false ;
        document.getElementById("tbGiolam").innerHTML = 
        "Nhập giờ làm"
    }else if (workTime > 200 || workTime < 80 ){
        valid = false ;
        document.getElementById("tbGiolam").innerHTML =
        "Số giờ làm từ 80 - 200"
    }
    else{
        document.getElementById("tbGiolam").innerHTML = "";
    }

    return valid;

}


// hàm kiểm tra input có trống hay không
function checkInput(value){
    if(!value){
        return false;
    }
    return true;
}

// hàm kiểm tra độ dài
function length(value, max , min){
    if(value.length > max ){
        return false;
    }
    if(value.length < min ){
        return false;
    }
    return true;
}