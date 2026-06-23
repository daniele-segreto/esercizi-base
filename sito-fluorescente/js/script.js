// Script Lumen Fluo in jQuery: menu, tema Mozzafiato, coriandoli, lightbox <dialog>.
// showModal / close restano API native del browser (jQuery non le incapsula).
$(function () {
    "use strict";

    // Footer: anno corrente.
    $("#year").text(String(new Date().getFullYear()));

    // Menu hamburger: .is-open + aria-expanded.
    $("#navToggle").on("click", function () {
        $("#siteNav").toggleClass("is-open");
        var open = $("#siteNav").hasClass("is-open");
        $(this).attr("aria-expanded", open ? "true" : "false");
    });

    // Chiusura menu mobile dopo click su ancore interne.
    $("#siteNav").on("click", "a[href^='#']", function () {
        $("#siteNav").removeClass("is-open");
        $("#navToggle").attr("aria-expanded", "false");
    });

    // Svuota il contenitore coriandoli (Reset o prima di una nuova raffica).
    function clearConfetti() {
        $("#confetti-layer").empty();
    }

    // Genera span animati da CSS; ogni pezzo si rimuove al termine dell’animazione (.one).
    function launchConfetti() {
        // Nessun coriandolo se l’utente ha chiesto meno movimento (accessibilità).
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            return;
        }
        var $layer = $("#confetti-layer");
        // Crea il layer una sola volta: fixed + pointer-events none sono in style.css.
        if (!$layer.length) {
            $layer = $("<div>", {
                id: "confetti-layer",
                class: "confetti-layer",
                "aria-hidden": "true"
            }).appendTo("body");
        }
        // Palette festa (rossi / arancio / bianco) coerente col tema Mozzafiato.
        var colors = [
            "#ff2e2e",
            "#ff5349",
            "#ff6b35",
            "#ffd166",
            "#fff3e0",
            "#c1121f",
            "#780000",
            "#ffffff",
            "#fb8500",
            "#e63946"
        ];
        var count = 110;
        var pieces = [];
        for (var i = 0; i < count; i++) {
            var w = 5 + Math.random() * 9;
            var thin = Math.random() > 0.55;
            // Proprietà inline + variabili CSS usate da @keyframes confetti-fall in style.css.
            var css = {
                width: w + "px",
                height: (thin ? w * 0.35 : w) + "px",
                left: Math.random() * 100 + "%",
                background: colors[Math.floor(Math.random() * colors.length)],
                "--confetti-drift": Math.round(Math.random() * 280 - 140) + "px",
                "--confetti-spin": Math.round(360 + Math.random() * 720) + "deg",
                animationDuration: 2.5 + Math.random() * 2 + "s",
                animationDelay: Math.random() * 0.4 + "s"
            };
            if (Math.random() > 0.45) {
                css.borderRadius = thin ? "2px" : "50%";
            }
            var $el = $("<span>", { class: "confetti-piece" }).css(css);
            $el.one("animationend", function () {
                $(this).remove();
            });
            pieces.push($el);
        }
        // append accetta un array di nodi jQuery: un solo reflow sul contenitore.
        $layer.append(pieces);
    }

    // Mozzafiato: body.theme-mozzafiato attiva il rosso in CSS + lancio coriandoli.
    $("#mozzafiatoButton").on("click", function () {
        $("body").addClass("theme-mozzafiato");
        launchConfetti();
    });

    // Reset: tema default e rimozione immediata dei coriandoli dal DOM.
    $("#resetButton").on("click", function () {
        $("body").removeClass("theme-mozzafiato");
        clearConfetti();
    });

    // Galleria: data-modal contiene l’id del <dialog> (es. modal-1); showModal è API nativa.
    $(".gallery__card[data-modal]").on("click", function () {
        var id = $(this).attr("data-modal");
        var dlg = id ? document.getElementById(id) : null;
        if (dlg && typeof dlg.showModal === "function") {
            dlg.showModal();
        }
    });

    // Pulsante × sulla lightbox: chiude solo il dialog che contiene il bottone.
    $("[data-close-modal]").on("click", function () {
        var dlg = $(this).closest("dialog").get(0);
        if (dlg && dlg.open) {
            dlg.close();
        }
    });

    // Click sullo sfondo del dialog (elemento dialog stesso): e.target === this evita chiusura su click interni.
    $("dialog.lightbox").on("click", function (e) {
        if (e.target === this) {
            this.close();
        }
    });
});
