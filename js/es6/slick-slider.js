(() => {
    $(document).ready(() => {
        if (slick !== undefined && typeof slick === 'function') {
            const singleSlick = $('.single-slick');
            if (singleSlick.length) {
                singleSlick.slick();
            }
        }
    });
})();