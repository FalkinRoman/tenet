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
  
  // === Модальное окно категорий ===
  const categoryModal = document.getElementById('categoryModal');
  const categoryModalClose = document.getElementById('categoryModalClose');
  const categoryModalOverlayClose = document.getElementById('categoryModalOverlayClose');
  
  // Переменная для отслеживания источника открытия модального окна заявки
  let requestModalSource = null; // 'header', 'category', или null
  
  // Находим все кнопки "Оставить заявку" (в шапке и в карточке)
  const headerChooseButton = document.querySelector('.header-actions .choose');
  const burgerChooseButton = document.querySelector('.burger-header-actions .choose');
  
  // Функция открытия модального окна
  window.openModal = function(source = 'header') {
    if (modal) {
      requestModalSource = source;
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      
      // Очищаем все чекбоксы при открытии модального окна
      setTimeout(() => {
        const categoryCheckboxes = document.querySelectorAll('.category-checkbox input[type="checkbox"]');
        categoryCheckboxes.forEach(checkbox => {
          checkbox.checked = false;
          checkbox.dispatchEvent(new Event('change'));
        });
      }, 100);
    }
  }
  
  // Функция закрытия модального окна
  window.closeModal = function() {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      
      // Если модальное окно было открыто из категории, возвращаемся туда
      if (requestModalSource === 'category') {
        setTimeout(() => {
          openCategoryModal(currentCategory);
          requestModalSource = null; // Сбрасываем источник
        }, 100);
      } else {
        requestModalSource = null; // Сбрасываем источник
      }
    }
  }
  
  // Открытие модального окна при клике на карточку "Оставить заявку"
  if (serviceCardContact) {
    serviceCardContact.addEventListener('click', () => openModal('header'));
  }
  
  // Открытие модального окна при клике на кнопку в шапке
  if (headerChooseButton) {
    headerChooseButton.addEventListener('click', () => openModal('header'));
  }
  
  // Открытие модального окна при клике на кнопку в бургер-меню
  if (burgerChooseButton) {
    burgerChooseButton.addEventListener('click', () => openModal('header'));
  }
  
  // Тестовая функция для проверки модального окна
  window.testModal = function() {
    if (modal) {
      openModal('header');
    } else {
      console.error('Модальное окно не найдено в тесте!');
    }
  };
  
  // Закрытие модального окна при клике на крестик в модальном окне
  if (modalClose) {
    modalClose.addEventListener('click', window.closeModal);
  }
  
  // Закрытие модального окна при клике на крестик на подложке
  if (modalOverlayClose) {
    modalOverlayClose.addEventListener('click', window.closeModal);
  }
  
  // Закрытие модального окна при клике по подложке
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        window.closeModal();
      }
    });
  }
  
  // Закрытие модального окна при нажатии Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      window.closeModal();
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
        window.closeModal();
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
    "name": "ЛЮДИ",
    "image": "assets/images/people.png",
    "quotes": [
      { "text": "Качество работы людей — это **основа успеха** любой организации.", "author": "Питер Друкер" },
      { "text": "Успех бизнеса зависит от **качества людей**, работающих в нем.", "author": "Джек Уэлч" },
      { "text": "Уделяйте **внимание** своим **сотрудникам**, и они будут уделять **внимание** вашим **Клиентам**.", "author": "Ричард Брэнсон" },
      { "text": "Собирая команду, вы должны помнить: **самые большие активы Компании** — это **люди**.", "author": "Генри Форд" },
      { "text": "**Качество** вашей **команды** определяет **качество вашего бизнеса**.", "author": "Том Питерс" },
      { "text": "**Самые важные решения в бизнесе** — это не те, что касаются стратегии или финансирования. Это те, что **касаются людей**.", "author": "Рэй Далио" },
      { "text": "Ваши **люди** — это ваш **самый ценный актив**. **Инвестируйте в них**.", "author": "Майкл Делл" },
      { "text": "Никто из нас не так умен, как все мы вместе.", "author": "Кен Бланшар" }
    ],
    "accordions": [
      {
        "title": "**РАЗБОРЫ ПРОБЛЕМАТИК** С КЛИЕНТАМИ НА РЕАЛЬНЫХ КЕЙСАХ",
        "content": "Помогаем командам **анализировать и решать** проблемы клиентов на основе реальных ситуаций. **Развиваем навыки** критического мышления и **достигаем результатов**."
      },
      {
        "title": "**ОБУЧЕНИЕ** — ФОРМИРОВАНИЕ НАВЫКОВ ПРОДАЖ",
        "content": "**Специализированные программы обучения** направлены на развитие навыков продаж. Цель — **максимизация результатов** и **прибыли компании**."
      },
      {
        "title": "**ОБУЧЕНИЕ ТЕХНОЛОГИЯМ** СЕРВИСА",
        "content": "**Практическое обучение** технологиям сервиса для повышения **профессионализма** и **уверенности** в работе с клиентами."
      },
      {
        "title": "**СОПРОВОЖДЕНИЕ** ПОСЛЕ ОБУЧЕНИЯ",
        "content": "**Поддержка после обучения** для закрепления новых знаний и **применения навыков** на практике."
      },
      {
        "title": "**ПОДБОР ПРОФЕССИОНАЛОВ**",
        "content": "**Экспертиза в сфере недвижимости** и подбор кандидатов для поиска **идеальных членов команды**."
      },
      {
        "title": "**ОПРОСЫ**: ПЕРСОНАЛ, РУКОВОДСТВО",
        "content": "Проведение **опросов** для получения представления о бизнесе и принятия **обоснованных решений**."
      },
      {
        "title": "**РАЗБОРЫ ПРОБЛЕМАТИК** С МЕНЕДЖЕРАМИ НА РЕАЛЬНЫХ КЕЙСАХ",
        "content": "**Анализ и решение** проблем с менеджерами, включая **мотивацию** и **эффективность** работы."
      },
      {
        "title": "**ОБУЧЕНИЕ** — ФОРМИРОВАНИЕ УПРАВЛЕНЧЕСКИХ НАВЫКОВ",
        "content": "**Обучение лидеров** для развития ключевых компетенций **эффективного управления** командами и проектами."
      },
      {
        "title": "**АССЕССМЕНТ ПЕРСОНАЛА**",
        "content": "**Комплексный анализ** компетенций сотрудников для выявления **сильных сторон** и **областей развития**."
      },
      {
        "title": "**ИНДИВИДУАЛЬНЫЕ ПЛАНЫ** РАЗВИТИЯ",
        "content": "Создание **персонализированных планов развития** сотрудников для повышения **компетенций** и **эффективности команды**."
      },
      {
        "title": "**МЕНТОРСТВО ПЕРСОНАЛА**",
        "content": "**В разработке**. Опытные менторы для **повышения навыков** и **эффективности команды**."
      },
      {
        "title": "**МНОГОЕ ДРУГОЕ**",
        "content": "**Широкий спектр** дополнительных услуг для **оптимизации бизнес-процессов**, улучшения **обслуживания клиентов** и **увеличения прибыли**. Свяжитесь с нами для **нестандартных идей**."
      }
    ]
  },
  "quality": {
    "name": "КАЧЕСТВО",
    "image": "assets/images/quality.png",
    "quotes": [
      { "text": "Качество означает делать это правильно, когда никто не смотрит.", "author": "Генри Форд" },
      { "text": "Качество — это не то, что можно проверить, это то, что нужно создать.", "author": "Питер Друкер" },
      { "text": "Качество - это не просто то, что вы делаете, это то, как вы это делаете.", "author": "Энди Гроув" },
      { "text": "Если вы не можете измерить качество, вы не можете его улучшить.", "author": "Джек Улч" },
      { "text": "Работа, выполненная с качеством, создает доверие и уважение.", "author": "Майкл Порт" },
      { "text": "Культура Компании должна быть такой, чтобы каждый сотрудник был готов сделать всё для Клиента.", "author": "Тони Шей" }
    ],
    "accordions": [
      {
        "title": "**КОМПЛЕКСНАЯ ЭКСПЕРТИЗА** ВСТРЕЧ С КЛИЕНТАМИ",
        "content": "**Борьба за результат**, за Клиента — этому подчинено все, что было во встрече, но и то, чего не было, а также причины. **Осуществляем тотальный контроль** за выполнением корпоративных стандартов и процедур, что дают результат."
      },
      {
        "title": "**НАПИСАНИЕ СТАНДАРТОВ** И МЕТОДОВ",
        "content": "Стандарты и методы — **ключ к качеству и надежности** в бизнесе. Мы предлагаем **индивидуальные решения**, адаптированные под ваши **уникальные задачи**, обеспечивая **высокую профессиональную точность**."
      },
      {
        "title": "**ЗАПУСК ПРОЦЕССОВ** КОНТРОЛЯ КАЧЕСТВА",
        "content": "Поможем вам **внедрить надежные процессы** контроля качества, которые гарантируют **высокие стандарты** на всех этапах обслуживания. Наши решения позволяют **быстро выявлять и устранять недостатки**, повышая **удовлетворенность клиентов** и **укрепляя репутацию** вашего бренда."
      },
      {
        "title": "**АНАЛИЗ КАЧЕСТВА** РАБОТЫ",
        "content": "Проводим **глубокий анализ** качества работы вашей команды, выявляя **сильные и слабые стороны**. Мы предоставляем **практические рекомендации** по **улучшению эффективности** и **повышению лояльности** сотрудников, что ведет к **росту бизнеса**."
      },
      {
        "title": "**ОПРОСЫ**: CS, NPS, ТАЙНЫЙ ПОКУПАТЕЛЬ",
        "content": "Проводим **опросы удовлетворенности**, **лояльности Клиентов** (CS, NPS) и сотрудников, чтобы получить **ценные инсайты** о восприятии вашего бизнеса со всех сторон. Не только важно **правильно проанализировать** полученные данные, осуществляем **глубокий анализ**. Результаты позволяют принимать **обоснованные решения** для **улучшения сервиса**."
      },
      {
        "title": "**ОПРОСЫ**: ПЕРСОНАЛ, ПАРТНЕРЫ И Т.Д.",
        "content": "Проводим **опросы удовлетворенности**, **лояльности сотрудников** и партнеров, чтобы получить **ценные инсайты** о восприятии вашего бизнеса со всех сторон. Не только важно **правильно проанализировать** полученные данные, осуществляем **глубокий анализ**. Результаты позволяют принимать **обоснованные решения** для **улучшения сервиса**."
      },
      {
        "title": "**КОМПЛЕКСНАЯ ЭКСПЕРТИЗА** ЗВОНКОВ С КЛИЕНТАМИ",
        "content": "**Борьба за результат**, за Клиента — этому подчинено все, что было в звонке, но и то, чего не было, а также причины. **Осуществляем тотальный контроль** за выполнением корпоративных стандартов и процедур, что дают результат."
      },
      {
        "title": "**НАПИСАНИЕ МЕТОДОЛОГИИ** И МАТРИЦЫ",
        "content": "Разрабатываем **индивидуальные методологии** и матрицы, которые помогают **оптимизировать процессы** в вашей компании. Наша команда использует свои **разработанные практики** и **принципы**, что обеспечивает **максимальную эффективность** и **прозрачность** в управлении."
      },
      {
        "title": "**НАПИСАНИЕ КНИГ** ПРОДАЖ И ПРОДУКТА",
        "content": "Создаем **уникальные и высококачественные** книги продаж и продукта, которые содержат **проверенные стратегии** и **тактики** для увеличения продаж. **Взаимодействуем с Клиентами** и описываем ваш продукт с учетом **рыночных особенностей**. Наша методология помогает менеджерам не только **понять**, но и **уметь** продавать. Мы применяем **лучшие практики** для достижения **высоких результатов** и **укрепления отношений** с Клиентами."
      },
      {
        "title": "**АНАЛИЗ КАЧЕСТВА** БИЗНЕС — ПРОЦЕССОВ",
        "content": "Осуществляем **комплексный анализ** бизнес-процессов, чтобы выявить **узкие места** и **возможности для оптимизации**. Наши стратегии помогут вам **сократить затраты**, **повысить эффективность** и **улучшить взаимодействие** между подразделениями."
      },
      {
        "title": "**АССЕССМЕНТ ПЕРСОНАЛА**",
        "content": "Комплексный и **глубокий анализ** компетенций сотрудников, который позволяет **выявить сильные стороны** и **зоны развития**. Мы используем **современные методики** и **инструменты**, обеспечивающие **точность** и **объективность** оценки. Делаем все, чтобы **активизировать кадровые ресурсы** вашей компании и создать команду, способную **достигать выдающихся результатов**."
      },
      {
        "title": "**МНОГОЕ ДРУГОЕ**",
        "content": "Мы предлагаем **широкий спектр дополнительных услуг**, направленных на **оптимизацию** бизнес-процессов, **повышение** уровня обслуживания Клиентов и **увеличение** прибыли. Если у вас есть **нестандартные идеи** — мы готовы **реализовать** их. Свяжитесь с нами, чтобы узнать больше о том, как мы можем **помочь вашему бизнесу**!"
      }
    ]
  },
  "service": {
    "name": "СЕРВИС",
    "image": "assets/images/servisses.png",
    "quotes": [
      { "text": "Клиенты не ожидают от вас идеального сервиса. Они ожидают от вас **искреннего отношения**.", "author": "Ричард Бренсон" },
      { "text": "Если вы делаете Клиентов счастливыми, **они будут возвращаться**.", "author": "Джефф Безос" },
      { "text": "Обслуживание Клиентов — это не просто работа, это **искусство**.", "author": "Дональд Трамп" },
      { "text": "Культура Компании должна быть такой, чтобы **каждый сотрудник был готов сделать всё для Клиента**.", "author": "Тони Шей" },
      { "text": "Успех в бизнесе зависит от того, **насколько хорошо вы заботитесь о своих Клиентах**.", "author": "Кен Бланшар" },
      { "text": "Клиент не является помехой в вашем бизнесе. Он — **его цель**.", "author": "Питер Друкер" },
      { "text": "Отличный сервис — это не просто хорошее обслуживание, это **создание эмоций и впечатлений**.", "author": "Майкл Герарди" },
      { "text": "Хороший сервис — это не просто предоставление услуги, это **создание доверия**.", "author": "Шерил Сэндберг" },
      { "text": "Ваши Клиенты могут забыть, что вы сказали, но они **никогда не забудут, как вы заставили их чувствовать**.", "author": "Роберт Г. Аллен" },
      { "text": "Обслуживание Клиентов — это не просто отдел, это **вся Компания**.", "author": "Дебора Тейлор" },
      { "text": "Сервис — это то, что **отличает вас от конкурентов**.", "author": "Томас Долан" }
    ],
    "accordions": [
      {
        "title": "**РАЗБОРЫ ПРОБЛЕМАТИК** С КЛИЕНТАМИ НА РЕАЛЬНЫХ КЕЙСАХ",
        "content": "Приезжаем к команде и в режиме реального времени пошагово **разбираем сложные ситуации с Клиентами**. Помогаем командам **практическими методами работы** с Клиентами не только справляться с текущими вызовами, но и **развивать навыки** для успешной работы с Клиентами в будущем. Команды получают **поддержку и мотивацию на результат**."
      },
      {
        "title": "**НАПИСАНИЕ СТАНДАРТОВ** И МЕТОДОВ",
        "content": "Стандарты и методы — **ключ к качеству и надежности** в бизнесе. Мы предлагаем **индивидуальные решения**, адаптированные под ваши **уникальные задачи**, обеспечивая **высший уровень профессионализма и точности**."
      },
      {
        "title": "**КОНТРОЛЬ ГОСТЕПРИИМСТВА**",
        "content": "**Оцениваем уровень гостеприимства** в вашей компании, проводя проверки и анализируя **взаимодействие с Клиентами**. Это помогает **укрепить лояльность Клиентов**, **повысить рекомендации** и **увеличить прибыль**."
      },
      {
        "title": "**АНАЛИЗ ТЕКУЩЕГО** СЕРВИСА",
        "content": "Проводим **комплексный детальный анализ** текущих процессов и текущего качества обслуживания, выявляя **сильные и слабые стороны**. На основе полученных данных **предоставляем рекомендации** для **оптимизации сервиса**, **повышения его качества** и **увеличения прибыли**."
      },
      {
        "title": "**АНАЛИЗ СЕРВИСА** КОНКУРЕНТОВ",
        "content": "**Исследуем подходы и практики** прямых конкурентов и компаний с **других рынков**, чтобы выявить **лучшие решения** в вашей отрасли или предложить **новый подход**. Это поможет вам **адаптировать успешные стратегии** и **повысить конкурентоспособность** вашего бизнеса."
      },
      {
        "title": "**ОПРОСЫ**: CSI; NPS; ТАЙНЫЙ ПОКУПАТЕЛЬ",
        "content": "Проводим **опросы удовлетворенности**, **лояльности Клиентов** (CSI, NPS) и сотрудников, чтобы получить **ценные инсайты** о восприятии вашего бизнеса со всех сторон. Но также важно **правильно проанализировать полученные данные**, осуществляем **глубокий анализ**. Результаты позволяют **принимать обоснованные решения** для **улучшения сервиса**."
      },
      {
        "title": "**КОНТРОЛЬ РАБОТЫ** АДМИНИСТРАТОРОВ",
        "content": "**Контролируем и анализируем** каждое действие персонала и **соотносим его с реакциями Клиента**. Любая ошибка может привести к **потере Клиента** — к **потере прибыли**. Важно знать: что и как делает ваш персонал, чтобы точно понимать, как вы **влияете на результат** работы с Клиентом."
      },
      {
        "title": "**ОБУЧЕНИЕ ТЕХНОЛОГИЯМ** СЕРВИСА",
        "content": "Организуем **практическое обучение** по собственным **современным технологиям обслуживания**, чтобы ваши сотрудники были **нацелены на достижение максимального результата** и **увеличивать прибыль Компании**. Это способствует **повышению их профессионализма и уверенности**."
      },
      {
        "title": "**ИНДИВИДУАЛЬНЫЕ ПЛАНЫ** РАЗВИТИЯ",
        "content": "Создаем **персонализированные планы развития** для сотрудников, учитывая их **сильные стороны** и **области для улучшения**. Это способствует **росту их компетенций** и **повышению эффективности команды**."
      },
      {
        "title": "**КОНТРОЛЬ СЕРВИСА** КОМПАНИИ",
        "content": "**Контролируем и анализируем влияние** вашего сервиса, **разрабатываем новые форматы сервиса** для вас, чтобы **влиять на результат** работы с Клиентом. **Обеспечиваем высший стандарт качества** и **надежности услуг**. Мы гарантируем **полное соответствие** вашим **ожиданиям и потребностям**, и ваших Клиентов."
      },
      {
        "title": "**МЕНТОРСТВО НАД** АДМИНИСТРАТОРАМИ",
        "content": "Услуга находится в разработке, если вам это интересно свяжитесь с нами **ссылка на телеграм**. Мы предоставим **опытных менторов** для администраторов, которые помогут **развивать навыки** и **повысить эффективность работы команды**. Это способствует **созданию сильных специалистов** внутри вашей компании."
      },
      {
        "title": "**МНОГОЕ ДРУГОЕ**",
        "content": "Мы предлагаем **широкий спектр дополнительных услуг**, направленных на **оптимизацию** бизнес-процессов, **повышение** уровня обслуживания Клиентов и **увеличение** прибыли. Если у вас есть **нестандартные идеи** — мы готовы **реализовать** их. Свяжитесь с нами, чтобы узнать больше о том, как мы можем **помочь вашему бизнесу**!"
      }
    ]
  },
  "sales": {
    "name": "ПРОДАЖИ",
    "image": "assets/images/sales.png",
    "quotes": [
      { "text": "Продажа — это не просто обмен товара на деньги. Это возможность помочь Клиенту **решить его проблемы**.", "author": "Брайан Трейси" },
      { "text": "Успех в продажах не связан с тем, что вы продаете, а с тем, **как вы это делаете**.", "author": "Грант Кардон" },
      { "text": "Люди покупают не то, что вы продаете, а то, **как вы это представляете**.", "author": "Том Хопкинс" },
      { "text": "Продажи — это не о том, как много вы знаете о своем продукте, а о том, **как много вы знаете о своем Клиенте**.", "author": "Майкл Гербер" },
      { "text": "Самая большая **ошибка в продажах** — это думать, что люди покупают то, что вы продаете.", "author": "Кевин Халлер" },
      { "text": "Ваша задача — не продать продукт, а **создать желание**.", "author": "Сет Годин" },
      { "text": "Я буду **продавать**, не потому что я хочу, а потому что я **могу помочь**.", "author": "Ог Мандино" },
      { "text": "Вы не можете продать то, **во что не верите сами**.", "author": "Ларри Уингет" },
      { "text": "Ваши продажи зависят от того, **насколько хорошо вы понимаете потребности ваших Клиентов**.", "author": "Роберт Кийосаки" },
      { "text": "Успех — это **результат хорошей подготовки, упорного труда и обучения на ошибках**!", "author": "Дональд Трамп" },
      { "text": "Продажа — это не манипуляция, это **служение**.", "author": "Майкл Порт" }
    ],
    "accordions": [
      {
        "title": "**РАЗБОРЫ ПРОБЛЕМАТИК** С КЛИЕНТАМИ НА РЕАЛЬНЫХ КЕЙСАХ",
        "content": "Приезжаем к команде и в режиме реального времени пошагово разбираем сложные ситуации с Клиентами. Помогаем командам **практическими методами** работы с Клиентами не только справляться с текущими вызовами, но и **развивать навыки** для успешной работы с Клиентами в будущем. Команды получают поддержку и мотивацию на результат."
      },
      {
        "title": "**НАПИСАНИЕ СТАНДАРТОВ** И МЕТОДОВ",
        "content": "Стандарты и методы — **ключ к качеству и надежности** в бизнесе. Мы предлагаем **индивидуальные решения**, адаптированные под ваши **уникальные задачи**, обеспечивая **высший уровень профессионализма и точности**."
      },
      {
        "title": "**КОМПЛЕКСНАЯ ЭКСПЕРТИЗА** ВСТРЕЧ С КЛИЕНТАМИ",
        "content": "Борьба за результат, за Клиента — этому подчинена вся система оценки. Вот почему мы **детально изучим и анализируем** не только то, что было во встрече, но и то, чего не было, а также причины этого. Осуществляем **тотальный контроль** за выполнением корпоративных стандартов и процедур, что дает результат."
      },
      {
        "title": "**КОМПЛЕКСНАЯ ЭКСПЕРТИЗА** ЗВОНКОВ С КЛИЕНТАМИ",
        "content": "Борьба за результат, за Клиента — этому подчинена вся система оценки. Вот почему мы **детально изучим и анализируем** не только то, что было в звонке, но и то, чего не было, а также причины этого. Осуществляем **тотальный контроль** за выполнением корпоративных стандартов и процедур, что дает результат."
      },
      {
        "title": "**ОБУЧЕНИЕ — ФОРМИРОВАНИЕ** НАВЫКОВ ПРОДАЖ",
        "content": "Разработали для вас: **51 навык, 47 авторское обучение, 39 авторских компетенций**. Организуем **практическое обучение** по собственным **современным технологиям** работы с Клиентом, чтобы ваши сотрудники были нацелены на достижение **максимального результата** и увеличение **прибыли Компании**."
      },
      {
        "title": "**СОПРОВОЖДЕНИЕ ПОСЛЕ ОБУЧЕНИЯ**",
        "content": "Предоставляем **поддержку сотрудникам** после завершения обучения, помогая **внедрять новые знания** на практике. Это гарантирует **устойчивые результаты** и **закрепление полученных навыков**."
      },
      {
        "title": "**АНАЛИЗ ТЕКУЩЕЙ РАБОТЫ** С КЛИЕНТОМ",
        "content": "Проводим **комплексный детальный анализ** текущих процессов и текущего качества работы с Клиентами, выявляя сильные и слабые стороны. На основе полученных данных **предоставляем рекомендации** для оптимизации процессов, повышения качества работы и **увеличения прибыли**."
      },
      {
        "title": "**ИНДИВИДУАЛЬНЫЕ ПЛАНЫ** РАЗВИТИЯ",
        "content": "Создаем **персонализированные планы развития** для сотрудников, учитывая их сильные стороны и области для улучшения. Это способствует **росту их компетенций** и **повышению эффективности команды**."
      },
      {
        "title": "**АНАЛИЗ РАБОТЫ** КОНКУРЕНТОВ С КЛИЕНТАМИ",
        "content": "Исследуем **подходы и практики** прямых конкурентов и компаний с других рынков, чтобы выявить **лучшие решения** в вашей отрасли или предложить **новый подход**. Это поможет вам **адаптировать успешные стратегии** и **повысить конкурентоспособность** вашего бизнеса."
      },
      {
        "title": "**МЕНТОРСТВО** НАД МЕНЕДЖЕРАМИ",
        "content": "Услуга находится в разработке, если вам это интересно свяжитесь с нами ссылка на телеграм. Мы предоставим **опытных менторов** для менеджеров, которые помогут **развивать навыки** и **повысить эффективность работы** команды. Это способствует **созданию сильных специалистов** внутри вашей компании."
      },
      {
        "title": "**ОПРОСЫ**: CS, NPS, ТАЙНЫЙ ПОКУПАТЕЛЬ",
        "content": "Проводим **опросы удовлетворенности, лояльности** Клиентов (CSI, NPS) и сотрудников, чтобы получить **ценные инсайты** о восприятии вашего бизнеса со всех сторон. Но также важно **правильно проанализировать** полученные данные, осуществляем **глубокий анализ**. Результаты позволяют **принимать обоснованные решения** для улучшения сервиса."
      },
      {
        "title": "**МНОГОЕ ДРУГОЕ**",
        "content": "Мы предлагаем **широкий спектр дополнительных услуг**, направленных на **оптимизацию бизнес-процессов** и **повышение уровня обслуживания Клиентов** и **увеличение прибыли**. Если у вас есть **нестандартные идеи** — мы готовы **реализовать их**. Свяжитесь с нами, чтобы узнать больше о том, как мы можем **помочь вашему бизнесу**!"
      }
    ]
  },
  "leaders": {
    "name": "РУКОВОДИТЕЛИ",
    "image": "assets/images/manadger.png",
    "quotes": [
      { "text": "Лучший руководитель — это тот, кто не заставляет подчиненных чувствовать себя **подчиненными**.", "author": "Лао-цзы" },
      { "text": "Лидерство — это не только делать правильные вещи, но и **делать это правильно**.", "author": "Винстон Черчилль" },
      { "text": "Лидерство — это не позиция, а **действие**.", "author": "Том Питерс" },
      { "text": "Управление — это не только о том, чтобы быть у руля. Это о том, чтобы **поддерживать своих людей и давать им возможность расти**.", "author": "Ричард Бренсон" }
    ],
    "accordions": [
      {
        "title": "**РАЗБОРЫ ПРОБЛЕМАТИК** С МЕНЕДЖЕРАМИ НА РЕАЛЬНЫХ КЕЙСАХ",
        "content": "Приезжаем к команде руководителей и в режиме реального времени пошагово **разбираем сложные ситуации** с менеджерами, мотивацией и работой на результат. Помогаем командам руководителей **практическими методами работы с персоналом**: не только справляться с текущими вызовами, но и **развивать навыки** для успешной работы в будущем. Команды руководителей получают **поддержку и мотивацию на результат**."
      },
      {
        "title": "**КОНТРОЛЬ СОБЛЮДЕНИЯ СТАНДАРТОВ** РУКОВОДИТЕЛЯМИ",
        "content": "Обеспечиваем **высокую степень соответствия** корпоративным стандартам, внедряя **эффективные механизмы контроля** и обучения для руководителей. Наша команда помогает создать **культуру ответственности и качества**, что приводит к **повышению производительности** и **удовлетворенности Клиентов**."
      },
      {
        "title": "**ОБУЧЕНИЕ — ФОРМИРОВАНИЕ** УПРАВЛЕНЧЕСКИХ НАВЫКОВ",
        "content": "Разработали для вас: **51 навык, 41 авторское обучение и 39 авторских компетенций**. Организуем **практическое обучение** по собственным **современным технологиям работы с персоналом**, чтобы ваши сотрудники были **нацелены на достижение максимального результата** и **увеличение прибыли Компании**."
      },
      {
        "title": "**АНАЛИЗ ТЕКУЩЕЙ РАБОТЫ** С ПЕРСОНАЛОМ",
        "content": "Проводим **глубокий анализ взаимодействия** с вашим персоналом, выявляя **узкие места** и **возможности для оптимизации**. Наши рекомендации основаны на **собственных разработках** и **лучших практиках отрасли** и помогут вам создать **эффективную команду**, способную **достигать выдающихся результатов**."
      },
      {
        "title": "**ОБУЧЕНИЕ ОЦЕНКА РИСКОВ**",
        "content": "Предлагаем **уникальный подход к оценке рисков**, сочетая **теоретические знания** с **практическими кейсами**. Мы обучаем ваших сотрудников **выявлять, анализировать и минимизировать риски** на всех этапах проектов, что позволяет значительно повысить **эффективность, безопасность** и достигать **максимальной эффективности**."
      },
      {
        "title": "**ОПРОСЫ**: ПЕРСОНАЛ, РУКОВОДСТВО",
        "content": "Проводим **опросы удовлетворенности**, **лояльности сотрудников**, чтобы получить **ценные инсайты** о восприятии вашего бизнеса со всех сторон. Но также важно **правильно проанализировать** полученные данные, осуществляем **глубокий анализ**. Результаты позволяют **принимать обоснованные решения** для **улучшения сервиса**."
      },
      {
        "title": "**НАПИСАНИЕ СТАНДАРТОВ И МЕТОДОВ** ДЛЯ РУКОВОДИТЕЛЕЙ",
        "content": "Стандарты и методы — **ключ к качеству и надежности** в бизнесе. Мы предлагаем **индивидуальные решения**, адаптированные под ваши **уникальные задачи**, обеспечивая **высший уровень профессионализма и точности**."
      },
      {
        "title": "**КОМПЛЕКСНАЯ ЭКСПЕРТИЗА РАБОТЫ** С ПЕРСОНАЛОМ",
        "content": "**Борьба за результат** — этому подчинена вся система оценки. Вот, почему мы **детально изучаем и анализируем** не только то, что было в работе с персоналом, но и то, чего не было, а также причины этого. **Осуществляем тотальный контроль** за выполнением корпоративных стандартов и процедур, что **дает результат**."
      },
      {
        "title": "**СОПРОВОЖДЕНИЕ ПОСЛЕ ОБУЧЕНИЯ**",
        "content": "Предоставляем **поддержку сотрудникам** после завершения обучения, помогая **внедрять новые знания** на практике. Это гарантирует **устойчивые результаты** и **закрепление полученных навыков**."
      },
      {
        "title": "**ИНДИВИДУАЛЬНЫЕ ПЛАНЫ РАЗВИТИЯ** ДЛЯ РУКОВОДИТЕЛЕЙ",
        "content": "Создаем **персонализированные планы развития** для сотрудников, учитывая их **сильные стороны** и **области для улучшения**. Это способствует **росту их компетенций** и **повышению эффективности команды**."
      },
      {
        "title": "**МЕНТОРСТВО РУКОВОДИТЕЛЕЙ**",
        "content": "Услуга находится в разработке, если вам это интересно свяжитесь с нами **ссылка на телеграм**. Мы предоставим **опытных менторов** для руководителей, которые помогут **развивать навыки** и **повысить эффективность работы команды**. Это способствует созданию **сильных специалистов** внутри вашей компании."
      },
      {
        "title": "**МНОГОЕ ДРУГОЕ**",
        "content": "Мы предлагаем **широкий спектр дополнительных услуг**, направленных на **оптимизацию бизнес-процессов**, **повышение уровня обслуживания Клиентов** и **увеличение** прибыли. Если у вас есть **нестандартные идеи** — мы готовы **реализовать их**. Свяжитесь с нами, чтобы узнать больше о том, как мы можем **помочь вашему бизнесу**!"
      }
    ]
  },
  "unique": {
    "name": "Уникальные услуги",
    "image": "assets/images/unick.png",
    "quotes": [
      { "text": "**Уникальность** — это **конкурентное преимущество**.", "author": "Майкл Портер" },
      { "text": "**Инновации** — это **будущее** бизнеса.", "author": "Питер Друкер" },
      { "text": "**Уникальность** — это **ценность** для клиента.", "author": "Сет Годин" },
      { "text": "**Дифференциация** — это **путь** к успеху.", "author": "Джек Траут" },
      { "text": "**Уникальность** — это **ответ** на потребности рынка.", "author": "Клейтон Кристенсен" }
    ],
    "accordions": [
      {
        "title": "Авторские методики",
        "content": "**Уникальные методики** и подходы, разработанные специально для рынка недвижимости. **Патентованные решения** и **эксклюзивные технологии**."
      },
      {
        "title": "Индивидуальные решения",
        "content": "**Персонализированные решения** под конкретные потребности каждого клиента. **Глубокий анализ** бизнеса и **точечные рекомендации**."
      },
      {
        "title": "Экспертиза рынка",
        "content": "**Глубокая экспертиза** рынка недвижимости и **понимание специфики** отрасли. **Отраслевые знания** и **лучшие практики**."
      },
      {
        "title": "Инновационные технологии",
        "content": "Внедрение **современных технологий** и **инновационных решений** для повышения эффективности бизнеса."
      }
    ]
  }
};

let currentCategory = 'people';

// Инициализация модального окна категорий
function initializeCategoryModal() {
  const categoryModal = document.getElementById('categoryModal');
  const categoryModalOverlayClose = document.getElementById('categoryModalOverlayClose');
  const categoryModalClose = document.getElementById('categoryModalClose');
  
  // Закрытие при клике на крестик на подложке
  if (categoryModalOverlayClose) {
    categoryModalOverlayClose.addEventListener('click', closeCategoryModal);
  }
  
  // Закрытие при клике на белый крестик
  if (categoryModalClose) {
    categoryModalClose.addEventListener('click', closeCategoryModal);
  }
  
  // Закрытие при клике на фон
  if (categoryModal) {
    categoryModal.addEventListener('click', (e) => {
      if (e.target === categoryModal) {
        closeCategoryModal();
      }
    });
  }
  
  // Закрытие при нажатии Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && categoryModal && categoryModal.classList.contains('active')) {
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
    { key: 'service', name: 'Сервис', icon: 'assets/images/servisses.png' },
    { key: 'sales', name: 'Продажи', icon: 'assets/images/sales.png' },
    { key: 'leaders', name: 'Руководители', icon: 'assets/images/manadger.png' },
    { key: 'unique', name: 'Уникальные', icon: 'assets/images/unick.png' }
  ];
  
  // Исключаем активную категорию из нижних табов
  const filteredTabs = tabList.filter(tab => tab.key !== currentCategory);
  
  filteredTabs.forEach(tab => {
    const tabDiv = document.createElement('div');
    tabDiv.className = 'category-tab';
    tabDiv.setAttribute('data-category', tab.key);
    
    tabDiv.innerHTML = `
      <div class="category-tab-icon">
        <img src="${tab.icon}" alt="${tab.name}">
      </div>
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

window.openRequestModalFromCategory = function() {
    closeCategoryModal();
    setTimeout(() => {
        window.openModal('category');
        // Предварительно выбираем категорию в форме
        setTimeout(() => {
            const categoryCheckboxes = document.querySelectorAll('.category-checkbox input[type="checkbox"]');
            categoryCheckboxes.forEach(checkbox => {
                checkbox.checked = false;
                checkbox.dispatchEvent(new Event('change'));
            });
            
            const categoryMapping = {
                'people': 'people',
                'quality': 'quality',
                'service': 'service',
                'sales': 'sales',
                'leaders': 'leaders',
                'unique': 'unique'
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
      // Обрабатываем жирный текст в названии
      const processedTitle = accordion.title.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // Обрабатываем жирный текст в контенте
      const processedContent = accordion.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      
      const accordionElement = document.createElement('div');
      accordionElement.className = 'category-accordion';
      accordionElement.innerHTML = `
        <div class="category-accordion-header">
          <div class="category-accordion-title">${processedTitle}</div>
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
  
  // Обновляем нижние табы (исключая текущую категорию)
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

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
  // Инициализация модального окна категорий
  initializeCategoryModal();
});