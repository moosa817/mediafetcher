let current_page = 'image';

$('#btns button').click(function (e) {
    let id = $(this).attr('id');

    $('#btns button').removeClass('bg-gray-900');
    $(`#${id}`).addClass('bg-gray-900');

    $(`#${current_page}-section`).hide();
    $(`#${id}-section`).fadeIn();
    current_page = id;
});

