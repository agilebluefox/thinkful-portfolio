$(document).ready(() => {
    function centerMenu() {
        $(window).resize(() => {
            if ($(window).width() < 768) {
                $('#main-nav ul')
                    .removeClass('justify-content-end')
                    .addClass('justify-content-center');
            } else {
                $('#main-nav ul')
                    .removeClass('justify-content-center')
                    .addClass('justify-content-end');
            }
        });
    }

    centerMenu();
});