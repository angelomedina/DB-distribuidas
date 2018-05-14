<?php
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// redireccion de funciones

if ($_GET['func']=='registroClientes()'){
    registroClientes($_GET['telefono'],$_GET['nombre'],$_GET['primerApellido'],$_GET['segundoApellido'],$_GET['correo']);
}

if ($_GET['func']=='activarVale()'){
    activarVale($_GET['telefono'],$_GET['monto']);
}

if ($_GET['func']=='realizarPedido()'){
    realizarPedido($_GET['telefono'],$_GET['documento']);
}

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//FUNCIONES
function conexion(){
    $serverName = "localhost\sqlexpress,1433";
    $connectionInfo = array( "Database"=>"Nodo_ServidorCentral", "UID"=>"sa", "PWD"=>"deathnote");
    $conn = sqlsrv_connect( $serverName, $connectionInfo);

    if( $conn ) {
        echo "Exito de conexion con SQL Server";
        return $conn;
    }else{
        echo "Error de conexion con SQL Server";
        die( print_r( sqlsrv_errors(), true));
    }
}

function registroClientes($telefono,$nombre,$primerApellido,$seguncoApellido,$correo){

    $conn = conexion();
    $sql ="exec registroClientes @telefono='$telefono',@nombre='$nombre',@primerApellido='$primerApellido',@segundoApellido='$seguncoApellido',@correo='$correo',@respuesta='0'";

    $stmt = sqlsrv_query( $conn, $sql );
    if( $stmt === false) {
        die( print_r( sqlsrv_errors(), true) );
    }
    sqlsrv_free_stmt( $stmt);
}

function activarVale($telefono,$monto){

    $conn = conexion();
    $sql ="exec activarVale @telefono='$telefono',@monto='$monto',@respuesta='0'";

    $stmt = sqlsrv_query( $conn, $sql );
    if( $stmt === false) {
        die( print_r( sqlsrv_errors(), true) );
    }
    sqlsrv_free_stmt( $stmt);
}

function realizarPedido($telefono,$documento){

    $conn = conexion();
    $sql ="exec realizarPedido @telefono='$telefono',@documento='$documento',@respuesta='0'";

    $stmt = sqlsrv_query( $conn, $sql );
    if( $stmt === false) {
        die( print_r( sqlsrv_errors(), true) );
    }
    sqlsrv_free_stmt( $stmt);
}