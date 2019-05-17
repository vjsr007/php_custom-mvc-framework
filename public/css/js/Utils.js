/*!
* Utils.js v1.0.0
*
* Probado con: jquery v1.11.2
* Probado con: jquery-ui.js v1.11.2
*
* Autor: Víctor J. Sánchez Rivas
* Fecha: 2015-07-24
*/
var Utils = {};

(function (self) {
    "use strict";

    self.decodeString = function (encodedString) {
        var textArea = document.createElement('textarea');
        textArea.innerHTML = encodedString;
        return textArea.value;
    }

    self.mensajeSinRegistros = $('<div style="text-align:center;height:20px;padding-top:5px">Sin registros que mostrar</div>');

    self.Bootstrap = {};

    self.viewSSRS = function (url, postData) {
        var request = $.ajax({
            type: "post",
            async: false,
            url: url,
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(postData),
            dataType: "json"
        });

        request.done(function (data) {

            var url = encodeURI(data.liga);
            var iframe = $('<div><iframe src="' + url + '" scrolling="auto" width="100%" height="100%" align ="left" frameborder="0" /></div>');

            iframe.dialog({
                autoOpen: true,
                title: "Vista Previa",
                width: 1150,
                height: 500,
                modal: true,
                resizable: false,
                buttons: {
                    "Cerrar": function () {
                        $(this).dialog('close');
                    }
                },
                open: function (event, ui) {
                    var dz = $(".ui-dialog:last").css("z-index");
                    $(".ui-widget-overlay:last").insertBefore(".ui-dialog:last");
                    $(".ui-widget-overlay:last").css({ "z-index": dz - 1 });
                }
            });
        });

        request.fail(function (jqXhr, textStatus) {
            console.log("Error en AJAX: " + jqXhr.responseText);
        });
    };

    self.hackValidation = function ($form) {
        $form.unbind();
        $form.data("validator", null);
        $.validator.unobtrusive.parse(document);
        $form.validate($form.data("unobtrusiveValidation").options);
    }

    self.dialogoError = function (errores) {

        var texto = "";

        texto = '<p><span class="ui-icon ui-icon-alert" style="float:left;margin-right:4px;"></span><strong> Se encontraron los siguientes errores:</strong></p>';
        if (errores.constructor.toString().indexOf("Array") > 0) {
            texto = texto + '<ul>';
            for (var i = 0; i < errores.length; i++) {
                texto = texto + '<li>' + errores[i] + '</li>';
            }
            texto = texto + '</ul>';
        } else {
            texto = '<ul><li>' + errores + '</li></ul>';
        }

        var $dialogo = $('<div class="ui-message-dialog-error"></div>')
            .html(texto)
            .dialog({
                autoOpen: false,
                title: 'Mensaje de error',
                width: 400,
                modal: true,
                open: function (event, ui) {
                    var dz = $(".ui-dialog:last").css("z-index");
                    $(".ui-widget-overlay:last").insertBefore(".ui-dialog:last");
                    $(".ui-widget-overlay:last").css({ "z-index": dz - 1 });
                }
            });
        $dialogo.dialog('open');
    };

    self.testLength = function (ta, maxLength) {
        if (ta.value.length > maxLength) {
            ta.value = ta.value.substring(0, maxLength);
        }
    }

    self.mostrarConfirmar = function (titulo, mensaje, observaciones, options, callBack) {
        ///<summary>Muestra dialog con opciones de Aceptar o Cancelar, al Aceptar realiza callBack y al Cancelar cierra ventana</summary> 
        /// <param name="titulo" type="String">Titulo de la ventana modal</param>
        /// <param name="mensaje" type="String">Mensaje en la ventana modal</param>
        /// <param name="observaciones" type="String">ID tag con el que se mostrara textarea en la venta modal, para captura de texto</param>
        /// <param name="options" type="Object">Mensaje en la ventana modal ej. {modal: modal, autoOpen: autoOpen, resizable: resizable, width: width, height: height}</param>
        /// <param name="callBack" type="Function">Funcion a ejecutar despues cerrar ventana modal</param>
        if (mensaje == null) mensaje = "Descripción del Mensaje";
        if (titulo == null) titulo = "Mensaje";
        if (observaciones == null) observaciones = "";
        if (options == null) options = new Object;
        if (callBack == null) callBack = function () { return false; }

        var width = options.width != null ? options.width : 380;
        var height = options.height != null ? options.height : 180;
        var autoOpen = options.autoOpen != null ? options.autoOpen : true;
        var resizable = options.resizable != null ? options.resizable : false;
        var modal = options.modal != null ? options.modal : true;
        var maxLenObs = options.maxLenObs != null ? options.maxLenObs : 100;
        var autoClose = options.autoClose != null ? options.autoClose : true;

        var txtObs = "";
        if (observaciones.length > 0) {
            txtObs = '<br><textarea onchange="Utils.testLength(this,' + maxLenObs + ')" onkeyup="Utils.testLength(this,' + maxLenObs + ')" onpaste="Utils.testLength(this,' + maxLenObs + ')" cols="' + maxLenObs + '" maxlength="' + maxLenObs + '" style="resize: none;width:99%; margin:0;" id="' + observaciones + '"></textarea>';
        }

        var dialog = $("<div><div id='lblMsgConfirmar' >" + mensaje + "</div>" + txtObs + "</div>").dialog({
            modal: true,
            autoOpen: autoOpen,
            resizable: resizable,
            width: width,
            height: height,
            title: titulo,
            open: function (event, ui) {
                var dz = $(".ui-dialog:last").css("z-index");
                $(".ui-widget-overlay:last").insertBefore(".ui-dialog:last");
                $(".ui-widget-overlay:last").css({ "z-index": dz - 1 });
            },
            close: function (event, ui) {
                $(this).remove();
            },
            buttons: {
                Cancelar: function () {
                    $(this).dialog("close");
                },
                Aceptar: function () {
                    callBack(dialog);
                    if (autoClose) $(this).dialog("close");
                }
            }
        });

        return dialog;
    }

    self.mostrarMensaje = function (titulo, mensaje, options, callBack) {
        ///<summary>Muestra dialog con mensaje</summary> 
        /// <param name="titulo" type="String">Titulo de la ventana modal</param>
        /// <param name="mensaje" type="String">Mensaje en la ventana modal</param>
        /// <param name="options" type="Object">Mensaje en la ventana modal ej. {modal: modal, autoOpen: autoOpen, resizable: resizable, width: width, height: height}</param>
        /// <param name="callBack" type="Function">Funcion a ejecutar despues cerrar ventana modal</param>
        if (mensaje == null) mensaje = "";
        if (titulo == null) titulo = "Sistema UDIS";

        if (options == null) options = new Object;
        if (callBack == null) callBack = function () { return false; }

        var width = options.width != null ? options.width : '250px';
        var height = options.height != null ? options.height : 'auto';
        var autoOpen = options.autoOpen != null ? options.autoOpen : true;
        var resizable = options.resizable != null ? options.resizable : true;
        var modal = options.modal != null ? options.modal : true;

        var dialog = $("<div><div style='min-width: 250px;' id='lblMensaje' ></div></div>").dialog({
            modal: modal,
            autoOpen: autoOpen,
            resizable: resizable,
            width: width,
            height: height,
            minHeight: '180',
            minWidth: '380',
            maxHeight: '90%',
            maxWidth: '90%',
            title: titulo,
            close: function (event, ui) {
                $(this).dialog("close");
                if (callBack != null) callBack(dialog);
                $(this).remove();
            },
            buttons: {
                Cerrar: function () {
                    $(this).dialog("close");
                }
            }
        });

        $("#lblMensaje").html(mensaje);

        return dialog;
    }

    self.mostrarModal = function (titulo, url, data, options, callBack) {
        //<summary>Carga una ventana modal con el Html Content recibido</summary>
        /// <param name="titulo" type="String">Titulo de la ventana modal</param>
        /// <param name="url" type="String">URL de Vista parcial</param>
        /// <param name="data" type="String">parametros de la vista parcial</param>
        /// <param name="options" type="Object">Mensaje en la ventana modal ej. {modal: modal, autoOpen: autoOpen, resizable: resizable, width: width, height: height}</param>
        /// <param name="callBack" type="Function">Funcion a ejecutar despues cerrar ventana modal</param>
        if (titulo == null) titulo = "Intranet";

        if (options == null) options = new Object;
        if (options.buttons == null) options.buttons =
        {
            Cerrar: function () {
                $(this).dialog("close");
                $(this).hide();
            }
        };

        var width = options.width != null ? options.width : 'auto';
        var height = options.height != null ? options.height : 'auto';
        var autoOpen = options.autoOpen != null ? options.autoOpen : true;
        var resizable = options.resizable != null ? options.resizable : true;
        var modal = options.modal != null ? options.modal : true;
        var minHeight = options.minHeight != null ? options.minHeight : '180';//: '180',
        var minWidth = options.minWidth != null ? options.minWidth : '380';//: '380',
        var maxHeight = options.maxHeight != null ? options.maxHeight : '90%';//: '90%',
        var maxWidth = options.maxWidth != null ? options.maxWidth : '90%';//: '90%',
        var autoClose = options.autoClose != null ? options.autoClose : false;

        var beforeClose;
        if (options.beforeClose == null) {
            beforeClose =
            function (event, ui) {

            };
        }
        else {
            beforeClose = options.beforeClose;
        }

        var $htmlDialog = $("<div></div>");
        $htmlDialog.load(url, data, function (response, status, xhr) {
            var dialog = $htmlDialog.dialog({
                modal: modal,
                autoOpen: autoOpen,
                resizable: resizable,
                width: width,
                height: height,
                minHeight: minHeight,
                minWidth: minWidth,
                maxHeight: maxHeight,
                show: { effect: "slideDown", duration: 500 },
                hide: { effect: "slideUp", duration: 500 },
                maxWidth: maxWidth,
                title: titulo,
                open: function (event, ui) {
                    $(this).css('overflow', 'hidden');
                },
                close: function (event, ui) {
                    dialog.remove();
                },
                beforeClose: beforeClose,
                buttons: options.buttons,
                position:
                {
                    my: "center",
                    at: "center",
                    of: document
                }
            });

            if (callBack != null) {
                callBack(dialog);
                if (autoClose) dialog.dialog("close");
            }

            return dialog;
        });
    };

    self.mostrarVentana = function (titulo, mensaje, Observaciones, options, callBack, buttons) {
        if (mensaje == null) mensaje = "Descripción del Mensaje";
        if (titulo == null) titulo = "Mensaje";
        if (Observaciones == null) Observaciones = "";
        if (options == null) options = new Object;
        if (callBack == null) callBack = function () { return false; }

        var width = options.width != null ? options.width : 380;
        var height = options.height != null ? options.height : 180;
        var autoOpen = options.autoOpen != null ? options.autoOpen : true;
        var resizable = options.resizable != null ? options.resizable : false;
        var modal = options.modal != null ? options.modal : true;
        var maxLenObs = options.maxLenObs != null ? options.maxLenObs : 10;

        var txtObs = "";
        if (Observaciones.length > 0) {
            txtObs = '<br><textarea onchange="testLength(this,' + maxLenObs + ')" onkeyup="testLength(this,' + maxLenObs + ')" onpaste="testLength(this,' + maxLenObs + ')" cols="' + maxLenObs + '" maxlength="' + maxLenObs + '" style="resize: none;width:99%; margin:0;" id="' + Observaciones + '"></textarea>';
        }

        var dialog = $("<div><div id='lblMsgConfirmar' >" + mensaje + "</div>" + txtObs + "</div>").dialog({
            id: 'VentanaEmergente',
            modal: true,
            autoOpen: autoOpen,
            resizable: resizable,
            width: width,
            height: height,
            title: titulo,
            close: function (event, ui) {
                $(this).remove();
            },
            open: function (event, ui) {
                var dz = $(".ui-dialog:last").css("z-index");
                $(".ui-widget-overlay:last").insertBefore(".ui-dialog:last");
                $(".ui-widget-overlay:last").css({ "z-index": dz - 1 });

                callBack();
            },
            buttons: buttons
        });

        return dialog;
    };

    self.dialogoMensaje = function (mensaje) {

        var $dialogo = $('<div></div>')
            .html(mensaje)
            .dialog({
                autoOpen: false,
                title: 'Mensaje',
                modal: true,
                open: function (event, ui) {
                    var dz = $(".ui-dialog:last").css("z-index");
                    $(".ui-widget-overlay:last").insertBefore(".ui-dialog:last");
                    $(".ui-widget-overlay:last").css({ "z-index": dz - 1 });
                }
            });
        $dialogo.dialog('open');
    };

    self.Bootstrap.mostrarModal = function (idParent, idModal, url, data, options, callBack) {
        //<summary>Carga una ventana modal de Boostrap con el Html Content recibido</summary>
        var $htmlDialog = $(idParent);
        $htmlDialog.load(url, data, function () {
            var modal = $(idModal).modal('show');

            if (callBack != null) {
                callBack();
            }
        });
    };

    self.ejecutarAjax = function (post, url, method, callBack) {
        /// <summary>Ejecuta AJAX y espera resultado en JSON desde la URL definida, y realiza el callBack al terminar.</summary>
        /// <param name="post" type="Object">Filtros del post j. {f: {nombre: "x", pass: "y"}}</param>
        /// <param name="url" type="String">URL a ejecutar</param>
        /// <param name="callBack" type="Function">Funcion a ejecutar despues de terminar AJAX</param>
        /// <returns type="void"></returns>
        if (method == null) method = "post";
        try {
            var request = $.ajax({
                url: url,
                dataType: "json",
                data: JSON.stringify(post),
                contentType: "application/json",
                async: true,
                type: method
            });

            request.done(function (data) {
                if (callBack != null) callBack(data);
            });

            request.fail(function (jqXhr, textStatus) {
                self.mostrarMensaje("Error request: " + url, textStatus);
            });
        } catch (e) {
            self.mostrarMensaje("Error de sintaxis", e.message);
        }
    };

    self.url2json = function (url, complete) {
        /// <summary>Convierte una URL string a JSON.</summary>
        /// <param name="url" type="String">URL a serializar</param>
        /// <param name="complete" type="bool">URL completa o solo datos</param>
        /// <returns type="Object"></returns>
        var obj = {};

        function arr_vals(arr) {
            if (arr.indexOf(',') > 1) {
                var vals = arr.slice(1, -1).split(',');
                var arr = [];
                for (var i = 0; i < vals.length; i++)
                    arr[i] = vals[i];
                return arr;
            }
            else
                return arr.slice(1, -1);
        }

        function eval_var(avar) {
            if (avar[1].indexOf('[') == 0)
                obj[avar[0]] = arr_vals(avar[1]);
            else
                obj[avar[0]] = avar[1];
        }

        if (url.indexOf('?') > -1 || !complete) {
            if (complete) {
                var params = url.split('?')[1];
            }
            else {
                var params = url;
            }
            if (params.indexOf('&') > 2) {
                var vars = params.split('&');
                for (var i in vars)
                    eval_var(vars[i].split('='));
            }
            else
                eval_var(params.split('='));
        }

        return obj;
    }

    self.CreateTable = function (data, id) {
        /// <summary>Crea table a partir de array object.</summary>
        /// <param name="data" type="Object">Array object a dibujar</param>
        /// <param name="id" type="string">ID tag de la tabla</param>
        /// <returns type="JQuery("table")"></returns>
        var cols = self.GetHeaders(data[0]);

        var table = $('<table style="width:100%" id="' + id + '"></table>');
        var th = $('<tr></tr>');
        for (var i = 0; i < cols.length; i++) {
            th.append('<th>' + cols[i] + '</th>');
        }
        table.append(th);

        for (var j = 0; j < data.length; j++) {
            var obj = data[j];
            var tr = $('<tr></tr>');
            for (var k = 0; k < cols.length; k++) {
                var columnName = cols[k];
                tr.append('<td>' + obj[columnName] + '</td>');
            }
            table.append(tr);
        }
        return table;
    }

    self.GetHeaders = function (obj) {
        /// <summary>Obtiene los nombres de las propiedades de un Objeto.</summary>
        /// <param name="obj" type="Object">Objeto</param>
        /// <returns type="Object"></returns>
        var cols = new Array();
        var p = obj;
        for (var key in p) {
            cols.push(key);
        }
        return cols;
    }

    self.CrearLista = function (array, id) {
        var cList = $('<ul></ul>').attr("id", id);

        $.each(array, function (idx, d) {

            var li = $('<li/>')
                .addClass('ui-menu-item')
                .attr('role', 'menuitem')
                .html(d)
                .appendTo(cList);

        });

        return cList;
    }

    self.download = function (url, data, method, callBack) {
        /// <summary>Descarga un archivo de una URL.</summary>
        /// <param name="url" type="String">URL de la descarga</param>
        /// <param name="data" type="Object">Filtros a enviar</param>
        /// <param name="method" type="String">Metodo POST GET</param>
        /// <param name="callBack" type="Function">Callback que se lanza en evento load de iframe</param>
        /// <returns type="File"></returns>
        var inputs = "";
        var downloadInterval;
        var sUsrAg = navigator.userAgent;
        var callBack = typeof callBack === 'function' ? callBack : (function () { });

        if (url && data) {

            //split params into form inputs
            $.each(data, function (p, val) {
                inputs += "<input type='hidden' name='" + p + "' value='" + val + "' />";
            });

            //create form to send request
            $('<form enctype="multipart/form-data" action="' + url + '" method="' + (method || 'post') + '" target="_blank" >' + inputs + '</form>')
                .appendTo('body')
                .submit()
                .remove();
        }
    };

    self.dateFormat = function () {
        var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
            timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
            timezoneClip = /[^-+\dA-Z]/g,
            pad = function (val, len) {
                val = String(val);
                len = len || 2;
                while (val.length < len) val = "0" + val;
                return val;
            };

        return function (date, mask, utc) {
            var dF = self.dateFormat;

            if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
                mask = date;
                date = undefined;
            }


            date = date ? new Date(date) : new Date;
            try {
                if (isNaN(date)) throw SyntaxError("invalid date");
            }
            catch (e) {

            }

            mask = String(dF.masks[mask] || mask || dF.masks["default"]);

            if (mask.slice(0, 4) == "UTC:") {
                mask = mask.slice(4);
                utc = true;
            }

            var _ = utc ? "getUTC" : "get",
                d = date[_ + "Date"](),
                D = date[_ + "Day"](),
                m = date[_ + "Month"](),
                y = date[_ + "FullYear"](),
                H = date[_ + "Hours"](),
                M = date[_ + "Minutes"](),
                s = date[_ + "Seconds"](),
                L = date[_ + "Milliseconds"](),
                o = utc ? 0 : date.getTimezoneOffset(),
                flags = {
                    d: d,
                    dd: pad(d),
                    ddd: dF.i18n.dayNames[D],
                    dddd: dF.i18n.dayNames[D + 7],
                    m: m + 1,
                    mm: pad(m + 1),
                    mmm: dF.i18n.monthNames[m],
                    mmmm: dF.i18n.monthNames[m + 12],
                    yy: String(y).slice(2),
                    yyyy: y,
                    h: H % 12 || 12,
                    hh: pad(H % 12 || 12),
                    H: H,
                    HH: pad(H),
                    M: M,
                    MM: pad(M),
                    s: s,
                    ss: pad(s),
                    l: pad(L, 3),
                    L: pad(L > 99 ? Math.round(L / 10) : L),
                    t: H < 12 ? "a" : "p",
                    tt: H < 12 ? "am" : "pm",
                    T: H < 12 ? "A" : "P",
                    TT: H < 12 ? "AM" : "PM",
                    Z: utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
                    o: (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                    S: ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
                };

            return mask.replace(token, function ($0) {
                return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
            });
        };
    }();

    self.dateFormat.masks = {
        "default": "ddd mmm dd yyyy HH:MM:ss",
        shortDate: "m/d/yy",
        mediumDate: "mmm d, yyyy",
        longDate: "mmmm d, yyyy",
        fullDate: "dddd, mmmm d, yyyy",
        shortTime: "h:MM TT",
        mediumTime: "h:MM:ss TT",
        longTime: "h:MM:ss TT Z",
        isoDate: "yyyy-mm-dd",
        isoTime: "HH:MM:ss",
        isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
        isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
    };

    self.dateFormat.i18n = {
        dayNames: [
            "Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab",
            "Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"
        ],
        monthNames: [
            "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
            "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ]
    };

    self.formateaFechaJSON = function (Fecha, Formato) {
        /// <summary>Formatea fecha JSON.</summary>
        /// <param name="Fecha" type="Date JSON">Fecha JSON a formatear</param>
        /// <param name="Formato" type="String">Formato ej. dd/mm/yyyy</param>
        if (Fecha == null) return "";
        if (Fecha == "") return "";

        var date = new Date(parseInt((Fecha.toString()).replace("/Date(", "").replace(")/", ""), 10));        

        return self.dateFormat(date, Formato);
    }

    self.fillSelect = function ($select, collection, id, name, emptyOption) {
        /// <summary>Llena select a partir de una colección.</summary>
        /// <param name="$select" type="JQuery select">html select a llenar.</param>
        /// <param name="collection" type="Object">Colección para llenar html select</param>
        /// <param name="id" type="Property">Propiedad para atributo value de option</param>
        /// <param name="name" type="Property">Propiedad para html de option</param>
        /// <param name="emptyOption" type="String">Texto de option vacio</param>
        try {
            var sHtml = '';
            var ID = '';
            if (emptyOption) sHtml = '<option value="">' + emptyOption.toString() + '</option>';
            $.each(collection, function (i, obj) {
                sHtml += '<option value="' + $.trim(obj[id]) + '">' + obj[name] + '</option>';
            });
            $select.html(sHtml);
        }
        catch (e) {
            alert("Error fillSelect: " + e.message)
        }
    };

    self.cascadingSelect = function ($parent, $child, collection, id, name, idParent, emptyOption) {
        /// <summary>Crea selects en cascada.</summary>
        /// <param name="$parent" type="JQuery select">html select padre.</param>
        /// <param name="$child" type="JQuery select">html select hijo.</param>
        /// <param name="collection" type="Object">Colección para llenar html select</param>
        /// <param name="id" type="Property">Propiedad para atributo value de option</param>
        /// <param name="name" type="Property">Propiedad para html de option</param>
        /// <param name="idParent" type="Property">Propiedad relación padre-hijo</param>
        /// <param name="emptyOption" type="String">Texto de option vacio</param>
        try {
            $parent.change(function () {
                var sHtml = '';
                if (emptyOption) sHtml = '<option value="">' + emptyOption + '</option>';
                var parent = $(this).val();
                if ($(this).val() != "") {
                    $.each(collectionParent, function (i, obj) {
                        if (parent == obj[idParent].toString())
                            sHtml += '<option value="' + $.trim(obj[id]) + '">' + obj[name] + '</option>';
                    });
                }
                $child.html(sHtml);
                $child.change();
            });
        }
        catch (e) {
            alert("Error cascadingSelect: " + e.message)
        }
    };

    self.isDate = function (txtDate) {
        /// <summary>Valida si un texto es fecha.</summary>
        /// <param name="txtDate" type="String">Fecha en texto.</param>
        if (txtDate==null)
            return false;

        var currVal = txtDate;
        if (currVal == '')
            return false;


        var rxDatePattern = /^(\d{1,2})(\/|-)(\d{1,2})(\/|-)(\d{4})$/;
        var dtArray = currVal.match(rxDatePattern); // is format OK?

        if (dtArray == null)
            return false;

        //mm/dd/yyyy
        dtDay = dtArray[1];
        dtMonth = dtArray[3];
        dtYear = dtArray[5];

        if (dtMonth < 1 || dtMonth > 12)
            return false;
        else if (dtDay < 1 || dtDay > 31)
            return false;
        else if ((dtMonth == 4 || dtMonth == 6 || dtMonth == 9 || dtMonth == 11) && dtDay == 31)
            return false;
        else if (dtMonth == 2) {
            var isleap = (dtYear % 4 == 0 && (dtYear % 100 != 0 || dtYear % 400 == 0));
            if (dtDay > 29 || (dtDay == 29 && !isleap))
                return false;
        }
        return true;
    }

    self.centerDialogGrid = function (grid) {
        /// <summary>Centrar Dialog de JQGrid.</summary>
        /// <param name="grid" type="JQGrid">JQGrid.</param>
        var dlgDiv = $("#editmod" + grid[0].id);
        var parentDiv = dlgDiv.parent(); // div#gbox_list
        var dlgWidth = dlgDiv.width();
        var parentWidth = parentDiv.width();
        var dlgHeight = dlgDiv.height();
        var parentHeight = parentDiv.height();
        // TODO: change parentWidth and parentHeight in case of the grid
        //       is larger as the browser window
        //dlgDiv[0].style.top = Math.round((parentHeight - dlgHeight) / 2) + "px";
        dlgDiv[0].style.left = Math.round((parentWidth - dlgWidth) / 1.2) + "px";
    }

    self.validMoney = function (e, Text) {
        /// <summary>Validar formato de moneda de un texto.</summary>
        /// <param name="e" type="Object">Event</param>
        /// <param name="Text" type="Text">Texto a validar</param>
        /// <returns type="bool"></returns>
        if (((e.which == 46) || (e.which >= 48 && e.which <= 57) || (e.which == 8) || (e.which == 45))) {
            var splitText = Text.val().split(".");
            if (e.which == 46) {
                if (splitText.length > 1) {
                    return false;
                }
            }
            if (e.which == 45) {
                splitText = Text.val().split("-");
                if (Text.val().length > 0) {
                    return false;
                }
                if (splitText.length > 1) {
                    return false;
                }
            }
        }
        else {
            return false;
        }
    }

    self.validInt = function (e, Text) {
        /// <summary>Validar tipo entero de un texto.</summary>
        /// <param name="e" type="Object">Event</param>
        /// <param name="Text" type="Text">Texto a validar</param>
        /// <returns type="bool"></returns>
        if ((e.which >= 48 && e.which <= 57) || (e.which == 8)) {
            return true;
        }
        else {
            return false;
        }
    }

    self.cargarSSRS = function (Url, Params) {
        /// <summary>Validar tipo entero de un texto.</summary>
        /// <param name="Url" type="String">URL del Reporting Service</param>
        /// <param name="Params" type="Params">Paranetros del Reporting</param>
        $('body').append('<form style="display:none;" id="frmSRRSS"></form>');
        var $form = $("#frmSRRSS");

        $form.append('<div id="dialogSRRS" style="width: 1150px; height:500px;" ><iframe id="iSRSS" name="iSRSS" scrolling="auto" frameborder="0" width="100%" height="100%""/></div>');
        var $iframe = $("#iSRSS");
        var $dialog = $("#frmVista");

        $("#dialogSRRS").dialog({
            autoOpen: false,
            title: "Vista Previa",
            width: 1150,
            height: 500,
            modal: true,
            resizable: false,
            close: function (event, ui) {
                $(this).dialog('close');
                $("#frmSRRSS").remove();
            },
            buttons: {
                "Cerrar": function () {
                    $(this).dialog('close');
                }
            },
            open: function (event, ui) {
                var dz = $(".ui-dialog:last").css("z-index");
                $(".ui-widget-overlay:last").insertBefore(".ui-dialog:last");
                $(".ui-widget-overlay:last").css({ "z-index": dz - 1 });
            }
        });

        $iframe.load(function () {
            $.unblockUI();
            try { $("#dialogSRRS").dialog('open') } catch (e) { };
        });

        $form.attr("target", "iSRSS");
        $form.attr("action", Url);
        $form.attr("method", "post");

        $form.append('<input name="rs:ParameterLanguage" value="" />');
        $form.append('<input name="rc:Parameters" value="False" />');
        $form.append('<input name="rs:ClearSession" value="true" />');

        var listParams = self.GetHeaders(Params);

        $.each(listParams, function (idx, p) {
            $form.append('<input name="' + p + '" id="' + p + '" />');
            $('#' + p).val(Params[p]);
        });

        $form.append("method", "post");


        $form.submit();
    }

    self.exportarSSRS = function (Url, Params) {
        /// <summary>Validar tipo entero de un texto.</summary>
        /// <param name="Url" type="String">URL del Reporting Service</param>
        /// <param name="Params" type="Params">Paranetros del Reporting</param>
        $.ajax({
            url: Url,
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify(Params),
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
                if (result != null) {
                    var urlreporte = result.liga;
                    window.open(urlreporte);
                }
            }
        });
    }

    self.exportarGrid = function (vURLActionExportar, grid) {
        var postData = grid.jqGrid('getGridParam', 'postData');

        try {
            var request = $.ajax({
                type: "post",
                async: false,
                url: vURLActionExportar + '?CompaniaID=' + $("#cmbCompanias").val(),
                beforeSend: function () {
                    /*showPageLoadingMsg();*/
                },
                complete: function () {
                    /*hidePageLoadingMsg()*/
                },
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(postData),
                dataType: "json"
            });

            request.done(function (data) {

                var url = encodeURI(data.liga);
                var iframe = $('<div><iframe src="' + url + '" scrolling="auto" width="100%" height="100%" align ="left" frameborder="0" /></div>');

                iframe.dialog({
                    autoOpen: true,
                    title: "Vista Previa",
                    width: 1150,
                    height: 500,
                    modal: true,
                    resizable: false,
                    buttons: {
                        "Cerrar": function () {
                            $(this).dialog('close');
                        }
                    },
                    open: function (event, ui) {
                        var dz = $(".ui-dialog:last").css("z-index");
                        $(".ui-widget-overlay:last").insertBefore(".ui-dialog:last");
                        $(".ui-widget-overlay:last").css({ "z-index": dz - 1 });
                    }
                });
            });

            request.fail(function (jqXhr, textStatus) {
                console.log("Error en AJAX: " + jqXhr.responseText);
            });
        } catch (e) {
            console.log("Error en TRY: " + e.message);
        }
    };

    self.keydownHandler = function (e) {

        var key = e.which || e.keyCode;

        if (!e.shiftKey && !e.altKey && !e.ctrlKey &&
            // numbers   
            key >= 48 && key <= 57 ||
            // Numeric keypad
            key >= 96 && key <= 105 ||
            // Backspace and Tab and Enter
            key == 8 || key == 9 || key == 13 ||
            // Home and End
            key == 35 || key == 36 ||
            // left and right arrows
            key == 37 || key == 39 ||
            // Del and Ins
            key == 46 || key == 45)
            return true;

        return false;
    }

    self.parseXml = function (xml) {
        var dom = null;
        if (window.DOMParser) {
            try {
                dom = (new DOMParser()).parseFromString(xml, "text/xml");
            }
            catch (e) { dom = null; }
        }
        else if (window.ActiveXObject) {
            try {
                dom = new ActiveXObject('Microsoft.XMLDOM');
                dom.async = false;
                if (!dom.loadXML(xml)) // parse error ..

                    window.alert(dom.parseError.reason + dom.parseError.srcText);
            }
            catch (e) { dom = null; }
        }
        else
            alert("cannot parse xml string!");
        return dom;
    }

    self.xml2json = function (xml, tab) {
        var X = {
            toObj: function (xml) {
                var o = {};
                if (xml.nodeType == 1) {   // element node ..
                    if (xml.attributes.length)   // element with attributes  ..
                        for (var i = 0; i < xml.attributes.length; i++)
                            o["@" + xml.attributes[i].nodeName] = (xml.attributes[i].nodeValue || "").toString();
                    if (xml.firstChild) { // element has child nodes ..
                        var textChild = 0, cdataChild = 0, hasElementChild = false;
                        for (var n = xml.firstChild; n; n = n.nextSibling) {
                            if (n.nodeType == 1) hasElementChild = true;
                            else if (n.nodeType == 3 && n.nodeValue.match(/[^ \f\n\r\t\v]/)) textChild++; // non-whitespace text
                            else if (n.nodeType == 4) cdataChild++; // cdata section node
                        }
                        if (hasElementChild) {
                            if (textChild < 2 && cdataChild < 2) { // structured element with evtl. a single text or/and cdata node ..
                                X.removeWhite(xml);
                                for (var n = xml.firstChild; n; n = n.nextSibling) {
                                    if (n.nodeType == 3)  // text node
                                        o["#text"] = X.escape(n.nodeValue);
                                    else if (n.nodeType == 4)  // cdata node
                                        o["#cdata"] = X.escape(n.nodeValue);
                                    else if (o[n.nodeName]) {  // multiple occurence of element ..
                                        if (o[n.nodeName] instanceof Array)
                                            o[n.nodeName][o[n.nodeName].length] = X.toObj(n);
                                        else
                                            o[n.nodeName] = [o[n.nodeName], X.toObj(n)];
                                    }
                                    else  // first occurence of element..
                                        o[n.nodeName] = X.toObj(n);
                                }
                            }
                            else { // mixed content
                                if (!xml.attributes.length)
                                    o = X.escape(X.innerXml(xml));
                                else
                                    o["#text"] = X.escape(X.innerXml(xml));
                            }
                        }
                        else if (textChild) { // pure text
                            if (!xml.attributes.length)
                                o = X.escape(X.innerXml(xml));
                            else
                                o["#text"] = X.escape(X.innerXml(xml));
                        }
                        else if (cdataChild) { // cdata
                            if (cdataChild > 1)
                                o = X.escape(X.innerXml(xml));
                            else
                                for (var n = xml.firstChild; n; n = n.nextSibling)
                                    o["#cdata"] = X.escape(n.nodeValue);
                        }
                    }
                    if (!xml.attributes.length && !xml.firstChild) o = null;
                }
                else if (xml.nodeType == 9) { // document.node
                    o = X.toObj(xml.documentElement);
                }
                else
                    alert("unhandled node type: " + xml.nodeType);
                return o;
            },
            toJson: function (o, name, ind) {
                var json = name ? ("\"" + name + "\"") : "";
                if (o instanceof Array) {
                    for (var i = 0, n = o.length; i < n; i++)
                        o[i] = X.toJson(o[i], "", ind + "\t");
                    json += (name ? ":[" : "[") + (o.length > 1 ? ("\n" + ind + "\t" + o.join(",\n" + ind + "\t") + "\n" + ind) : o.join("")) + "]";
                }
                else if (o == null)
                    json += (name && ":") + "null";
                else if (typeof (o) == "object") {
                    var arr = [];
                    for (var m in o)
                        arr[arr.length] = X.toJson(o[m], m, ind + "\t");
                    json += (name ? ":{" : "{") + (arr.length > 1 ? ("\n" + ind + "\t" + arr.join(",\n" + ind + "\t") + "\n" + ind) : arr.join("")) + "}";
                }
                else if (typeof (o) == "string")
                    json += (name && ":") + "\"" + o.toString() + "\"";
                else
                    json += (name && ":") + o.toString();
                return json;
            },
            innerXml: function (node) {
                var s = ""
                if ("innerHTML" in node)
                    s = node.innerHTML;
                else {
                    var asXml = function (n) {
                        var s = "";
                        if (n.nodeType == 1) {
                            s += "<" + n.nodeName;
                            for (var i = 0; i < n.attributes.length; i++)
                                s += " " + n.attributes[i].nodeName + "=\"" + (n.attributes[i].nodeValue || "").toString() + "\"";
                            if (n.firstChild) {
                                s += ">";
                                for (var c = n.firstChild; c; c = c.nextSibling)
                                    s += asXml(c);
                                s += "</" + n.nodeName + ">";
                            }
                            else
                                s += "/>";
                        }
                        else if (n.nodeType == 3)
                            s += n.nodeValue;
                        else if (n.nodeType == 4)
                            s += "<![CDATA[" + n.nodeValue + "]]>";
                        return s;
                    };
                    for (var c = node.firstChild; c; c = c.nextSibling)
                        s += asXml(c);
                }
                return s;
            },
            escape: function (txt) {
                return txt.replace(/[\\]/g, "\\\\")
                          .replace(/[\"]/g, '\\"')
                          .replace(/[\n]/g, '\\n')
                          .replace(/[\r]/g, '\\r');
            },
            removeWhite: function (e) {
                e.normalize();
                for (var n = e.firstChild; n;) {
                    if (n.nodeType == 3) {  // text node
                        if (!n.nodeValue.match(/[^ \f\n\r\t\v]/)) { // pure whitespace text node
                            var nxt = n.nextSibling;
                            e.removeChild(n);
                            n = nxt;
                        }
                        else
                            n = n.nextSibling;
                    }
                    else if (n.nodeType == 1) {  // element node
                        X.removeWhite(n);
                        n = n.nextSibling;
                    }
                    else                      // any other node
                        n = n.nextSibling;
                }
                return e;
            }
        };
        if (xml) {
            if (xml.nodeType == 9) // document node
                xml = xml.documentElement;
            var json = X.toJson(X.toObj(X.removeWhite(xml)), xml.nodeName, "\t");
            return "{\n" + tab + (tab ? json.replace(/\t/g, tab) : json.replace(/\t|\n/g, "")) + "\n}";
        }
        else {
            return {};
        }
    }

    self.fileUpload = function ($form, url, params, callBack) {
        $.blockUI();

        $form.append("<iframe id='iUpload' name='iUpload' style='positio:absolute; top:0; left:0;width: 0; height: 0; border: none;'></iframe>");
        var $iframe = $form.find("#iUpload");

        $iframe.load(function () {
            var data = $(this).contents().find("body").html();

            if (callBack) callBack(data);

            setTimeout(
                function () {
                    $.unblockUI();
                    $iframe.remove();
                    for (var key in params) {
                        $form.find("#" + key).remove();
                    }
                },
                500
            );
        });

        for (var key in params) {
            $form.append("<input type='hidden' name='" + key + "' id='" + key + "' value='" + params[key] + "'>");
        }

        $form.attr("target", "iUpload");
        $form.attr("action", url);
        $form.attr("method", "post");
        $form.attr("enctype", "multipart/form-data");
        $form.attr("encoding", "multipart/form-data");

        $form.submit();

        $form.find("input[type='file']").each(function () {
            var upload = $(this);
            upload.replaceWith(upload = upload.clone(true));
        });
    }
    
    self.validarCamposVacios = function ($content, Class) {
        var camposVacios = 0;

        $content.find(".error").remove();
        $content.find(".vacio").removeClass("vacio");

        var content;
        if (Class == null || Class == "") {
            content = $content.find("select,input");
        }
        else {
            content = $content.find(Class);
        }

        content.each(function () {
            var me = $(this);
            if (!me.is(":disabled")) {
                if ($.trim(me.val()) == "") {
                    var next;
                    var p = me.position();

                    camposVacios++;
                    me.addClass("vacio");
                    me.after("<div class='error'>*<div>");
                    next = me.next('.error');
                    next.css('top', p.top);
                    next.css('left', p.left + me.width() + next.width() + 4);
                }
                else {
                    me.removeClass("vacio");
                    me.next().remove(".error");
                }
            }
        });

        return camposVacios;
    }

    self.getParameter = function (name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    /*================================================================
                            PROTOTIPOS
    ==================================================================*/

    Number.prototype.formatMoney = function (c, d, t) {
        /// <summary>Aplica formatode moneda a un numero.</summary>
        /// <param name="c" type="Number">Numero a formatear</param>
        /// <param name="d" type="String">Caracter decimal</param>
        /// <param name="t" type="String">Caracter de miles</param>
        var n = this,
            c = isNaN(c = Math.abs(c)) ? 2 : c,
            d = d == undefined ? "." : d,
            t = t == undefined ? "," : t,
            s = n < 0 ? "-" : "",
            i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
            j = (j = i.length) > 3 ? j % 3 : 0;
        return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
    };


    Date.prototype.format = function (mask, utc) {
        /// <summary>Formatea variable Date.</summary>
        /// <param name="mask" type="String">mask o formato</param>
        /// <param name="utc" type="String">aplicar UTC date</param>
        return self.dateFormat(this, mask, utc);
    };

    Number.prototype.round = function (decimales) {/// <summary>Redondea el numero a la cantidad de decimales especificados</summary>
        places = Math.pow(10, places);
        return Math.round(this * decimales) / decimales;
    };

    String.prototype.removeAll = function (text) {/// <summary>Elimina todas las apariciones y devuelve el texto generado</summary>
        return this.split(text).join("");
    }

    String.prototype.replaceAll = function (value, replacement) {/// <summary>Reemplaza todas las apariciones y devuelve el texto generado</summary>
        return this.split(value).join(replacement);
    }

    Date.prototype.toIsoDate = function () {/// <summary>Convierte a texto con el formato ISO yyyy-MM-dd donde yyyy es el año, MM es el nómero del mes y dd es el dia del mes</summary>
        return this.toISOString().substring(0, 10);
    };

    String.prototype.coalesce = function () {/// <summary>Si el valor actual es nulo, vacío o solo consiste por espacios en blanco, devuelve algun parámetro en orden que no sea nulo, vacío ni que consista solo por espacios en blanco</summary>

        if (EsNuloVacioEspaciosBlanco(this)) {
            for (var i = 0, max = arguments.length; i < max; i++) {
                if (!EsNuloVacioEspaciosBlanco(arguments[i])) {
                    return arguments[i];
                }
            }
        }
        return this;

        function EsNuloVacioEspaciosBlanco(texto) {
            return texto == null || texto.trim && texto.trim() == "" || texto.toString().trim() == "";
        }
    };

    String.prototype.format = function (args) {
        var params = args == null ? arguments : args;
        var argsFormat = new Array;

        switch (typeof params) {
            case 'object':
                argsFormat = $.map(params, function (value, index) {
                    return [value];
                });

                break;
            default:
                argsFormat = arguments;
        }

        function replace(match, number) {
            return typeof argsFormat[number] != 'undefined' ? argsFormat[number] : match;
        }
        return this.replace(/{(\d+)}/g, replace);
    };

    Array.prototype.remove = Array.prototype.remove || function (args) {
        /// <summary>Eliminar elementos de un arreglo.</summary>
        /// <param name="args" type="Array/Index">Arreglo de indices [0,1,7] o Indice especifico</param>
        var array = this;
        if(args instanceof Array){

            var i = 0;
            $.each(args, function (index, value) {
                value = i + value;
                array.splice(value, 1);
                i--;
            });
        }
        else{
            array.splice(args, 1);
        }

        return this;
    };

    Array.prototype.removeEqualTo = Array.prototype.removeEqualTo || function (valRemove, property) {
        /// <summary>Eliminar elementos de un arreglo cuando los elementos son iguales al valor parametrizado.</summary>
        /// <param name="args" type="String">Valor a quitar del array</param>
        /// <param name="property" type="String">Opcional - Propiedad del objeto a comparar</param>
        var i = 0;
        var decremento = 0;

        var array = this;
        $.each(array, function (index) {
            i = decremento + index;

            if ((typeof array[i]) == 'object') {
                if (array[i][property] == valRemove) {
                    array.splice(i, 1);
                    decremento--;
                }
            }
            else {
                if (array[i] == valRemove) {
                    array.splice(i, 1);
                    decremento--;
                }
            }
        });

        return this;
    };

    /*================================================================
                            PLUGIN JQUERY
    ==================================================================*/

    jQuery.fn.forceInteger = function () {
        $(this).keydown(function (e) {
            var key = e.which || e.keyCode;
            if (!e.shiftKey && !e.altKey && !e.ctrlKey &&
                // numbers   
                key >= 48 && key <= 57 ||
                // Numeric keypad
                key >= 96 && key <= 105 ||
                // Backspace and Tab and Enter
                key == 8 || key == 9 || key == 13 ||
                // Home and End
                key == 35 || key == 36 ||
                // left and right arrows
                key == 37 || key == 39 ||
                // Del and Ins
                key == 46 || key == 45)
                return true;

            return false;
        });
        //});
    }

    jQuery.fn.styleTable = function (options) {
        //<summary> Aplica estilos a tabla dinamica</summary>
        var defaults = {
            css: 'styleTable'
        };
        if (options = null) options = {};
        options = $.extend(defaults, options);

        return this.each(function () {

            var input = $(this);
            input.addClass(options.css);

            if (options.hover) {
                input.find("tr").bind('mouseover mouseout', function (event) {
                    if (event.type == 'mouseover') {
                        $(this).children("td").addClass("ui-state-hover").css("cursor", "pointer");
                    } else {
                        $(this).children("td").removeClass("ui-state-hover");
                    }
                })
            }

            input.find("th").addClass("ui-state-default");
            input.find("td").addClass("ui-widget-content");

            //input.find("tr").each(function () {
            //    $(this).children("td:not(:first)").addClass("first");
            //    $(this).children("th:not(:first)").addClass("first");
            //});
        });
    };

    $.fn.aplicarMoneda = function (options) {
        //<summary> Aplica estilos de moneda a input[type="text"]</summary>
        var defaults = {
            css: 'moneda'
        };

        if (options == null) options = {};

        options = $.extend(defaults, options);

        var controls = this;
        controls.each(function () {
            var input = $(this).filter('input[type="text"]');
            var isFocused = input.is(":focus");

            input.unbind('blur');

            input.bind('blur', function () {
                if ($(this).val() != null && $(this).val() != "" && $.isNumeric($(this).val())) {
                    if (options.porcentaje && $(this).val() > 100) $(this).val(100)
                    $(this).val(parseFloat($(this).val()).formatMoney(2, '.', options.porcentaje ? '' : ','));
                }
            });
            input.bind('focus', function () {
                if ($(this).val() != null && $(this).val() != "")
                    $(this).val($(this).val().replace(/,/g, ""));
            });
            if (input.val() != null && input.val() != "" && !isFocused && $.isNumeric(input.val())) {
                input.val(parseFloat(input.val()).formatMoney(2, '.', options.porcentaje ? '' : ','));
            }
            input.attr('maxlength', options.porcentaje ? '5' : '15');
            input.css('text-align', 'right');

            input.keypress(function (e) {
                return validMoney(e, $(this));
            });

            input.data("value", input.val());

            setInterval(function () {
                var isFocused = input.is(":focus");
                var data = input.data("value"),
                    val = input.val();

                if (data !== val && !isFocused) {
                    if (input.val() != null && input.val() != "" && $.isNumeric(val)) {
                        input.val(parseFloat(input.val()).formatMoney(2, '.', ','));
                    }
                    input.data("value", val);
                }
            }, 100);
        });

        function validMoney(e, Text) {
            //<summary> Valida inputs solo numeros decimales</summary>
            if (((e.which == 46) || (e.which >= 48 && e.which <= 57) || (e.which == 8) || (e.which == 45))) {
                var splitText = Text.val().split(".");
                if (e.which == 46) {
                    if (splitText.length > 1) {
                        return false;
                    }
                }
                if (e.which == 45) {
                    splitText = Text.val().split("-");
                    if (Text.val().length > 0) {
                        return false;
                    }
                    if (splitText.length > 1) {
                        return false;
                    }
                }
            }
            else {
                return false;
            }
        }

        return controls
    };

    $.fn.removerMoneda = function (options) {
        //<summary> Remueve estilo de moneda a input[type="text"]</summary>
        var defaults = {
            css: 'moneda'
        };

        options = $.extend(defaults, options);

        var controls = this;
        controls.each(function () {
            var input = $(this).filter('input[type="text"]');
            var isFocused = input.is(":focus");

            if (input.val() != null && input.val() != "" && !isFocused) {
                input.val(input.val().replace(/,/g, ""));
            }
        });

        return controls
    };

    /*================================================================
                            INICIO UTILS.JS
    ==================================================================*/

    var init = function () {
        ///<summary>Ejecución al realizar $.ready()</summary>
    };

    var load = function () {
        //<summary>Cargar al momento</summary>
        $(init);
    }

    load();

})(Utils);