document.addEventListener('DOMContentLoaded', () => {
    const loaderScreen = document.querySelector('.loader-screen');
    const container = document.querySelector('.container');
    
    // Ждем завершения всех анимаций лоадера (2.4 секунды)
    setTimeout(() => {
        // Сначала начинаем исчезать элементы лоадера
        loaderScreen.classList.add('hide');
        
        // После того как лоадер начал скрываться, показываем контент
        setTimeout(() => {
            container.classList.add('visible');
            // Сброс скролла после появления контента
            window.scrollTo(0, 0);
            if (window.location.hash) {
                window.location.hash = '';
            }
        }, 200);
    }, 2400);
    
    // Обработчик клика на заголовок
    const h1 = document.querySelector('.container h1');
    h1.addEventListener('click', () => {
        alert('Привет! Вы кликнули на заголовок!');
    });
});

window.onbeforeunload = function () {
  window.scrollTo(0, 0);
};

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
} 




// Этот код отвечает за отображение и управление поведением липкого подменю, которое появляется при прокрутке страницы и подсвечивает активный пункт меню в зависимости от текущей секции.
document.addEventListener('DOMContentLoaded', () => {
    const origMenu = document.querySelector('.main-menu-block');
    const stickyMenu = document.querySelector('.sticky-submenu');
    const origMenuRect = () => origMenu.getBoundingClientRect().bottom;

    function onScroll() {
        if (origMenuRect() <= 80) { // 80 — высота хедера
            stickyMenu.style.display = 'flex';
        } else {
            stickyMenu.style.display = 'none';
        }
    }
    window.addEventListener('scroll', onScroll);

    // Подсветка активного пункта по якорю
    const sections = ['about','principles','services','results','advantages','team'];
    function setActiveMenu() {
        const header = document.querySelector('.main-header');
        const submenu = document.querySelector('.sticky-submenu');
        const headerHeight = header ? header.offsetHeight : 0;
        const submenuHeight = submenu ? submenu.offsetHeight : 0;
        const offset = headerHeight + submenuHeight;

        let found = false;
        for (let id of sections) {
            const el = document.getElementById(id);
            if (el && window.scrollY + offset + 1 >= el.offsetTop) {
                stickyMenu.querySelectorAll('li').forEach(li => li.classList.remove('active'));
                const link = stickyMenu.querySelector(`a[href="#${id}"]`);
                if (link) link.parentElement.classList.add('active');
                found = true;
            }
        }
        if (!found) stickyMenu.querySelectorAll('li').forEach(li => li.classList.remove('active'));
    }
    window.addEventListener('scroll', setActiveMenu);
    stickyMenu.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', e => {
            setTimeout(setActiveMenu, 300);
        });
    });
});


// Обрабатываем все ссылки, начинающиеся с "#", добавляя обработчик клика
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
      // Получаем ID целевого элемента из атрибута href
      const targetId = this.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        // Предотвращаем стандартное поведение ссылки
        e.preventDefault();
        // Получаем высоту хедера и подменю
        const header = document.querySelector('.main-header');
        const submenu = document.querySelector('.sticky-submenu');
        const headerHeight = header ? header.offsetHeight : 0;
        const submenuHeight = submenu ? submenu.offsetHeight : 0;
        // Рассчитываем смещение для плавного скролла
        const offset = headerHeight + submenuHeight;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        // Плавно скроллим к целевому элементу
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

// Затемнение других li при наведении на один (только для .main-menu.new-menu)
document.addEventListener('DOMContentLoaded', () => {
    const menu = document.querySelector('.main-menu.new-menu');
    if (menu) {
        const items = menu.querySelectorAll('li');
        items.forEach(li => {
            li.addEventListener('mouseenter', () => {
                items.forEach(other => {
                    if (other !== li) other.style.opacity = '0.3';
                    else other.style.opacity = '1';
                });
            });
            li.addEventListener('mouseleave', () => {
                items.forEach(other => {
                    other.style.opacity = '1';
                });
            });
        });
    }
});



// Плавный скролл к якорю
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        const header = document.querySelector('.main-header');
        const submenu = document.querySelector('.sticky-submenu');
        // Всегда учитываем обе высоты, даже если подменю скрыто (оно появится при скролле)
        const headerHeight = header ? header.offsetHeight : 0;
        const submenuHeight = submenu ? submenu.offsetHeight : 0;
        const offset = headerHeight + submenuHeight;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


// Бургер меню
document.addEventListener('DOMContentLoaded', () => {
    const burger = document.querySelector('.burger-img');
    const overlay = document.getElementById('burgerOverlay');
    const closeBtn = document.getElementById('burgerClose');
    const drop = document.getElementById('burgerDrop');
    if (burger && overlay && closeBtn && drop) {
        burger.addEventListener('click', () => {
            // 1. Показать падающий div
            drop.classList.add('active');
            setTimeout(() => {
                // 2. Убрать падающий div
                drop.classList.remove('active');
                drop.classList.add('hide');
                // 3. Показать бургер-экран
                overlay.classList.add('open');
                document.body.style.overflow = 'hidden';
                // 4. Сбросить drop через 300мс (чтобы можно было повторно открыть)
                setTimeout(() => {
                    drop.classList.remove('hide');
                }, 300);
            }, 220); // время падения + пауза
        });
        closeBtn.addEventListener('click', () => {
            overlay.classList.remove('open');
            document.body.style.overflow = 'auto';
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                overlay.classList.remove('open');
                document.body.style.overflow = 'auto';
            }
        });
        overlay.querySelectorAll('.burger-menu a').forEach(a => {
            a.addEventListener('click', () => {
                overlay.classList.remove('open');
                document.body.style.overflow = 'auto';
            });
        });
    }
});