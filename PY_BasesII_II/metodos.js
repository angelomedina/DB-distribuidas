google.charts.load('current', {'packages':['gauge']});
google.charts.setOnLoadCallback(drawChart);


google.charts.load('current', {'packages':['table']});
google.charts.setOnLoadCallback(drawTable);

var telefonosUsuarios = [];
var conexionesDB=0;
var megasNodo="0";
var megasCentral="0";


function resetGraficos() {
    conexionesDB=0;
    megasNodo="0";
    megasCentral="0";
    drawTable("0","0");
    drawChart(0);

    document.getElementById('cantidad_registro_clientes').value="";
    document.getElementById('tiempo_registro_clientes').value="";
    document.getElementById('cantidad_activar_vales').value="";
    document.getElementById('tiempo_activar_vales').value="";
    document.getElementById('cantidad_realizar_solicitudes').value="";
    document.getElementById('tiempo_realizar_solicitudes').value="";

}

function cargaGraficos() {
    drawTable("0","0");
    drawChart(0);

}

function numeroAleatorio(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function generaClientes() {


    //inicio de tiempo de ejecucion
    var start = new Date().getTime();


    //console.timeEnd('Tiempo registro clientes');

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
                var end = new Date().getTime();
                var time = end - start;
                alert("Fin registro clientes, duracion: "+time);
            }
        }, (ntiempo * 1000));
    }
}

function generaVales() {

    var start = new Date().getTime();

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
                var end = new Date().getTime();
                var time = end - start;
                alert("Fin genera vales, duracion: "+time);
            }
        }, (ntiempo * 1000));
    }
}

function generaPedidos() {

    var start = new Date().getTime();

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

                var end = new Date().getTime();
                var time = end - start;
                alert("Fin genera pedidos, duracion: "+time);

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
                getTamañoCentral();
                getTamañoNodo();
                conexionesDB=conexionesDB+1;
                //grafico
                drawChart(conexionesDB);
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
                getTamañoCentral();
                getTamañoNodo();
                conexionesDB=conexionesDB+1;
                //grafico
                drawChart(conexionesDB);
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
                getTamañoCentral();
                getTamañoNodo();
                conexionesDB=conexionesDB+1;
                //grafico
                drawChart(conexionesDB);
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

                conexionesDB=conexionesDB+1;
                //grafico
                drawChart(conexionesDB);

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

//obtine el tamano de DB Central
function getTamañoCentral(){

    drawTable(megasCentral,megasNodo);
    //++++++++++++++++++++++++++++++++++
    //SOLICITUD
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {

        if (this.readyState == 4 && this.status == 200) {
            if(this.statusText== "OK" && this.status == 200) {

                var json = this.response;
                var arr = JSON.parse(json);

                conexionesDB=conexionesDB+1;
                //grafico
                drawChart(conexionesDB);

                for (var i = 0; i < arr.length; i++){
                    var obj = arr[i];

                    for (var key in obj){

                        if(key.toString() === 'database_size'){
                            var value = obj[key];

                            megasCentral=value;
                        }

                    }
                }
            }
            else{console.log(this.statusText, this.status)}
        }
    };
    xhttp.open("GET", "conn.php?func=getTamañoCentral()", true);
    xhttp.send();

}

//obtine el tamano de DB Nodo
function getTamañoNodo(){

    drawTable(megasCentral,megasNodo);
    //++++++++++++++++++++++++++++++++++
    //SOLICITUD
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {

        if (this.readyState == 4 && this.status == 200) {
            if(this.statusText== "OK" && this.status == 200) {

                var json = this.response;
                var arr = JSON.parse(json);

                conexionesDB=conexionesDB+1;
                //grafico
                drawChart(conexionesDB);

                for (var i = 0; i < arr.length; i++){
                    var obj = arr[i];

                    for (var key in obj){

                        if(key.toString() === 'database_size'){
                            var value = obj[key];

                            megasNodo=value;
                        }

                    }
                }
            }
            else{console.log(this.statusText, this.status)}
        }
    };
    xhttp.open("GET", "conn.php?func=getTamañoCentral()", true);
    xhttp.send();

}

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//GRAFICO
function drawChart(Conn) {

    var data = google.visualization.arrayToDataTable([
        ['Label', 'Value'],
        ['Conexiones', Conn]
    ]);

    var options = {
        width: 500, height: 120,
        redFrom: 90, redTo: 100,
        yellowFrom:75, yellowTo: 90,
        minorTicks: 5
    };

    var chart = new google.visualization.Gauge(document.getElementById('chart_div'));
    chart.draw(data, options);
}

function drawTable(Central,Nodo) {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'DB');
    data.addColumn('string', 'Tamaño');
    data.addRows([
        ['Central',Central],
        ['Nodo',Nodo]
    ]);

    var table = new google.visualization.Table(document.getElementById('table_div'));

    table.draw(data, {width: '20%', height: '20%'});
}

