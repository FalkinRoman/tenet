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
        }, 200);
    }, 2400);
    
    // Обработчик клика на заголовок
    const h1 = document.querySelector('.container h1');
    h1.addEventListener('click', () => {
        alert('Привет! Вы кликнули на заголовок!');
    });
}); 