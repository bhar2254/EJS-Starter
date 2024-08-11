$(document).ready(function () {
    $('#generalDataTable').find('td').each(function (i) {
        const href = $(this).find("a").attr('href') || '#'
        $(this).attr('onclick', `location.href="${href}";`)
        $(this).attr('style', 'cursor:pointer;')
        $(this).find("a").attr('style', 'text-decoration:none;')
    })
})