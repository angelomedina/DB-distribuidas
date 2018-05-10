--drop database ServidorCentral
create database ServidorCentral
use ServidorCentral


create table usuario
(
    telefono        char(9) not null,
	nombre          varchar(30) not null,
	primerApellido  varchar(30) not null,
	segundoApellido varchar(30) not null,
	correo          varchar(30) not null,
	tipo            char(1) not null,
    constraint pk_telefono_usuario  primary key (telefono),
	constraint chk_telefono_usuario check (telefono like '[0-9][0-9][0-9][0-9]-[0-9][0-9][0-9][0-9]'),
	constraint chk_correo_usuario   check (correo like '_%@_%._%'),
	constraint chk_tipo_usuario     check (tipo in ('A','C')),
);



create table cliente
(
    telefono        char(9) not null,
	totalDinero     int not null,
    constraint pk_telefono_cliente       primary key (telefono),
	constraint fk_telefono_cliente       foreign key (telefono) references usuario,
	constraint chk_telefono_cliente      check (telefono like '[0-9][0-9][0-9][0-9]-[0-9][0-9][0-9][0-9]')
);

create table administrador
(
    telefono        char(9) not null,
    constraint pk_telefono_administrador  primary key (telefono)
);


create table vale
(
	codigo        int IDENTITY(1,1),
	monto         int not null,
	telefono      char(9) not null,
	constraint pk_codigo_vale        primary key (codigo),
	constraint chk_telefono_vale     check (telefono like '[0-9][0-9][0-9][0-9]-[0-9][0-9][0-9][0-9]'),
    constraint fk_telefono_vale      foreign key (telefono) references cliente
);

create table solicitud
(
	id        int not null,
	fecha     datetime  not null,
	monto     int not null,
	telefono  char(9) not null,
	constraint pk_id_solicitud          primary key (id),
    constraint fk_telefono_solicitud    foreign key (telefono) references cliente,
    constraint chk_telefono_solicitud   check (telefono like '[0-9][0-9][0-9][0-9]-[0-9][0-9][0-9][0-9]')
);


-------------------------------------------------------------------------------------------------------------------------------------

--drop database Nodo_ServidorCentral

create database Nodo_ServidorCentral
use Nodo_ServidorCentral

create table documento
(
    codigo          int IDENTITY(1,1),
	documento       varbinary(max) NULL,
	idSolicitud     int not null,
    constraint  pk_codigo_documento  primary key (codigo),
);

create table solicitud
(
	id            int IDENTITY(1,1),
	telefono      char(9)    not null,
	fecha         datetime  not null,
	montoCompra   int not null,
	cantidad      int not null,
	color         char(1) not null,
	estado        char(1) not null,
	constraint pk_id_solicitud  primary key (id),
    constraint chk_telefono_solicitud  check (telefono like '[0-9][0-9][0-9][0-9]-[0-9][0-9][0-9][0-9]'),
	constraint chk_color_solicitud     check (color in ('B','N')),
	constraint chk_estado_solicitud    check (estado in ('F','T'))

);

-------------------------------------------------------------------------------------------------------------------------------------------

--servidor de conexiones remotas primer paso
exec master.dbo.sp_addlinkedserver
	@server = N'localhost',
	@srvproduct = N'SQL Server';
go

--servidor de conexiones remotas segundo paso
exec master.dbo.sp_addlinkedsrvlogin
	@rmtsrvname = N'localhost',
	@rmtuser = N'sa',
	@useself = 'FALSE',
	@rmtpassword = N'deathnote';
go

-----------------------------------------------------------------------------------------------------------------------------------
--consulta al servidor
select * from [localhost].ServidorCentral.dbo.usuario
go

--Registrar Clientes
use Nodo_ServidorCentral

---(usuario)+(cliente)


create PROCEDURE registroClientes
    @telefono		   varchar(9),
    @nombre			   varchar(30),
	@primerApellido    varchar(30),
	@segundoApellido   varchar(30),
	@correo            varchar(30),
	@respuesta         BIT OUTPUT
AS
   begin
		SET NOCOUNT ON;
				BEGIN TRY
					insert into [localhost].ServidorCentral.dbo.usuario (telefono,nombre,primerApellido,segundoApellido,correo,tipo) values(@telefono,@nombre,@primerApellido,@segundoApellido,@correo,'C');
					insert into [localhost].ServidorCentral.dbo.cliente (telefono,totalDinero) values(@telefono,0);
					SET @respuesta = 1
					SELECT @respuesta
				END TRY
				BEGIN CATCH
					SET @respuesta = 0
					SELECT @respuesta
					END CATCH
		SET NOCOUNT OFF;
   end
GO

--ejemplo de query
exec registroClientes '7227-9636','a','b','c','a@gmail.com',0
exec registroClientes '0000-0000','a','b','c','a@gmail.com',0
exec registroClientes '1111-1111','a','b','c','a@gmail.com',0

-----------------------------------------------------------------------------------------------------------------------------------
--Activar vales



create PROCEDURE activarVale
    @telefono		   varchar(9),
    @monto			   int,
	@respuesta         BIT OUTPUT
AS
   begin
		SET NOCOUNT ON;
				BEGIN TRY
					insert into [localhost].ServidorCentral.dbo.vale (monto,telefono) values(@monto,@telefono);
					Update [localhost].ServidorCentral.dbo.cliente  set totalDinero=totalDinero+@Monto where telefono=@telefono;
					SET @respuesta = 1
					SELECT @respuesta
				END TRY
				BEGIN CATCH
					SET @respuesta = 0
					SELECT @respuesta
					END CATCH
		SET NOCOUNT OFF;
   end
GO

--ejemplo de query
exec activarVale '7227-9636',1000,0
exec activarVale '0000-0000',1000,0
exec activarVale '1111-1111',1000,0



-----------------------------------------------------------------------------------------------------------------------------------

--Realizar solicitud


create PROCEDURE realizarPedido
    @telefono		   varchar(9),
	@documento         varbinary(max), 
	@respuesta         BIT OUTPUT
AS
Declare 
   @montoDisponible int,
   @resto int,
   @idSolicitud int,
   @fecha  datetime;
   begin
		SET NOCOUNT ON;
				BEGIN TRY
					set @fecha=GETDATE();
					if exists (select telefono from [localhost].ServidorCentral.dbo.cliente where @telefono = telefono)
						begin
						   set @montoDisponible = (select totalDinero from [localhost].ServidorCentral.dbo.cliente where @telefono = telefono);
						   set @resto = @montoDisponible-500;

						       if(@montoDisponible >= 500)
							        begin 

									  --verificamos que usuario y saldo sean suficientes(de atras)

									  insert into solicitud(telefono,fecha,montoCompra,cantidad,color,estado) values(@telefono,@fecha,500,1,'N','T');
									  
									  --buscamos la solicitud
									  set @idSolicitud  = (select id from solicitud where telefono=@telefono and fecha=@fecha);
				

									  --insertamos documento
									  insert into documento(documento,idSolicitud) values(@documento,@idSolicitud);

									  --solicitud central
									  insert into [localhost].ServidorCentral.dbo.solicitud (id,fecha,monto,telefono) values(@idSolicitud ,@fecha,500,@telefono);

									  ---actualizar monto usuario cntral
									  Update [localhost].ServidorCentral.dbo.cliente  set totalDinero=@resto where telefono=@telefono;



									  SET @respuesta = 1
									  SELECT @respuesta									 
								    end
								else
									SET @respuesta = 0
									SELECT @respuesta
						end
					else
						SET @respuesta = 0
						SELECT @respuesta

				END TRY
				BEGIN CATCH
					SET @respuesta = 0
					SELECT @respuesta
					END CATCH
		SET NOCOUNT OFF;
   end
GO


exec  realizarPedido '1111-1111',null,0

select * from [localhost].ServidorCentral.dbo.cliente