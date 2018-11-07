$(function(){
    const $gallery = $('*[data-gallery]');
    $gallery.slick({
        arrows: true,
        adaptiveHeight: true,
        autoplay: true,
        autoplaySpeed: 7000,
        dots: true,
    });
});
