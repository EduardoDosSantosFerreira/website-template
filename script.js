// ===== script.js =====
// JavaScript modular para template de comércio local

(function() {
    "use strict";

    // ----- VARIÁVEIS GLOBAIS (EDITÁVEIS) -----
    const CONFIG = {
        // NÚMERO WHATSAPP PADRÃO (ALTERE AQUI PARA MUDAR TODOS OS BOTÕES)
        whatsappNumber: "5511999999999", // com código do país, sem +
        // TEXTO PADRÃO PARA MENSAGEM (opcional)
        whatsappMessage: "Olá! Vi o site e gostaria de mais informações."
    };

    // ----- FUNÇÃO PARA ATUALIZAR TODOS OS LINKS WHATSAPP -----
    function updateWhatsappLinks() {
        const wppLinks = document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp.com"]');
        const baseUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(CONFIG.whatsappMessage)}`;
        
        wppLinks.forEach(link => {
            // Evita sobrescrever links manuais que já tenham parâmetros customizados
            if (!link.getAttribute('href').includes('wa.me') || link.getAttribute('data-custom') === 'true') return;
            link.setAttribute('href', baseUrl);
        });
    }

    // ----- MENU MOBILE -----
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            // Alternar ícone
            const icon = menuToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Fechar menu ao clicar em um link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });

        // Fechar ao clicar fora (opcional)
        document.addEventListener('click', (event) => {
            if (!navMenu.contains(event.target) && !menuToggle.contains(event.target) && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // ----- EFEITO NA NAVBAR AO ROLAR (SCROLL) -----
    const navbar = document.getElementById('navbar');
    function handleNavbarScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    window.addEventListener('scroll', handleNavbarScroll);
    handleNavbarScroll(); // executa uma vez ao carregar

    // ----- SCROLL SUAVE (com offset para navbar fixa) -----
    function initSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]:not([href="#"])');
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const navbarHeight = document.getElementById('navbar')?.offsetHeight || 80;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navbarHeight;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ----- ANIMAÇÃO LEVE AO APARECER NA TELA (intersection observer) -----
    function initScrollReveal() {
        const elements = document.querySelectorAll('.service-card, .testimonial-card, .diff-item, .about-grid > *');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target); // para de observar após aparecer
                }
            });
        }, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' });

        elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(25px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    // ----- ATUALIZAR WHATSAPP LINKS COM BASE NA CONFIG -----
    function fixWhatsappNumbers() {
        // Seleciona todos os elementos que possuem href com wa.me (navbar, hero, cta, float etc.)
        const wppAnchors = document.querySelectorAll('a[href*="wa.me"]');
        const customMessage = encodeURIComponent(CONFIG.whatsappMessage);
        wppAnchors.forEach(anchor => {
            // Se já tem número diferente, preserva? Por padrão substituímos.
            // Mas se quiser manter algum específico, use data-attribute.
            if (anchor.classList.contains('keep-number')) return;
            
            let baseHref = `https://wa.me/${CONFIG.whatsappNumber}`;
            // Se já existe ?text=, adiciona mensagem padrão somente se não houver
            if (anchor.href.includes('?text=')) {
                // mantém a mensagem original (pode ser customizada no HTML)
            } else {
                baseHref += `?text=${customMessage}`;
            }
            anchor.setAttribute('href', baseHref);
        });
    }

    // ----- INICIALIZAÇÃO -----
    document.addEventListener('DOMContentLoaded', () => {
        initSmoothScroll();
        initScrollReveal();
        fixWhatsappNumbers(); // garante que todos os números sigam a CONFIG
        updateWhatsappLinks(); // função adicional para segurança

        // Se houver mais de um número com custom, é só ajustar manualmente no HTML
        // Exemplo: <a href="https://wa.me/5511988887777?text=Oi" data-custom="true">
    });

    // Reaplica o número do WhatsApp no botão flutuante caso ele exista
    // Também previne que o número seja sobrescrito indevidamente
    const wppFloat = document.getElementById('wppFloat');
    if (wppFloat) {
        wppFloat.addEventListener('click', (e) => {
            // o href já foi atualizado no DOMContentLoaded
        });
    }

    // Expor configuração globalmente se quiser editar via console (opcional)
    window.COMERCIO_TEMPLATE_CONFIG = CONFIG;
})();