const { createConnection } = require('mysql');
const app = require('../../config/server');
const bcryptjs = require('bcryptjs');
const connection = require('../../config/db');
const { request } = require('../../config/server');
const ejsLint = require('ejs-lint');


module.exports = app => {
    app.get('/', (req, res) => {
        console.log("Funciona");
        if (req.session.loggedin) {
            res.render('../views/gestorapp.ejs', {
                login: true,
                name: req.session.usuario

            })
        } else {
            res.render('../views/login.ejs', {
                login: false,
                name: "Por favor inicie sessión"
            })
        }
    })

    // vistas
    app.get('/login', (req, res) => {
        res.render('../views/login.ejs');
    })

    app.get('/register', (req, res) => {
        res.render('../views/register.ejs');
    })

    app.get('/index', (req, res) => {
        res.render('../views/index.ejs');
    })

    app.get('/gestorapp', (req, res) => {
        res.render('../views/gestorapp.ejs', { login: true, name: req.session.usuario })

    })


    app.get('/info', (req, res) => {
        res.render('../views/info.ejs')
    })

    app.get('/logout', (req, res) => {
        req.session.destroy(() => {
            res.redirect('/')
        })
    })

    // Visualización Reportes  
    app.get("/reportes", (req, res) => {
        connection.query("SELECT * FROM inventario", (errr, results) => {
            connection.query("SELECT SUM(total_venta) as 'ventas', SUM(total_gasto) as 'gastos', SUM(total_ganancia) as 'ganancias' FROM ventas_diarias", (err, result) => {
                if (err, errr) {
                    res.render("../views/error.ejs");
                } else {
                    res.render("../views/reportes.ejs", {
                        inventario: results,
                        ventas_diarias: result,
                        ventas: result[0].ventas,
                        gastos: result[0].gastos,
                        ganancias: result[0].ganancias


                    });
                    
                }
            });
    
        });
    });

    


    app.get("/grafico", (req, res) => {
        connection.query("SELECT * FROM inventario", (err, result) => {
            if (err) {
                res.render("../views/error.ejs");
            } else {
                res.render("../views/grafico.ejs");
                // res.status(200).json(result);
            }
        })

    });

    app.get("/apigrafico", (req, res) => {
        const sql = 'SELECT * FROM inventario';
        connection.query(sql, (error, results) => {
            if (error) throw error;
            if (results.length > 0) {
                res.json(results);
            } else {
                res.send('not result');
            }
        })
    })
    app.get("/apiventas", (req, res) => {
        const sql = "SELECT SUM(total_venta) as 'ventas', SUM(total_gasto) as 'gastos', SUM(total_ganancia) as 'ganancias' FROM ventas_diarias";
        connection.query(sql, (error, results) => {
            if (error) throw error;
            if (results.length > 0) {
                res.json(results);
            } else {
                res.send('not result');
            }
        })
    })


    // Visualización Registro Ventas
    app.get("/ventas", (req,res) => {
        connection.query("SELECT * FROM ventas_diarias", (err, result) => {
            if(err){
                res.render("../views/error.ejs");
            } else {
                res.render("../views/ventas.ejs", {
                    ventas_diarias: result
                    
                });
                console.log(result);
            }
        })
    });

    // Agregar Registro
    app.post("/addVenta", (req,res) => {
        const {id, total_venta, total_gasto, total_ganancia,fecha_creacion} = req.body;
        const total_ganancias = total_venta - total_gasto;
        connection.query("INSERT INTO ventas_diarias SET ?" , {
            id: id,
            total_venta: total_venta,
            total_gasto: total_gasto,
            total_ganancia: total_ganancias,
            fecha_creacion: fecha_creacion,

        }, (err, result) => {
            if(err){
                res.render("../views/error.ejs");
            } else {
                res.redirect("/ventas")
            }
        })
    });

    // Borrar un Registro Venta
    app.get("/deleteVenta/:id", (req,res) => {
        const id = req.params.id;
        connection.query("DELETE FROM ventas_diarias WHERE id = ?", [id], (err, result) => {
            if(err){
                res.render("../views/error.ejs");
            } else {
                connection.query("SELECT * FROM ventas_diarias", (err, result) => {
                    if(err){
                        res.render("../views/error.ejs");
                    } else {
                        res.render("../views/ventas.ejs", {
                            ventas_diarias: result,
                            alert:true,
                            ruta: "ventas"
                        });
                    }
                })
            }
        })

    });

    //Editar Registro de Venta
    app.post("/editVenta/:id", (req,res) => {
        const id = req.params.id;
        const {  total_venta, total_gasto} = req.body
        const ganancias = total_venta - total_gasto;
        console.log(req.body);
        connection.query("UPDATE ventas_diarias SET total_venta = ?, total_gasto = ?, total_ganancia = ? WHERE id = ?", [total_venta, total_gasto, ganancias, id], (err, result) => {
            if(err){
                res.render("../views/error.ejs");
            } else {
                res.redirect("/ventas");
                console.log(result);
                // ventas_diarias: result
            }
        })
    }); 

    // Visualización de Cuentas por Pagar a Proveedores
    app.get("/cuentas", (req,res) => {
        connection.query("SELECT * FROM cuentas_proveedores", (err, result) => {
            if(err){
                res.render("../views/error.ejs");
            } else {
                res.render("../views/cuentas.ejs", {
                    cuentas_proveedores: result
                });
                console.log(result);
            }
        })
    });

    // Agregar Cuenta
    app.post("/addCuenta", (req,res) => {
        const {id_factura, nit_proveedor, dias_descuento, total, estado, fecha_lim} = req.body;
        connection.query("INSERT INTO cuentas_proveedores SET ?" , {
            id_factura: id_factura,
            nit_proveedor: nit_proveedor,
            dias_descuento: dias_descuento,
            total: total,
            estado: estado,
            fecha_lim: fecha_lim,
        }, (err, result) => {
            if(err){
                res.render("../views/error.ejs");
            } else {
                res.redirect("/cuentas")
            }
        })
    });

    // Borrar un Cuenta
    app.get("/deleteCuenta/:id_factura", (req,res) => {
        const id_factura = req.params.id_factura;
        connection.query("DELETE FROM cuentas_proveedores WHERE id_factura = ?", [id_factura], (err, result) => {
            if(err){
                res.render("../views/error.ejs");
            } else {
                connection.query("SELECT * FROM cuentas_proveedores", (err, result) => {
                    if(err){
                        res.render("../views/error.ejs");
                    } else {
                        res.render("../views/cuentas.ejs", {
                            cuentas_proveedores: result,
                            alert:true,
                            ruta: "cuentas"
                        });
                    }
                })
            }
        })
    });

    //Editar Cuenta
    app.post("/editCuenta/:id_factura", (req,res) => {
        const id_factura = req.params.id_factura;
        const { nit_proveedor, dias_descuento, total, estado, fecha_lim, fecha_creacion} = req.body;
        console.log(req.body);
        connection.query("UPDATE cuentas_proveedores SET nit_proveedor = ?, dias_descuento = ?, total = ?, estado = ?, fecha_lim = ?, fecha_creacion = ? WHERE id_factura = ?", [nit_proveedor, dias_descuento, total, estado, fecha_lim, fecha_creacion, id_factura], (err, result) => {
            if(err){
                res.render("../views/error.ejs");
            } else {
                res.redirect("/cuentas");
            }
        })
    });    


    // Visualización de Proveedores
    app.get("/proveedores", (req,res) => {
        connection.query("SELECT * FROM proveedores", (err, result) => {
            if(err){
                res.render("../views/error.ejs");
            } else {
                res.render("../views/proveedores.ejs", {
                    proveedores: result
                    
                });
                console.log(result);
            }
        })
    });

    // Agregar Proveedor
    app.post("/addProveedor", (req,res) => {
        const {nit_proveedor, nombre, codigo, telefono, email, dias_descuento} = req.body;
        connection.query("INSERT INTO proveedores SET ?" , {
            nit_proveedor: nit_proveedor,
            nombre: nombre,
            codigo: codigo,
            telefono: telefono,
            email: email,
            dias_descuento: dias_descuento
            
        }, (err, result) => {
            if(err){
                res.render("../views/error.ejs");
            } else {
                res.redirect("/proveedores")
            }
        })
    });

    // Borrar un Proveedor
    app.get("/deleteProveedor/:nit_proveedor", (req,res) => {
        const nit_proveedor = req.params.nit_proveedor;
        connection.query("DELETE FROM proveedores WHERE nit_proveedor = ?", [nit_proveedor], (err, result) => {
            if(err){
                res.render("../views/error.ejs");
            } else {
                connection.query("SELECT * FROM proveedores", (err, result) => {
                    if(err){
                        res.send(err);
                    } else {
                        res.render("../views/proveedores.ejs", {
                            proveedores: result,
                            alert:true,
                            ruta: "proveedores"
                        });
                    }
                })
            }
        })
    });

    //Editar proveedor
    app.post("/editProveedor/:nit_proveedor", (req,res) => {
        const nit_proveedor = req.params.nit_proveedor;
        const { nombre, codigo, telefono, email, dias_descuento} = req.body
        console.log(req.body);
        connection.query("UPDATE proveedores SET nombre = ?, codigo = ?, telefono = ?, email = ?, dias_descuento = ? WHERE nit_proveedor = ?", [nombre, codigo, telefono, email, dias_descuento, nit_proveedor], (err, result) => {
            if(err){
                res.render("../views/error.ejs");
            } else {
                res.redirect("/proveedores");
            }
        })
    });

    
    // Visualización de Productos en Inventario
    app.get("/inventario", (req,res) => {
        connection.query("SELECT * FROM inventario", (err, result) => {
            if(err){
                res.render("../views/error.ejs");
            } else {
                res.render("../views/inventario.ejs", {
                    inventario: result
                    
                });
                console.log(result);
            }
        })
    });


    // Agregar un Nuevo Producto a Inventario
    app.post("/add", (req,res) => {
        const {codigo, producto, cantidad, precio, nit_proveedor} = req.body;
        connection.query("INSERT INTO inventario SET ?" , {
            codigo: codigo,
            producto: producto,
            cantidad: cantidad,
            precio:precio,
            nit_proveedor:nit_proveedor
        }, (err, result) => {
            if(err){
                res.render("../views/error.ejs");
            } else {
                res.redirect("/inventario")
            }
        })
    });
    // Borrar un Producto del Inventario
    app.get("/delete/:codigo", (req,res) => {
        const codigo = req.params.codigo;
        connection.query("DELETE FROM inventario WHERE codigo = ?", [codigo], (err, result) => {
            if(err){
                res.render("../views/error.ejs");
            } else {
                connection.query("SELECT * FROM inventario", (err, result) => {
                    if(err){
                        res.render("../views/error.ejs");
                    } else {
                        res.render("../views/inventario.ejs", {
                            inventario: result,
                            alert:true,
                            ruta: "inventario"
                        });
                    }
                })
            }
        })
    });

    // Editar Producto
    app.post("/edit/:codigo", (req,res) => {
        const codigo = req.params.codigo;
        const {producto, cantidad, precio, nit_proveedor} = req.body
        console.log(req.body);
        connection.query("UPDATE inventario SET producto = ?, cantidad = ?, precio = ?, nit_proveedor = ? WHERE codigo = ?", [producto, cantidad, precio, nit_proveedor, codigo], (err, result) => {
            if(err){
                res.render("../views/error.ejs");

            } else {
                res.redirect("/inventario");
            }
        })
    });
    
    // solicitud post vista register
    app.post('/register', async (req, res) => {
        const { usuario, nombre, email, telefono, contrasena } = req.body;
        console.log(req.body);
        let passwordHaash = await bcryptjs.hash(contrasena, 8);

        connection.query("INSERT INTO usuarios SET ?", {
            usuario: usuario,
            nombre: nombre,
            email: email,
            telefono: telefono,
            contrasena: passwordHaash
        }, async (error, results) => {
            if (error) {
                // res.render("../views/error.ejs");
                console.log(error);
            } else {
                res.render('../views/register.ejs', {
                    alert: true,
                    alertTitle: "Registro",
                    alertMessage: "Registro Exitoso",
                    alertIcon: "success",
                    showConfirmButton: false,
                    timer: 1500,
                    ruta: 'login'
                });
            }
        })

    });

    // solicitud post de login (autenticacion)
    app.post('/auth', async (req, res) => {
        const { usuario, contrasena } = req.body;
        let passwordHaash = await bcryptjs.hash(contrasena, 8);

        if (usuario && contrasena) {
            connection.query('SELECT * FROM usuarios WHERE usuario = ?', [usuario], async (error, results) => {
                console.log(results);
                if (results.length === 0 || !(await bcryptjs.compare(contrasena, results[0].contrasena))) {
                    res.render('../views/login.ejs', {
                        //config sweet alert error
                        alert: true,
                        alertTitle: "Error",
                        alertMessage: "Usuario y/o contraseña incorrectas",
                        alertIcon: "error",
                        showConfirmButton: true,
                        timer: 3500,
                        ruta: ''

                    })
                } else {
                    req.session.loggedin = true,
                    req.session.usuario = results[0].usuario;
                    res.render('../views/gestorapp.ejs', {
                        alert: true,
                        alertTitle: "Ingreso Exitoso",
                        alertMessage: "Ha ingresado correctamente",
                        alertIcon: "success",
                        showConfirmButton: true,
                        timer: 3500,
                        ruta: '',
                        login: true,
                        name: req.session.usuario


                    });
                    console.log(req.session.usuario);
                }
            })

        }
    });

};

