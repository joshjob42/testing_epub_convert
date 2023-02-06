var dotEPUB_links = 1;
var dotEPUB_lang = 'en';
var dotEPUB_format = 'epub';
var dotEPUB_bookver = '1.2';
var dotEPUB = {
        version: "0.8.17",
        path: "//dotepub.com/api/v1/post",
        doc: null,
        flags: "|",
        imgs: 1,
        format: "epub",
        links: 1,
        lang: "en",
        type: "Bookmarklet",
        debug: !1,
        gelByClass: function(e, t) {
            var o = e.getElementsByTagName("*"),
                n = [];
            t = t.replace(/\-/g, "\\-");
            for (var a, r = RegExp("(^|\\s)" + t + "(\\s|$)"), d = 0; d < o.length; d++) a = o[d], r.test(a.className) && n.push(a);
            return n
        },
        meta: function(e) {
            for (var t = document.getElementsByTagName("meta"), o = 0; o < t.length; o++)
                if (t[o].getAttribute("name") && t[o].getAttribute("name").toLowerCase() == e) return t[o].getAttribute("content");
            return ""
        },
        getLang: function() {
            var e = document.documentElement,
                t = e.lang,
                o = e.textContent;
            return void 0 !== t && "" !== t ? "zh" === t ? "zh-CN" : t : -1 !== o.search(/的/) ? "zh-CN" : -1 !== o.search(/の/) ? "ja" : "en"
        },
        getAuthor: function() {
            if ("undefined" != typeof dotEPUB_author && "null" != dotEPUB_author) return "<dotEPUB_sep/>" + dotEPUB_author;
            if (document.getElementById("dotEPUBauthor")) return "<dotEPUB_sep/>" + rd.getInnerText(document.getElementById("dotEPUBauthor"));
            for (var e = dotEPUB.meta("author"), t = document.getElementsByTagName("body")[0].getElementsByTagName("*"), o = 0, n = t.length; n > o; o++) {
                var a = t[o].getAttribute("itemprop"),
                    r = t[o].getAttribute("rel");
                if ("author" === r || "author" === a || "creator" === a) return e + "<dotEPUB_sep/>" + rd.getInnerText(t[o])
            }
            var d = ["byline-author", "byline-name", "byline", "headline_meta", "postmeta", "postmetadata", "entry-tagline", "blog-byline", "firma", "article_byline", "story_author"],
                i = dotEPUB.gelByClass(document, "post-author")[0];
            if (void 0 !== i) {
                var s = dotEPUB.gelByClass(i, "fn")[0];
                return void 0 !== s ? e + "<dotEPUB_sep/>" + rd.getInnerText(s) : e + "<dotEPUB_sep/>" + rd.getInnerText(i)
            }
            for (var l = 0; l < d.length; l++)
                if (i = dotEPUB.gelByClass(document, d[l])[0], void 0 !== i) {
                    var s = dotEPUB.gelByClass(i, "author")[0];
                    return void 0 !== s ? e + "<dotEPUB_sep/>" + rd.getInnerText(s) : e + "<dotEPUB_sep/>" + rd.getInnerText(i)
                } return e
        },
        addFlag: function(e) {
            dotEPUB.flags = dotEPUB.flags + e + "|"
        },
        field: function(e, t, o) {
            var n = document.createElement("input");
            n.setAttribute("type", "hidden"), n.setAttribute("name", t), n.setAttribute("value", o), e.appendChild(n)
        },
        createRepl: function(e, t, o) {
            var n = document.createElement("em");
            n.className = "dotEPUBProtected";
            var a = document.createElement("a");
            a.href = o;
            var r = document.createTextNode(t);
            a.appendChild(r);
            var d = document.createTextNode(" ["),
                i = document.createTextNode("] ");
            n.appendChild(i), i.parentNode.insertBefore(a, i), a.parentNode.insertBefore(d, a), e.parentNode.insertBefore(n, e), e.parentNode.removeChild(e)
        },
        imgRepl: function(e, t) {
            var o = dotEPUB.messages.imgremoved[dotEPUB_lang];
            dbg("dotEPUB: img replaced " + t.length);
            for (var n = t.length - 1; n >= 0; n--) dotEPUB.createRepl(t[n], o, t[n].src);
            return e
        },
        Absolutize: function(e) {
            for (var t = e.getElementsByTagName("a"), o = t.length - 1; o >= 0; o--) t[o].href = t[o].href
        },
        imgLinks: function(e) {
            var t = e.getElementsByTagName("img"),
                o = "",
                n = e.innerHTML,
                a = t.length,
                r = 10,
                d = !1;
            if (dbg("dotEPUB: img links " + a), 0 == a) return [e, ""];
            # if (!confirm(dotEPUB.messages.imgs[dotEPUB_lang])) return e = dotEPUB.imgRepl(e, t), [e, ""];
            # a > r && (alert(dotEPUB.messages.manyimgs[dotEPUB_lang]), a = r, d = !0), dotEPUB.imgs = 1;
            for (var i = 0, s = 0; a > s; s++)
                if ("" != t[s].src)
                    if (t[s].src.match(/^data:/)) n = n.replace(/<img /, "<imagedata ");
                    else {
                        i++;
                        var l = t[s].alt;
                        "" == l && (l = t[s].title, "" == l && (l = "[IMG]")), l = l.replace(/\t/g, " "), n = n.replace(/<img /, '<imgdotepub="num' + i + '" class="dotEPUBProtected"'), o += t[s].src + "	" + l + "	"
                    } if (d) {
                e.innerHTML = n;
                var c = e.getElementsByTagName("img"),
                    a = t.length,
                    e = dotEPUB.imgRepl(e, c),
                    n = e.innerHTML
            }
            return n = n.replace(/<imgdotepub/g, "<img dotepub"), n = n.replace(/<imagedata /g, "<img "), e.innerHTML = n, [e, "<dotEPUBimgs>" + o + "</dotEPUBimgs>"]
        },
        videoRepl: function(e) {
            var t = dotEPUB.messages.videoremoved[dotEPUB_lang],
                o = e.getElementsByTagName("object");
            dbg("dotEPUB: video replace object candidates " + o.length);
            for (var n = o.length - 1; n >= 0; n--) {
                var a = o[n].getElementsByTagName("param");
                e: for (var r = 0; r < a.length; r++)
                    for (var d = 0; d < a[r].attributes.length; d++)
                        if (-1 !== a[r].attributes[d].value.search(rd.regexps.videoRe)) {
                            var i = a[r].attributes[d].value;
                            dotEPUB.createRepl(o[n], t, i), dbg("dotEPUB: video replaced (object) " + i);
                            break e
                        }
            }
            var s = ["embed", "iframe", "video"];
            for (var l in s) {
                var c = e.getElementsByTagName(s[l]);
                dbg("dotEPUB: video replace " + s[l] + " candidates " + c.length);
                for (var m = 0; m < c.length; m++)
                    for (var g = 0; g < c[m].attributes.length; g++)
                        if (-1 !== c[m].attributes[g].value.search(rd.regexps.videoRe)) {
                            var i = c[m].attributes[g].value;
                            dotEPUB.createRepl(c[m], t, i), dbg("dotEPUB: video replaced (" + s[l] + ") " + i);
                            break
                        }
            }
        },
        removeStatus: function() {
            "undefined" != typeof dotEPUBstatus && dotEPUBstatus.parentNode.removeChild(dotEPUBstatus)
        },
        send: function(e, t, o) {
            if (0 == window.location.href.indexOf("file") && dotEPUB.links && !confirm(dotEPUB.messages.local[dotEPUB_lang])) return void dotEPUB.removeStatus();
            var n = e.content.length;
            # if (n > 5e5 && 2999999 > n && !confirm(dotEPUB.messages.toolong[dotEPUB_lang])) return void dotEPUB.removeStatus();
            # if (n > 3e6) return alert(dotEPUB.messages.tootoolong[dotEPUB_lang]), void dotEPUB.removeStatus();
            if (!document.getElementById("dotepub_iframe")) {
                var a = document.createElement("iframe");
                if (a.frameBorder = 0, a.style.cssText = "position:absolute;top:0px;right:0px;width:0pt;height:0pt;", a.id = "dotepub_iframe", document.body.appendChild(a), a) {
                    var r;
                    if (a.contentDocument ? r = a.contentDocument : a.contentWindow ? r = a.contentWindow.document : window.frames[a.name] && (r = window.frames[a.name].document), r) {
                        r.open();
                        var d = "" === dotEPUB_bookver ? "0" : dotEPUB_bookver,
                            i = window.location,
                            s = i.hostname;
                        r.write("<html><head><script>(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','//www.google-analytics.com/analytics.js','ga');ga('create', 'UA-3753530-8', 'auto');ga('send', 'event', 'Downloads (" + dotEPUB.format + ")', '" + dotEPUB.type + "', '" + s + "', " + n + ");ga('send', 'event', 'Bookver (" + d + ")', '" + dotEPUB.type + "', '" + i.protocol + "//" + s + "');</script></head><body></body></html>"), r.close()
                    }
                }
            }
            var l = document.createElement("form");
            l.setAttribute("action", dotEPUB.path), l.setAttribute("method", "post"), l.setAttribute("accept-charset", "utf-8"), dotEPUB.field(l, "format", dotEPUB.format), dotEPUB.field(l, "title", e.title), dotEPUB.field(l, "html", e.content), dotEPUB.field(l, "url", "Link" !== dotEPUB.type ? window.location.href : dotEPUB_url), dotEPUB.field(l, "author", t), dotEPUB.field(l, "copy", o), dotEPUB.field(l, "flags", dotEPUB.flags), dotEPUB.field(l, "links", dotEPUB.links), dotEPUB.field(l, "lang", dotEPUB_lang), dotEPUB.field(l, "imgs", dotEPUB.imgs), dotEPUB.field(l, "wlang", dotEPUB.wlang), dotEPUB.field(l, "v", dotEPUB.version + " / " + dotEPUB.type.substring(0, 1).toLowerCase() + dotEPUB_bookver + " " + (1 === dotEPUB.imgs ? "I" : "") + (1 === dotEPUB.links ? "L" : "")), dotEPUB.field(l, "s", dotEPUB.s([5, 3, 100, 2, 0, 4, 33, 1, 255, document])), window.setTimeout(function() {
                if (dotEPUB.removeStatus(), "Link" === dotEPUB.type) {
                    var e = document.body;
                    e.style.display = "block", e.innerHTML = "<h1 style=\"padding: 10px;background-color: #85ba25;color: #fff;font-size: 20px;font-family: 'Trebuchet MS',verdana,sans-serif;}\">" + dotEPUB.messages.theend1[dotEPUB_lang] + '<a style="color: #fff; text-decoration: underline" href="' + dotEPUB_url + '">' + dotEPUB.messages.theend2[dotEPUB_lang] + "</a>.</h1>"
                }
            }, 3e3), document.body.appendChild(l), l.submit(), l.parentNode.removeChild(l)
        },
        escapePre: function() {
            var e = dotEPUB.doc.getElementsByTagName("pre");
            e.length > 0 && (dotEPUB.addFlag("pre"), dbg("dotEPUB: pre found"));
            for (var t = 0; t < e.length; t++) rd.clean(e[t], "img"), rd.clean(e[t], "a"), e[t].textContent = e[t].textContent.replace(/\n/g, "{_dotepub_cr_}").replace(/ /g, "{_dotepub_sp_}")
        },
        footnotes: function() {
            var e = document.getElementById("footnotes");
            return e || (e = dotEPUB.gelByClass(document, "footnotes")[0]), e ? '<div class="dotEPUBfn">' + e.innerHTML + "</div>" : !1
        },
        s: function(e) {
            var t = dotEPUB.form(s, e[4], e[1], d, l, o, n, e[2], e[3], e[4]),
                o = dotEPUB.form(e[4], t, e[1], d, l, o, n, e[9], e[5], t),
                n = dotEPUB.form(e[7], t, e[1], d, l, o, n, e[6], e[7], o),
                a = dotEPUB.form(e[5], t, e[3], d, l, o, n, e[0], e[3], n),
                r = dotEPUB.form(e[1], t, e[1], d, l, o, n, n / 11, e[7], a),
                d = dotEPUB.form(e[3], t, e[5], d, l, o, n, e[2], a, r),
                i = dotEPUB.form(e[4], t, e[1], d, l, o, n, e[8] - e[6] - e[5], e[7], d),
                s = dotEPUB.form(e[3], t, 6, d, l, o, n, e[2], a, r),
                l = dotEPUB.form(s, t, e[0], d, l, o, n, e[0], e[7], s),
                c = dotEPUB.form(s, t, e[4], d, l, o, n, e[0], e[4], s),
                m = dotEPUB.form(s, t, e[7], d, l, o, n, e[0], e[7], s),
                g = dotEPUB.form(s, t, e[0], d, l, o, n, e[0], e[7], c),
                a = dotEPUB.form(s, t, e[7], d, g, o, n, e[0], e[7], s),
                p = dotEPUB.form(c, l, e[7], d, g - e[5], o, n, e[0], e[7], s),
                u = dotEPUB.form(s, t, e[0], d, l, o, n, e[0], e[7], 0);
            return m + i + a + p + u
        },
        remove: function(e, t) {
            for (var o = e.getElementsByTagName(t), n = o.length - 1; n >= 0; n--) o[n].parentNode.removeChild(o[n])
        },
        removeClass: function(e, t) {
            for (var o = dotEPUB.gelByClass(e, t), n = o.length - 1; n >= 0; n--) o[n].parentNode.removeChild(o[n])
        },
        clearly: function() {
            var e = document.getElementById("readable_iframe"),
                t = e.contentWindow || e.contentDocument;
            t.document && (t = t.document);
            var o = t.getElementById("text").cloneNode(!0);
            dotEPUB.removeClass(o, "none"), dotEPUB.removeClass(o, "pageSeparator");
            var n = document.createElement("div");
            n.className = "dotEPUBcontent", n.style.display = "none", n.appendChild(o), n.innerHTML = n.innerHTML.replace(/<div[^>]*>/g, ""), n.innerHTML = n.innerHTML.replace(/<\/div>/g, ""), document.getElementsByTagName("body")[0].appendChild(n)
        },
        messages: {
            choose: {
                en: "Choose a format",
                es: "Escoge un formato",
                ca: "Escull un format"
            },
            mode: {
                en: "Mode",
                es: "Modo",
                ca: "Mode"
            },
            nocontent: {
                en: "dotEPUB is unable to process this page. If it's an article page, a blog entry, a story, etc. report this problem to info@dotepub.com.",
                es: "dotEPUB no es capaz de procesar esta página. Si es una página de un artículo, una entrada de blog, un relato o similar, informa de este problema a info@dotepub.com.",
                ca: "dotEPUB no és capaç de processar aquesta pàgina. Si és una pàgina d'un article, una entrada de blog, un relat o similar, informa d'aquest problema a info@dotepub.com."
            },
            imgremoved: {
                en: "Image removed",
                es: "Imagen eliminada",
                ca: "Imatge eliminada"
            },
            manyimgs: {
                en: "This page has too many images!\n\nWe cannot include them all, sorry.",
                es: "¡Esta página contiene demasiadas imágenes!\n\nNo podemos incluirlas todas, sintiéndolo mucho.",
                ca: "Aquesta pàgina conté massa imatges!\n\nNo podem incloure-les totes, sentint-ho molt."
            },
            home: {
                en: "dotEPUB.com is designed to process article pages, blog entries, stories, etc., not home pages.\n\nDo you want to proceed anyway?",
                es: "dotEPUB.com está diseñado para procesar páginas de artículos, entradas de blogs, relatos, etc., no páginas principales.\n\n¿Deseas continuar de todas formas?",
                ca: "dotEPUB.com està dissenyat per processar pàgines d'articles, entrades de blogs, relats, etc., no pàgines principals.\n\nVols continuar de totes formes?"
            },
            imgs: {
                en: 'This page has images.\n\nIf they are not needed to understand the text, do NOT try to retrieve them: the conversion process will be much longer and the e-book file bigger.\n\nPress "OK" to try to retrieve the images.\n\nPress "Cancel" to continue without retrieving the images.',
                es: 'Esta página contiene imágenes.\n\nSi no son imprescindibles para la comprensión del texto, NO intentes recuperarlas: el proceso de conversión será mucho más largo y el fichero del e-book mucho más grande.\n\nPulsa "Aceptar" para tratar de recuperar las imágenes.\n\nPulsa "Cancelar" para continuar sin recuperar las imágenes.',
                ca: 'Aquesta pàgina conté imatges.\n\nSi no són imprescindibles per a la comprensió del text, NO intentis recuperar-les: el procés de conversió serà molt més llarg i el fitxer de l\'e-book molt més gran.\n\nPrem "Accepta" per tractar de recuperar les imatges.\n\nPrem "Cancel·la" per continuar sense recuperar les imatges.'
            },
            videoremoved: {
                en: "Video removed",
                es: "Vídeo eliminado",
                ca: "Vídeo eliminat"
            },
            local: {
                en: "This page is not on the Internet.\n\nWe cannot retrieve its images.\n\nThe conversion will be done using the immersive mode.\n\nDo you still want to proceed?",
                es: "Esta página no está en Internet.\n\nNo podemos recuperar las imágenes.\n\nLa conversión se efectuará usando el modo inmersivo.\n\n¿Deseas continuar de todas formas?",
                ca: "Aquesta pàgina no és a Internet.\n\nNo podem recuperar les imatges.\n\nLa conversió serà efectuada utilizant el mode immersiu.\n\nVols continuar de totes formes?"
            },
            toolong: {
                en: "This page is very long!\n\nThe processing and downloading of the e-book may take some time (please be patient) and some e-readers may be unable to view it.\n\nDo you want to proceed?",
                es: "¡Esta página es muy larga!\n\nEl procesamiento y descarga del libro electrónico puede durar un rato (por favor, sé paciente) y algunos e-readers quizás no sean capaces de visualizarlo.\n\n¿Deseas continuar de todas formas?",
                ca: "Aquesta pàgina és molt llarga!\n\nEl processament i descàrrega del llibre electrònic pot trigar una estona (sisplau, sigues pacient) i alguns e-readers potser no siguin capaços de visualitzar-lo.\n\nVols continuar de totes formes?"
            },
            tootoolong: {
                en: "This page is very very very long!\nWe cannot accept it, sorry.",
                es: "¡Esta página es muy muy muy larga!\nNo podemos aceptarla, sintiéndolo mucho.",
                ca: "Aquesta pàgina és molt molt molt llarga!\nNo podem acceptar-la sentint-ho molt."
            },
            cancel: {
                en: "cancel",
                es: "cancelar",
                ca: "cancel·lar"
            },
            progress: {
                en: "Conversion in progress",
                es: "Conversi&oacute;n en curso",
                ca: "Conversi&oacute; en curs"
            },
            title_epub: {
                en: "used by most e-readers",
                es: "usado por la mayoría de los e-readers",
                ca: "utilitzat per la majoria dels e-readers"
            },
            title_mobi: {
                en: "for Amazon Kindle only",
                es: "solamente para Amazon Kindle",
                ca: "només per Amazon Kindle"
            },
            links_0: {
                en: "imm.",
                es: "inm.",
                ca: "imm."
            },
            links_1: {
                en: "non-imm.",
                es: "no inm.",
                ca: "no imm."
            },
            title_0: {
                en: "immersive: links, images and videos will be removed",
                es: "inmersivo: los enlaces, imágenes y vídeos serán eliminados",
                ca: "immersiu: els enllaços, imatges i vídeos seran eliminats"
            },
            title_1: {
                en: "non-immersive: links and images will be kept, videos will be linked",
                es: "no inmersivo: los enlaces e imágenes se mantendrán, los vídeos se enlazarán",
                ca: "no immersiu: els enllaços i imatges es mantindran, els vídeos s'enllaçaran"
            },
            theend1: {
                en: "Close this window once the download has completed or go to the ",
                es: "Cierra esta ventana una vez haya concluido la descarga o visita la ",
                ca: "Tanca aquesta finestra un cop hagi acabat la descàrrega o visita la "
            },
            theend2: {
                en: "original webpage",
                es: "página original",
                ca: "pàgina original"
            }
        },
        init: function() {
            dotEPUBstatus = document.getElementById("dotepub"), "undefined" != typeof dotEPUB_links && (dotEPUB.links = dotEPUB_links), "undefined" == typeof dotEPUB_lang && (dotEPUB_lang = dotEPUB.lang), "undefined" != typeof dotEPUB_format && (dotEPUB.format = dotEPUB_format.toLowerCase(), dotEPUB_format = void 0), "undefined" != typeof dotEPUB_type && (dotEPUB.type = dotEPUB_type), "undefined" != typeof dotEPUB_url && (dotEPUB.type = "Link");
            var e = dotEPUB.links ? "" : " (i)",
                t = "ask" === dotEPUB.format ? "" : dotEPUB.format,
                o = document.createTextNode(t + e + " v." + dotEPUB.version);
            if (dotEPUB_d = document.createElement("div"), dotEPUB_d.id = "dotEPUB_info", dotEPUB_d.style.cssText = "text-align:right;margin-top:-18px;margin-right:5px;font-family:Verdana, Sans-serif;font-size:11px;color:#000", dotEPUB_d.appendChild(o), document.getElementById("dotepub").getElementsByTagName("div")[0].appendChild(dotEPUB_d), "dotepub.com" != window.location.host && window.location.protocol + "//" + window.location.host + "/" == window.location.href && !confirm(dotEPUB.messages.home[dotEPUB_lang])) return void dotEPUB.removeStatus();
            dotEPUB.wlang = dotEPUB.getLang(), dotEPUB.doc = document.createElement("html"), document.getElementById("readable_iframe") && dotEPUB.clearly();
            var n = document.getElementsByTagName("html")[0],
                a = n.cloneNode(!0);
            dotEPUB.doc.appendChild(a), "ask" == dotEPUB.links ? (dotEPUBstatus.getElementsByTagName("p")[0].firstChild.nodeValue = dotEPUB.messages.mode[dotEPUB_lang] + ": ", dotEPUB.formatInput("links", 0), dotEPUB.formatInput("links", 1), dotEPUB.formatCancel()) : dotEPUB.cleanclone()
        },
        cleanclone: function() {
            dotEPUB.escapePre();
            var e = dotEPUB.footnotes(),
                t = rd.init();
            if (t.content = t.content.replace(/<div id="dotepub"><div id="status"><p>[^<]*<\/p><\/div><\/div>/, ""), e && (t.content += e), "" == t.content) alert(dotEPUB.messages.nocontent[dotEPUB_lang]), dotEPUB.removeStatus();
            else {
                "" == t.title && (t.title = window.location.href, t.title = t.title.replace(/\//g, "/ "), t.title = t.title.replace(/&/g, " &amp; ")), "undefined" != typeof dotEPUB_title && "null" != dotEPUB_title ? t.title = dotEPUB_title : t.title = document.getElementById("dotEPUBtitle") ? rd.getInnerText(document.getElementById("dotEPUBtitle")) : t.title;
                var o = dotEPUB.getAuthor(),
                    n = dotEPUB.meta("copyright");
                "ask" === dotEPUB.format ? (dotEPUBstatus.getElementsByTagName("p")[0].firstChild.nodeValue = dotEPUB.messages.choose[dotEPUB_lang] + ": ", dotEPUB.formatInput("format", "epub", t, o, n), dotEPUB.formatInput("format", "mobi", t, o, n), dotEPUB.formatCancel()) : dotEPUB.send(t, o, n)
            }
        },
        formatCancel: function() {
            var e = document.createElement("a"),
                t = document.createTextNode(dotEPUB.messages.cancel[dotEPUB_lang]);
            e.appendChild(t), e.onclick = function() {
                dotEPUB.removeStatus()
            }, dotEPUBstatus.getElementsByTagName("label")[1].parentNode.insertBefore(e, dotEPUBstatus.getElementsByTagName("label")[1].nextSibling)
        },
        formatInput: function(e, t, o, n, a) {
            if ("format" === e) var r = t.toUpperCase(),
                d = t;
            else var r = dotEPUB.messages["links_" + t][dotEPUB_lang],
                d = t ? "" : "(i)";
            var i = document.createTextNode(r),
                s = document.createElement("input");
            s.id = "dotEPUBparam" + t, s.type = "radio";
            var l = document.createElement("label");
            l.title = dotEPUB.messages["title_" + t][dotEPUB_lang], s.onclick = function() {
                dotEPUBstatus.getElementsByTagName("p")[0].innerHTML = dotEPUB.messages.progress[dotEPUB_lang], dotEPUB[e] = t;
                var r = document.getElementById("dotEPUB_info");
                r.firstChild.nodeValue = d + " " + r.firstChild.nodeValue, "format" === e ? dotEPUB.send(o, n, a) : dotEPUB.cleanclone()
            }, l.appendChild(s), l.appendChild(i), dotEPUBstatus.getElementsByTagName("p")[0].appendChild(l)
        },
        form: function(e, t, o, n, a, r, d, i, s, l) {
            switch (o) {
                case 0:
                    return ((e * t + d + 4) / 3 + 1) / 10 - 1;
                case 1:
                    return n.charCodeAt(a);
                case 2:
                    return r.location;
                case 3:
                    return i;
                case 4:
                    return s.href;
                case 5:
                    return n.length + l;
                case 6:
                    return d * l - t
            }
        }
    },
    dbg = dotEPUB.debug && "undefined" != typeof console ? function(e) {
        console.log(".epub: " + e)
    } : function() {},
    rd = {
        version: "1.6.2-1.7.0 + dotEPUB mod",
        iframeLoads: 0,
        frameHack: !1,
        biggestFrame: !1,
        bodyCache: null,
        flags: 7,
        FLAG_STRIP_UNLIKELYS: 1,
        FLAG_WEIGHT_CLASSES: 2,
        FLAG_CLEAN_CONDITIONALLY: 4,
        regexps: {
            unlikelyCandidatesRe: /tool|combx|comment|disqus|extra|foot|header|menu|rss|shoutbox|sidebar|sponsor|ad-break|agegate|pagination|pager|popup|insider_ad|outbrain/i,
            okMaybeItsACandidateRe: /and|column|main|shadow/i,
            positiveRe: /dotEPUBcontent|article|body|content|entry|hentry|main|page|pagination|post|full-text|text|blog|container|topmatter|story/i,
            negativeRe: /tool|combx|comment|com-|contact|foot|footer|footnote|masthead|media|meta|outbrain|promo|related|scroll|shoutbox|sidebar|sponsor|shopping|tags|widget|utilidades|votos|coment|dablink|thumb|share|complementa|image|cbw|foto|insider_ad|section_heading show|section_heading hide|supplemental|ad-placeholder|ad|story-ad|story-interrupter|newsletter-signup|dotEPUBremove/i,
            divToPElementsRe: /<(a|blockquote|dl|div|img|ol|p|pre|table|ul)/i,
            replaceBrsRe: /(<br[^>]*>[ \n\r\t]*){2,}/gi,
            replaceFontsRe: /<(\/?)font[^>]*>/gi,
            trimRe: /^\s+|\s+$/g,
            normalizeRe: /\s{2,}/g,
            killBreaksRe: /(<br\s*\/?>(\s|&nbsp;?)*){1,}/g,
            videoRe: /http:\/\/(www\.)?(youtube|vimeo)\.com/i
        },
        init: function(e) {
            window.onload = window.onunload = function() {};
            for (var t = dotEPUB.doc.getElementsByTagName("script"), o = t.length - 1; o >= 0; o--)(void 0 === t[o].src || -1 == t[o].src.indexOf("dotepub")) && (t[o].nodeValue = "", t[o].removeAttribute("src"), t[o].parentNode.removeChild(t[o]));
            dotEPUB.doc.getElementsByTagName("body")[0] && !rd.bodyCache && (rd.bodyCache = dotEPUB.doc.getElementsByTagName("body")[0].innerHTML.replace(/<div id="dotepub"><div id="status"><p>[^<]*<\/p><\/div><\/div>/i, "")), rd.prepDocument();
            var n = rd.getArticleTitle(),
                a = rd.grabArticle();
            if (rd.getInnerText(a, !1).length < 250) {
                if (rd.flagIsActive(rd.FLAG_STRIP_UNLIKELYS)) return rd.removeFlag(rd.FLAG_STRIP_UNLIKELYS), dotEPUB.doc.getElementsByTagName("body")[0].innerHTML = rd.bodyCache, rd.init();
                if (rd.flagIsActive(rd.FLAG_WEIGHT_CLASSES)) return rd.removeFlag(rd.FLAG_WEIGHT_CLASSES), dotEPUB.doc.getElementsByTagName("body")[0].innerHTML = rd.bodyCache, rd.init();
                if (rd.flagIsActive(rd.FLAG_CLEAN_CONDITIONALLY)) return rd.removeFlag(rd.FLAG_CLEAN_CONDITIONALLY), dotEPUB.doc.getElementsByTagName("body")[0].innerHTML = rd.bodyCache, rd.init();
                if (!e) return dotEPUB.doc.getElementsByTagName("body")[0].innerHTML = rd.bodyCache.replace(/<a ([^>]*)>(.*)<\/a><br>/gi, "<p>$2</p>").replace(/<blockquote([^>]*)>/gi, "<$1p>"), rd.init(1);
                a.innerHTML = rd.bodyCache
            }
            return dotEPUB.links && dotEPUB.Absolutize(a), {
                title: rd.getInnerText(n),
                content: a.innerHTML
            }
        },
        getArticleTitle: function() {
            var e = "",
                t = "";
            try {
                e = t = document.title, "string" != typeof e && (e = t = rd.getInnerText(dotEPUB.doc.getElementsByTagName("title")[0]))
            } catch (o) {}
            if (e.match(/ [\|\-] /)) e = t.replace(/(.*)[\|\-] .*/gi, "$1"), e.split(" ").length < 3 && (e = t.replace(/[^\|\-]*[\|\-](.*)/gi, "$1"));
            else if (-1 !== e.indexOf(": ")) e = t.replace(/.*:(.*)/gi, "$1"), e.split(" ").length < 3 && (e = t.replace(/[^:]*[:](.*)/gi, "$1"));
            else if (e.length > 150 || e.length < 15) {
                var n = dotEPUB.doc.getElementsByTagName("h1");
                1 == n.length && (e = rd.getInnerText(n[0]))
            }
            e = e.replace(rd.regexps.trimRe, ""), e.split(" ").length <= 4 && "" != t && (e = t);
            var a = document.createElement("H1");
            return a.innerHTML = e, a
        },
        prepDocument: function() {
            if (null === dotEPUB.doc.getElementsByTagName("body")[0]) {
                var e = document.createElement("body");
                try {
                    dotEPUB.doc.getElementsByTagName("body")[0] = e
                } catch (t) {
                    dotEPUB.doc.documentElement.appendChild(e), dbg(t)
                }
            }
            var o = dotEPUB.doc.getElementsByTagName("frame");
            if (o.length > 0) {
                for (var n = null, a = 0, r = 0, d = 0; d < o.length; d++) {
                    var i = o[d].offsetWidth + o[d].offsetHeight,
                        s = !1;
                    try {
                        o[d].contentWindow.dotEPUB.doc.getElementsByTagName("body")[0], s = !0
                    } catch (l) {
                        dbg(l)
                    }
                    i > r && (r = i, rd.biggestFrame = o[d]), s && i > a && (rd.frameHack = !0, n = o[d], a = i)
                }
                if (n) {
                    var c = document.createElement("body");
                    c.innerHTML = n.contentWindow.dotEPUB.doc.getElementsByTagName("body")[0].innerHTML, c.style.overflow = "scroll", dotEPUB.doc.getElementsByTagName("body")[0] = c;
                    var m = dotEPUB.doc.getElementsByTagName("frameset")[0];
                    m && m.parentNode.removeChild(m)
                }
            }
            for (var g = dotEPUB.doc.getElementsByTagName("style"), p = 0; p < g.length; p++) g[p].textContent = "";
            dotEPUB.doc.getElementsByTagName("body")[0].innerHTML = dotEPUB.doc.getElementsByTagName("body")[0].innerHTML.replace(rd.regexps.replaceBrsRe, "</p><p>").replace(rd.regexps.replaceFontsRe, "<$1span>"), dbg("****")
        },
        prepArticle: function(e) {
            dbg("Article content before cleaning:" + e.innerHTML), rd.cleanStyles(e), rd.killBreaks(e), dotEPUB.remove(e, "noscript"), rd.cleanConditionally(e, "form"), rd.cleanConditionally(e, "button"), rd.clean(e, "object"), rd.clean(e, "embed"), dotEPUB.remove(e, "applet"), dotEPUB.remove(e, "canvas"), dotEPUB.remove(e, "audio"), dotEPUB.remove(e, "nobr"), dotEPUB.remove(e, "wbr"), rd.cleanHeaders(e), dotEPUB.removeClass(e, "magnify"), dotEPUB.removeClass(e, "hidden"), dotEPUB.removeClass(e, "no-content"), dotEPUB.removeClass(e, "visually-hidden"), dotEPUB.removeClass(e, "newsletter-signup"), dotEPUB.removeClass(e, "ad");
            var t = "";
            if (dotEPUB.links) {
                var o = dotEPUB.imgLinks(e);
                e = o[0], t = o[1], dotEPUB.videoRepl(e)
            } else dotEPUB.remove(e, "img"), dotEPUB.remove(e, "object"), dotEPUB.remove(e, "embed"), dotEPUB.remove(e, "video");
            dotEPUB.remove(e, "iframe"), rd.cleanConditionally(e, "table"), rd.cleanConditionally(e, "div");
            for (var n = e.getElementsByTagName("p"), a = n.length - 1; a >= 0; a--) {
                var r = n[a].getElementsByTagName("img").length,
                    d = n[a].getElementsByTagName("embed").length,
                    i = n[a].getElementsByTagName("object").length;
                0 === r && 0 === d && 0 === i && "" == rd.getInnerText(n[a], !1) && n[a].parentNode.removeChild(n[a])
            }
            try {
                e.innerHTML = e.innerHTML.replace(/<br[^>]*>\s*<p/gi, "<p") + t
            } catch (s) {
                dbg("Cleaning innerHTML of breaks failed. This is an IE strict-block-elements bug. Ignoring.: " + s)
            }
        },
        initializeNode: function(e) {
            switch (e.rd = {
                    contentScore: 0
                }, e.tagName) {
                case "DIV":
                    e.rd.contentScore += 5;
                    break;
                case "PRE":
                case "TD":
                case "BLOCKQUOTE":
                    e.rd.contentScore += 3;
                    break;
                case "ADDRESS":
                case "OL":
                case "UL":
                case "DL":
                case "DD":
                case "DT":
                case "LI":
                case "FORM":
                    e.rd.contentScore -= 3;
                    break;
                case "H1":
                case "H2":
                case "H3":
                case "H4":
                case "H5":
                case "H6":
                case "TH":
                    e.rd.contentScore -= 5
            }
            e.rd.contentScore += rd.getClassWeight(e)
        },
        grabArticle: function() {
            for (var e = rd.flagIsActive(rd.FLAG_STRIP_UNLIKELYS), t = null, o = [], n = 0; t = dotEPUB.doc.getElementsByTagName("body")[0].getElementsByTagName("*")[n]; n++) {
                if (e) {
                    var a = t.className + t.id;
                    if (-1 !== a.search(rd.regexps.unlikelyCandidatesRe) && -1 == a.search(rd.regexps.okMaybeItsACandidateRe) && "BODY" !== t.tagName) {
                        dbg("Removing unlikely candidate - " + a), t.parentNode.removeChild(t), n--;
                        continue
                    }
                }
                if (("P" === t.tagName || "TD" === t.tagName || "PRE" === t.tagName) && (o[o.length] = t), "DIV" === t.tagName && -1 === t.innerHTML.search(rd.regexps.divToPElementsRe)) {
                    dbg("Altering div to p " + t.className);
                    var r = document.createElement("p");
                    try {
                        r.innerHTML = t.innerHTML, t.parentNode.replaceChild(r, t), n--, o[o.length] = t
                    } catch (d) {
                        dbg("Could not alter div to p, probably an IE restriction, reverting back to div.: " + d)
                    }
                }
            }
            for (var i = [], s = 0; s < o.length; s++) {
                var l = o[s].parentNode,
                    c = l ? l.parentNode : null,
                    m = rd.getInnerText(o[s]);
                if (l && void 0 !== l.tagName && !(m.length < 25)) {
                    void 0 === l.rd && (rd.initializeNode(l), i.push(l)), c && void 0 === c.rd && void 0 !== c.tagName && (rd.initializeNode(c), i.push(c));
                    var g = 0;
                    g++, g += m.split(",").length, g += Math.min(Math.floor(m.length / 100), 3), l.rd.contentScore += g, c && (c.rd.contentScore += g / 2)
                }
            }
            var p = null;
            if (dotEPUB.doc.getElementsByTagName("body")[0].getElementsByTagName("article")[0]) p = dotEPUB.doc.getElementsByTagName("body")[0].getElementsByTagName("article")[0], p.rd = {
                contentScore: 1e5
            };
            else
                for (var u = 0, E = i.length; E > u; u++) i[u].rd.contentScore = i[u].rd.contentScore * (1 - rd.getLinkDensity(i[u])), dbg("Candidate: " + i[u] + " (" + i[u].className + ":" + i[u].id + ") with score " + i[u].rd.contentScore), (!p || i[u].rd.contentScore > p.rd.contentScore) && (p = i[u]);
            (null === p || "BODY" == p.tagName) && (p = document.createElement("DIV"), p.innerHTML = dotEPUB.doc.getElementsByTagName("body")[0].innerHTML, dotEPUB.doc.getElementsByTagName("body")[0].innerHTML = "", dotEPUB.doc.getElementsByTagName("body")[0].appendChild(p), rd.initializeNode(p));
            var B = document.createElement("DIV");
            B.id = "readability-content";
            for (var f = Math.max(10, .2 * p.rd.contentScore), v = p.parentNode.childNodes, P = 0, h = v.length; h > P; P++) {
                var U = v[P],
                    y = !1;
                dbg("Looking at sibling node: " + U + " (" + U.className + ":" + U.id + ")" + (void 0 !== U.rd ? " with score " + U.rd.contentScore : "")), dbg("Sibling has score " + (U.rd ? U.rd.contentScore : "Unknown")), U === p && (y = !0);
                var b = 0;
                if (U.className == p.className && "" != p.className && (b += .2 * p.rd.contentScore), void 0 !== U.rd && U.rd.contentScore + b >= f && (y = !0), "P" == U.nodeName) {
                    var T = rd.getLinkDensity(U),
                        N = rd.getInnerText(U),
                        C = N.length;
                    C > 80 && .25 > T ? y = !0 : 80 > C && 0 === T && -1 !== N.search(/\.( |$)/) && (y = !0)
                }
                if (y) {
                    dbg("Appending node: " + U);
                    var _ = null;
                    if ("DIV" != U.nodeName && "P" != U.nodeName) {
                        dbg("Altering siblingNode of " + U.nodeName + " to div."), _ = document.createElement("div");
                        try {
                            _.id = U.id, _.innerHTML = U.innerHTML
                        } catch (d) {
                            dbg("Could not alter siblingNode to div, probably an IE restriction, reverting back to original."), _ = U, P--, h--
                        }
                    } else _ = U, P--, h--;
                    _.className = "", B.appendChild(_)
                }
            }
            return rd.prepArticle(B), B
        },
        getInnerText: function(e, t) {
            var o = "";
            return void 0 === e.textContent && void 0 === e.innerText ? "" : (t = void 0 === t ? !0 : t, o = "Microsoft Internet Explorer" == navigator.appName ? e.innerText.replace(rd.regexps.trimRe, "") : e.textContent.replace(rd.regexps.trimRe, ""), t ? o.replace(rd.regexps.normalizeRe, " ") : o)
        },
        getCharCount: function(e, t) {
            return t = t || ",", rd.getInnerText(e).split(t).length - 1
        },
        cleanStyles: function(e) {
            e = e || doc;
            var t = e.firstChild;
            if (e)
                for ("function" == typeof e.removeAttribute && e.removeAttribute("style"); null !== t;) 1 == t.nodeType && (t.removeAttribute("style"), rd.cleanStyles(t)), t = t.nextSibling
        },
        getLinkDensity: function(e) {
            for (var t = e.getElementsByTagName("a"), o = rd.getInnerText(e).length, n = 0, a = 0, r = t.length; r > a; a++) n += rd.getInnerText(t[a]).length;
            return n / o
        },
        getClassWeight: function(e) {
            if (!rd.flagIsActive(rd.FLAG_WEIGHT_CLASSES)) return 0;
            var t = 0;
            return "string" == typeof e.className && "" != e.className && (-1 !== e.className.search(rd.regexps.negativeRe) && (t -= 25), -1 !== e.className.search(rd.regexps.positiveRe) && (t += 25)), "string" == typeof e.id && "" != e.id && (-1 !== e.id.search(rd.regexps.negativeRe) && (t -= 25), -1 !== e.id.search(rd.regexps.positiveRe) && (t += 25)), t
        },
        nodeIsVisible: function(e) {
            return (0 !== e.offsetWidth || 0 !== e.offsetHeight) && "none" !== e.style.display.toLowerCase()
        },
        killBreaks: function(e) {
            try {
                e.innerHTML = e.innerHTML.replace(rd.regexps.killBreaksRe, "<br />")
            } catch (t) {
                dbg("KillBreaks failed - this is an IE bug. Ignoring.: " + t)
            }
        },
        clean: function(e, t) {
            for (var o = e.getElementsByTagName(t), n = "object" == t || "embed" == t, a = o.length - 1; a >= 0; a--) {
                if (n) {
                    for (var r = "", d = 0, i = o[a].attributes.length; i > d; d++) r += o[a].attributes[d].value + "|";
                    if (-1 !== r.search(rd.regexps.videoRe)) continue;
                    if (-1 !== o[a].innerHTML.search(rd.regexps.videoRe)) continue
                }
                o[a].parentNode.removeChild(o[a])
            }
        },
        cleanConditionally: function(e, t) {
            if (-1 === e.innerHTML.search(/dotEPUBProtected/i) && rd.flagIsActive(rd.FLAG_CLEAN_CONDITIONALLY))
                for (var o = e.getElementsByTagName(t), n = o.length, a = n - 1; a >= 0; a--) {
                    var r = rd.getClassWeight(o[a]),
                        d = void 0 !== o[a].rd ? o[a].rd.contentScore : 0;
                    if (dbg("Cleaning Conditionally " + o[a] + " (" + o[a].className + ":" + o[a].id + ")" + (void 0 !== o[a].rd ? " with score " + o[a].rd.contentScore : "")), 0 > r + d) o[a].parentNode.removeChild(o[a]);
                    else if (rd.getCharCount(o[a], ",") < 10) {
                        for (var i = o[a].getElementsByTagName("p").length, s = o[a].getElementsByTagName("img").length, l = o[a].getElementsByTagName("li").length - 100, c = o[a].getElementsByTagName("input").length, m = 0, g = o[a].getElementsByTagName("embed"), p = 0, u = g.length; u > p; p++) - 1 == g[p].src.search(rd.regexps.videoRe) && m++;
                        var E = rd.getLinkDensity(o[a]),
                            B = rd.getInnerText(o[a]).length,
                            f = !1;
                        s > i ? f = !0 : l > i && "ul" != t && "ol" != t ? f = !0 : c > Math.floor(i / 3) ? f = !0 : 25 > B && (0 === s || s > 2) ? f = !0 : 25 > r && E > .2 ? f = !0 : r >= 25 && E > .5 ? f = !0 : (1 == m && 75 > B || m > 1) && (f = !0), f && o[a].parentNode.removeChild(o[a])
                    }
                }
        },
        cleanHeaders: function(e) {
            for (var t = 1; 3 > t; t++)
                for (var o = e.getElementsByTagName("h" + t), n = o.length - 1; n >= 0; n--)(rd.getClassWeight(o[n]) < 0 || rd.getLinkDensity(o[n]) > .33) && o[n].parentNode.removeChild(o[n])
        },
        htmlspecialchars: function(e) {
            return "string" == typeof e && (e = e.replace(/&/g, "&amp;"), e = e.replace(/"/g, "&quot;"), e = e.replace(/'/g, "&#039;"), e = e.replace(/</g, "&lt;"), e = e.replace(/>/g, "&gt;")), e
        },
        flagIsActive: function(e) {
            return (rd.flags & e) > 0
        },
        addFlag: function(e) {
            rd.flags = rd.flags | e
        },
        removeFlag: function(e) {
            rd.flags = rd.flags & ~e
        }
    };
dotEPUB.init();
