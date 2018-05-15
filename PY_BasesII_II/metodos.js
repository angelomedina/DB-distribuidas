var telefonosUsuarios = [];

function numeroAleatorio(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function generaClientes() {

    var cantidad=document.getElementById('cantidad_registro_clientes').value;
    var segundos=document.getElementById('tiempo_registro_clientes').value;

    //verificacion del formulario

    if ( (cantidad == null || cantidad.length == 0 || /^\s+$/.test(cantidad)) || (segundos == null || segundos.length == 0 || /^\s+$/.test(segundos))) {
         alert("Verifique que los datos este completos");
    }
    else {

        var ntelefono = parseInt(cantidad);
        var ntiempo = parseInt(segundos);

        //+++++++++++++++++++++++++++++++++
        //obtengo la lista de los Usuarios(endpoint)
        getUsuarios();

        //+++++++++++++++++++++++++++++++++
        var cont = 1;
        var id = setInterval(function () {

            //generar el telefono
            //**************************************************
            var random = [];
            var temp = Math.floor(Math.random() * 9000) + 999
            var temp2 = Math.floor(Math.random() * 9000) + 999

            if (random.indexOf(temp) == -1) {
                random.push(temp + "-" + temp2);
                var telefono = random[0];

                if (telefono in telefonosUsuarios) {
                    console.log("telefono repetido: no agregado")
                }
                else {
                    registroClientes(telefono.toString())
                }
                cont++;
            }
            //**************************************************

            //para la secuencia
            //*************************************************
            if (cont == ntelefono + 1) {
                clearInterval(id);
                alert("Fin registro clientes");
            }
        }, (ntiempo * 1000));
    }
}

function generaVales() {

    var cantidad=document.getElementById('cantidad_activar_vales').value;
    var segundos=document.getElementById('tiempo_activar_vales').value;

    //verificacion del formulario

    if ( (cantidad == null || cantidad.length == 0 || /^\s+$/.test(cantidad)) || (segundos == null || segundos.length == 0 || /^\s+$/.test(segundos))) {
        alert("Verifique que los datos este completos");
    }
    else {

        var ntelefono = parseInt(cantidad);
        var ntiempo = parseInt(segundos);

        //+++++++++++++++++++++++++++++++++
        //obtengo la lista de los Usuarios(endpoint)
        getUsuarios();

        //+++++++++++++++++++++++++++++++++
        var cont = 1;
        var id = setInterval(function () {

            if(telefonosUsuarios.length >= 1) {

                var cantidadTelefonos = telefonosUsuarios.length;
                var posicion = numeroAleatorio(0, cantidadTelefonos);

                var telefono = telefonosUsuarios[posicion];

                activarVale(telefono);
            }
            else{
                alert("No hay telefonos registrados en DB");
            }
            cont++;

            //**************************************************

            //para la secuencia
            //*************************************************
            if (cont == ntelefono + 1) {
                clearInterval(id);
                alert("Fin realizar pedidos");
            }
        }, (ntiempo * 1000));
    }
}

function generaPedidos() {

    var cantidad=document.getElementById('cantidad_realizar_solicitudes').value;
    var segundos=document.getElementById('tiempo_realizar_solicitudes').value;

    //verificacion del formulario

    if ( (cantidad == null || cantidad.length == 0 || /^\s+$/.test(cantidad)) || (segundos == null || segundos.length == 0 || /^\s+$/.test(segundos))) {
        alert("Verifique que los datos este completos");
    }
    else {

        var ntelefono = parseInt(cantidad);
        var ntiempo = parseInt(segundos);

        //+++++++++++++++++++++++++++++++++
        //obtengo la lista de los Usuarios(endpoint)
        getUsuarios();

        //+++++++++++++++++++++++++++++++++
        var cont = 1;
        var id = setInterval(function () {

            if(telefonosUsuarios.length >= 1) {

                var cantidadTelefonos = telefonosUsuarios.length;
                var posicion = numeroAleatorio(0, cantidadTelefonos);

                var telefono = telefonosUsuarios[posicion];

                realizarPedido(telefono);
            }
            else{
                alert("No hay telefonos registrados en DB");
            }
            cont++;

            //**************************************************

            //para la secuencia
            //*************************************************
            if (cont == ntelefono + 1) {
                clearInterval(id);
                alert("Fin realizar pedidos");
            }
        }, (ntiempo * 1000));
    }
}

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//CONEXIONES DB: JAVASCRIP + PHP + SQL SERVER

// procedimiento almacenado para registrar cleinte
function registroClientes(ptelefono) {
    //++++++++++++++++++++++++++++++++
    //PARAMETROS
    var telefono=ptelefono;
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
                console.log("Solicitud registro cliente enviada");
            }
            else{console.log(this.statusText, this.status)}
        }
    };
    xhttp.open("GET", "conn.php?func=registroClientes()&telefono="+telefono+"&nombre="+nombre+"&primerApellido="+primerApellido+"&segundoApellido="+segundoApellido+"&correo="+correo, true);
    xhttp.send();

}

// procedimiento almacenado para activar vales a un cliente
function activarVale(ptelefono) {
    //++++++++++++++++++++++++++++++++
    //PARAMETROS
    var telefono=ptelefono;
    var monto   =500;

    //++++++++++++++++++++++++++++++++++
    //SOLICITUD
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {

        if (this.readyState == 4 && this.status == 200) {
            if(this.statusText== "OK" && this.status == 200) {
                console.log("Solicitud activacion de vale enviada");
            }
            else{console.log(this.statusText, this.status)}
        }
    };
    xhttp.open("GET", "conn.php?func=activarVale()&telefono="+telefono+"&monto="+monto.toString(), true);
    xhttp.send();

}

// procedimento almacenado para realizar solicitudes
function realizarPedido(ptelefono) {
    //++++++++++++++++++++++++++++++++
    //PARAMETROS
    var telefono  =ptelefono;

    //++++++++++++++++++++++++++++++++++
    //SOLICITUD
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {

        if (this.readyState == 4 && this.status == 200) {
            if(this.statusText== "OK" && this.status == 200) {
                console.log("Solicitud realizar pedido enviada");
            }
            else{console.log(this.statusText, this.status)}
        }
    };
    xhttp.open("GET", "conn.php?func=realizarPedido()&telefono="+telefono, true);
    xhttp.send();

}

// proyeccion de los telefonos de los usuarios: los guarda en una lista
function getUsuarios() {
    telefonosUsuarios = [];
    //++++++++++++++++++++++++++++++++++
    //SOLICITUD
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {

        if (this.readyState == 4 && this.status == 200) {
            if(this.statusText== "OK" && this.status == 200) {

                var json = this.response;
                var arr = JSON.parse(json);

                for (var i = 0; i < arr.length; i++){
                    var obj = arr[i];

                    for (var key in obj){
                        var value = obj[key];

                        telefonosUsuarios .push(value.toString());

                    }
                }
            }
            else{console.log(this.statusText, this.status)}
        }
    };
    xhttp.open("GET", "conn.php?func=getUsuarios()", true);
    xhttp.send();

}