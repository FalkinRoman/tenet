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
    if (h1) {
        h1.addEventListener('click', () => {
            alert('Привет! Вы кликнули на заголовок!');
        });
    }
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
    const menu = overlay.querySelector('.burger-menu');
    const socials = overlay.querySelector('.burger-socials');
    const drop = document.getElementById('burgerDrop');

    if (burger && overlay && closeBtn && menu && socials && drop) {
        burger.addEventListener('click', () => {
            // 1. Показать падающую плашку
            drop.classList.add('active');

            // 2. Убрать плашку и показать бургер-меню
            setTimeout(() => {
                drop.classList.remove('active');
                drop.classList.add('hide');
                overlay.classList.add('open');
                document.body.style.overflow = 'hidden';

                // Сбросить анимации меню и соцсетей
                menu.classList.remove('visible');
                socials.classList.remove('visible');

                // Появление меню снизу
                setTimeout(() => {
                    menu.classList.add('visible');
                }, 200);

                // Появление соцсетей справа
                setTimeout(() => {
                    socials.classList.add('visible');
                }, 600);

                // 3. Сбросить drop через 300мс (чтобы можно было повторно открыть)
                setTimeout(() => {
                    drop.classList.remove('hide');
                }, 300);
            }, 220); // время падения + пауза
        });

        closeBtn.addEventListener('click', () => {
            overlay.classList.remove('open');
            document.body.style.overflow = 'auto';
            menu.classList.remove('visible');
            socials.classList.remove('visible');
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                overlay.classList.remove('open');
                document.body.style.overflow = 'auto';
                menu.classList.remove('visible');
                socials.classList.remove('visible');
            }
        });

        overlay.querySelectorAll('.burger-menu a').forEach(a => {
            a.addEventListener('click', () => {
                overlay.classList.remove('open');
                document.body.style.overflow = 'auto';
                menu.classList.remove('visible');
                socials.classList.remove('visible');
            });
        });
    }
});



// Типизируем текст машинка
document.addEventListener('DOMContentLoaded', function() {
    new Typed('#typewriter', {
      strings: ['рынка недвижимости'],
      typeSpeed: 150,
      backSpeed: 80,
      backDelay: 1200,
      startDelay: 200,
      loop: true,
      showCursor: true,
      cursorChar: '|'
    });
  });

// Анимация появления и счётчик для блока "Мы в цифрах"
(function() {
  function animateStatsBlock() {
    const stats = document.querySelectorAll('.stats-grid .stat-cell');
    if (!stats.length) return;
    const options = { threshold: 0.3 };
    const observer = new window.IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Анимация цифр
          const num = entry.target.querySelector('.stat-number');
          if (num && !num.classList.contains('counted')) {
            const target = parseInt(num.getAttribute('data-target'), 10);
            animateNumber(num, target);
            num.classList.add('counted');
          }
          obs.unobserve(entry.target);
        }
      });
    }, options);
    stats.forEach(stat => observer.observe(stat));
  }
  function animateNumber(el, target) {
    let start = 0;
    let duration = 900 + Math.random() * 600;
    let startTime = null;
    function step(ts) {
      if (!startTime) startTime = ts;
      let progress = Math.min((ts - startTime) / duration, 1);
      let val = Math.floor(progress * (target - start) + start);
      el.textContent = val;
      // Если есть % рядом, не затираем его
      if (el.nextElementSibling && el.nextElementSibling.classList.contains('stat-percent')) {
        el.textContent = val;
        el.nextElementSibling.style.display = 'inline-block';
      }
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
        if (el.nextElementSibling && el.nextElementSibling.classList.contains('stat-percent')) {
          el.nextElementSibling.style.display = 'inline-block';
        }
      }
    }
    requestAnimationFrame(step);
  }
  document.addEventListener('DOMContentLoaded', animateStatsBlock);
})();




// Блок "Мы в цифрах"
const statCells = document.querySelectorAll('.stat-cell');
const infoData = [
  {title: 'Опыт', desc: '22 года на рынке недвижимости — это не просто цифра, а гарантия стабильности.'},
  {title: 'Команда', desc: '50 сотрудников с опытом продаж — каждый эксперт в своём деле.'},
  {title: 'Компетенции', desc: '39 авторских компетенций — уникальные решения для рынка.'},
  {title: 'Навыки', desc: '51 навык — результат постоянного развития и обучения.'},
  {title: 'Корреляция', desc: '78% — показатель эффективности нашей методологии.'},
  {title: 'Тренинг', desc: '41 авторский тренинг — эксклюзив для рынка недвижимости.'},
  {title: 'Проекты', desc: '67 индивидуальных проектов с партнёрами — гибкость и персонализация.'},
  {title: 'Обучение', desc: '1160 специалистов обучено в год — мы делимся опытом.'}
];

function handleHover(e) {
  if (window.innerWidth < 1200) return;
  const hovered = e.currentTarget;
  const idx = parseInt(hovered.dataset.info, 10);
  statCells.forEach((cell, i) => {
    cell.classList.remove('bottom-row');
    if (cell === hovered) {
      cell.classList.add('active');
      cell.classList.remove('faded');
      // popup
      let popup = cell.querySelector('.stat-info-popup');
      if (!popup) {
        popup = document.createElement('div');
        popup.className = 'stat-info-popup';
        popup.innerHTML = `<div style="font-weight:700;font-size:1.1em;margin-bottom:8px;">${infoData[idx].title}</div>
        <div style="font-weight:400;font-size:0.98em;line-height:1.4;">${infoData[idx].desc}</div>`;
        cell.appendChild(popup);
      }
      // Определяем нижний ряд (4 колонки)
      if (window.innerWidth >= 1200 && idx >= 4) {
        cell.classList.add('bottom-row');
      }
      // Для адаптива (2 колонки)
      if (window.innerWidth < 1200 && idx >= 6) {
        cell.classList.add('bottom-row');
      }
    } else {
      cell.classList.remove('active', 'bottom-row');
      cell.classList.add('faded');
      let popup = cell.querySelector('.stat-info-popup');
      if (popup) popup.remove();
    }
  });
}
function handleLeave() {
  statCells.forEach(cell => {
    cell.classList.remove('faded', 'active');
    let popup = cell.querySelector('.stat-info-popup');
    if (popup) popup.remove();
  });
}

statCells.forEach(cell => {
  cell.addEventListener('mouseenter', handleHover);
  cell.addEventListener('mouseleave', handleLeave);
});
window.addEventListener('resize', handleLeave);




// Анимация появления текстов в "Принципы"
document.addEventListener('DOMContentLoaded', () => {
  const first = document.querySelector('.principles-text-block.first-text');
  const second = document.querySelector('.principles-text-block.second-text');
  if (!first || !second) return;
  first.style.opacity = 0;
  first.style.transform = 'translateY(60px)';
  second.style.opacity = 0;
  second.style.transform = 'translateX(80px)';
  function showTexts() {
    const rect = first.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.7) {
      first.style.opacity = 1;
      first.style.transform = 'translateY(0)';
      setTimeout(() => {
        second.style.opacity = 1;
        second.style.transform = 'translateX(0)';
      }, 900);
      window.removeEventListener('scroll', showTexts);
    }
  }
  window.addEventListener('scroll', showTexts);
  showTexts();
});

// Анимация появления венн-диаграммы по этапам
document.addEventListener('DOMContentLoaded', function() {
  const block = document.querySelector('.venn-animated-block');
  if (!block) return;
  const svg = block.querySelector('.venn-svg');
  const circles = svg.querySelectorAll('.venn-circle');
  const texts = svg.querySelectorAll('.venn-text');

  function animateVenn() {
    const rect = block.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.8) {
      setTimeout(() => {
        // 1. Главный круг + результат
        circles[3].classList.add('visible'); // main (он 4-й по счёту)
        setTimeout(() => texts[0].classList.add('visible'), 200); // РЕЗУЛЬТАТ

        // 2. Малые круги одновременно
        setTimeout(() => {
          circles[2].classList.add('visible'); // top
          circles[0].classList.add('visible'); // left
          circles[1].classList.add('visible'); // right
        }, 700);

        // 3. Крупные подписи одновременно
        setTimeout(() => {
          texts[1].classList.add('visible');
          texts[2].classList.add('visible');
          texts[3].classList.add('visible');
        }, 1300);

        // 4. Мелкие подписи одновременно
        setTimeout(() => {
          texts[4].classList.add('visible');
          texts[5].classList.add('visible');
          texts[6].classList.add('visible');
        }, 1700);

        window.removeEventListener('scroll', animateVenn);
      }, 900);
    }
  }
  window.addEventListener('scroll', animateVenn);
  animateVenn();
});

document.addEventListener('DOMContentLoaded', function() {
  const textBlock = document.querySelector('.venn-text-block');
  if (!textBlock) return;

  function showTextBlockOnScroll() {
    const rect = textBlock.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85) {
      if (window.innerWidth <= 1100) {
        setTimeout(() => {
          textBlock.classList.add('visible');
        }, 900); // задержка 900мс, как у других блоков
      } else {
        textBlock.classList.add('visible');
      }
      window.removeEventListener('scroll', showTextBlockOnScroll);
    }
  }

  window.addEventListener('scroll', showTextBlockOnScroll);
  showTextBlockOnScroll();
});


