document.addEventListener('DOMContentLoaded', () => {
  const loaderScreen = document.querySelector('.loader-screen');
  const container = document.querySelector('.container');
  const sloganBlock2 = document.querySelector('.main-slogan-block2');

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

      // Запускаем анимацию второго блока через 2 секунды после скрытия лоадера
      setTimeout(() => {
        if (sloganBlock2) {
          sloganBlock2.classList.add('visible');
        }
      }, 5000);
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
  const sections = ['about', 'principles', 'services', 'results', 'advantages', 'team'];
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
  link.addEventListener('click', function (e) {
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
  link.addEventListener('click', function (e) {
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



// Анимация появления и счётчик для блока "Мы в цифрах"
(function () {
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
  { title: 'Опыт', desc: '22 года на рынке недвижимости — это не просто цифра, а гарантия стабильности.' },
  { title: 'Команда', desc: '50 сотрудников с опытом продаж — каждый эксперт в своём деле.' },
  { title: 'Компетенции', desc: '39 авторских компетенций — уникальные решения для рынка.' },
  { title: 'Навыки', desc: '51 навык — результат постоянного развития и обучения.' },
  { title: 'Корреляция', desc: '78% — показатель эффективности нашей методологии.' },
  { title: 'Тренинг', desc: '41 авторский тренинг — эксклюзив для рынка недвижимости.' },
  { title: 'Проекты', desc: '67 индивидуальных проектов с партнёрами — гибкость и персонализация.' },
  { title: 'Обучение', desc: '1160 специалистов обучено в год — мы делимся опытом.' }
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
        // Добавляем класс в зависимости от позиции
        if ([2, 3, 6, 7].includes(idx)) { // индексы 3,4,7,8 (правые элементы)
          popup.classList.add('right-side');
        } else { // индексы 1,2,5,6 (левые элементы)
          popup.classList.add('left-side');
        }
        popup.innerHTML = `<div style="font-weight:700;font-size:1.1em;margin-bottom:8px;">${infoData[idx].title}</div>
        <div style="font-weight:400;font-size:0.98em;line-height:1.4;">${infoData[idx].desc}</div>`;
        cell.appendChild(popup);
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
document.addEventListener('DOMContentLoaded', function () {
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

document.addEventListener('DOMContentLoaded', function () {
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

document.addEventListener('DOMContentLoaded', function () {
  const missionTextBlock = document.querySelector('.mission-text-block');
  if (!missionTextBlock) return;

  function showMissionTextOnScroll() {
    const rect = missionTextBlock.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85) {
      if (window.innerWidth <= 1100) {
        setTimeout(() => {
          missionTextBlock.classList.add('visible');
        }, 900);
      } else {
        missionTextBlock.classList.add('visible');
      }
      window.removeEventListener('scroll', showMissionTextOnScroll);
    }
  }

  window.addEventListener('scroll', showMissionTextOnScroll);
  showMissionTextOnScroll();
});

// Анимация появления слогана при скролле (только для первого блока)
const sloganBlock = document.querySelector('.main-slogan-block');
const sloganObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, 500);
      sloganObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.2
});

if (sloganBlock) {
  sloganObserver.observe(sloganBlock);
}

document.addEventListener('DOMContentLoaded', () => {
  const sloganBlock3 = document.querySelector('.main-slogan-block3');
  if (!sloganBlock3) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, 500);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  observer.observe(sloganBlock3);
});

document.addEventListener('DOMContentLoaded', function () {
  const valuesTextBlock = document.querySelector('.values-text-block');
  if (!valuesTextBlock) return;

  function showValuesTextOnScroll() {
    const rect = valuesTextBlock.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85) {
      if (window.innerWidth <= 1100) {
        setTimeout(() => {
          valuesTextBlock.classList.add('visible');
        }, 900);
      } else {
        valuesTextBlock.classList.add('visible');
      }
      window.removeEventListener('scroll', showValuesTextOnScroll);
    }
  }

  window.addEventListener('scroll', showValuesTextOnScroll);
  showValuesTextOnScroll();
});

document.addEventListener('DOMContentLoaded', () => {
  const stickyMenu = document.querySelector('.sticky-submenu .sticky-menu');
  if (stickyMenu) {
    const items = stickyMenu.querySelectorAll('li');
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

document.addEventListener('DOMContentLoaded', function () {
  if (window.innerWidth > 1100) {
    new Rellax('.mission-img[data-rellax-speed], .values-img[data-rellax-speed]', {
      center: true,
      wrapper: null,
      round: true,
      vertical: true,
      horizontal: false
    });
  }
});

// === Problems Section Logic ===
(function () {
  const reasonsCount = document.querySelectorAll('.problems-reasons-list span').length;
  const problems = document.querySelectorAll('.problems-choice');
  let interval = null;
  let userSelected = false;
  let progressDuration = 3000;

  function getRandomIndexes(count, total) {
    const arr = [];
    while (arr.length < count) {
      const idx = Math.floor(Math.random() * total);
      if (!arr.includes(idx)) arr.push(idx);
    }
    return arr;
  }

  function setActiveTask(idx) {
    problems.forEach((el, i) => {
      el.classList.toggle('active', i === idx);
    });
    setActiveReasonsRandom();
  }

  function setActiveReasonsRandom() {
    const allReasons = document.querySelectorAll('.problems-reasons-list span');
    let count;
    if (window.innerWidth < 900) {
      count = 4;
    } else {
      count = 6;
    }
    const total = allReasons.length;
    const activeIdxs = getRandomIndexes(count, total);
    allReasons.forEach((el, i) => {
      if (activeIdxs.includes(i)) el.classList.add('problems-reason-active');
      else el.classList.remove('problems-reason-active');
    });
  }

  function autoSwitch() {
    if (userSelected) return;
    const idx = Math.floor(Math.random() * problems.length);
    setActiveTask(idx);
  }

  function startAuto() {
    interval = setInterval(autoSwitch, progressDuration);
    autoSwitch();
  }

  function stopAuto() {
    if (interval) clearInterval(interval);
    interval = null;
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (!problems.length) return;
    startAuto();
    problems.forEach((el, i) => {
      el.addEventListener('click', () => {
        userSelected = true;
        stopAuto();
        setActiveTask(i);
      });
    });
    window.addEventListener('resize', () => {
      setActiveReasonsRandom();
    });
  });
})();










document.addEventListener('DOMContentLoaded', function () {
  const section = document.querySelector('.problems-section');
  const strike = document.querySelector('.problems-strike');
  const line = document.querySelector('.problems-strike .strike-line');
  const slide = document.querySelector('.problems-slide');
  if (!section || !strike || !line || !slide) return;

  let animated = false;
  const observer = new window.IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        // 1. Анимация линии перечёркивания
        strike.classList.add('strike-animate');
        // 2. После анимации линии — делаем слово бледным
        setTimeout(() => {
          strike.classList.add('strike-fade');
          // 3. После этого появляется "задачи" и сдвигает "наших партнеров"
          setTimeout(() => {
            slide.classList.add('slide-animate');
          }, 600);
        }, 900); // линия 0.7s + пауза
        obs.unobserve(section);
      }
    });
  }, { threshold: 0.3 });
  observer.observe(section);
});

const allReasons = [
  "РЕРЕЗУЛЬТАТИВНЫЕ ЧЕК - ЛИСТЫ", "CSI", "ОТСУТСТВИЕ СТАНДАРТОВ", "ТЕКУЧКА КАДРОВ",
  "ВОЗВРАТ КЛИЕНТОВ В ВОРОНКУ", "ОТСУТСВИЕ РАБОТЫ С ВОЗРАЖЕНИЯМИ", "НЕЭФФЕКТИВНЫЕ МЕТОДЫ", "NPS",
  "НИЗКОЕ КАЧЕСТВО ПЕРСОНАЛА", "НИЗКОЕ КАЧЕСТВО УПРАВЛЕНИЯ", "ОТСУТСТВИЕ АНАЛИЗА ВЛИЯНИЯ НА РЕЗУЛЬТАТ",
  "НЕТ ЗАПИСИ ВСТРЕЧ", "ОТСУТСТВИЕ МЕТОДОЛОГИИ", "НЕХВАТКА МОТИВАЦИИ", "НЕ ОПРЕДЕЛЕНА «ТЕМПЕРАТУРА» КЛИЕНТА",
  "МНОГО СОМНЕВАЮЩИХСЯ КЛИЕНТОВ", "CSAT", "ПРОБЛЕМЫ С АДАПТАЦИЕЙ НОВЫХ СОТРУДНИКОВ", "НЕХВАТКА НАВЫКОВ ПЕРСОНАЛА",
  "ОТСУТСТВИЕ АНАЛИЗА ВЛИЯНИЯ НА РЕЗУЛЬТАТ", "НЕХВАТКА ИНСТРУМЕНТОВ И ПЕРСОНАЛА", "ОТСУТСТВИЕ ОБРАТНОЙ СВЯЗИ",
  "НЕЯСНЫЕ ПОТРЕБНОСТИ КЛИЕНТОВ", "НЕТ ЗАПИСИ ЗВОНКОВ", "ТАЙНЫЙ ПОКУПАТЕЛЬ", "РАЗНЫЙ УРОВЕНЬ ПЕРСОНАЛА",
  "НЕХВАТКА НАВЫКОВ ПРОДАВЦОВ", "ОТСУТСТВИЕ РАБОТЫ С ЖАЛОБАМИ И РЕКОМЕНДАЦИЯМИ", "СЛАБАЯ ВОВЛЕЧЕННОСТЬ",
  "ВЫГОРАНИЕ", "КОММУНИКАЦИЯ", "НЕХВАТКА РЕСУРСОВ ДЛЯ ОБУЧЕНИЯ И РАЗВИТИЯ", "НАРУШЕНЫ БИЗНЕС ПРОЦЕССЫ"
];

// 16 наиболее релевантных для мобилы/планшета (выбери любые, вот пример)
const mobileReasons = [
  "ЕРЕЗУЛЬТАТИВНЫЕ ЧЕК - ЛИСТЫ", "CSI", "ОТСУТСТВИЕ СТАНДАРТОВ", "ТЕКУЧКА КАДРОВ",
  "ВОЗВРАТ КЛИЕНТОВ В ВОРОНКУ", "ОТСУТСВИЕ РАБОТЫ С ВОЗРАЖЕНИЯМИ", "НЕЭФФЕКТИВНЫЕ МЕТОДЫ", "NPS",
  "НИЗКОЕ КАЧЕСТВО ПЕРСОНАЛА", "ОТСУТСТВИЕ АНАЛИЗА ВЛИЯНИЯ НА РЕЗУЛЬТАТ", "НЕХВАТКА МОТИВАЦИИ",
  "МНОГО СОМНЕВАЮЩИХСЯ КЛИЕНТОВ", "CSAT", "ПРОБЛЕМЫ С АДАПТАЦИЕЙ НОВЫХ СОТРУДНИКОВ",
  "НЕХВАТКА НАВЫКОВ ПЕРСОНАЛА", "ВЫГОРАНИЕ"
];

function getCurrentReasons() {
  if (window.innerWidth < 900) return mobileReasons;
  return allReasons;
}

function renderReasons() {
  const reasonsList = document.querySelector('.problems-reasons-list');
  if (!reasonsList) return;
  reasonsList.innerHTML = '';
  getCurrentReasons().forEach(reason => {
    const span = document.createElement('span');
    span.textContent = reason;
    reasonsList.appendChild(span);
  });
}

// Вызови при загрузке и ресайзе:
window.addEventListener('DOMContentLoaded', renderReasons);
window.addEventListener('resize', renderReasons);

document.addEventListener('DOMContentLoaded', function () {
  const block = document.querySelector('.bottom-problems-block');
  const strike = block.querySelector('.bottom-strike');
  const line = block.querySelector('.bottom-strike-line');
  const slide = block.querySelector('.bottom-slide');
  const partners = block.querySelector('.bottom-partners-text');
  if (!block || !strike || !line || !slide || !partners) return;

  let animated = false;
  const observer = new window.IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        // 1. Анимация линии перечёркивания
        strike.classList.add('strike-animate');
        // 2. После анимации линии — делаем слово бледным
        setTimeout(() => {
          strike.classList.add('strike-fade');
          // 3. После этого появляется "задачи"
          setTimeout(() => {
            slide.classList.add('slide-animate');
          }, 600);
        }, 900);
        obs.unobserve(block);
      }
    });
  }, { threshold: 0.3 });
  observer.observe(block);
});