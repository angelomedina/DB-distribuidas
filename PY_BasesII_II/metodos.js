
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//CONEXIONES DB: JAVASCRIP + PHP + SQL SERVER

// procedimiento almacenado para registrar cleinte
function registroClientes() {
    //++++++++++++++++++++++++++++++++
    //PARAMETROS
    var telefono="0010-0000";
    var nombre="0";
    var primerApellido="0";
    var segundoApellido="0";
    var correo="0@gmail.com";

    //++++++++++++++++++++++++++++++++++
    //SOLICITUD
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {

        if (this.readyState == 4 && this.status == 200) {
            if(this.statusText== "OK" && this.status == 200) {
                alert("Registro cliente exitoso")
            }
            else{console.log(this.statusText, this.status)}
        }
    };
    xhttp.open("GET", "conn.php?func=registroClientes()&telefono="+telefono+"&nombre="+nombre+"&primerApellido="+primerApellido+"&segundoApellido="+segundoApellido+"&correo="+correo, true);
    xhttp.send();

}

// procedimiento almacenado para activar vales a un cliente
function activarVale() {
    //++++++++++++++++++++++++++++++++
    //PARAMETROS
    var telefono="0010-0000";
    var monto   =500;

    //++++++++++++++++++++++++++++++++++
    //SOLICITUD
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {

        if (this.readyState == 4 && this.status == 200) {
            if(this.statusText== "OK" && this.status == 200) {
                alert("Activacion de vale exitosa")
            }
            else{console.log(this.statusText, this.status)}
        }
    };
    xhttp.open("GET", "conn.php?func=activarVale()&telefono="+telefono+"&monto="+monto.toString(), true);
    xhttp.send();

}

// procedimento almacenado para realizar solicitudes
function realizarPedido() {
    //++++++++++++++++++++++++++++++++
    //PARAMETROS
    var telefono  ="0010-0000";
    var documento =01010100;


    //++++++++++++++++++++++++++++++++++
    //SOLICITUD
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {

        if (this.readyState == 4 && this.status == 200) {
            if(this.statusText== "OK" && this.status == 200) {
                console.log(this.response.toString())
                alert("Pedido exitoso")
            }
            else{console.log(this.statusText, this.status)}
        }
    };
    xhttp.open("GET", "conn.php?func=realizarPedido()&telefono="+telefono+"&documento="+documento.toString(), true);
    xhttp.send();

}