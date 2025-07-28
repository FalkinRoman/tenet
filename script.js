document.addEventListener('DOMContentLoaded', () => {
  const loaderScreen = document.querySelector('.loader-screen');
  const container = document.querySelector('.container');
  const sloganBlock2 = document.querySelector('.main-slogan-block2');

  // === Модальное окно заявки ===
  const modal = document.getElementById('requestModal');
  const modalClose = document.getElementById('modalClose');
  const modalOverlayClose = document.getElementById('modalOverlayClose');
  const requestForm = document.getElementById('requestForm');
  const serviceCardContact = document.querySelector('.service-card-contact');
  
  // Находим все кнопки "Оставить заявку" (в шапке и в карточке)
  const headerChooseButton = document.querySelector('.header-actions .choose');
  const burgerChooseButton = document.querySelector('.burger-header-actions .choose');
  
  // Функция открытия модального окна
  function openModal() {
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }
  
  // Функция закрытия модального окна
  function closeModal() {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
  
  // Открытие модального окна при клике на карточку "Оставить заявку"
  if (serviceCardContact) {
    serviceCardContact.addEventListener('click', openModal);
  }
  
  // Открытие модального окна при клике на кнопку в шапке
  if (headerChooseButton) {
    headerChooseButton.addEventListener('click', openModal);
  }
  
  // Открытие модального окна при клике на кнопку в бургер-меню
  if (burgerChooseButton) {
    burgerChooseButton.addEventListener('click', openModal);
  }
  
  // Тестовая функция для проверки модального окна
  window.testModal = function() {
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    } else {
      console.error('Модальное окно не найдено в тесте!');
    }
  };
  
  // Закрытие модального окна при клике на крестик в модальном окне
  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }
  
  // Закрытие модального окна при клике на крестик на подложке
  if (modalOverlayClose) {
    modalOverlayClose.addEventListener('click', closeModal);
  }
  
  // Закрытие модального окна при клике на фон
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }
  
  // Закрытие модального окна при нажатии Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
  
  // Обработка отправки формы
  if (requestForm) {
    requestForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(requestForm);
      const data = {
        name: formData.get('name'),
        company: formData.get('company'),
        phone: formData.get('phone'),
        date: formData.get('date'),
        time: formData.get('time'),
        categories: formData.getAll('categories'),
        consent: formData.get('consent')
      };
      
      try {
        await sendToTelegram(data);
        showSuccessMessage();
        requestForm.reset();
        modal.classList.remove('active');
        document.body.style.overflow = '';
      } catch (error) {
        console.error('Ошибка отправки:', error);
        showErrorMessage();
      }
    });
  }

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
  let reasonsLocked = false;

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
    if (reasonsLocked) return; // если зафиксировано — не меняем!
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
  "НЕРЕЗУЛЬТАТИВНЫЕ ЧЕК - ЛИСТЫ", "CSI", "ОТСУТСТВИЕ СТАНДАРТОВ", "ТЕКУЧКА КАДРОВ",
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
  "НЕРЕЗУЛЬТАТИВНЫЕ ЧЕК - ЛИСТЫ", "CSI", "ОТСУТСТВИЕ СТАНДАРТОВ", "ТЕКУЧКА КАДРОВ",
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

document.addEventListener('DOMContentLoaded', function () {
  const main = document.querySelector('.how-solve-main');
  const bg = document.querySelector('.how-solve-circle-bg');
  const accent = document.querySelector('.how-solve-circle-accent');
  const texts = [
    document.querySelector('.how-solve-text-0'),
    document.querySelector('.how-solve-text-1'),
    document.querySelector('.how-solve-text-2'),
    document.querySelector('.how-solve-text-3'),
    document.querySelector('.how-solve-text-4')
  ];
  const steps = texts.length;
  const circleLen = 2 * Math.PI * 230; // 230 — радиус круга
  accent.setAttribute('stroke-dasharray', circleLen);
  accent.setAttribute('stroke-dashoffset', circleLen);

  function showAllTexts() {
    texts.forEach(t => t.classList.add('visible'));
  }

  function animateStep(step) {
    if (step < steps) {
      // Подсветить текущий текст (предыдущие остаются активными)
      texts[step].classList.add('active');
      // Нарисовать сегмент круга
      accent.style.strokeDashoffset = circleLen - circleLen / steps * (step + 1);
      setTimeout(() => animateStep(step + 1), 900);
    }
    // Всё, больше ничего не делаем — все активные остаются чёрными
  }

  // Появление по IntersectionObserver
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        main.style.opacity = 1;
        setTimeout(() => {
          bg.style.opacity = 1;
          setTimeout(() => {
            showAllTexts();
            setTimeout(() => animateStep(0), 700);
          }, 500);
        }, 400);
      }, 200);
      observer.disconnect();
    }
  }, { threshold: 0.3 });
  observer.observe(main);
});

// Fade-in/fade-out большого текста, по шагам строится пирамида
(function () {
  const pyramidSteps = [
    '<b>РОСТ</b> КОНВЕРСИИ',
    '<b>РОСТ</b> СРЕДНЕГО ЧЕКА',
    'БОЛЕЕ <b>БЫСТРАЯ</b> ВОРОНКА',
    '<b>ПРОЗРАЧНОСТЬ</b> ПРОЦЕССА ПРОДАЖ',
    '<b>СИЛЬНЫЕ</b> МЕНЕДЖЕРЫ И УПРАВЛЕНЦЫ'
  ];
  let hasAnimated = false;
  function createStep(text) {
    const div = document.createElement('div');
    div.className = 'result-pyramid-step';
    div.innerHTML = text;
    return div;
  }
  function createRow(stepEl) {
    const row = document.createElement('div');
    row.className = 'result-pyramid-row';
    row.appendChild(stepEl);
    return row;
  }
  function startFadePyramid() {
    if (hasAnimated) return;
    hasAnimated = true;
    const big = document.querySelector('.result-anim-big');
    const pyramid = document.querySelector('.result-pyramid');
    if (!big || !pyramid) return;
    big.innerHTML = '';
    big.className = 'result-anim-big';
    pyramid.innerHTML = '';
    let idx = 0;
    function showBig(text) {
      big.innerHTML = text;
      big.classList.remove('hide');
      big.classList.add('visible');
    }
    function hideBig(callback) {
      big.classList.remove('visible');
      big.classList.add('hide');
      setTimeout(() => {
        big.classList.remove('hide');
        if (callback) callback();
      }, 600);
    }
    function showStepInPyramid(text, idx) {
      const step = createStep(text);
      setTimeout(() => {
        const containerWidth = pyramid.offsetWidth;
        if (step.scrollWidth > containerWidth) {
          let fontSize = parseFloat(window.getComputedStyle(step).fontSize);
          while (step.scrollWidth > containerWidth && fontSize > 0.7 * 16) {
            fontSize -= 1;
            step.style.fontSize = fontSize + 'px';
          }
        }
        step.classList.add('visible');
        setTimeout(() => step.classList.add('pulse'), 250);
      }, 100);
      const row = createRow(step);
      pyramid.appendChild(row);
    }
    function next() {
      if (idx < pyramidSteps.length) {
        showBig(pyramidSteps[idx]);
        setTimeout(() => {
          hideBig(() => {
            setTimeout(() => {
              showStepInPyramid(pyramidSteps[idx], idx);
              idx++;
              setTimeout(next, 600);
            }, 400); // пауза между исчезновением большого текста и появлением элемента в пирамиде
          });
        }, 600);
      }
    }
    // Просто запускаем анимацию без верхней линии
    next();
  }

  // Сброс при загрузке
  const big = document.querySelector('.result-anim-big');
  const pyramid = document.querySelector('.result-pyramid');
  if (big) { big.innerHTML = ''; big.className = 'result-anim-big'; }
  if (pyramid) pyramid.innerHTML = '';

  // Запуск по скроллу
  const section = document.querySelector('.result-section');
  if (!section) return;
  const observer = new window.IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      setTimeout(() => {
        startFadePyramid();
        observer.disconnect();
      }, 400); // задержка в 400мс перед стартом всей анимации
    }
  }, { threshold: 0.3 });
  observer.observe(section);
})();

// GSAP ScrollTrigger (только если GSAP загружен)
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);

  const fadeReveal = document.querySelector('.fade-reveal-section');
  if (fadeReveal) {
    ScrollTrigger.create({
      trigger: ".result-section",
      start: "bottom center",
      end: "+=400",
      toggleClass: {targets: fadeReveal, className: 'active'},
      scrub: true,
      pin: false,
      anticipatePin: 1,
    });
  }
}

// Функция отправки данных в Telegram
async function sendToTelegram(data) {
  // Замените на ваш токен бота и ID чата
  const BOT_TOKEN = 'YOUR_BOT_TOKEN';
  const CHAT_ID = 'YOUR_CHAT_ID';
  
  const message = `
🆕 Новая заявка с сайта TENET

👤 Имя: ${data.name}
🏢 Компания: ${data.company}
📞 Телефон: ${data.phone}
📅 Дата: ${data.date}
⏰ Время: ${data.time}
📋 Категории: ${data.categories.join(', ') || 'Не выбрано'}
✅ Согласие: ${data.consent ? 'Да' : 'Нет'}

🕐 Время отправки: ${new Date().toLocaleString('ru-RU')}
  `.trim();
  
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: message,
      parse_mode: 'HTML'
    })
  });
  
  if (!response.ok) {
    throw new Error('Ошибка отправки в Telegram');
  }
  
  return response.json();
}

// Показ сообщения об успешной отправке
function showSuccessMessage() {
  const message = document.createElement('div');
  message.className = 'success-message';
  message.innerHTML = `
    <div class="success-content">
      <h3>✅ Заявка отправлена!</h3>
      <p>Мы свяжемся с вами в ближайшее время.</p>
    </div>
  `;
  
  document.body.appendChild(message);
  
  setTimeout(() => {
    message.classList.add('show');
  }, 100);
  
  setTimeout(() => {
    message.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(message);
    }, 300);
  }, 3000);
}

// Показ сообщения об ошибке
function showErrorMessage() {
  const message = document.createElement('div');
  message.className = 'error-message';
  message.innerHTML = `
    <div class="error-content">
      <h3>❌ Ошибка отправки</h3>
      <p>Попробуйте еще раз или свяжитесь с нами по телефону.</p>
    </div>
  `;
  
  document.body.appendChild(message);
  
  setTimeout(() => {
    message.classList.add('show');
  }, 100);
  
  setTimeout(() => {
    message.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(message);
    }, 300);
  }, 3000);
}

// === Универсальное модальное окно для категорий ===
let categoriesData = {
  "people": {
    "name": "Люди",
    "image": "assets/images/people.png",
    "quotes": [
      { "text": "Качество работы людей — это основа успеха любой организации.", "author": "Питер Друкер" },
      { "text": "Успех бизнеса зависит от качества людей, работающих в нем.", "author": "Джек Уэлч" },
      { "text": "Уделяйте внимание своим сотрудникам, и они будут уделять внимание вашим Клиентам.", "author": "Ричард Брэнсон" },
      { "text": "Собирая команду, вы должны помнить: самые большие активы Компании — это люди.", "author": "Генри Форд" },
      { "text": "Качество вашей команды определяет качество вашего бизнеса.", "author": "Том Питерс" },
      { "text": "Самые важные решения в бизнесе — это не те, что касаются стратегии или финансирования. Это те, что касаются людей.", "author": "Рэй Далио" },
      { "text": "Ваши люди — это ваш самый ценный актив. Инвестируйте в них.", "author": "Майкл Делл" },
      { "text": "Никто из нас не так умен, как все мы вместе.", "author": "Кен Бланшар" }
    ],
    "accordions": [
      {
        "title": "РАЗБОРЫ ПРОБЛЕМАТИК С КЛИЕНТАМИ НА РЕАЛЬНЫХ КЕЙСАХ",
        "content": "Привлекаем к команде и к решению реального времени, помогаем разбирать сложные ситуации с клиентами. Показываем команде **практические методики** работы. Команды получают поддержку и мотивацию на результат."
      },
      {
        "title": "ОБУЧЕНИЕ — ФОРМИРОВАНИЕ НАВЫКОВ ПРОДАЖ",
        "content": "Разрабатываем для вас **51 навык**, **41 авторское обучение** и **39 авторских компетенций**. Сотрудники проходят практическое обучение по собственным современным технологиям работы с клиентом, чтобы получать максимальный результат и увеличивать прибыль компании."
      },
      {
        "title": "ОБУЧЕНИЕ ТЕХНОЛОГИЯМ СЕРВИСА",
        "content": "Сотрудники проходят практическое обучение по собственным современным технологиям обслуживания, чтобы ваши сотрудники были уверены в достижении максимального результата и увеличении прибыли компании. Это способствует повышению их **профессионализма** и **уверенности**."
      },
      {
        "title": "СОПРОВОЖДЕНИЕ ПОСЛЕ ОБУЧЕНИЯ",
        "content": "Предоставляем поддержку сотрудникам после завершения обучения, помогаем внедрять новые знания на практике. Это гарантирует **устойчивые результаты** и закрепление полученных навыков."
      },
      {
        "title": "ПОДБОР ПРОФЕССИОНАЛОВ",
        "content": "Знаем **80% рынка недвижимости** и на базе анализа ваших потребностей подбираем профессионалов, которые окажут наибольшее влияние в вашу команду. Доверьтесь нашему опыту — мы гарантируем результат, который превзойдет ваши ожидания."
      },
      {
        "title": "ОПРОСЫ: ПЕРСОНАЛ, РУКОВОДСТВО",
        "content": "Проводим опросы удовлетворенности, лояльности сотрудников, чтобы получить **ценные инсайты** и восприятие вашего бизнеса со всех сторон. Результаты позволяют принимать обоснованные решения для улучшения сервиса."
      },
      {
        "title": "РАЗБОРЫ ПРОБЛЕМАТИК С МЕНЕДЖЕРАМИ НА РЕАЛЬНЫХ КЕЙСАХ",
        "content": "Привлекаем к команде руководителей и к решению реального времени, помогаем разбирать сложные ситуации с менеджерами, инструктируем и работаем на результат. Команды руководителей получают поддержку и мотивацию на результат."
      },
      {
        "title": "ОБУЧЕНИЕ — ФОРМИРОВАНИЕ УПРАВЛЕНЧЕСКИХ НАВЫКОВ",
        "content": "Наши обучения по формированию управленческих навыков позволяют вашей команде **развивать ключевые навыки** менеджмента для эффективного управления проектами и коллективом. Мы применяем современные методики и практические инструменты, чтобы **развивать навыки** для успешной работы в будущем. Создаем успешные управленческие команды, способные достигать амбициозных целей."
      },
      {
        "title": "АССЕССМЕНТ ПЕРСОНАЛА",
        "content": "Комплексный и глубокий анализ компетенций сотрудников, который позволяет выявить их **сильные стороны** и зоны для развития. Мы используем современные методики и инструменты, обеспечивая точность и объективность оценки. Позволяет найти, чтобы оптимизировать кадровые ресурсы вашей компании и создать команду, способную достигать выдающихся результатов."
      },
      {
        "title": "ИНДИВИДУАЛЬНЫЕ ПЛАНЫ РАЗВИТИЯ",
        "content": "Создаем персонализированные планы развития для сотрудников, учитывая их **сильные стороны** и области для улучшения. Это способствует росту их компетенций и повышению эффективности команды."
      },
      {
        "title": "МЕНТОРСТВО ПЕРСОНАЛА",
        "content": "Услуга находится в разработке, если вам это интересно — свяжитесь с нами любым из телеграм. Мы предоставляем наставников для персонала, которые помогают **развивать навыки** и повышать эффективность работы команды. Наставники создают сильных специалистов внутри вашей команды."
      },
      {
        "title": "МНОГОЕ ДРУГОЕ",
        "content": "Мы предлагаем широкий спектр дополнительных услуг: тренинги, коучинг, оценка персонала, внедрение новых инструментов и многое другое. Свяжитесь с нами, чтобы узнать больше о том, как мы можем помочь вашему бизнесу!"
      }
    ]
  },
  "quality": {
    "name": "Качество",
    "image": "assets/images/quality_big.png",
    "quotes": [
      { "text": "Качество — это не акт, это привычка.", "author": "Аристотель" },
      { "text": "Качество — это делать что-то правильно, даже когда никто не смотрит.", "author": "Генри Форд" },
      { "text": "Качество — это не то, что вы делаете, а то, кем вы являетесь.", "author": "Джим Рон" }
    ],
    "accordions": [
      {
        "title": "СТАНДАРТЫ КАЧЕСТВА",
        "content": "Разрабатываем и внедряем стандарты качества для всех процессов в вашей компании. Это обеспечивает единообразие и высокий уровень обслуживания клиентов."
      },
      {
        "title": "КОНТРОЛЬ КАЧЕСТВА",
        "content": "Внедряем системы контроля качества, которые позволяют отслеживать и улучшать все аспекты работы с клиентами."
      },
      {
        "title": "ОБУЧЕНИЕ КАЧЕСТВУ",
        "content": "Проводим обучение персонала принципам качества и стандартам обслуживания для обеспечения высокого уровня сервиса."
      }
    ]
  },
  "sales": {
    "name": "Продажи",
    "image": "assets/images/sales_big.png",
    "quotes": [
      { "text": "Продажи — это не просто транзакция, это отношения.", "author": "Дейл Карнеги" },
      { "text": "Лучшие продавцы — это лучшие слушатели.", "author": "Брайан Трейси" },
      { "text": "Продажи — это решение проблем клиента.", "author": "Зиг Зиглар" }
    ],
    "accordions": [
      {
        "title": "ТЕХНИКИ ПРОДАЖ",
        "content": "Обучаем современным техникам продаж, которые помогают закрывать больше сделок и увеличивать выручку."
      },
      {
        "title": "СКРИПТЫ ПРОДАЖ",
        "content": "Разрабатываем эффективные скрипты продаж, адаптированные под вашу отрасль и целевую аудиторию."
      },
      {
        "title": "УПРАВЛЕНИЕ ПРОДАЖАМИ",
        "content": "Внедряем системы управления продажами для отслеживания эффективности и планирования."
      }
    ]
  },
  "leaders": {
    "name": "Руководители",
    "image": "assets/images/leaders_big.png",
    "quotes": [
      { "text": "Лидерство — это влияние, а не власть.", "author": "Джон Максвелл" },
      { "text": "Хорошие лидеры создают последователей, великие лидеры создают лидеров.", "author": "Роберт Нойс" },
      { "text": "Лидерство — это искусство заставить людей делать то, что нужно.", "author": "Дуайт Эйзенхауэр" }
    ],
    "accordions": [
      {
        "title": "РАЗВИТИЕ ЛИДЕРСТВА",
        "content": "Развиваем лидерские качества у руководителей, помогаем стать эффективными лидерами команды."
      },
      {
        "title": "УПРАВЛЕНЧЕСКИЕ НАВЫКИ",
        "content": "Обучаем современным управленческим навыкам, необходимым для эффективного руководства."
      },
      {
        "title": "СТРАТЕГИЧЕСКОЕ МЫШЛЕНИЕ",
        "content": "Развиваем стратегическое мышление у руководителей для принятия правильных бизнес-решений."
      }
    ]
  },
  "unique": {
    "name": "Уникальные",
    "image": "assets/images/unique_big.png",
    "quotes": [
      { "text": "Уникальность — это ваше конкурентное преимущество.", "author": "Майкл Портер" },
      { "text": "Будьте уникальными, будьте незаменимыми.", "author": "Сет Годин" },
      { "text": "Уникальность создает ценность.", "author": "Питер Тиль" }
    ],
    "accordions": [
      {
        "title": "УНИКАЛЬНЫЕ РЕШЕНИЯ",
        "content": "Разрабатываем уникальные решения, адаптированные под специфику вашего бизнеса и рынка."
      },
      {
        "title": "ИННОВАЦИИ",
        "content": "Внедряем инновационные подходы и технологии для создания конкурентных преимуществ."
      },
      {
        "title": "ИНДИВИДУАЛЬНЫЙ ПОДХОД",
        "content": "Создаем индивидуальные стратегии развития, учитывающие особенности вашей компании."
      }
    ]
  }
};

let currentCategory = 'people'; // Default category

// Инициализация модального окна категорий
function initializeCategoryModal() {
    const categoryModal = document.getElementById('categoryModal');
    const categoryModalOverlayClose = document.getElementById('categoryModalOverlayClose');
    
    // Закрытие по клику на крестик на оверлее
    categoryModalOverlayClose.addEventListener('click', closeCategoryModal);
    
    // Закрытие по клику на оверлей
    categoryModal.addEventListener('click', function(e) {
        if (e.target === categoryModal) {
            closeCategoryModal();
        }
    });
    
    // Закрытие по Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && categoryModal.classList.contains('active')) {
            closeCategoryModal();
        }
    });
    
    // Обработчик для кнопки "Оставить заявку" в модалке категорий
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('submit-btn') && e.target.closest('.category-request-section')) {
            openRequestModalFromCategory();
        }
    });
    
    // Обработчики для карточек услуг
    document.addEventListener('click', function(e) {
        if (e.target.closest('.service-card') && !e.target.closest('.service-card-contact')) {
            const card = e.target.closest('.service-card');
            const category = card.getAttribute('data-category');
            if (category) {
                openCategoryModal(category);
            }
        }
    });
    
    // Обработчики для табов категорий
    document.addEventListener('click', function(e) {
        if (e.target.closest('.category-tab')) {
            const tab = e.target.closest('.category-tab');
            const category = tab.getAttribute('data-category');
            if (category) {
                displayCategory(category);
            }
        }
    });
    
    // Инициализация с первой категорией
    displayCategory('people');
}

// Получаем случайную цитату для категории
function getRandomQuote(category) {
  if (categoriesData[category] && categoriesData[category].quotes && categoriesData[category].quotes.length > 0) {
    const randomIndex = Math.floor(Math.random() * categoriesData[category].quotes.length);
    return categoriesData[category].quotes[randomIndex];
  }
  return null;
}

// Отображаем цитату
function displayQuote(category) {
  const quoteSection = document.querySelector('.category-quote-section');
  
  if (quoteSection && categoriesData[category] && categoriesData[category].quotes) {
    const randomQuote = getRandomQuote(category);
    
    if (randomQuote) {
      // Обрабатываем жирный текст в цитате
      const processedText = randomQuote.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      
      quoteSection.innerHTML = `
        <div class="category-quote-text">${processedText}</div>
        <div class="category-quote-author">— ${randomQuote.author}</div>
      `;
    }
  }
}

// Отображаем аккордеоны
function displayAccordions(category) {
  const accordionsContainer = document.querySelector('.category-accordions-container');
  
  if (accordionsContainer && categoriesData[category] && categoriesData[category].accordions) {
    accordionsContainer.innerHTML = '';
    
    categoriesData[category].accordions.forEach((accordion, index) => {
      // Обрабатываем жирный текст
      const processedContent = accordion.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      
      const accordionElement = document.createElement('div');
      accordionElement.className = 'category-accordion';
      accordionElement.innerHTML = `
        <div class="category-accordion-header">
          <div class="category-accordion-title">${accordion.title}</div>
          <div class="category-accordion-toggle"></div>
        </div>
        <div class="category-accordion-content">
          <div class="category-accordion-text">${processedContent}</div>
        </div>
      `;
      
      // Добавляем обработчик для аккордеона
      const header = accordionElement.querySelector('.category-accordion-header');
      const content = accordionElement.querySelector('.category-accordion-content');
      
      header.addEventListener('click', () => {
        // Закрываем все остальные аккордеоны
        document.querySelectorAll('.category-accordion').forEach(acc => {
          if (acc !== accordionElement) {
            acc.classList.remove('active');
          }
        });
        
        // Переключаем текущий аккордеон
        accordionElement.classList.toggle('active');
      });
      
      accordionsContainer.appendChild(accordionElement);
    });
  }
}

// Отображаем категорию (обновляем весь контент)
function displayCategory(category) {
  if (!categoriesData[category]) return;
  
  currentCategory = category;
  
  // Обновляем название категории
  const categoryName = document.querySelector('.category-name');
  if (categoryName) {
    categoryName.textContent = categoriesData[category].name || '';
  }
  
  // Обновляем изображение
  const categoryImage = document.querySelector('.category-image');
  if (categoryImage && categoriesData[category].image) {
    categoryImage.src = categoriesData[category].image;
    categoryImage.alt = categoriesData[category].name || '';
  }
  
  // Отображаем цитату
  displayQuote(category);
  
  // Отображаем аккордеоны
  displayAccordions(category);
  
  // Обновляем активную вкладку
  document.querySelectorAll('.category-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  
  const activeTab = document.querySelector(`.category-tab[data-category="${category}"]`);
  if (activeTab) {
    activeTab.classList.add('active');
  }
  renderCategoryTabs();
}

// Открываем модальное окно категории
function openCategoryModal(category = 'people') {
  const categoryModal = document.getElementById('categoryModal');
  
  if (categoryModal) {
    categoryModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Отображаем контент для выбранной категории
    if (categoriesData[category]) {
      displayCategory(category);
    }
  }
}

// Закрываем модальное окно категории
function closeCategoryModal() {
  const categoryModal = document.getElementById('categoryModal');
  
  if (categoryModal) {
    categoryModal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Рендер табов категорий
function renderCategoryTabs() {
  const tabsContainer = document.querySelector('.category-tabs');
  if (!tabsContainer) return;
  tabsContainer.innerHTML = '';
  const tabList = [
    { key: 'people', name: 'Люди', icon: 'assets/images/people.png' },
    { key: 'quality', name: 'Качество', icon: 'assets/images/quality.png' },
    { key: 'sales', name: 'Продажи', icon: 'assets/images/sales.png' },
    { key: 'leaders', name: 'Руководители', icon: 'assets/images/manadger.png' },
    { key: 'unique', name: 'Уникальные', icon: 'assets/images/unick.png' }
  ];
  tabList.forEach(tab => {
    const tabDiv = document.createElement('div');
    tabDiv.className = 'category-tab';
    tabDiv.dataset.category = tab.key;
    if (tab.key === currentCategory) tabDiv.classList.add('active');
    tabDiv.innerHTML = `
      <div class="category-tab-icon"><img src="${tab.icon}" alt="${tab.name}"></div>
      <div class="category-tab-name">${tab.name}</div>
    `;
    tabDiv.addEventListener('click', () => {
      displayCategory(tab.key);
    });
    tabsContainer.appendChild(tabDiv);
  });
}

// Инициализируем модалку сразу
initializeCategoryModal();
renderCategoryTabs();

function openRequestModalFromCategory() {
    closeCategoryModal();
    setTimeout(() => {
        openModal();
        // Предварительно выбираем категорию в форме
        setTimeout(() => {
            const categoryCheckboxes = document.querySelectorAll('.category-checkbox input[type="checkbox"]');
            categoryCheckboxes.forEach(checkbox => {
                checkbox.checked = false;
                checkbox.dispatchEvent(new Event('change'));
            });
            
            const categoryMapping = {
                'people': 'Люди',
                'quality': 'Качество', 
                'sales': 'Продажи',
                'leaders': 'Руководители',
                'unique': 'Уникальные'
            };
            
            const targetCategory = categoryMapping[currentCategory];
            if (targetCategory) {
                const targetCheckbox = document.querySelector(`input[value="${targetCategory}"]`);
                if (targetCheckbox) {
                    targetCheckbox.checked = true;
                    targetCheckbox.dispatchEvent(new Event('change'));
                }
            }
        }, 100);
    }, 300);
}