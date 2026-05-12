    (function () {
    "use strict";

    var navToggle = document.querySelector(".nav-toggle");
    var nav = document.getElementById("nav");
    var yearEl = document.getElementById("year");

    if (yearEl) {
        yearEl.textContent = String(new Date().getFullYear());
    }

    if (navToggle && nav) {
        navToggle.addEventListener("click", function () {
        var open = document.body.classList.toggle("nav-open");
        navToggle.setAttribute("aria-expanded", open ? "true" : "false");
        navToggle.setAttribute("aria-label", open ? "Chiudi menu" : "Apri menu");
        });

        nav.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
            document.body.classList.remove("nav-open");
            navToggle.setAttribute("aria-expanded", "false");
            navToggle.setAttribute("aria-label", "Apri menu");
        });
        });
    }

    /* Scroll reveal */
    var revealEls = document.querySelectorAll("[data-reveal]");
    if ("IntersectionObserver" in window && revealEls.length) {
        var io = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                io.unobserve(entry.target);
            }
            });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
        );
        revealEls.forEach(function (el) {
        io.observe(el);
        });
    } else {
        revealEls.forEach(function (el) {
        el.classList.add("is-visible");
        });
    }

    /* Count-up stats */
    function animateValue(el, target, duration) {
        var start = 0;
        var startTime = null;
        function step(ts) {
        if (!startTime) startTime = ts;
        var p = Math.min((ts - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = String(Math.round(start + (target - start) * eased));
        if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    var statValues = document.querySelectorAll(".stat__value[data-count]");
    if (statValues.length && "IntersectionObserver" in window) {
        var statsIo = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            var el = entry.target;
            var target = parseInt(el.getAttribute("data-count"), 10);
            if (!isNaN(target)) animateValue(el, target, 1400);
            statsIo.unobserve(el);
            });
        },
        { threshold: 0.4 }
        );
        statValues.forEach(function (el) {
        statsIo.observe(el);
        });
    }

    /* Card spotlight follow cursor */
    document.querySelectorAll(".card").forEach(function (card) {
        card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        var x = ((e.clientX - r.left) / r.width) * 100;
        var y = ((e.clientY - r.top) / r.height) * 100;
        card.style.setProperty("--mx", x + "%");
        card.style.setProperty("--my", y + "%");
        });
    });

    /* Respect reduced motion */
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    function applyMotionPrefs() {
        if (reduceMotion.matches) {
        document.documentElement.style.setProperty("--ease-out", "linear");
        var track = document.querySelector(".marquee__track");
        if (track) track.style.animation = "none";
        }
    }
    applyMotionPrefs();
    reduceMotion.addEventListener("change", applyMotionPrefs);
    })();
